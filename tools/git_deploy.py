#!/usr/bin/env python3
"""《GTO 撲克學院》— 一鍵驗證、打包 docs/ 並 git push 部署到 GitHub / Cloudflare Pages。

流程：
  1. 執行內容與語法驗證（node tools/validate_content.js + node --check）。
  2. 重建靜態發布目錄 docs/（python3 tools/build_github_pages.py）。
  3. 若工作目錄有未提交變更，自動 git add -A && git commit。
  4. 讀取本機權杖並透過 http.extraHeader 執行 git push origin main（權杖不寫進 .git/config）。

認證：GitHub Fine-grained PAT（僅需勾選 okayell/poker-gto-lab 的 Contents: Read and write），
  存在 ~/.config/poker_deploy/github_token（chmod 600）或環境變數 POKER_GITHUB_TOKEN。

用法：
  python3 tools/git_deploy.py --setup-token   # 互動式安全儲存 GitHub PAT（只需做一次）
  python3 tools/git_deploy.py --dry-run       # 只跑驗證＋打包＋顯示待推內容，不 commit / push
  python3 tools/git_deploy.py                 # 驗證＋打包＋自動 commit 並推上線
  python3 tools/git_deploy.py -m "自訂訊息"    # 使用自訂 commit 訊息推上線
"""
from __future__ import annotations

import argparse
import base64
import getpass
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.expanduser("~")
REPO = "okayell/poker-gto-lab"
TOKEN_FILE = os.path.join(HOME, ".config", "poker_deploy", "github_token")
LIVE_URL = "https://poker-gto-lab.pages.dev/#/resources"


class DeployError(RuntimeError):
    """Raised when validation, build, token lookup, or git push fails."""


def _load_token() -> str:
    tok = (os.environ.get("POKER_GITHUB_TOKEN") or "").strip()
    if not tok and os.path.isfile(TOKEN_FILE):
        with open(TOKEN_FILE, encoding="utf-8") as f:
            tok = f.read().strip()
    if not tok:
        raise DeployError(
            "找不到 GitHub 權杖！請先執行以下任一方式設定（只需做一次）：\n"
            "  1) 執行：python3 tools/git_deploy.py --setup-token\n"
            f"  2) 或至 https://github.com/settings/tokens?type=beta 建立 Fine-grained PAT\n"
            f"     （Repository access 選 {REPO}，Permissions → Contents: Read and write），\n"
            f"     再執行：mkdir -p {os.path.dirname(TOKEN_FILE)} && umask 077 && printf %s '<你的權杖>' > {TOKEN_FILE}"
        )
    return tok


def _setup_token() -> None:
    print(f"請到 https://github.com/settings/tokens?type=beta 建立 Fine-grained PAT")
    print(f"（Repository access 只選 {REPO}，Permissions → Contents 設為 Read and write）\n")
    tok = getpass.getpass("請貼上 GitHub PAT（輸入時不會顯示字元，貼完按 Enter）：").strip()
    if not tok:
        raise DeployError("未輸入任何權杖，已取消。")
    token_dir = os.path.dirname(TOKEN_FILE)
    os.makedirs(token_dir, mode=0o700, exist_ok=True)
    fd = os.open(TOKEN_FILE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(tok + "\n")
    except Exception:
        os.close(fd)
        raise
    os.chmod(TOKEN_FILE, 0o600)
    print(f"✅ 已安全儲存至 {TOKEN_FILE}（權限 600）。現在可以直接執行：python3 tools/git_deploy.py")


def _run(cmd: list[str], cwd: str = ROOT, check: bool = True) -> subprocess.CompletedProcess:
    p = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)
    if check and p.returncode != 0:
        detail = (p.stderr or p.stdout or "").strip()
        raise DeployError(f"指令失敗 ({' '.join(cmd)}):\n{detail[-1000:]}")
    return p


def _git(args: list[str], token: str | None = None, check: bool = True) -> subprocess.CompletedProcess:
    cmd = ["git"]
    if token:
        auth = base64.b64encode(f"x-access-token:{token}".encode("utf-8")).decode("ascii")
        cmd += ["-c", f"http.extraHeader=Authorization: Basic {auth}"]
    cmd += args
    env = dict(os.environ, GIT_TERMINAL_PROMPT="0", GIT_ASKPASS="/bin/true")
    p = subprocess.run(cmd, cwd=ROOT, env=env, text=True, capture_output=True)
    if check and p.returncode != 0:
        err = (p.stderr or p.stdout or "").strip()
        if token:
            err = err.replace(token, "***")
        raise DeployError(f"git {' '.join(args[:2])} 失敗：\n{err[-1000:]}")
    return p


def run_checks_and_build(skip_check: bool) -> None:
    if not skip_check:
        print("1/4 執行網站內容與語法檢查...")
        _run(["node", "tools/validate_content.js"])
        _run(["node", "--check", "static/js/monetize_config.js"])
        _run(["node", "--check", "static/js/monetize_ui.js"])
    else:
        print("1/4 已略過內容檢查 (--skip-check)")

    print("2/4 重建靜態發布目錄 docs/...")
    res = _run([sys.executable, "tools/build_github_pages.py"])
    if res.stdout.strip():
        print("   ", res.stdout.strip())


def main() -> int:
    parser = argparse.ArgumentParser(description="《GTO 撲克學院》自動驗證、打包並部署到 GitHub / Cloudflare Pages")
    parser.add_argument("--setup-token", action="store_true", help="互動式設定 ~/.config/poker_deploy/github_token")
    parser.add_argument("--dry-run", action="store_true", help="只做檢查、打包與顯示待推狀態，不 commit 也不 push")
    parser.add_argument("--skip-check", action="store_true", help="略過 validate_content.js 檢查")
    parser.add_argument("-m", "--message", default="Deploy Poker GTO Lab update", help="有未提交變更時使用的 commit 訊息")
    args = parser.parse_args()

    try:
        if args.setup_token:
            _setup_token()
            return 0

        run_checks_and_build(skip_check=args.skip_check)

        print("3/4 檢查 Git 變更與待推送紀錄...")
        status = _git(["status", "--short"]).stdout.strip()
        ahead_commits = _git(["log", "origin/main..HEAD", "--oneline"]).stdout.strip()

        if args.dry_run:
            print("── DRY RUN（未執行 commit / push）──")
            print("工作目錄變更：")
            print(status if status else "  (無未提交變更)")
            print("待推送 commits：")
            print(ahead_commits if ahead_commits else "  (無待推送 commit)")
            return 0

        token = _load_token()

        if status:
            _git(["add", "-A"])
            _git(["commit", "-m", args.message])
            print(f"    已自動提交：{args.message}")

        ahead_after = _git(["log", "origin/main..HEAD", "--oneline"]).stdout.strip()
        if not ahead_after:
            print("✅ 遠端已是最新狀態，沒有需要推送的變更。")
            return 0

        print("4/4 正在推送至 GitHub origin/main...")
        _git(["push", "origin", "main"], token=token)
        print(f"🚀 部署推送成功！約 1 分鐘後 Cloudflare Pages 生效：{LIVE_URL}")
        return 0
    except DeployError as exc:
        print(f"❌ {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
