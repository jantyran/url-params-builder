# URL Parameter Studio

[アプリを開く](https://jantyran.github.io/url-params-builder/)

Webトラッキング、広告・CRM計測、独自仕様のURLパラメーターを作成・編集するオープンソースツールです。日本語とEnglishに対応しています。

## できること

- UTMパラメーターを使ったWebトラッキング用URLの作成
- Adobe Tracking Code、広告・CRM計測用のテンプレート
- 任意のキーと値を使ったURLの作成
- 既存URLの読み込み・編集。クエリとハッシュを保持
- 重複キー、URL形式、URL長、認証情報・個人情報らしき値の確認
- URLのコピー、保存、検索、CSV出力、バックアップと復元
- 条件の組み合わせによる複数URLの一括生成
- よく使うパラメーター構成のテンプレート化

## 使い方

1. [アプリを開く](https://jantyran.github.io/url-params-builder/)
2. 作成方法を選ぶ。Webトラッキング、広告・CRM計測、既存URLの編集、自由入力に対応
3. 遷移先URLとパラメーターを入力
4. 生成結果を確認してコピーまたは保存

Adobe Analytics用の形式は、入力画面のテンプレートから「Adobe Tracking Code」を選択します。

## 例

```text
https://example.com/service?utm_source=newsletter&utm_medium=email&utm_campaign=autumn_sale&utm_content=hero_cta
```

## ローカルで動かす

依存パッケージやビルドは不要です。リポジトリを取得後、以下を実行します。

```bash
git clone https://github.com/jantyran/url-params-builder.git
cd url-params-builder
python3 -m http.server 8000
```

ブラウザで [http://localhost:8000](http://localhost:8000) を開きます。終了する場合はターミナルで `Ctrl + C` を押します。

## 参考資料

- [Google Analytics: URL builder](https://support.google.com/analytics/answer/10917952)
- [Adobe Analytics: Campaign tracking](https://experienceleague.adobe.com/en/docs/analytics/implementation/use-cases/campaign-tracking)

プロダクトの設計方針は [プロダクト設計書](./docs/product-design.md) にまとめています。
