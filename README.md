# URLパラメータ作成ツール

GA4などのアクセス解析で利用する、UTMパラメータ付きURLを正確に作成するブラウザ完結型ツールです。サーバーへの送信やアカウント登録は不要です。

## できること

- `utm_source`、`utm_medium`、`utm_campaign` を必須項目として、計測URLを生成
- `utm_content`、`utm_term`、`utm_id`、`utm_source_platform` も任意で付与
- メール、SNS広告、Google広告、QRコードなどのテンプレートで入力を省略
- 既存のクエリパラメータ・ハッシュを保持し、URLエンコードを安全に処理
- 作成した設定をブラウザに保存、再利用、削除
- 保存済み設定をCSVで出力
- 命名ルールのヒントを表示し、集計のばらつきを防止

> 保存データはこのブラウザの `localStorage` にのみ保存されます。別の端末・ブラウザとの自動共有は行いません。

## 使い方

1. 遷移先URLを入力します。
2. 必須の `utm_source`（参照元）、`utm_medium`（媒体）、`utm_campaign`（施策名）を設定します。
3. 必要に応じて、クリエイティブ識別用の `utm_content` や検索語句用の `utm_term` を追加します。
4. 生成URLをコピー、または「設定を保存」して次回再利用します。

例：

```
https://example.com/service?plan=standard&utm_source=newsletter&utm_medium=email&utm_campaign=autumn_sale&utm_content=hero_cta#contact
```

## 命名のおすすめ

- 小文字・数字・ハイフン・アンダースコアを利用する（例：`autumn_sale`）
- 同じ媒体には常に同じ `utm_source`・`utm_medium` を使う
- `utm_campaign` は施策名と一致させる
- 同一施策の広告素材やCTAを比較する場合は `utm_content` を変える

詳細は [Google Analytics の公式ガイド](https://support.google.com/analytics/answer/10917952) を参照してください。

## ローカルで使う

依存パッケージやビルドは不要です。`index.html` をブラウザで開くか、任意の静的HTTPサーバーから配信してください。クリップボード機能を確実に使うには、HTTPSまたは `localhost` で開いてください。

## GitHub Pagesで公開する

このリポジトリは静的ファイルだけで動くため、GitHub Pagesでそのまま公開できます。

1. 変更をGitHubの既定ブランチ（通常は `main`）へpushします。
2. GitHubリポジトリの **Settings → Pages** を開きます。
3. **Build and deployment** の **Source** で **GitHub Actions** を選択します。
4. `Deploy GitHub Pages` ワークフローが完了したら、実行結果に表示される公開URLを開きます。

公開URLはHTTPSになるため、URLコピー機能も利用できます。

## 技術構成

- Vue 3.5.13（CDN）
- HTML / CSS / JavaScript
- ブラウザの `localStorage`

## 注意

UTMの命名規則は組織のレポート設計に合わせて運用してください。Google Adsなど、連携・自動タグ設定済みの広告媒体では、手動UTM付与の方針を事前に確認することをおすすめします。

## 次期版の設計

GA4に限定しない汎用URLパラメータツールへの移行、匿名利用とログイン機能の境界、組織カスタマイズ・共有機能の要件は、[プロダクト設計書](./docs/product-design.md)にまとめています。
