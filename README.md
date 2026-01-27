# UPDATE 2026/1/27(wed)
+ 線描画のopacity(不透明度)機能を有効化
+ マップアイコンに日本語名を表示
+ タッチ操作端末でマップアイコンにマップ名が表示されるように変更(PCではカーソルを合わせることで表示される) 
+ lair(アジト)が表示されないバグを修正
+ マップ選択画面で、長押しタップによる画像やテキストの選択を無効化
+ ペン色の変更時に、再選択まで色が変わらないバグを修正。


<!--技術概要-->

<div id="top"></div>

## 使用技術一覧

<!-- シールド一覧 -->
<!-- 該当するプロジェクトの中から任意のものを選ぶ-->
<p style="display: inline">
  <!-- フロントエンドの言語一覧 -->
  <img alt="Static Badge" src="https://img.shields.io/badge/html-white?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/Sass-black?style=for-the-badge&logo=sass&logoColor=%23CC6699">
  <img alt="Static Badge" src="https://img.shields.io/badge/JAVASCRIPT-black?style=for-the-badge&logo=javascript">
  <!-- バックエンドのフレームワーク一覧 -->

  <!-- バックエンドの言語一覧 -->

  <!-- ミドルウェア一覧 -->

  <!-- インフラ一覧 -->
  <img alt="Static Badge" src="https://img.shields.io/badge/GitHub%20Pages-%23222222?style=for-the-badge&logo=githubpages">
</p>

## 目次

1. [RainbowSixSiegeX BriefingBoardについて](#RainbowSixSiegeX_BriefingBoardについて)
2. [ディレクトリ構成](#ディレクトリ構成)
3. [使い方](#使い方)


<!-- プロジェクト名を記載 -->

## RainbowSixSiegeX_BriefingBoard

RainbowSixSiegeX BriefingBoardリポジトリ

<!-- プロジェクトについて -->

## RainbowSixSiegeX_BriefingBoardについて

HTMLのCanvas要素を使用したレインボーシックスシージXの作戦ボードツール。

<p align="right">(<a href="#top">トップへ</a>)</p>

<!-- プロジェクトの概要を記載 -->


## ディレクトリ構成

<!-- VScodeのAscii Tree Generatorを使ってディレクトリ構成を生成し、imageディレクトリを削除して記載-->

.
├── css
│   ├── style.css
│   └── style.css.map
├── fonts
│   ├── JustAnotherHand-Regular.ttf
│   └── ZenKurenaido-Regular.ttf
├── image
├── js
│   ├── board
│   │   ├── canvas.js
│   │   ├── modal--board.js
│   │   └── session--board.js
│   ├── index
│   │   └── session--index.js
│   ├── operators
│   │   ├── modal--operators.js
│   │   └── session--operators.js
│   ├── common.js
│   └── constants.js
├── sass
│   ├── foundation
│   │   ├── _base.scss
│   │   ├── _index.scss
│   │   ├── _mixins.scss
│   │   ├── _reset.scss
│   │   └── _variables.scss
│   ├── layout
│   │   ├── _index.scss
│   │   ├── _l-board.scss
│   │   ├── _l-body.scss
│   │   └── _l-footer.scss
│   ├── object
│   │   ├── component
│   │   │   ├── _c-button.scss
│   │   │   ├── _c-link.scss
│   │   │   ├── _c-map.scss
│   │   │   ├── _c-modal--board.scss
│   │   │   ├── _c-modal--operator.scss
│   │   │   ├── _c-operator.scss
│   │   │   ├── _c-text.scss
│   │   │   └── _index.scss
│   │   ├── project
│   │   │   ├── _index.scss
│   │   │   ├── _p-board.scss
│   │   │   ├── _p-canvas.scss
│   │   │   ├── _p-howToUse.scss
│   │   │   └── _p-landscape.scss
│   │   └── utility
│   │       ├── _index.scss
│   │       ├── _u-font.scss
│   │       └── _u-layout.scss
│   └── style.scss
├── index.html
├── page-board.html
├── page-operators.html
└── README.md

<p align="right">(<a href="#top">トップへ</a>)</p>

## 使い方
GitHub Pagesで公開中。

### index.html
+ マップ選択。(セッションにマップ情報を保存して遷移)
+ ランクマップのみ対応。

### page-operators.html
+ オペレータを選択。(セッションにオペレータ情報を保存して遷移)

### page-board.html
+ 本サイトの基幹部分。  
+ セッションからマップを読み込んでいるため、本ページへの直リンクではマップが描写されない。
直リンクでアクセスした場合は、右下のmapボタンから任意のマップを選択することでマップが描写され、通常通り使用できる。  
+ オペレータも同様に、描写されていない場合は、右上のoperatorボタンをクリックした後、下部にあるオペレータ変更アイコンをクリックしてオペレータをセットすることで、legendに反映され、各種スタンプが使用できる。

## 運用
### ランクマッププールの変更
+ 公式サイトからイメージ画像やblueprintをimageディレクトリ内に格納し、constants.jsでファイルパスを指定。(既存のマップであれば有効化するなど適宜対応)
+ index.htmlおよびpage-board.htmlのマッププールに関する構成を変更。

### オペレータの追加
+ 公式サイトからアイコン画像やアビリティimageディレクトリ内に格納し、constants.jsでファイルパスを指定。
+ 所持するガジェットを確認し、同ファイル内のオブジェクトを更新。
+ page-operators.htmlやpage-board.htmlのオペレータープールに関する構成を変更。alt等からオペレータ名を取得しているscriptもあるので、要チェック。

<p align="right">(<a href="#top">トップへ</a>)</p>