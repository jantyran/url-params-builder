# URL Parameter Studio

Webトラッキング用のUTM、Adobe AnalyticsのTracking Code、広告・CRM・社内独自のパラメータを、解析・生成・検査するブラウザ完結型ツールです。サーバーへの送信やアカウント登録は不要です。

## できること

画面右上で日本語／Englishを切り替えできます。

- URL貼り付けによる既存クエリ・ハッシュの解析と編集
- GA4 UTM、Adobe Tracking Code、広告・CRM、任意パラメータのプロファイル
- 任意のキー・値の追加、並び替え、削除
- 既存のクエリ・ハッシュを保持し、URLエンコードを安全に処理
- 重複キー、URL長、形式、認証情報・個人情報らしき値の検査
- URLとノートの保存、検索、編集、CSV出力、JSONバックアップ／復元
- キャンペーンの条件を掛け合わせる一括URL生成
- 自分用のプロファイル保存

## ログインについて

現行版はログイン不要です。URLの作成、解析、任意パラメータの追加、ノート、CSV／JSON出力はすべて匿名で利用できます。保存時には「この端末に保存」と、今後対応予定の「アカウントで保存」から選べます。

将来のログイン機能は、端末間同期、共有編集、組織共通の命名ルール、承認、変更履歴のためだけに追加します。ログインしない利用者の基本機能を制限する予定はありません。

## 使い方

最初に画面上部の作成方法を選びます。Webトラッキングを選ぶと、GA4を含む一般的なUTM入力欄を用意します。Adobe Analyticsを使う場合は、入力画面のテンプレートから「Adobe Tracking Code」を選びます。

- **Webトラッキング**: UTMの入力欄から始めます。
- **広告・CRM計測**: Campaign IDなどの入力欄から始めます。
- **URLを読み込んで編集**: URLを貼り付け、既存パラメータを分解して編集します。
- **自由に作る**: 独自のキー・値を追加します。

その後、遷移先URLとパラメータを設定し、品質チェックを確認してURLをコピーします。必要ならノートを残して「保存する」を選び、保存方法を選択します。

例：

```
https://example.com/service?plan=standard&utm_source=newsletter&utm_medium=email&utm_campaign=autumn_sale&utm_content=hero_cta#contact
```

## 命名のおすすめ

- 小文字・数字・ハイフン・アンダースコアを利用する（例：`autumn_sale`）
- 同じ媒体には常に同じ `utm_source`・`utm_medium` を使う
- `utm_campaign` は施策名と一致させる
- 同一施策の広告素材やCTAを比較する場合は `utm_content` を変える

GA4については [Google Analytics の公式ガイド](https://support.google.com/analytics/answer/10917952) を、Adobe Tracking Codeについては [Adobeのキャンペーン計測ガイド](https://experienceleague.adobe.com/en/docs/analytics/implementation/use-cases/campaign-tracking) を参照してください。

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

## 注意

パラメータの命名規則は組織のレポート設計に合わせて運用してください。Google Adsなど、連携・自動タグ設定済みの広告媒体では、手動パラメータ付与の方針を事前に確認することをおすすめします。

## 次期版の設計

GA4に限定しない汎用URLパラメータツールへの移行、匿名利用とログイン機能の境界、組織カスタマイズ・共有機能の要件は、[プロダクト設計書](./docs/product-design.md)にまとめています。
