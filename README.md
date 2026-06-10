# Shortcut Memo Clip PWA

Windows / Mac のショートカット辞典、メモ、クリップボード手動保存をまとめた軽量PWAです。

## 主な修正

- `Cannot access 'state' before initialization` を修正
- 初期表示でショートカット一覧が必ず表示されるように修正
- Windows / Mac 切り替えを追加
- Mac用ショートカットを追加
- ショートカット追加・編集・削除を追加
- 標準ショートカットは削除不可
- ユーザー追加ショートカットのみ編集・削除可能
- 「自分で追加」フィルタを追加
- OS別によく使うを保存
- Service Workerのキャッシュ名を更新し、古いキャッシュ対策を追加

## GitHub Pages へのアップロード

リポジトリ直下に以下がある状態でアップロードしてください。

- index.html
- app.js
- styles.css
- sw.js
- manifest.webmanifest
- assets/
- icons/

公開URLは以下のようにルートで開く想定です。

```txt
https://ユーザー名.github.io/リポジトリ名/
```

## 表示が変わらない場合

Chromeで以下を実行してください。

1. Command + Shift + R で強制更新
2. DevTools → Application → Service Workers → Unregister
3. DevTools → Application → Storage → Clear site data
4. 再読み込み

