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

const RAW_WINDOWS_SHORTCUTS = [
  ['win-copy','windows','Windows','基本','コピー','Ctrl + C','選択した文字やファイルをコピー','copy コピ 複製'],
  ['win-paste','windows','Windows','基本','貼り付け','Ctrl + V','コピーした内容を貼り付け','paste ペースト'],
  ['win-cut','windows','Windows','基本','切り取り','Ctrl + X','選択した文字やファイルを切り取り','cut カット'],
  ['win-undo','windows','Windows','基本','元に戻す','Ctrl + Z','直前の操作を取り消す','undo 戻す'],
  ['win-redo','windows','Windows','基本','やり直し','Ctrl + Y','取り消した操作をやり直す','redo'],
  ['win-select-all','windows','Windows','基本','全選択','Ctrl + A','すべて選択','select all'],
  ['win-save','windows','Windows','基本','保存','Ctrl + S','現在のファイルを保存','save'],
  ['win-find','windows','Windows','基本','検索','Ctrl + F','ページやファイル内を検索','find search 探す'],
  ['win-screenshot-area','windows','Windows','画面','スクリーンショット','Win + Shift + S','範囲を選んで画面を撮影','スクショ 写真 画像 キャプチャ 画面撮影 screenshot capture snipping snip'],
  ['win-screenshot-full','windows','Windows','画面','画面全体を撮影','PrtScn','画面全体をクリップボードへコピー','スクショ 写真 画像 キャプチャ screenshot printscreen'],
  ['win-screenshot-window','windows','Windows','画面','アクティブ画面を撮影','Alt + PrtScn','現在のウィンドウだけを撮影','スクショ ウィンドウ 写真 画像 キャプチャ'],
  ['win-desktop','windows','Windows','画面','デスクトップ表示','Win + D','すべてのウィンドウを最小化してデスクトップ表示','desktop'],
  ['win-app-switch','windows','Windows','画面','ウィンドウ切り替え','Alt + Tab','開いているアプリを切り替える','アプリ切替 switch'],
  ['win-task-view','windows','Windows','画面','タスクビュー','Win + Tab','仮想デスクトップと開いている画面を表示','task view'],
  ['win-maximize','windows','Windows','画面','ウィンドウ最大化','Win + ↑','現在のウィンドウを最大化','maximize'],
  ['win-minimize','windows','Windows','画面','ウィンドウ最小化','Win + ↓','現在のウィンドウを最小化','minimize'],
  ['win-snap-left','windows','Windows','画面','左に整列','Win + ←','ウィンドウを左半分へ配置','snap left'],
  ['win-snap-right','windows','Windows','画面','右に整列','Win + →','ウィンドウを右半分へ配置','snap right'],
  ['win-explorer','windows','Windows','システム','エクスプローラーを開く','Win + E','ファイル管理画面を開く','explorer file folder フォルダ'],
  ['win-settings','windows','Windows','システム','設定を開く','Win + I','Windows設定を開く','settings setting 環境設定'],
  ['win-lock','windows','Windows','システム','画面ロック','Win + L','PCをロックする','lock'],
  ['win-quick-settings','windows','Windows','システム','クイック設定','Win + A','Wi-Fiや音量などの設定を開く','quick settings'],
  ['win-notification','windows','Windows','システム','通知センター','Win + N','通知とカレンダーを表示','notification'],
  ['win-run','windows','Windows','システム','実行','Win + R','実行ダイアログを開く','run'],
  ['win-clipboard-history','windows','Windows','システム','クリップボード履歴','Win + V','Windowsのクリップボード履歴を開く','clipboard clip コピー履歴'],
  ['win-emoji','windows','Windows','システム','絵文字パネル','Win + .','絵文字・記号・顔文字を入力','emoji'],
  ['win-task-manager','windows','Windows','システム','タスクマネージャー','Ctrl + Shift + Esc','タスクマネージャーを開く','task manager'],
  ['win-security','windows','Windows','システム','セキュリティ画面','Ctrl + Alt + Delete','ロックやサインアウトなどを表示','security'],
  ['chrome-new-tab-win','windows','Chrome','ブラウザ','新しいタブ','Ctrl + T','新しいタブを開く','browser tab'],
  ['chrome-close-tab-win','windows','Chrome','ブラウザ','タブを閉じる','Ctrl + W','現在のタブを閉じる','tab close'],
  ['chrome-restore-tab-win','windows','Chrome','ブラウザ','閉じたタブを戻す','Ctrl + Shift + T','最後に閉じたタブを復元','restore tab'],
  ['chrome-address-win','windows','Chrome','ブラウザ','アドレスバーへ移動','Ctrl + L','URL入力欄へフォーカス','address url'],
  ['chrome-history-win','windows','Chrome','ブラウザ','履歴','Ctrl + H','閲覧履歴を開く','history'],
  ['chrome-download-win','windows','Chrome','ブラウザ','ダウンロード','Ctrl + J','ダウンロード一覧を開く','download'],
  ['chrome-bookmark-win','windows','Chrome','ブラウザ','ブックマーク','Ctrl + D','現在のページをブックマーク','bookmark'],
  ['chrome-find-win','windows','Chrome','ブラウザ','ページ内検索','Ctrl + F','ページ内を検索','find search'],
  ['chrome-reload-win','windows','Chrome','ブラウザ','再読み込み','Ctrl + R','ページを再読み込み','reload refresh']
];

const RAW_MAC_SHORTCUTS = [
  ['mac-copy','mac','macOS','基本','コピー','Command + C','選択した文字やファイルをコピー','copy コピ 複製'],
  ['mac-paste','mac','macOS','基本','貼り付け','Command + V','コピーした内容を貼り付け','paste ペースト'],
  ['mac-cut','mac','macOS','基本','切り取り','Command + X','選択した文字やファイルを切り取り','cut カット'],
  ['mac-undo','mac','macOS','基本','元に戻す','Command + Z','直前の操作を取り消す','undo 戻す'],
  ['mac-redo','mac','macOS','基本','やり直し','Command + Shift + Z','取り消した操作をやり直す','redo'],
  ['mac-select-all','mac','macOS','基本','全選択','Command + A','すべて選択','select all'],
  ['mac-save','mac','macOS','基本','保存','Command + S','現在のファイルを保存','save'],
  ['mac-find','mac','macOS','基本','検索','Command + F','ページやファイル内を検索','find search 探す'],
  ['mac-spotlight','mac','macOS','システム','Spotlight検索','Command + Space','Mac全体を検索','spotlight 検索 アプリ 起動'],
  ['mac-app-switch','mac','macOS','画面','アプリ切り替え','Command + Tab','開いているアプリを切り替える','アプリ切替 switch'],
  ['mac-force-quit','mac','macOS','システム','強制終了','Command + Option + Esc','アプリの強制終了画面を開く','force quit 強制 終了'],
  ['mac-close-window','mac','macOS','画面','ウィンドウを閉じる','Command + W','現在のウィンドウまたはタブを閉じる','close window tab'],
  ['mac-quit-app','mac','macOS','システム','アプリ終了','Command + Q','現在のアプリを終了する','quit exit'],
  ['mac-minimize','mac','macOS','画面','最小化','Command + M','現在のウィンドウを最小化','minimize'],
  ['mac-hide-app','mac','macOS','画面','アプリを隠す','Command + H','現在のアプリを隠す','hide'],
  ['mac-screenshot-full','mac','macOS','画面','画面全体スクリーンショット','Command + Shift + 3','画面全体を撮影して保存','スクショ スクリーンショット 写真 画像 キャプチャ 画面撮影 screenshot capture'],
  ['mac-screenshot-area','mac','macOS','画面','範囲スクリーンショット','Command + Shift + 4','範囲を選んでスクリーンショットを撮影','スクショ スクリーンショット 写真 画像 キャプチャ 画面撮影 screenshot capture'],
  ['mac-screenshot-menu','mac','macOS','画面','スクリーンショットメニュー','Command + Shift + 5','スクリーンショットと画面収録メニューを開く','スクショ スクリーンショット 写真 画像 キャプチャ 画面収録 recording'],
  ['finder-new-window','mac','Finder','Finder','新規Finderウィンドウ','Command + N','新しいFinderウィンドウを開く','finder new window'],
  ['finder-go-folder','mac','Finder','Finder','フォルダへ移動','Command + Shift + G','パスを入力してフォルダへ移動','finder path folder フォルダ'],
  ['finder-hidden-files','mac','Finder','Finder','隠しファイル表示','Command + Shift + .','Finderで隠しファイルの表示/非表示を切り替える','隠しファイル hidden files finder 表示 非表示'],
  ['chrome-new-tab-mac','mac','Chrome','ブラウザ','新しいタブ','Command + T','新しいタブを開く','browser tab'],
  ['chrome-close-tab-mac','mac','Chrome','ブラウザ','タブを閉じる','Command + W','現在のタブを閉じる','tab close'],
  ['chrome-restore-tab-mac','mac','Chrome','ブラウザ','閉じたタブを戻す','Command + Shift + T','最後に閉じたタブを復元','restore tab'],
  ['chrome-address-mac','mac','Chrome','ブラウザ','アドレスバーへ移動','Command + L','URL入力欄へフォーカス','address url'],
  ['chrome-history-mac','mac','Chrome','ブラウザ','履歴','Command + Y','閲覧履歴を開く','history'],
  ['chrome-download-mac','mac','Chrome','ブラウザ','ダウンロード','Command + Shift + J','ダウンロード一覧を開く','download'],
  ['chrome-bookmark-mac','mac','Chrome','ブラウザ','ブックマーク','Command + D','現在のページをブックマーク','bookmark'],
  ['chrome-find-mac','mac','Chrome','ブラウザ','ページ内検索','Command + F','ページ内を検索','find search'],
  ['chrome-reload-mac','mac','Chrome','ブラウザ','再読み込み','Command + R','ページを再読み込み','reload refresh']
];

const DEFAULT_WINDOWS_SHORTCUTS = RAW_WINDOWS_SHORTCUTS.map(toShortcut);
const DEFAULT_MAC_SHORTCUTS = RAW_MAC_SHORTCUTS.map(toShortcut);

function toShortcut([id,os,app,category,title,keys,description,aliases]){
  return { id, os, app, category, title, keys, description, aliases, keywords: String(aliases || '').split(/\s+/).filter(Boolean), frequent:false, system:true, userCreated:false };
}

const DEFAULT_STATE = {
  activeTab: 'shortcuts', selectedOS: 'windows', shortcutFilter: 'all', category: 'all', query: '',
  frequentIdsByOS: { windows: ['win-copy','win-paste','win-save','win-screenshot-area','win-app-switch','win-explorer','win-settings','win-clipboard-history','chrome-new-tab-win','chrome-address-win'], mac: ['mac-copy','mac-paste','mac-save','mac-screenshot-area','mac-screenshot-menu','mac-app-switch','mac-spotlight','finder-hidden-files','chrome-new-tab-mac','chrome-address-mac'] },
  userShortcuts: { windows: [], mac: [] },
  notes: [{id: uid(), title:'便利メモ', body:'覚えておきたい操作や手順をここに保存できます。', pinned:true, createdAt: now()}],
  clips: [], settings: DEFAULT_SETTINGS, undo: null
};

let state = loadState();
let deferredInstallPrompt = null;
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function uid(){ return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }
function now(){ return new Date().toISOString(); }
function escapeHtml(str=''){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function clone(data){ return JSON.parse(JSON.stringify(data)); }
function safeParse(v){ try { return JSON.parse(v); } catch { return null; } }
function storageGet(key){ try { if(window.localStorage) return window.localStorage.getItem(key); } catch{} return memoryStorage.get(key) || null; }
function storageSet(key,value){ try { if(window.localStorage){ window.localStorage.setItem(key,value); return; } } catch{} memoryStorage.set(key,value); }
function save(){ storageSet(LS_KEY, JSON.stringify(state)); }
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),1800); }

function normalizeUserShortcut(item, os){
  if(!item || typeof item !== 'object') return null;
  const title = String(item.title || '').trim();
  const keys = String(item.keys || '').trim();
  if(!title || !keys) return null;
  const keywords = Array.isArray(item.keywords) ? item.keywords : String(item.aliases || '').split(/[\s,、]+/).filter(Boolean);
  return {
    id: String(item.id || uid()), os: item.os === 'mac' || item.os === 'windows' ? item.os : os,
    app: String(item.app || item.category || '自分用'), category: String(item.category || '自分用'),
    title, keys, description: String(item.description || ''), aliases: String(item.aliases || keywords.join(' ')), keywords,
    frequent: Boolean(item.frequent), system:false, userCreated:true,
    createdAt: item.createdAt || now(), updatedAt: item.updatedAt || now()
  };
}

function loadState(){
  const saved = safeParse(storageGet(LS_KEY));
  if(saved) return sanitizeState(saved);
  const old = safeParse(storageGet(OLD_LS_KEY));
  if(old) return migrateOldState(old);
  return clone(DEFAULT_STATE);
}
function sanitizeState(input){
  const base = clone(DEFAULT_STATE);
  const next = {...base, ...input};
  next.selectedOS = input.selectedOS === 'mac' ? 'mac' : 'windows';
  next.settings = {...DEFAULT_SETTINGS, ...(input.settings || {})};
  next.frequentIdsByOS = {
    windows: Array.isArray(input.frequentIdsByOS?.windows) ? input.frequentIdsByOS.windows : base.frequentIdsByOS.windows,
    mac: Array.isArray(input.frequentIdsByOS?.mac) ? input.frequentIdsByOS.mac : base.frequentIdsByOS.mac
  };
  if(Array.isArray(input.frequentIds)) next.frequentIdsByOS.windows = input.frequentIds;
  next.userShortcuts = {
    windows: (Array.isArray(input.userShortcuts?.windows) ? input.userShortcuts.windows : []).map(x=>normalizeUserShortcut(x,'windows')).filter(Boolean),
    mac: (Array.isArray(input.userShortcuts?.mac) ? input.userShortcuts.mac : []).map(x=>normalizeUserShortcut(x,'mac')).filter(Boolean)
  };
  if(Array.isArray(input.customShortcuts)){
    next.userShortcuts.windows.push(...input.customShortcuts.map(x=>normalizeUserShortcut(x,'windows')).filter(Boolean));
  }
  next.notes = Array.isArray(input.notes) ? input.notes : base.notes;
  next.clips = Array.isArray(input.clips) ? input.clips.slice(0,50) : [];
  next.shortcutFilter = ['all','frequent','others','custom'].includes(input.shortcutFilter) ? input.shortcutFilter : 'all';
  next.category = input.category || 'all';
  next.activeTab = ['shortcuts','notes','clips','settings'].includes(input.activeTab) ? input.activeTab : 'shortcuts';
  return next;
}
function migrateOldState(old){
  const migrated = sanitizeState({...clone(DEFAULT_STATE), ...old});
  migrated.selectedOS = 'windows';
  save();
  return migrated;
}

const SYN = {
  'スクショ':['スクリーンショット','写真','画像','キャプチャ','画面撮影','screenshot','capture','snip','snipping'],
  'スクリーンショット':['スクショ','写真','画像','キャプチャ','画面撮影','screenshot','capture'],
  '写真':['スクショ','スクリーンショット','画像','キャプチャ','撮影'], '画像':['スクショ','スクリーンショット','写真','キャプチャ'],
  'コピー':['copy','コピ','複製','クリップボード'], '貼り付け':['paste','ペースト'],
  '設定':['settings','setting','環境設定'], 'ファイル':['file','フォルダ','folder','エクスプローラー','finder'],
  '検索':['search','find','探す'], '履歴':['history','クリップボード履歴'], '強制終了':['force quit','終了','quit'],
  '隠しファイル':['hidden files','finder','表示','非表示']
};
function normalize(s=''){ return String(s).toLowerCase().normalize('NFKC').replace(/[\s　+_\-\/\\|:：;；,.。、()（）\[\]【】「」'"`]/g,''); }
function queryTerms(q){
  const base=normalize(q); if(!base) return [];
  const terms=new Set([base]);
  Object.entries(SYN).forEach(([k,arr])=>{ const nk=normalize(k); if(base.includes(nk) || arr.some(a=>base.includes(normalize(a)))){ terms.add(nk); arr.forEach(a=>terms.add(normalize(a))); }});
  return [...terms].filter(Boolean);
}
function textOf(item){ return [item.title,item.keys,item.description,item.category,item.app,item.aliases,item.keywords?.join(' '),item.body,item.os].filter(Boolean).join(' '); }
function scoreItem(item,q){ const terms=queryTerms(q); if(!terms.length) return 1; const target=normalize(textOf(item)); let score=0; for(const term of terms){ if(target.includes(term)) score+=term.length>2?12:7; if(normalize(item.title||'').includes(term)) score+=18; if(normalize(item.keys||'').includes(term)) score+=10; if(normalize(item.aliases||'').includes(term)) score+=14; } return score; }
function highlight(str,q){
  let html=escapeHtml(str||'');
  const raw=[...new Set([String(q||''),...queryTerms(q)])].filter(v=>v && v.length>=2).slice(0,8);
  raw.forEach(term=>{ const safe=escapeHtml(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); try{ html=html.replace(new RegExp(`(${safe})`,'gi'),'<mark class="highlight">$1</mark>'); }catch{} });
  return html;
}

function defaultShortcutsForOS(os=state.selectedOS){ return os === 'mac' ? DEFAULT_MAC_SHORTCUTS : DEFAULT_WINDOWS_SHORTCUTS; }
function userShortcutsForOS(os=state.selectedOS){ return state.userShortcuts?.[os] || []; }
function allShortcuts(os=state.selectedOS){ return [...defaultShortcutsForOS(os), ...userShortcutsForOS(os)]; }
function currentFrequentIds(){ return state.frequentIdsByOS[state.selectedOS] || []; }
function setCurrentFrequentIds(ids){ state.frequentIdsByOS[state.selectedOS] = [...new Set(ids)]; }
function isFrequent(id){ return currentFrequentIds().includes(id); }

function setCss(){
  const s=state.settings, r=document.documentElement.style;
  ['bg','panel','card','text','muted','border','accent'].forEach(k=>r.setProperty('--'+k,s[k]));
  r.setProperty('--fav',s.favoriteColor); r.setProperty('--radius',s.radius+'px'); r.setProperty('--gap',s.gap+'px'); r.setProperty('--pad',s.padding+'px');
  r.setProperty('--font-family',s.fontFamily); r.setProperty('--font-size',s.fontSize+'px'); r.setProperty('--font-weight',s.fontWeight); r.setProperty('--line-height',s.lineHeight); r.setProperty('--letter-spacing',s.letterSpacing+'em');
  r.setProperty('--anim',s.animation+'ms'); r.setProperty('--background-opacity',s.backgroundOpacity+'%'); r.setProperty('--background-blur',s.backgroundBlur+'px');
  document.body.classList.toggle('fav-hidden', s.favoriteDisplay === 'hidden');
}
function updateTabs(){
  $$('.tab').forEach(b=>b.classList.toggle('is-active', b.dataset.tab === state.activeTab));
  $$('.panel').forEach(p=>p.classList.toggle('is-active', p.id === state.activeTab));
  $('#shortcutToolbar').style.display = state.activeTab === 'shortcuts' ? 'flex' : 'none';
}
function render(){ setCss(); updateTabs(); renderOSControls(); renderCategoryOptions(); renderShortcuts(); renderNotes(); renderClips(); renderSettings(); updateMeta(); save(); }
function updateMeta(){
  let count=0; if(state.activeTab==='shortcuts') count=filteredShortcuts().length; if(state.activeTab==='notes') count=filteredNotes().length; if(state.activeTab==='clips') count=filteredClips().length;
  $('#searchMeta').textContent = state.query.trim() ? `検索結果 ${count}件` : state.activeTab==='shortcuts' ? `${state.selectedOS === 'mac' ? 'Mac' : 'Windows'}ショートカット ${filteredShortcuts().length}件` : '検索できます';
}
function renderOSControls(){
  $$('.os-seg').forEach(b=>b.classList.toggle('is-active', b.dataset.os===state.selectedOS));
  const addBtn=$('#addShortcutBtn'); if(addBtn) addBtn.textContent = `＋ ${state.selectedOS === 'mac' ? 'Mac' : 'Windows'}ショートカット追加`;
}
function renderCategoryOptions(){
  const sel=$('#categoryFilter'); if(!sel) return;
  const cats=[...new Set(allShortcuts().map(s=>s.category))].sort((a,b)=>a.localeCompare(b,'ja'));
  sel.innerHTML='<option value="all">すべてのカテゴリ</option>'+cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  if(!cats.includes(state.category) && state.category!=='all') state.category='all';
  sel.value=state.category;
  $$('.seg').forEach(b=>b.classList.toggle('is-active', b.dataset.filter===state.shortcutFilter));
}
function filteredShortcuts(){
  const q=state.query; let list=allShortcuts().map(item=>({...item,_score:scoreItem(item,q)}));
  if(q.trim()) list=list.filter(x=>x._score>0);
  if(state.category!=='all') list=list.filter(x=>x.category===state.category);
  if(state.shortcutFilter==='frequent') list=list.filter(x=>isFrequent(x.id));
  if(state.shortcutFilter==='others') list=list.filter(x=>!isFrequent(x.id));
  if(state.shortcutFilter==='custom') list=list.filter(x=>x.userCreated);
  return list.sort((a,b)=>(isFrequent(b.id)-isFrequent(a.id)) || b._score-a._score || a.title.localeCompare(b.title,'ja'));
}
function section(title,items,body){ return items.length ? `<div class="section-title"><h2>${title}</h2><span class="count">${items.length}件</span></div><div class="grid">${body(items)}</div>` : ''; }
function iconFor(cat){ const map={基本:'⌘',画面:'📷',システム:'⚙',ブラウザ:'🌐',Finder:'📁'}; return map[cat] || '⌨'; }
function shortcutCard(item){
  const fav=isFrequent(item.id), mark=escapeHtml(state.settings.favoriteMark||'⭐'), compact=state.settings.density==='compact'?' compact':'';
  const editButtons = item.userCreated ? `<button class="btn" data-action="edit-shortcut" data-id="${item.id}">編集</button><button class="btn danger" data-action="delete-shortcut" data-id="${item.id}">削除</button>` : '';
  return `<article class="card shortcut-card${compact}" data-id="${item.id}">
    <div class="icon">${iconFor(item.category)}</div><div>
      <div class="title"><span class="fav-badge ${fav?'show':''}">${mark}</span>${highlight(item.title,state.query)}</div>
      <div class="keys">${highlight(item.keys,state.query)}</div>
      <div class="desc">${highlight(item.description,state.query)}</div>
      <div class="meta">OS：${item.os==='mac'?'Mac':'Windows'} ・カテゴリ：${escapeHtml(item.app || item.category)} ${item.userCreated ? '・自分で追加' : '・辞典データ'}</div>
      ${editButtons ? `<div class="actions">${editButtons}</div>` : ''}</div>
    <button class="fav-btn ${fav?'is-on':''}" data-action="toggle-fav" data-id="${item.id}">${fav ? `${mark} よく使う` : '☆ よく使う'}</button></article>`;
}
function renderShortcuts(){
  const list=filteredShortcuts(), frequent=list.filter(x=>isFrequent(x.id)), others=list.filter(x=>!isFrequent(x.id));
  let html='';
  if(state.shortcutFilter==='frequent') html=section('⭐ よく使う', frequent, items=>items.map(shortcutCard).join(''));
  else if(state.shortcutFilter==='others') html=section('📚 その他', others, items=>items.map(shortcutCard).join(''));
  else if(state.shortcutFilter==='custom') html=section('📝 自分で追加', list, items=>items.map(shortcutCard).join(''));
  else html=section('⭐ よく使う', frequent, items=>items.map(shortcutCard).join('')) + section('📚 その他', others, items=>items.map(shortcutCard).join(''));
  $('#shortcuts').innerHTML = html || '<div class="empty">該当するショートカットがありません。</div>';
}
function filteredNotes(){ return state.notes.map(n=>({...n,_score:scoreItem({...n,description:n.body},state.query)})).filter(n=>!state.query.trim()||n._score>0).sort((a,b)=>(b.pinned-a.pinned)||b._score-a._score||b.createdAt.localeCompare(a.createdAt)); }
function renderNotes(){ const list=filteredNotes(); $('#notes').innerHTML = `<div class="form"><input class="field" id="noteTitle" placeholder="メモタイトル" /><textarea id="noteBody" placeholder="メモ内容"></textarea><button class="btn primary" data-action="add-note">メモを追加</button></div>` + (list.length ? `<div class="grid">${list.map(n=>`<article class="card" data-id="${n.id}"><div class="title">${n.pinned?'📌 ':''}${highlight(n.title,state.query)}</div><div class="desc">${highlight(n.body,state.query)}</div><div class="actions"><button class="btn ghost" data-action="pin-note" data-id="${n.id}">${n.pinned?'ピン解除':'ピン留め'}</button><button class="btn" data-action="edit-note" data-id="${n.id}">編集</button><button class="btn danger" data-action="delete-note" data-id="${n.id}">削除</button></div></article>`).join('')}</div>` : '<div class="empty">メモはまだありません。</div>'); }
function filteredClips(){ return state.clips.map(c=>({...c,_score:scoreItem({title:c.text,description:c.text},state.query)})).filter(c=>!state.query.trim()||c._score>0).sort((a,b)=>(b.pinned-a.pinned)||b._score-a._score||b.createdAt.localeCompare(a.createdAt)); }
function renderClips(){ const list=filteredClips(); $('#clips').innerHTML = `<div class="form"><textarea id="clipText" placeholder="保存したいテキストを貼り付け"></textarea><button class="btn primary" data-action="add-clip">クリップボードに保存（最大50個）</button></div>` + (list.length ? `<div class="grid">${list.map(c=>`<article class="card" data-id="${c.id}"><div class="title">${c.pinned?'📌 ':''}クリップ</div><div class="desc">${highlight(c.text,state.query)}</div><div class="actions"><button class="btn primary" data-action="copy-clip" data-id="${c.id}">コピー</button><button class="btn ghost" data-action="pin-clip" data-id="${c.id}">${c.pinned?'ピン解除':'ピン留め'}</button><button class="btn" data-action="edit-clip" data-id="${c.id}">編集</button><button class="btn danger" data-action="delete-clip" data-id="${c.id}">削除</button></div></article>`).join('')}</div>` : '<div class="empty">クリップはまだありません。</div>'); }
function renderSettings(){
  const s=state.settings;
  $('#settings').innerHTML = `<div class="settings-grid">
    <section class="setting-card"><h2>お気に入り表示</h2><label>マーク<input class="field" data-setting="favoriteMark" value="${escapeHtml(s.favoriteMark)}" maxlength="4"></label><label>色<input type="color" data-setting="favoriteColor" value="${s.favoriteColor}"></label><label>表示<select class="select" data-setting="favoriteDisplay"><option value="button-badge">ボタン＋見出し</option><option value="button-only">ボタンのみ</option><option value="hidden">非表示</option></select></label><label>表示密度<select class="select" data-setting="density"><option value="standard">標準</option><option value="compact">コンパクト</option></select></label></section>
    <section class="setting-card"><h2>フォント</h2><label>書体<select class="select" data-setting="fontFamily"><option value="Segoe UI, system-ui, sans-serif">Segoe UI</option><option value="Inter, Segoe UI, sans-serif">Inter</option><option value="Noto Sans JP, Segoe UI, sans-serif">Noto Sans JP</option><option value="Yu Gothic, Segoe UI, sans-serif">游ゴシック</option><option value="Meiryo, Segoe UI, sans-serif">メイリオ</option><option value="JetBrains Mono, Consolas, monospace">JetBrains Mono</option></select></label><label>文字サイズ <input type="range" min="12" max="22" data-setting="fontSize" value="${s.fontSize}"></label><label>太さ <input type="range" min="300" max="800" step="100" data-setting="fontWeight" value="${s.fontWeight}"></label><label>行間 <input type="range" min="1.2" max="2" step="0.05" data-setting="lineHeight" value="${s.lineHeight}"></label><label>文字間隔 <input type="range" min="0" max="0.12" step="0.01" data-setting="letterSpacing" value="${s.letterSpacing}"></label></section>
    <section class="setting-card"><h2>サイズ・余白</h2><label>角丸 <input type="range" min="4" max="34" data-setting="radius" value="${s.radius}"></label><label>余白 <input type="range" min="8" max="30" data-setting="padding" value="${s.padding}"></label><label>間隔 <input type="range" min="6" max="24" data-setting="gap" value="${s.gap}"></label><label>アニメーション <input type="range" min="0" max="400" data-setting="animation" value="${s.animation}"></label></section>
    <section class="setting-card"><h2>背景効果</h2><label>背景の透明度 ${s.backgroundOpacity}% <input type="range" min="20" max="100" data-setting="backgroundOpacity" value="${s.backgroundOpacity}"></label><label>背景のぼかし ${s.backgroundBlur}px <input type="range" min="0" max="40" data-setting="backgroundBlur" value="${s.backgroundBlur}"></label></section>
    <section class="setting-card"><h2>色</h2>${['bg','panel','card','text','muted','border','accent'].map(k=>`<label>${k}<input type="color" data-setting="${k}" value="${s[k]}"></label>`).join('')}</section>
    <section class="setting-card"><h2>データ管理</h2><div class="actions"><button class="btn" data-action="export-data">全データ書き出し</button><button class="btn" data-action="import-data">読み込み</button><button class="btn danger" data-action="reset-data">初期化</button><input id="importFile" type="file" accept="application/json" hidden></div></section>
  </div>`;
  $$('[data-setting]').forEach(el=>{ if(el.tagName==='SELECT') el.value=String(s[el.dataset.setting]); });
}

function openShortcutModal(item=null){
  const isEdit=Boolean(item), os=item?.os || state.selectedOS;
  const html=`<div class="modal-backdrop" id="shortcutModal"><section class="modal"><h2>${isEdit?'ショートカット編集':'ショートカット追加'}</h2><div class="form">
    <label>OS<select class="select" id="scOS"><option value="windows">Windows</option><option value="mac">Mac</option></select></label>
    <label>タイトル<input class="field" id="scTitle" placeholder="例：スクリーンショット" value="${escapeHtml(item?.title||'')}"></label>
    <label>ショートカットキー<input class="field" id="scKeys" placeholder="例：Win + Shift + S / Command + Shift + 4" value="${escapeHtml(item?.keys||'')}"></label>
    <label>カテゴリ<input class="field" id="scCategory" placeholder="例：自分用 / Finder / Chrome" value="${escapeHtml(item?.category||'自分用')}"></label>
    <label>説明<textarea id="scDescription" placeholder="何に使うショートカットか">${escapeHtml(item?.description||'')}</textarea></label>
    <label>検索キーワード<input class="field" id="scKeywords" placeholder="スクショ, 写真, 画像" value="${escapeHtml((item?.keywords||[]).join(', '))}"></label>
    <label class="check-row"><input type="checkbox" id="scFrequent" ${isEdit && isFrequent(item.id) ? 'checked' : ''}> よく使うに追加</label>
    <div class="actions"><button class="btn ghost" data-action="close-modal">キャンセル</button><button class="btn primary" data-action="save-shortcut" data-id="${escapeHtml(item?.id||'')}">${isEdit?'更新':'保存'}</button></div>
  </div></section></div>`;
  document.body.insertAdjacentHTML('beforeend', html); $('#scOS').value=os;
}
function closeShortcutModal(){ $('#shortcutModal')?.remove(); }
function saveShortcutFromModal(id=''){
  const os=$('#scOS').value, title=$('#scTitle').value.trim(), keys=$('#scKeys').value.trim();
  if(!title) return toast('タイトルを入力してください'); if(!keys) return toast('ショートカットキーを入力してください');
  const item={ id:id||uid(), os, title, keys, category:$('#scCategory').value.trim()||'自分用', app:$('#scCategory').value.trim()||'自分用', description:$('#scDescription').value.trim(), keywords:$('#scKeywords').value.split(/[、,\s]+/).map(s=>s.trim()).filter(Boolean), aliases:$('#scKeywords').value.trim(), userCreated:true, system:false, createdAt:now(), updatedAt:now() };
  for(const targetOS of ['windows','mac']) state.userShortcuts[targetOS]=state.userShortcuts[targetOS].filter(x=>x.id!==item.id);
  state.userShortcuts[os].unshift(item);
  if($('#scFrequent').checked){ const prev=state.selectedOS; state.selectedOS=os; setCurrentFrequentIds([...currentFrequentIds(), item.id]); state.selectedOS=prev; }
  state.selectedOS=os; closeShortcutModal(); render(); toast(id?'更新しました':'追加しました');
}
function findUserShortcut(id){ return [...state.userShortcuts.windows, ...state.userShortcuts.mac].find(x=>x.id===id); }
async function copyText(text){ try{ await navigator.clipboard.writeText(text); toast('コピーしました'); } catch{ prompt('コピーしてください', text); } }
function capClips(){ const pinned=state.clips.filter(c=>c.pinned), normal=state.clips.filter(c=>!c.pinned); state.clips=[...pinned,...normal].slice(0,50); }
function pushUndo(type,item){ state.undo={type,item,at:Date.now()}; toast('削除しました。Ctrl+Zで元に戻せます'); }

function bind(){
  $('#searchInput').value=state.query;
  $('#searchInput').addEventListener('input',e=>{ state.query=e.target.value; render(); });
  $('#categoryFilter').addEventListener('change',e=>{ state.category=e.target.value; render(); });
  document.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-action], .tab, .seg, .os-seg'); if(!btn) return;
    if(btn.classList.contains('tab')){ state.activeTab=btn.dataset.tab; render(); return; }
    if(btn.classList.contains('seg')){ state.shortcutFilter=btn.dataset.filter; render(); return; }
    if(btn.classList.contains('os-seg')){ state.selectedOS=btn.dataset.os; state.category='all'; render(); return; }
    const id=btn.dataset.id, action=btn.dataset.action;
    if(action==='add-shortcut'){ openShortcutModal(); return; }
    if(action==='close-modal'){ closeShortcutModal(); return; }
    if(action==='save-shortcut'){ saveShortcutFromModal(id); return; }
    if(action==='edit-shortcut'){ const item=findUserShortcut(id); if(item) openShortcutModal(item); return; }
    if(action==='delete-shortcut'){ const item=findUserShortcut(id); if(item && confirm('このショートカットを削除しますか？')){ state.userShortcuts[item.os]=state.userShortcuts[item.os].filter(x=>x.id!==id); state.frequentIdsByOS[item.os]=(state.frequentIdsByOS[item.os]||[]).filter(x=>x!==id); pushUndo('shortcut',item); render(); } return; }
    if(action==='toggle-fav'){ const ids=currentFrequentIds(); setCurrentFrequentIds(ids.includes(id) ? ids.filter(x=>x!==id) : [...ids,id]); render(); return; }
    if(action==='add-note'){ const title=$('#noteTitle').value.trim()||'無題メモ', body=$('#noteBody').value.trim(); if(!body) return toast('メモ内容を入力してください'); state.notes.unshift({id:uid(),title,body,pinned:false,createdAt:now()}); render(); toast('メモを追加しました'); return; }
    if(action==='pin-note'){ const n=state.notes.find(x=>x.id===id); if(n) n.pinned=!n.pinned; render(); return; }
    if(action==='edit-note'){ const n=state.notes.find(x=>x.id===id); if(!n)return; const title=prompt('タイトル',n.title); if(title===null)return; const body=prompt('内容',n.body); if(body===null)return; n.title=title.trim()||n.title; n.body=body.trim()||n.body; render(); return; }
    if(action==='delete-note'){ const n=state.notes.find(x=>x.id===id); if(n&&confirm('このメモを削除しますか？')){ state.notes=state.notes.filter(x=>x.id!==id); pushUndo('note',n); render(); } return; }
    if(action==='add-clip'){ const text=$('#clipText').value.trim(); if(!text) return toast('保存するテキストを入力してください'); state.clips.unshift({id:uid(),text,pinned:false,createdAt:now()}); capClips(); render(); toast('保存しました'); return; }
    if(action==='copy-clip'){ const c=state.clips.find(x=>x.id===id); if(c) copyText(c.text); return; }
    if(action==='pin-clip'){ const c=state.clips.find(x=>x.id===id); if(c) c.pinned=!c.pinned; render(); return; }
    if(action==='edit-clip'){ const c=state.clips.find(x=>x.id===id); if(!c)return; const text=prompt('内容',c.text); if(text===null)return; c.text=text.trim()||c.text; render(); return; }
    if(action==='delete-clip'){ const c=state.clips.find(x=>x.id===id); if(c&&confirm('このクリップを削除しますか？')){ state.clips=state.clips.filter(x=>x.id!==id); pushUndo('clip',c); render(); } return; }
    if(action==='export-data'){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='shortcut-memo-clip-backup.json'; a.click(); URL.revokeObjectURL(a.href); return; }
    if(action==='import-data'){ $('#importFile')?.click(); return; }
    if(action==='reset-data'){ if(confirm('すべて初期化しますか？')){ state=clone(DEFAULT_STATE); render(); } return; }
  });
  document.addEventListener('input',e=>{ const el=e.target.closest('[data-setting]'); if(!el)return; const key=el.dataset.setting; let val=el.value; if(['fontSize','fontWeight','lineHeight','letterSpacing','radius','gap','padding','animation','backgroundOpacity','backgroundBlur'].includes(key)) val=Number(val); state.settings[key]=val; render(); });
  document.addEventListener('keydown',e=>{ if(e.ctrlKey && ['1','2','3','4'].includes(e.key)){ e.preventDefault(); state.activeTab=['shortcuts','notes','clips','settings'][Number(e.key)-1]; render(); } if(e.key==='Escape'){ if($('#shortcutModal')) closeShortcutModal(); else { $('#searchInput').value=''; state.query=''; render(); } } if(e.ctrlKey && e.key.toLowerCase()==='z' && state.undo){ if(state.undo.type==='note') state.notes.unshift(state.undo.item); if(state.undo.type==='clip') state.clips.unshift(state.undo.item); if(state.undo.type==='shortcut') state.userShortcuts[state.undo.item.os].unshift(state.undo.item); state.undo=null; render(); toast('元に戻しました'); }});
  document.addEventListener('change',async e=>{ if(e.target?.id==='importFile'){ const file=e.target.files[0]; if(!file)return; const data=safeParse(await file.text()); if(!data) return toast('読み込みに失敗しました'); state=sanitizeState(data); render(); toast('読み込みました'); }});
  window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredInstallPrompt=e; $('#installBtn').hidden=false; });
  $('#installBtn')?.addEventListener('click',async()=>{ if(!deferredInstallPrompt) return toast('ブラウザのインストールボタンから追加できます'); deferredInstallPrompt.prompt(); const result=await deferredInstallPrompt.userChoice; deferredInstallPrompt=null; if(result.outcome==='accepted') $('#installBtn').hidden=true; });
}

if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
render(); bind();
if(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) $('#installBtn').hidden=true;
