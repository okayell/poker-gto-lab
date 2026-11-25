# ♠ GTO 撲克學院（獨立品牌版）

此專案為獨立品牌 **Poker GTO Lab｜GTO 撲克學院** 的免費互動德州撲克學習網站，內建：

- **免費核心功能**（吸引 IG / YouTube 流量並極大化收藏與分享）：6 人擬真 AI 實戰桌、雙軌教練覆盤室、54 堂圖解課、40 組 6-Max 範圍矩陣、11 種無限隨機練習與 200+ 術語百科。
- **導流與數據追蹤**：內建 GA4（`gtag.js`）與 IG / Shorts UTM 來源自動追蹤（`?utm_source=ig&utm_campaign=ep01_jj#/ranges`），並記錄每一筆 Portaly 與聯盟按鈕點擊事件。
- **變現與進階資源頁 (`#/resources`)**：集中管理 Portaly 數位教材／覆盤服務／咖啡贊助，以及合法競技訓練軟體（GTO Wizard、Hand2Note、PokerTracker 4）聯盟推薦。

## 上線前只要改 1 個檔案

編輯 [`static/js/monetize_config.js`](static/js/monetize_config.js)：
1. 填入你的 GA4 Measurement ID（`G-XXXXXXXXXX`）。
2. 填入你的 Portaly 商品／贊助網址。
3. 填入你申請到的 GTO Wizard / Hand2Note / PokerTracker 4 聯盟連結。

## 一鍵自動驗證、打包並部署（免重複輸密碼）

已比照《開心學園》內建 [`tools/git_deploy.py`](tools/git_deploy.py)：

1. 首次使用先設定一次專屬 GitHub PAT（僅需勾選 `okayell/poker-gto-lab` 的 `Contents: Read and write`）：
   ```bash
   python3 tools/git_deploy.py --setup-token
   ```
2. 之後每次修改完只要跑一行，就會自動檢查語法、重建 `docs/`、自動 commit 並 push 上線：
   ```bash
   python3 tools/git_deploy.py
   ```
   （先預覽不推送可加 `--dry-run`）

## 打包與推到獨立 GitHub Pages（手動流程）

1. 重建靜態發布資料夾 `docs/`：
   ```bash
   python3 tools/build_github_pages.py
   ```
2. 驗證內容與語法：
   ```bash
   node tools/validate_content.js
   ```
3. 在 GitHub 建立全新公開 Repo（例如 `poker-gto-lab`），然後在本機執行：
   ```bash
   git remote add origin https://github.com/<你的帳號>/poker-gto-lab.git
   git push -u origin main
   ```
4. 進 GitHub Repo 的 **Settings → Pages → Build and deployment**：
   - Source 選 **Deploy from a branch**
   - Branch 選 **`main`**，資料夾選 **`/docs`** → Save！
   - 1 分鐘後即可獲得獨立網址：`https://<你的帳號>.github.io/poker-gto-lab/`（之後可隨時綁定自訂網域如 `pokerlab.tw`）。

## IG Reels 精準導流深連結範例

- 導去範圍表：`https://<你的網址>/?utm_source=ig&utm_campaign=ep01_jj#/ranges`
- 導去 6 人 AI 實戰桌：`https://<你的網址>/?utm_source=ig&utm_campaign=ep01_jj#/play`
- 導去進階工具與數位手冊：`https://<你的網址>/?utm_source=ig&utm_campaign=bio#/resources`
