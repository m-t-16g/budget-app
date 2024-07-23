# 家計簿アプリ

Vue フレームワーク Nuxt 及び、firebase の Auth 機能と、firestoredatabase 利用の技術学習のために制作した SSG の家計簿アプリです。  
ユーザごとに収支データ、設定データの保存が可能です。

## データベース構造

-   budget コレクション(ドキュメント id は自動生成)

    -   amount 支出及び収入額
    -   category カテゴリー
    -   date 日付
    -   owner オーナー(ユーザ id で識別)
    -   title 題名

-   customCategories コレクション(ユーザ id=ドキュメント id)
    -   categories コレクション
        -   以下カスタムしたカテゴリーを列挙
    -   isPositive コレクション
        -   以下 bool 値で収入か支出かの判定

## 認証

GoogleFirebase の Auth 機能をそのまま利用し、ユーザ認証を行っています。メールアドレスとパスワードによるユーザ登録および認証と、Google アカウントによる認証を実装、アプリ内では Auth 機能から与えられたユーザ id を利用してユーザを識別しています。

## 利用フレームワーク

外観は Vue フレームワーク Vuetify を用いて設計しました。データテーブルや入力フォームの実装、mdi アイコンの利用が容易である等を考え選定しました。
