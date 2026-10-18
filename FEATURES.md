# TIVS 機能一覧（どこに何の機能があるか）

コードの中にはコメントを入れていません。機能の場所はこのファイルで確認してください。
「#〜」は画面の部品のID、「〜()」はその機能を動かしている関数の名前です。ファイル内で検索すると見つかります。

---

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | ホーム（3つのカード・達成度ヒートマップ・最近の記録） |
| `workout.html` | 筋トレページ |
| `run.html` | ランニングページ |
| `active.html` | 軽い運動ページ（ヨガ・ウォーキング・ストレッチ・瞑想など） |
| `menu.js` | 全ページ共通：右上の ≡ メニュー、背景の白/黒、言語、Spotifyボタン |
| `sw.js` | オフライン対応（ホーム画面に追加したアプリ用） |
| `manifest.webmanifest` | アプリ名・アイコンの設定 |
| `icon-*.png` / `apple-touch-icon.png` | アイコン画像 |

各HTMLファイルの中は「style（見た目）→ body（画面）→ script（動き）」の順に並んでいます。

---

## 全ページ共通（menu.js）

| 機能 | 場所 |
|---|---|
| 右上の ≡ メニュー（HOME / WORKOUT / RUNNING / ACTIVE） | `PAGES`、`build()`、今いるページの判定は `here()` |
| 背景の白 / 黒 | メニュー内「BACKGROUND」。黒の配色は `DARK_CSS`、切り替えは `setTheme()`。保存先 `tdiv_theme` |
| 言語（日本語・English・한국어・中文） | メニュー内「LANGUAGE」。`setLang()`。保存先 `tdiv_lang`（全ページ共通） |
| 右上の小さい Spotify ボタン | `data-menu-slot data-spotify` が付いた場所に `build()` が追加 |
| タイマーの下の大きい Spotify ボタン | `data-spotify-btn` が付いたリンクの中身を `fillBig()` が作る |
| ページ側から使える機能 | `window.TDIV.lang()` / `setLang()` / `theme()` / `setTheme()`。変更時に `tdiv:lang` / `tdiv:theme` イベント |

---

## ホーム（index.html）

| 機能 | 場所 |
|---|---|
| 今日の日付と一言（連続日数など） | `#tDate` `#tMsg` |
| WORKOUT カード（今日の達成率・セット数・メニュー） | `.t-wo`、`render()` 内（筋トレのデータ `tdiv_v2` を読む） |
| RUNNING カード（今週の距離・目標・直近のラン） | `.t-run`、`render()` 内（`tdiv_run_v1` を読む） |
| ACTIVE カード（今週の運動時間・目標・直近の記録） | `.t-ac`、`render()` 内（`tdiv_active_v1` を読む） |
| 達成度ヒートマップ（スマホ17週 / タブレット52週） | `#heat`、色＝筋トレの達成率、丸＝ラン、上の線＝軽い運動 |
| ヒートマップのマスを押したときの内容 | `#hmDet`、`showDay()` |
| STATS（連続日数・最新の体重・今月の運動日） | `#stats` |
| RECENT（最近の記録6件） | `#feed` |

ホームは表示だけで、データは保存しません（各ページのデータを読み取って表示）。

---

## 筋トレ（workout.html）

保存先：localStorage `tdiv_v2`
（exercises＝種目 / routine_items＝メニュー / workout_logs＝日ごとの記録 / workout_sets＝セット / body_weights＝体重 / settings＝設定）

### TODAY タブ（`#v-today`）
| 機能 | 場所 |
|---|---|
| 今日の達成率（数字が「ジジジ」と出る演出） | `#heroNum`、`animateRate()`、`scramble()` |
| VOLUME / STREAK / DAYS | `#mVol` `#mStreak` `#mDays`、`updateStats()` |
| インターバルタイマー（タップで手入力・±10秒・START/STOP） | `#tBig` `#tEdit` `#tMinus` `#tPlus` `#tStart`、`startRest()` `stopRest()` `adjTimer()` `applyTimerEdit()` |
| 終了音（音楽と重ねて鳴らす）・画面を消さない | `#optSound` `#optWake`、`beep()` `applyWake()` |
| Spotify で音楽をかけるボタン | タイマーの下の `a.sp-big` |
| 今日のメニュー（種目カード・セット入力・前回をコピー） | `#exList`、`renderToday()` `exCard()` `addSet()` `copyPrev()` |
| 種目を自由に追加 | `#adhocName` `#adhocBtn` |
| 前回の種目を呼び出す | `#recallBtn`、`lastWorkout()` |
| 今日のメモ | `#memo` |

### CHARTS タブ（`#v-body`）
| 機能 | 場所 |
|---|---|
| 体重の記録 | `#bInput` `#bBtn` |
| 日ごとの体重グラフ（30日 / 90日 / 1年 / 全期間） | `#bSeg`、`renderBodyChart()` `drawChart()` |
| Day Log（その日の種目・開始時刻・時間・メモ） | `#dDate` `#dStart` `#dDur` `#dSave`、`renderDayLog()` |

### LOG タブ（`#v-log`）
| 機能 | 場所 |
|---|---|
| 過去の記録の検索 | `#logQ` |
| 絞り込み（すべて / トレーニング / メモ・時間 / PR） | `#logSeg`、`renderLog()` |
| 1日分の記録の削除・Day Log で編集 | `logItem()`、`delDay()`、`openDayLog()` |

### SETUP タブ（`#v-setup`）
| 機能 | 場所 |
|---|---|
| メニューの決め方（曜日ごとに固定 / 日ごとに決める） | `#planSeg` |
| 曜日・日付ごとのメニュー編集、ほかの日からコピー | `#wdTabs` `#planDate` `#wdCopy`、`renderSetup()` |
| 種目マスタ・新しい種目の登録 | `#nxName` `#nxAdd`、`toggleArchive()` |
| 設定（インターバル秒・日付の切り替え時刻・言語） | `#setRest` `#setDay` `#setLang` |
| バックアップ（表示・コピー・ファイル保存・復元） | `#exportBtn` `#copyBtn` `#dlBtn` `#ulBtn` `#importBtn`、`importData()` |

### その他
| 機能 | 場所 |
|---|---|
| 画面下に浮かぶ休憩タイマー | `#rest`、`renderTimer()` |
| スマホ横向き専用のワークアウトモード（左に大きなリングタイマー、右に今の種目とセット記録） | `#wm`、`renderWM()` `renderWMTimer()`、記録は `#wmLog` |
| 旧バージョンのデータの移行 | `migrateV1()` |

---

## ランニング（run.html）

保存先：localStorage `tdiv_run_v1`（runs・settings）、計測中のランは `tdiv_run_cur`

### RUN タブ（`#v-run`）
| 機能 | 場所 |
|---|---|
| 計測（時間・距離・平均ペース・今のペース） | `#clock` `#sDist` `#sAvg` `#sNow`、`renderClock()` |
| スタート / 一時停止 / 再開 / ラップ / 終了 / 破棄 | `#ctrl`、`start()` `pause()` `resume()` `lap()` `openFinish()` `discard()` |
| GPS で距離を測る | `#optGps`、`gpsStart()` `onPos()` |
| 画面ロック中は GPS が使えない注意書き | `.warn` |
| ロック解除時のお知らせ | `hiddenAt` と `visibilitychange` の処理 |
| Spotify で音楽をかけるボタン | 操作ボタンの下の `a.sp-big` |
| 終了後の保存（距離の修正・メモ） | `#finish` `#fSave` |
| 今週の距離・目標・曜日ごとの距離 | `#wkKm` `#wkDots`、`renderWeek()` |
| 1kmごとのスプリット・ラップ | `#splits`、`renderSplits()` |
| 手入力で追加 | `#man` `#mAdd` |

### CHARTS / LOG / SETUP タブ
| 機能 | 場所 |
|---|---|
| 週ごとの距離（12週）・ペースの推移・記録（最長・最速・今月・累計） | `#v-charts`、`renderCharts()` |
| 合計・月ごとのラン一覧（押すと詳細・削除） | `#v-log`、`renderLog()` |
| 週の目標距離・GPS の初期設定・バックアップ | `#v-setup`、`renderSetup()`、`#goalIn` `#optGps2` `#bkOut` `#bkIn` |

---

## 軽い運動（active.html）

保存先：localStorage `tdiv_active_v1`（logs・flows・types・settings）

### TODAY タブ（`#v-today`）
| 機能 | 場所 |
|---|---|
| 今週の運動時間リング（目標 週150分）・曜日ごとの棒 | `#ringP` `#wkDays`、`renderWeek()` |
| Spotify で音楽をかけるボタン | リングの下の `a.sp-big` |
| 今日の記録（✕を2回押すと削除） | `#todayList`、`entRow()` |
| かんたん記録（種目・時間・きつさ・気分・メモ） | `#typeChips` `#minRow` `#intSeg` `#moodSeg` `#qSave`、`renderQuick()` |
| 自分の種目を追加 | `#customIn` `#customAdd` |

### FLOW タブ（`#v-flow`）
| 機能 | 場所 |
|---|---|
| フロー一覧（▶ 再生・編集・新規作成） | `#flowList` `#flowNew`、`renderFlowList()` |
| フローの編集（名前・種目・ポーズ・秒数・並べ替え・削除） | `#flowEdit`、`openEditor()` `renderEditor()` |
| 最初から入っているフロー | `PRESETS`（朝のヨガ・寝る前ストレッチ・肩こりリセット） |
| 読み上げ・切り替え音・画面を消さない | `#optVoice` `#optSound` `#optWake`、`say()` `beep()` `wake()` |
| 再生画面（全画面・カウントダウン・次のポーズ・Spotify） | `#player`、`startFlow()` `goPose()` `plTick()` `plRender()` |
| 終了画面（気分を選んで記録） | `#plDone`、`plFinish()` `#plSave` |

### BREATH タブ（`#v-breath`）
| 機能 | 場所 |
|---|---|
| 呼吸ガイド（ボックス / 4-7-8 / リラックス） | `PATS`、`#patSel` |
| 時間（1・3・5・10分） | `#brMin` |
| 円に合わせて呼吸・1分以上で「瞑想」として自動記録 | `#brC` `#brGo`、`brStart()` `brPhase()` `brStop()` |

### LOG タブ（`#v-log`）
| 機能 | 場所 |
|---|---|
| 週ごとの合計（8週）・今月の種目別・履歴 | `#chWeek` `#brk` `#hist`、`renderLog()` |
| 週の目標時間・バックアップ | `#goalIn` `#bkOut` `#bkIn` |

---

## オフライン対応（sw.js）

| 機能 | 場所 |
|---|---|
| キャッシュの名前（更新したら番号を上げる） | `CACHE` |
| 全ページと画像を端末に保存 | `install` の処理（`.html` なしのURLへの転送にも対応する `clean()`） |
| ページはネット優先・圏外なら保存済みを表示 | `fetch` の処理 |
