# FDA Readiness AI — Product Spec

## Target user
日本の医療機器 / SaMD / Digital Healthスタートアップで、米国進出を検討しているCEO、RA/QA責任者、事業開発担当。

## Core job-to-be-done
「FDAコンサルに数十〜数百万円払う前に、自社製品の規制経路、類似機器、足りないEvidence、次のアクションを把握したい」

## MVP user flow
1. 製品名、説明、Intended Useを入力
2. FDA Classification候補を検索
3. Product Code候補を提示
4. 同コード・近接名称の510(k)を表示
5. PMA側のシグナルも確認
6. Readiness Score
7. Evidence Gap
8. Next Actions
9. CSV / PDF
10. Expert Review CTA

## What AI should NOT do
- FDA classificationを断定する
- Predicateを法的・規制上確定する
- 「この510(k)で通る」と保証する
- 患者安全に関する判断をする

## Paid outputs
### Predicate Deep Dive
- Top 5–10候補
- Intended Use comparison
- Technology comparison
- Testing / evidence comparison
- Difference table
- Risk flags

### US Entry Dossier
- Regulatory pathway hypothesis
- Predicate / De Novo precedent
- Guidance + special controls checklist
- Evidence gap
- Q-Sub questions
- 12–24 month action plan
- Cost bands

### Expert Review
FDA/RA経験者のレビューを追加。

## Success metrics
- Free report completion rate
- % users who have a real US launch project
- Expert Review conversion
- Average paid order value
- Repeat projects per company
