# MEO Tracker (Google Maps Local Search Ranking Tracker)

A Next.js application designed to automatically track and visualize search rankings for registered businesses in specific locations on Google Maps. The backend uses a standalone cron job and Prisma ORM with SQLite, integrating with SerpApi for keyword tracking.

## Features
- **Japanese UI:** Full dashboard and management panel in Japanese.
- **Rank Tracking Dashboard:** Visualizes up to 12 keywords over time with an inverted Y-axis chart.
- **Automated Scheduling:** A standalone `node-cron` script fetches live MEO data daily at 12:00 PM.
- **Easy Management:** Built-in dashboard to Add, Edit, and Delete target keywords.

## Prerequisites
- Node.js (v18+)
- [SerpApi Account](https://serpapi.com/) for a valid API Key

## Setup & Execution Instructions

### 1. Installation
Clone the project or initialize from this directory, then install the dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to create your own `.env` file:
```bash
cp .env.example .env
```
Open `.env` and fill in your actual SerpApi key:
```env
SERPAPI_KEY="your_api_key_from_serpapi"
```

### 3. Database Initialization
Prepare the SQLite database using Prisma:
```bash
npx prisma db push
```
*(Or use `npx prisma migrate dev` if you intend to track migrations.)*

### 4. Running the Web Application (Next.js)
Start the frontend development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Cron Job (Background Task)
To actually fetch rankings automatically, you need to run the scheduler script alongside the web server.

For local testing, you can run the cron job directly. By default, it's scheduled to run every day at 12:00 PM:
```bash
# We use ts-node via npx directly for the local cron process
npx ts-node scripts/cron.ts
```

*(Note for production: You should explore using process managers like PM2 to keep this script running permanently in the background: `pm2 start scripts/cron.ts` or similar)*

## Cloudflare Deployment (Pages & D1)

Cloudflare Pages の 1,000 ファイル制限を回避し、サーバーレス環境で動作させるための手順です。

### 1. GitHub 連携によるデプロイ (推奨)
1. このプロジェクトを GitHub のリポジトリにプッシュします。
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages > Create > Pages > **Connect to Git** を選択します。
3. リポジトリと言語 (Next.js) を選択。
4. **Build settings:**
   - Framework preset: `Next.js`
   - Build command: `npm run cf-build`
   - Build output directory: `.vercel/output`
5. **Environment variables:**
   - `SERPAPI_KEY`: 取得したキーを設定
   - `CRON_SECRET`: 任意のランダムな文字列（セキュリティ用）
   - `NODE_VERSION`: `20` (またはそれ以降)

### 2. D1 データベースの作成
1. Cloudflare ダッシュボードで **D1 データベース** を新規作成（名前: `meo-database`）。
2. `wrangler.toml` 内の `database_id` を作成した ID に書き換えます。
3. Pages プロジェクトの設定 > Functions > **D1 database bindings** で、変数名を `DB` とし、作成したデータベースを紐付けます。

### 3. 初期テーブルの作成
ターミナルから以下を実行して D1 にテーブルを作成します：
```bash
npx wrangler d1 execute meo-database --local --file=./prisma/migrations/$(ls prisma/migrations | tail -1)/migration.sql
# 準備ができたらリモートにも適用
npx wrangler d1 execute meo-database --remote --file=./prisma/migrations/$(ls prisma/migrations | tail -1)/migration.sql
```

### 4. 定期実行 (Cron Triggers) の設定
Cloudflare Workers もしくは Pages の **Settings > Triggers > Cron Triggers** に、毎日 12:00 等のスケジュールを登録します。

---

## Troubleshooting
- **Cloudflare で 500 エラーが出る:** `env.DB` へのバインディングが正しいか確認してください。
- **ファイル数が多いエラー:** `.gitignore` に `node_modules` が含まれていること、およびダッシュボードへの直接アップロードではなく GitHub 連携を使用していることを確認してください。
