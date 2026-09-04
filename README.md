# FDA Readiness AI — MVP

日本のMedTech / Digital Health企業向けに、米国FDA進出の初期スクリーニングを行うMVPです。

## 今入っている機能
- 製品プロフィール入力
- openFDA Device Classification API検索
- openFDA 510(k) API検索
- openFDA PMA API検索
- FDA Product Code / Device Class / Regulation Number候補表示
- 510(k)類似候補一覧
- 510(k) / De Novo / PMA候補の初期推定
- FDA Readiness Score
- Evidence Gap
- Next Actions
- CSV出力
- ブラウザ印刷 / PDF保存
- Expert Reviewの有料化導線
- OpenAI APIが設定されていればAI分析、未設定ならルールベースfallback

## 重要
これは規制助言ではありません。Product Code、device classification、predicate、submission pathwayは正式なFDA資料・専門家・必要に応じQ-Submission等で確認してください。

## Vercelで動かす
1. このフォルダをGitHub repoにpush
2. VercelでImport Project
3. そのままDeploy
4. AI分析も使う場合はEnvironment Variablesに:
   - OPENAI_API_KEY
   - OPENAI_MODEL（任意。未設定なら gpt-5-mini）
5. Redeploy

静的HTMLを直接ダブルクリックすると `/api/*` が動かないので、VercelかローカルHTTP環境で動かしてください。

## ローカル
Vercel CLIを使う場合:
- `npm i -g vercel`
- `vercel dev`

## 次に本当に商品化するなら
1. 510(k) Summary本文まで取得・解析
2. Predicate比較表（Intended Use / Technology / Testing）
3. De Novo database接続
4. FDA guidance / special controls自動引用
5. Q-Submission question generator
6. CMS / CPT / HCPCS reimbursement layer
7. US KOL / trial site intelligence
8. 日本語会社資料 → US regulatory dossier gap analysis
9. User account / saved projects / Stripe
10. Regulatory expert marketplace / review workflow

## 商売としての核心
無料: FDA Readiness Checker
有料: Predicate Deep Dive / US Entry Dossier / Expert Review
