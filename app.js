'use strict';

const LS_KEY = 'shortcutMemoClip.v6.windowsMac';
const OLD_LS_KEY = 'shortcutMemoClip.v5';
const memoryStorage = new Map();

const DEFAULT_SETTINGS = {
  favoriteMark: '⭐', favoriteColor: '#facc15', favoriteDisplay: 'button-badge', density: 'standard',
  fontFamily: 'Segoe UI, system-ui, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0.01,
  radius: 18, gap: 12, padding: 16, animation: 180, backgroundOpacity: 88, backgroundBlur: 16,
  bg: '#0f172a', panel: '#111827', card: '#1e293b', text: '#f8fafc', muted: '#94a3b8', border: '#334155', accent: '#38bdf8'
};

const WINDOWS_ROWS = [
  ['w-copy','Windows','基本','コピー','Ctrl + C','選択した文字やファイルをコピー','copy コピ 複製'],
  ['w-paste','Windows','基本','貼り付け','Ctrl + V','コピーした内容を貼り付け','paste ペースト'],
  ['w-cut','Windows','基本','切り取り','Ctrl + X','選択した文字やファイルを切り取り','cut カット'],
  ['w-undo','Windows','基本','元に戻す','Ctrl + Z','直前の操作を取り消す','undo 戻す'],
  ['w-redo','Windows','基本','やり直し','Ctrl + Y','取り消した操作をやり直す','redo'],
  ['w-select-all','Windows','基本','全選択','Ctrl + A','すべて選択','select all'],
  ['w-save','Windows','基本','保存','Ctrl + S','現在のファイルを保存','save'],
  ['w-find','Windows','基本','検索','Ctrl + F','ページやファイル内を検索','find search 探す'],
  ['w-screenshot-area','Windows','画面','スクリーンショット','Win + Shift + S','範囲を選んで画面を撮影','スクショ 写真 画像 キャプチャ 画面撮影 screenshot capture snipping snip'],
  ['w-screenshot-all','Windows','画面','画面全体を撮影','PrtScn','画面全体をクリップボードへコピー','スクショ 写真 画像 キャプチャ screenshot printscreen'],
  ['w-screenshot-window','Windows','画面','アクティブ画面を撮影','Alt + PrtScn','現在のウィンドウだけを撮影','スクショ ウィンドウ 写真 画像 キャプチャ'],
  ['w-desktop','Windows','画面','デスクトップ表示','Win + D','すべてのウィンドウを最小化してデスクトップ表示','desktop'],
  ['w-switch-app','Windows','画面','ウィンドウ切り替え','Alt + Tab','開いているアプリを切り替える','アプリ切替 switch'],
  ['w-task-view','Windows','画面','タスクビュー','Win + Tab','仮想デスクトップと開いている画面を表示','task view'],
  ['w-maximize','Windows','画面','ウィンドウ最大化','Win + ↑','現在のウィンドウを最大化','maximize'],
  ['w-minimize','Windows','画面','ウィンドウ最小化','Win + ↓','現在のウィンドウを最小化','minimize'],
  ['w-snap-left','Windows','画面','左に整列','Win + ←','ウィンドウを左半分へ配置','snap left'],
  ['w-snap-right','Windows','画面','右に整列','Win + →','ウィンドウを右半分へ配置','snap right'],
  ['w-explorer','Windows','システム','エクスプローラーを開く','Win + E','ファイル管理画面を開く','explorer file folder フォルダ'],
  ['w-settings','Windows','システム','設定を開く','Win + I','Windows設定を開く','settings setting 環境設定'],
  ['w-lock','Windows','システム','画面ロック','Win + L','PCをロックする','lock'],
  ['w-quick-settings','Windows','システム','クイック設定','Win + A','Wi-Fiや音量などの設定を開く','quick settings'],
  ['w-notification','Windows','システム','通知センター','Win + N','通知とカレンダーを表示','notification'],
  ['w-run','Windows','システム','実行','Win + R','実行ダイアログを開く','run'],
  ['w-clipboard-history','Windows','システム','クリップボード履歴','Win + V','Windowsのクリップボード履歴を開く','clipboard clip コピー履歴'],
  ['w-emoji','Windows','システム','絵文字パネル','Win + .','絵文字・記号・顔文字を入力','emoji'],
  ['w-task-manager','Windows','システム','タスクマネージャー','Ctrl + Shift + Esc','タスクマネージャーを開く','task manager'],
  ['w-security','Windows','システム','セキュリティ画面','Ctrl + Alt + Delete','ロックやサインアウトなどを表示','security'],
  ['w-new-tab','Chrome','ブラウザ','新しいタブ','Ctrl + T','新しいタブを開く','browser tab'],
  ['w-close-tab','Chrome','ブラウザ','タブを閉じる','Ctrl + W','現在のタブを閉じる','tab close'],
  ['w-reopen-tab','Chrome','ブラウザ','閉じたタブを戻す','Ctrl + Shift + T','最後に閉じたタブを復元','restore tab'],
  ['w-address','Chrome','ブラウザ','アドレスバーへ移動','Ctrl + L','URL入力欄へフォーカス','address url'],
  ['w-history','Chrome','ブラウザ','履歴','Ctrl + H','閲覧履歴を開く','history'],
  ['w-download','Chrome','ブラウザ','ダウンロード','Ctrl + J','ダウンロード一覧を開く','download'],
  ['w-bookmark','Chrome','ブラウザ','ブックマーク','Ctrl + D','現在のページをブックマーク','bookmark'],
  ['w-reload','Chrome','ブラウザ','再読み込み','Ctrl + R','ページを再読み込み','reload refresh']
];

const MAC_ROWS = [
  ['m-copy','mac','基本','コピー','Command + C','選択した文字やファイルをコピー','copy コピ 複製 cmd'],
  ['m-paste','mac','基本','貼り付け','Command + V','コピーした内容を貼り付け','paste ペースト cmd'],
  ['m-cut','mac','基本','切り取り','Command + X','選択した文字やファイルを切り取り','cut カット cmd'],
  ['m-undo','mac','基本','元に戻す','Command + Z','直前の操作を取り消す','undo 戻す cmd'],
  ['m-redo','mac','基本','やり直し','Command + Shift + Z','取り消した操作をやり直す','redo cmd'],
  ['m-select-all','mac','基本','全選択','Command + A','すべて選択','select all cmd'],
  ['m-save','mac','基本','保存','Command + S','現在のファイルを保存','save cmd'],
  ['m-find','mac','基本','検索','Command + F','ページやファイル内を検索','find search 探す cmd'],
  ['m-spotlight','macOS','システム','Spotlight検索','Command + Space','Mac全体からアプリやファイルを検索','spotlight 検索 アプリ ファイル'],
  ['m-switch-app','macOS','画面','アプリ切り替え','Command + Tab','開いているアプリを切り替える','アプリ切替 switch'],
  ['m-quit-app','macOS','基本','アプリ終了','Command + Q','現在のアプリを終了する','quit close 終了'],
  ['m-close-window','macOS','基本','ウィンドウを閉じる','Command + W','現在のウィンドウやタブを閉じる','close tab window'],
  ['m-minimize','macOS','画面','最小化','Command + M','現在のウィンドウをDockへしまう','minimize'],
  ['m-hide-app','macOS','画面','アプリを隠す','Command + H','現在のアプリを非表示にする','hide 隠す'],
  ['m-force-quit','macOS','システム','強制終了','Command + Option + Esc','応答しないアプリを強制終了する','force quit フリーズ'],
  ['m-screenshot-all','macOS','画面','画面全体スクリーンショット','Command + Shift + 3','画面全体を撮影して保存','スクショ スクリーンショット 写真 画像 キャプチャ 画面撮影 screenshot capture'],
  ['m-screenshot-area','macOS','画面','範囲スクリーンショット','Command + Shift + 4','範囲を選択してスクリーンショットを撮影','スクショ スクリーンショット 写真 画像 キャプチャ 画面撮影 screenshot capture'],
  ['m-screenshot-menu','macOS','画面','スクリーンショットメニュー','Command + Shift + 5','スクリーンショットと画面収録メニューを開く','スクショ スクリーンショット 写真 画像 キャプチャ 画面収録 screenshot capture recording'],
  ['m-new-window','macOS','基本','新規ウィンドウ','Command + N','新しいウィンドウを開く','new window'],
  ['m-new-tab','Chrome / Safari','ブラウザ','新規タブ','Command + T','新しいタブを開く','browser tab safari chrome'],
  ['m-address','Chrome / Safari','ブラウザ','アドレスバーへ移動','Command + L','URL入力欄へフォーカス','address url'],
  ['m-reopen-tab','Chrome / Safari','ブラウザ','閉じたタブを戻す','Command + Shift + T','最後に閉じたタブを復元','restore tab'],
  ['m-reload','Chrome / Safari','ブラウザ','再読み込み','Command + R','ページを再読み込み','reload refresh'],
  ['m-finder-hidden','Finder','Finder','隠しファイル表示切替','Command + Shift + .','Finderで隠しファイルの表示/非表示を切り替える','finder 隠しファイル 表示 非表示 dot']
];

function rowsToShortcuts(rows, os){
  return rows.map(([id, app, category, title, keys, description, aliases]) => ({
    id, os, app, category, title, keys, description, aliases,
    keywords: String(aliases || '').split(/\s+/).filter(Boolean),
    system: true, userCreated: false, type: 'system'
  }));
}
const DEFAULT_WINDOWS_SHORTCUTS = rowsToShortcuts(WINDOWS_ROWS, 'windows');
const DEFAULT_MAC_SHORTCUTS = rowsToShortcuts(MAC_ROWS, 'mac');
const DEFAULT_SHORTCUTS = [...DEFAULT_WINDOWS_SHORTCUTS, ...DEFAULT_MAC_SHORTCUTS];

function uid(){ return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }
function now(){ return new Date().toISOString(); }
function escapeHtml(str=''){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function clone(data){ return JSON.parse(JSON.stringify(data)); }
function safeParse(v){ try { return JSON.parse(v); } catch { return null; } }
function storageGet(key){ try { if(window.localStorage) return window.localStorage.getItem(key); } catch {} return memoryStorage.get(key) || null; }
function storageSet(key, value){ try { if(window.localStorage) { window.localStorage.setItem(key, value); return; } } catch {} memoryStorage.set(key, value); }

const DEFAULT_STATE = {
  activeTab: 'shortcuts', selectedOS: 'windows', shortcutFilter: 'all', category: 'all', query: '',
  frequentIdsByOS: {
    windows: ['w-copy','w-paste','w-save','w-screenshot-area','w-switch-app','w-explorer','w-settings','w-clipboard-history','w-new-tab','w-address'],
    mac: ['m-copy','m-paste','m-save','m-screenshot-area','m-screenshot-menu','m-switch-app','m-spotlight','m-new-tab','m-address','m-finder-hidden']
  },
  notes: [{id: 'welcome-note', title:'便利メモ', body:'覚えておきたい操作や手順をここに保存できます。', pinned:true, createdAt:'2026-01-01T00:00:00.000Z'}],
  clips: [], customShortcuts: [], settings: DEFAULT_SETTINGS, undo: null
};

function normalizeShortcut(item){
  if(!item || typeof item !== 'object') return null;
  const title = String(item.title || '').trim();
  const keys = String(item.keys || '').trim();
  if(!title || !keys) return null;
  const os = item.os === 'mac' ? 'mac' : 'windows';
  const id = String(item.id || `user-${os}-${uid()}`);
  const keywords = Array.isArray(item.keywords) ? item.keywords : String(item.aliases || '').split(/[、,\s]+/).filter(Boolean);
  return {
    id, os, title, keys,
    category: String(item.category || item.app || '自分用'), app: String(item.app || item.category || '自分用'),
    description: String(item.description || ''), aliases: String(item.aliases || keywords.join(' ')), keywords,
    system: item.system !== false && item.userCreated !== true ? true : false,
    userCreated: item.userCreated === true || item.system === false,
    type: item.userCreated === true || item.system === false ? 'custom' : 'system',
    createdAt: item.createdAt || now(), updatedAt: item.updatedAt || now()
  };
}

function migrateOldState(old){
  const next = clone(DEFAULT_STATE);
  if(!old || typeof old !== 'object') return next;
  next.activeTab = ['shortcuts','notes','clips','settings'].includes(old.activeTab) ? old.activeTab : 'shortcuts';
  next.selectedOS = old.selectedOS === 'mac' ? 'mac' : 'windows';
  next.shortcutFilter = ['all','frequent','others','custom'].includes(old.shortcutFilter) ? old.shortcutFilter : 'all';
  next.category = typeof old.category === 'string' ? old.category : 'all';
  next.query = typeof old.query === 'string' ? old.query : '';
  next.notes = Array.isArray(old.notes) ? old.notes : next.notes;
  next.clips = Array.isArray(old.clips) ? old.clips.slice(0,50) : [];
  next.settings = {...DEFAULT_SETTINGS, ...(old.settings || {})};
  next.customShortcuts = Array.isArray(old.customShortcuts)
    ? old.customShortcuts.map(normalizeShortcut).filter(Boolean).map(x => ({...x, system:false, userCreated:true, type:'custom'}))
    : [];
  if(old.frequentIdsByOS && typeof old.frequentIdsByOS === 'object') {
    next.frequentIdsByOS = {
      windows: Array.isArray(old.frequentIdsByOS.windows) ? old.frequentIdsByOS.windows : next.frequentIdsByOS.windows,
      mac: Array.isArray(old.frequentIdsByOS.mac) ? old.frequentIdsByOS.mac : next.frequentIdsByOS.mac
    };
  } else if(Array.isArray(old.frequentIds)) {
    next.frequentIdsByOS.windows = old.frequentIds;
  }
  return next;
}
function loadState(){
  const current = safeParse(storageGet(LS_KEY));
  const old = safeParse(storageGet(OLD_LS_KEY));
  const next = migrateOldState(current || old || null);
  if(!Array.isArray(next.customShortcuts)) next.customShortcuts = [];
  if(!next.frequentIdsByOS) next.frequentIdsByOS = clone(DEFAULT_STATE.frequentIdsByOS);
  return next;
}
function saveState(nextState){ storageSet(LS_KEY, JSON.stringify(nextState)); }
let state = loadState();
let deferredInstallPrompt = null;

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
function save(){ saveState(state); }
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),1800); }

const SYN = {
  'スクショ':['スクリーンショット','写真','画像','キャプチャ','画面撮影','screenshot','capture','snip','snipping'],
  'スクリーンショット':['スクショ','写真','画像','キャプチャ','画面撮影','screenshot','capture'],
  '写真':['スクショ','スクリーンショット','画像','キャプチャ','撮影'],
  '画像':['スクショ','スクリーンショット','写真','キャプチャ'],
  'コピー':['copy','コピ','複製','クリップボード'], '貼り付け':['paste','ペースト'],
  '設定':['settings','setting','環境設定'], 'ファイル':['file','フォルダ','folder','エクスプローラー','finder'],
  '検索':['search','find','探す','spotlight'], '履歴':['history','クリップボード履歴'], 'コマンド':['command','cmd','⌘']
};
function normalize(s=''){ return String(s).toLowerCase().normalize('NFKC').replace(/[\s　+_\-\/\\|:：;；,.。、()（）\[\]【】「」'"`]/g,''); }
function queryTerms(q){
  const base = normalize(q); if(!base) return [];
  const terms = new Set([base]);
  Object.entries(SYN).forEach(([k, arr]) => {
    const nk = normalize(k);
    if(base.includes(nk) || arr.some(a => base.includes(normalize(a)))) { terms.add(nk); arr.forEach(a => terms.add(normalize(a))); }
  });
  return Array.from(terms).filter(Boolean);
}
function textOf(item){ return [item.title,item.keys,item.description,item.category,item.app,item.aliases,item.keywords?.join(' '),item.body,item.os].filter(Boolean).join(' '); }
function scoreItem(item, q){
  const terms=queryTerms(q); if(!terms.length) return 1;
  const target=normalize(textOf(item)); let score=0;
  for(const term of terms){
    if(target.includes(term)) score += term.length > 2 ? 12 : 7;
    if(normalize(item.title||'').includes(term)) score += 18;
    if(normalize(item.keys||'').includes(term)) score += 10;
    if(normalize(item.aliases||'').includes(term)) score += 14;
  }
  return score;
}
function highlight(str,q){
  let html = escapeHtml(str || '');
  const direct = String(q || '').trim();
  if(!direct) return html;
  const raw = Array.from(new Set([direct, ...queryTerms(direct)])).filter(v=>v && v.length>=2).slice(0,8);
  raw.forEach(term=>{ const safe = escapeHtml(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); try { html = html.replace(new RegExp(`(${safe})`,'gi'), '<mark class="highlight">$1</mark>'); } catch {} });
  return html;
}
function systemShortcutsForOS(os){ return os === 'mac' ? DEFAULT_MAC_SHORTCUTS : DEFAULT_WINDOWS_SHORTCUTS; }
function allShortcuts(){ return [...systemShortcutsForOS(state.selectedOS), ...state.customShortcuts.filter(x => x.os === state.selectedOS)]; }
function currentFrequentIds(){
  if(!state.frequentIdsByOS) state.frequentIdsByOS = clone(DEFAULT_STATE.frequentIdsByOS);
  if(!Array.isArray(state.frequentIdsByOS[state.selectedOS])) state.frequentIdsByOS[state.selectedOS] = [];
  return state.frequentIdsByOS[state.selectedOS];
}
function isFrequent(id){ return currentFrequentIds().includes(id); }
function setFrequent(id, on){
  const ids = currentFrequentIds();
  state.frequentIdsByOS[state.selectedOS] = on ? Array.from(new Set([...ids, id])) : ids.filter(x => x !== id);
}
function setCss(){
  const s=state.settings, r=document.documentElement.style;
  ['bg','panel','card','text','muted','border','accent'].forEach(k=>r.setProperty(`--${k}`,s[k]));
  r.setProperty('--fav',s.favoriteColor); r.setProperty('--radius',s.radius+'px'); r.setProperty('--gap',s.gap+'px'); r.setProperty('--pad',s.padding+'px'); r.setProperty('--font-family',s.fontFamily); r.setProperty('--font-size',s.fontSize+'px'); r.setProperty('--font-weight',s.fontWeight); r.setProperty('--line-height',s.lineHeight); r.setProperty('--letter-spacing',s.letterSpacing+'em'); r.setProperty('--anim',s.animation+'ms'); r.setProperty('--background-opacity',s.backgroundOpacity+'%'); r.setProperty('--background-blur',s.backgroundBlur+'px');
  document.body.classList.toggle('fav-hidden', s.favoriteDisplay === 'hidden');
}
function updateTabs(){
  $$('.tab').forEach(b=>b.classList.toggle('is-active', b.dataset.tab === state.activeTab));
  $$('.panel').forEach(p=>p.classList.toggle('is-active', p.id === state.activeTab));
  const tb = $('#shortcutToolbar'); if(tb) tb.style.display = state.activeTab === 'shortcuts' ? 'flex' : 'none';
}
function render(){ setCss(); updateTabs(); renderCategoryOptions(); renderShortcuts(); renderNotes(); renderClips(); renderSettings(); updateMeta(); save(); }
function updateMeta(){
  const q=state.query.trim(); let count=0;
  if(state.activeTab==='shortcuts') count=filteredShortcuts().length;
  if(state.activeTab==='notes') count=filteredNotes().length;
  if(state.activeTab==='clips') count=filteredClips().length;
  const meta = $('#searchMeta'); if(meta) meta.textContent = q ? `検索結果 ${count}件` : `${state.selectedOS === 'mac' ? 'Mac' : 'Windows'} 登録ショートカット ${allShortcuts().length}件`;
}
function renderCategoryOptions(){
  const sel=$('#categoryFilter'); if(!sel) return;
  const cats=Array.from(new Set(allShortcuts().map(s=>s.category))).sort((a,b)=>a.localeCompare(b,'ja'));
  sel.innerHTML = '<option value="all">すべてのカテゴリ</option>' + cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  if(!cats.includes(state.category) && state.category !== 'all') state.category='all';
  sel.value=state.category;
  $$('.seg').forEach(b=>b.classList.toggle('is-active', b.dataset.filter===state.shortcutFilter));
  $$('.os-btn').forEach(b=>b.classList.toggle('is-active', b.dataset.os===state.selectedOS));
}
function filteredShortcuts(){
  const q=state.query; let list=allShortcuts().map(item=>({...item,_score:scoreItem(item,q)}));
  if(q.trim()) list=list.filter(x=>x._score>0);
  if(state.category!=='all') list=list.filter(x=>x.category===state.category);
  if(state.shortcutFilter==='frequent') list=list.filter(x=>isFrequent(x.id));
  if(state.shortcutFilter==='others') list=list.filter(x=>!isFrequent(x.id));
  if(state.shortcutFilter==='custom') list=list.filter(x=>x.userCreated === true || x.system === false);
  return list.sort((a,b)=> (isFrequent(b.id)-isFrequent(a.id)) || b._score-a._score || a.title.localeCompare(b.title,'ja'));
}
function section(title, items, body){ if(!items.length) return ''; return `<div class="section-title"><h2>${title}</h2><span class="count">${items.length}件</span></div><div class="grid">${body(items)}</div>`; }
function iconFor(cat){ const map={基本:'⌘',画面:'📷',システム:'⚙',ブラウザ:'🌐',Finder:'📁'}; return map[cat] || '⌨'; }
function shortcutCard(item){
  const fav=isFrequent(item.id), mark=escapeHtml(state.settings.favoriteMark||'⭐');
  const compact=state.settings.density==='compact'?' compact':'';
  const custom = item.userCreated === true || item.system === false;
  return `<article class="card shortcut-card${compact}" data-id="${escapeHtml(item.id)}">
    <div class="icon">${iconFor(item.category)}</div>
    <div>
      <div class="title"><span class="fav-badge ${fav?'show':''}">${mark}</span>${highlight(item.title,state.query)}</div>
      <div class="keys">${highlight(item.keys,state.query)}</div>
      <div class="desc">${highlight(item.description,state.query)}</div>
      <div class="meta">${state.selectedOS === 'mac' ? 'Mac' : 'Windows'}・カテゴリ：${escapeHtml(item.app || item.category)} ${custom ? '・自分で追加' : '・辞典データ'}</div>
    </div>
    <div class="shortcut-actions">
      <button class="fav-btn ${fav?'is-on':''}" data-action="toggle-fav" data-id="${escapeHtml(item.id)}">${fav ? `${mark} 登録済み` : '☆ よく使う'}</button>
      ${custom ? `<button class="btn" data-action="edit-shortcut" data-id="${escapeHtml(item.id)}">編集</button><button class="btn danger" data-action="delete-shortcut" data-id="${escapeHtml(item.id)}">削除</button>` : ''}
    </div>
  </article>`;
}
function renderShortcuts(){
  const list=filteredShortcuts();
  const frequent=list.filter(x=>isFrequent(x.id)); const others=list.filter(x=>!isFrequent(x.id));
  let html = '';
  if(state.shortcutFilter==='frequent') html = section('⭐ よく使う', frequent, items=>items.map(shortcutCard).join(''));
  else if(state.shortcutFilter==='others') html = section('📚 その他', others, items=>items.map(shortcutCard).join(''));
  else if(state.shortcutFilter==='custom') html = section('✍ 自分で追加', list, items=>items.map(shortcutCard).join(''));
  else html = section('⭐ よく使う', frequent, items=>items.map(shortcutCard).join('')) + section('📚 その他', others, items=>items.map(shortcutCard).join(''));
  $('#shortcuts').innerHTML = html || '<div class="empty">該当するショートカットがありません。</div>';
}
function filteredNotes(){ return state.notes.map(n=>({...n,_score:scoreItem({...n,description:n.body}, state.query)})).filter(n=>!state.query.trim() || n._score>0).sort((a,b)=>(Boolean(b.pinned)-Boolean(a.pinned))||b._score-a._score||String(b.createdAt).localeCompare(String(a.createdAt))); }
function renderNotes(){
  const list=filteredNotes();
  $('#notes').innerHTML = `<div class="form"><input class="field" id="noteTitle" placeholder="メモタイトル" /><textarea id="noteBody" placeholder="メモ内容"></textarea><button class="btn primary" data-action="add-note">メモを追加</button></div>` + (list.length ? `<div class="grid">${list.map(n=>`<article class="card" data-id="${n.id}"><div class="title">${n.pinned?'📌 ':''}${highlight(n.title,state.query)}</div><div class="desc">${highlight(n.body,state.query)}</div><div class="actions"><button class="btn ghost" data-action="pin-note" data-id="${n.id}">${n.pinned?'ピン解除':'ピン留め'}</button><button class="btn" data-action="edit-note" data-id="${n.id}">編集</button><button class="btn danger" data-action="delete-note" data-id="${n.id}">削除</button></div></article>`).join('')}</div>` : '<div class="empty">メモはまだありません。</div>');
}
function filteredClips(){ return state.clips.map(c=>({...c,_score:scoreItem({title:c.text,description:c.text}, state.query)})).filter(c=>!state.query.trim() || c._score>0).sort((a,b)=>(Boolean(b.pinned)-Boolean(a.pinned))||b._score-a._score||String(b.createdAt).localeCompare(String(a.createdAt))); }
function renderClips(){
  const list=filteredClips();
  $('#clips').innerHTML = `<div class="form"><textarea id="clipText" placeholder="保存したいテキストを貼り付け"></textarea><button class="btn primary" data-action="add-clip">クリップボードに保存（最大50個）</button></div>` + (list.length ? `<div class="grid">${list.map(c=>`<article class="card" data-id="${c.id}"><div class="title">${c.pinned?'📌 ':''}クリップ</div><div class="desc">${highlight(c.text,state.query)}</div><div class="actions"><button class="btn primary" data-action="copy-clip" data-id="${c.id}">コピー</button><button class="btn ghost" data-action="pin-clip" data-id="${c.id}">${c.pinned?'ピン解除':'ピン留め'}</button><button class="btn" data-action="edit-clip" data-id="${c.id}">編集</button><button class="btn danger" data-action="delete-clip" data-id="${c.id}">削除</button></div></article>`).join('')}</div>` : '<div class="empty">クリップはまだありません。</div>');
}
function renderSettings(){
  const s=state.settings;
  $('#settings').innerHTML = `<div class="settings-grid">
    <section class="setting-card"><h2>お気に入り表示</h2><label>マーク<input class="field" data-setting="favoriteMark" value="${escapeHtml(s.favoriteMark)}" maxlength="4"></label><label>色<input type="color" data-setting="favoriteColor" value="${s.favoriteColor}"></label><label>表示<select class="select" data-setting="favoriteDisplay"><option value="button-badge">ボタン＋見出し</option><option value="button-only">ボタンのみ</option><option value="hidden">非表示</option></select></label><label>表示密度<select class="select" data-setting="density"><option value="standard">標準</option><option value="compact">コンパクト</option></select></label></section>
    <section class="setting-card"><h2>初期表示</h2><label>OS<select class="select" data-setting="selectedOS"><option value="windows">Windows</option><option value="mac">Mac</option></select></label></section>
    <section class="setting-card"><h2>フォント</h2><label>書体<select class="select" data-setting="fontFamily"><option value="Segoe UI, system-ui, sans-serif">Segoe UI</option><option value="Inter, Segoe UI, sans-serif">Inter</option><option value="Noto Sans JP, Segoe UI, sans-serif">Noto Sans JP</option><option value="Yu Gothic, Segoe UI, sans-serif">游ゴシック</option><option value="Meiryo, Segoe UI, sans-serif">メイリオ</option><option value="JetBrains Mono, Consolas, monospace">JetBrains Mono</option></select></label><label>文字サイズ <input type="range" min="12" max="22" data-setting="fontSize" value="${s.fontSize}"></label><label>太さ <input type="range" min="300" max="800" step="100" data-setting="fontWeight" value="${s.fontWeight}"></label><label>行間 <input type="range" min="1.2" max="2" step="0.05" data-setting="lineHeight" value="${s.lineHeight}"></label><label>文字間隔 <input type="range" min="0" max="0.12" step="0.01" data-setting="letterSpacing" value="${s.letterSpacing}"></label></section>
    <section class="setting-card"><h2>サイズ・余白</h2><label>角丸 <input type="range" min="4" max="34" data-setting="radius" value="${s.radius}"></label><label>余白 <input type="range" min="8" max="30" data-setting="padding" value="${s.padding}"></label><label>間隔 <input type="range" min="6" max="24" data-setting="gap" value="${s.gap}"></label><label>アニメーション <input type="range" min="0" max="400" data-setting="animation" value="${s.animation}"></label></section>
    <section class="setting-card"><h2>背景効果</h2><label>背景の透明度 ${s.backgroundOpacity}% <input type="range" min="20" max="100" step="1" data-setting="backgroundOpacity" value="${s.backgroundOpacity}"></label><label>背景のぼかし ${s.backgroundBlur}px <input type="range" min="0" max="40" step="1" data-setting="backgroundBlur" value="${s.backgroundBlur}"></label></section>
    <section class="setting-card"><h2>色</h2>${['bg','panel','card','text','muted','border','accent'].map(k=>`<label>${k}<input type="color" data-setting="${k}" value="${s[k]}"></label>`).join('')}</section>
    <section class="setting-card"><h2>データ管理</h2><div class="actions"><button class="btn" data-action="export-data">全データ書き出し</button><button class="btn" data-action="import-data">読み込み</button><button class="btn danger" data-action="reset-data">初期化</button><input id="importFile" type="file" accept="application/json" hidden></div></section>
  </div>`;
  $$('[data-setting]').forEach(el=>{ const key=el.dataset.setting; if(key === 'selectedOS') el.value=state.selectedOS; else if(el.tagName==='SELECT') el.value=String(s[key]); });
}
function confirmDelete(msg){ return confirm(msg); }
function pushUndo(type,item){ state.undo={type,item,at:Date.now()}; toast('削除しました。Ctrl+Zで元に戻せます'); }
async function copyText(text){ try { await navigator.clipboard.writeText(text); toast('コピーしました'); } catch { prompt('コピーしてください', text); } }
function capClips(){ const pinned=state.clips.filter(c=>c.pinned), normal=state.clips.filter(c=>!c.pinned); state.clips=[...pinned,...normal].slice(0,50); }
function openShortcutForm(item=null){
  const editing = Boolean(item);
  const title = prompt('タイトル', item?.title || ''); if(title===null) return;
  const keys = prompt('ショートカットキー', item?.keys || (state.selectedOS === 'mac' ? 'Command + ' : 'Ctrl + ')); if(keys===null) return;
  if(!title.trim() || !keys.trim()) return toast('タイトルとショートカットキーは必須です');
  const category = prompt('カテゴリ', item?.category || '自分用'); if(category===null) return;
  const description = prompt('説明', item?.description || ''); if(description===null) return;
  const keywordText = prompt('検索キーワード（カンマ区切り）', (item?.keywords || []).join(', ')); if(keywordText===null) return;
  const keywords = keywordText.split(/[、,]/).map(x=>x.trim()).filter(Boolean);
  if(editing){ Object.assign(item, {title:title.trim(), keys:keys.trim(), category:category.trim()||'自分用', app:category.trim()||'自分用', description:description.trim(), keywords, aliases:keywords.join(' '), updatedAt:now()}); }
  else { state.customShortcuts.unshift({id:`user-${state.selectedOS}-${uid()}`, os:state.selectedOS, title:title.trim(), keys:keys.trim(), category:category.trim()||'自分用', app:category.trim()||'自分用', description:description.trim(), keywords, aliases:keywords.join(' '), userCreated:true, system:false, type:'custom', createdAt:now(), updatedAt:now()}); state.shortcutFilter='custom'; }
  render(); toast(editing ? 'ショートカットを更新しました' : 'ショートカットを追加しました');
}
function bind(){
  const search = $('#searchInput'); if(search){ search.value=state.query; search.addEventListener('input', e=>{ state.query=e.target.value; render(); }); }
  document.addEventListener('click', e=>{
    const btn=e.target.closest('button[data-action], .tab, .seg, .os-btn'); if(!btn) return;
    if(btn.classList.contains('tab')){ state.activeTab=btn.dataset.tab; render(); return; }
    if(btn.classList.contains('seg')){ state.shortcutFilter=btn.dataset.filter; render(); return; }
    if(btn.classList.contains('os-btn')){ state.selectedOS=btn.dataset.os; state.category='all'; state.shortcutFilter='all'; render(); return; }
    const id=btn.dataset.id, action=btn.dataset.action;
    if(action==='toggle-fav') { setFrequent(id, !isFrequent(id)); render(); return; }
    if(action==='add-shortcut') { openShortcutForm(); return; }
    if(action==='edit-shortcut') { const item=state.customShortcuts.find(x=>x.id===id); if(item) openShortcutForm(item); return; }
    if(action==='delete-shortcut') { const item=state.customShortcuts.find(x=>x.id===id); if(item && confirmDelete('この追加ショートカットを削除しますか？')){ state.customShortcuts=state.customShortcuts.filter(x=>x.id!==id); setFrequent(id,false); pushUndo('shortcut',item); render(); } return; }
    if(action==='add-note'){ const title=$('#noteTitle').value.trim()||'無題メモ', body=$('#noteBody').value.trim(); if(!body) return toast('メモ内容を入力してください'); state.notes.unshift({id:uid(),title,body,pinned:false,createdAt:now()}); render(); toast('メモを追加しました'); return; }
    if(action==='pin-note'){ const n=state.notes.find(x=>x.id===id); if(n) n.pinned=!n.pinned; render(); return; }
    if(action==='edit-note'){ const n=state.notes.find(x=>x.id===id); if(!n) return; const title=prompt('タイトル', n.title); if(title===null)return; const body=prompt('内容', n.body); if(body===null)return; n.title=title.trim()||n.title; n.body=body.trim()||n.body; render(); return; }
    if(action==='delete-note'){ const n=state.notes.find(x=>x.id===id); if(n&&confirmDelete('このメモを削除しますか？')){ state.notes=state.notes.filter(x=>x.id!==id); pushUndo('note',n); render(); } return; }
    if(action==='add-clip'){ const text=$('#clipText').value; if(!text) return toast('保存するテキストを入力してください'); state.clips.unshift({id:uid(),text,pinned:false,createdAt:now()}); capClips(); render(); toast('保存しました'); return; }
    if(action==='copy-clip'){ const c=state.clips.find(x=>x.id===id); if(c) copyText(c.text); return; }
    if(action==='pin-clip'){ const c=state.clips.find(x=>x.id===id); if(c) c.pinned=!c.pinned; render(); return; }
    if(action==='edit-clip'){ const c=state.clips.find(x=>x.id===id); if(!c)return; const text=prompt('内容', c.text); if(text===null)return; c.text=text||c.text; render(); return; }
    if(action==='delete-clip'){ const c=state.clips.find(x=>x.id===id); if(c&&confirmDelete('このクリップを削除しますか？')){ state.clips=state.clips.filter(x=>x.id!==id); pushUndo('clip',c); render(); } return; }
    if(action==='export-data'){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='shortcut-memo-clip-backup.json'; a.click(); URL.revokeObjectURL(a.href); return; }
    if(action==='import-data'){ $('#importFile')?.click(); return; }
    if(action==='reset-data'){ if(confirm('すべて初期化しますか？')){ state=clone(DEFAULT_STATE); render(); } return; }
  });
  document.addEventListener('input', e=>{
    const el=e.target.closest('[data-setting]'); if(!el)return;
    const key=el.dataset.setting; let val=el.value;
    if(key === 'selectedOS'){ state.selectedOS = val === 'mac' ? 'mac' : 'windows'; state.category='all'; render(); return; }
    if(['fontSize','fontWeight','lineHeight','letterSpacing','radius','gap','padding','animation','backgroundOpacity','backgroundBlur'].includes(key)) val=Number(val);
    state.settings[key]=val; render();
  });
  $('#categoryFilter')?.addEventListener('change', e=>{ state.category=e.target.value; render(); });
  document.addEventListener('keydown', e=>{
    if((e.ctrlKey || e.metaKey) && ['1','2','3','4'].includes(e.key)){ e.preventDefault(); state.activeTab=['shortcuts','notes','clips','settings'][Number(e.key)-1]; render(); }
    if(e.key==='Escape'){ const s=$('#searchInput'); if(s) s.value=''; state.query=''; render(); }
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='z' && state.undo){
      if(state.undo.type==='note') state.notes.unshift(state.undo.item);
      if(state.undo.type==='clip') state.clips.unshift(state.undo.item);
      if(state.undo.type==='shortcut') state.customShortcuts.unshift(state.undo.item);
      state.undo=null; render(); toast('元に戻しました');
    }
  });
  window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredInstallPrompt=e; const b=$('#installBtn'); if(b) b.hidden=false; });
  window.addEventListener('appinstalled', ()=>{ deferredInstallPrompt=null; const b=$('#installBtn'); if(b) b.hidden=true; toast('インストールしました'); });
  $('#installBtn')?.addEventListener('click', async()=>{ if(!deferredInstallPrompt) return toast('ブラウザのインストールボタンから追加できます'); deferredInstallPrompt.prompt(); const result = await deferredInstallPrompt.userChoice; deferredInstallPrompt=null; if(result.outcome === 'accepted') $('#installBtn').hidden=true; });
}

function initApp(){
  const eyebrow = $('.eyebrow'); if(eyebrow) eyebrow.textContent = 'Windows / Mac Shortcut Dictionary';
  render(); bind();
  if(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) { const b=$('#installBtn'); if(b) b.hidden=true; }
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
window.addEventListener('DOMContentLoaded', initApp);
