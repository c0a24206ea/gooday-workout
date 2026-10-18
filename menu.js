(function(){

  const LANGS = ['ja', 'en', 'ko', 'zh'];
  const LANG_NAME = {ja:'日本語', en:'English', ko:'한국어', zh:'中文'};
  const L = {
    home:    {ja:'ホーム', en:'Home', ko:'홈', zh:'首页'},
    run:     {ja:'ランニング', en:'Running', ko:'러닝', zh:'跑步'},
    workout: {ja:'筋トレ', en:'Workout', ko:'근력 운동', zh:'力量训练'},
    active:  {ja:'ヨガ・ウォーキング', en:'Yoga & walking', ko:'요가·걷기', zh:'瑜伽·散步'},
    lang:    {ja:'言語', en:'Language', ko:'언어', zh:'语言'},
    menu:    {ja:'メニュー', en:'Menu', ko:'메뉴', zh:'菜单'},
    close:   {ja:'閉じる', en:'Close', ko:'닫기', zh:'关闭'},
    spotify: {ja:'Spotifyを開く', en:'Open Spotify', ko:'Spotify 열기', zh:'打开 Spotify'},
    theme:   {ja:'背景', en:'Background', ko:'배경', zh:'背景'},
    light:   {ja:'白', en:'White', ko:'흰색', zh:'白色'},
    dark:    {ja:'黒', en:'Black', ko:'검정', zh:'黑色'},
    spBig:   {ja:'Spotifyで音楽をかける', en:'Play music on Spotify', ko:'Spotify로 음악 듣기', zh:'用 Spotify 播放音乐'},
    spSub:   {ja:'タイマーは止まらずに動き続けます', en:'The timer keeps running', ko:'타이머는 멈추지 않고 계속됩니다', zh:'计时器会继续运行'}
  };

  const PAGES = [
    {key:'home', href:'./', en:'HOME', files:['', 'index']},
    {key:'workout', href:'workout.html', en:'WORKOUT', files:['workout']},
    {key:'run', href:'run.html', en:'RUNNING', files:['run']},
    {key:'active', href:'active.html', en:'ACTIVE', files:['active']}
  ];

  const get = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
  const set = (k, v) => { try{ localStorage.setItem(k, v); }catch(e){} };
  function detect(){
    const l = (navigator.language || 'ja').toLowerCase();
    return l.startsWith('ko') ? 'ko' : l.startsWith('zh') ? 'zh' : l.startsWith('en') ? 'en' : 'ja';
  }
  function lang(){
    const g = get('tdiv_lang');
    if(LANGS.includes(g)) return g;
    try{ const d = JSON.parse(get('tdiv_v2') || 'null'); if(d && d.settings && LANGS.includes(d.settings.lang)) return d.settings.lang; }catch(e){}
    return detect();
  }
  function setLang(l, silent){
    if(!LANGS.includes(l)) return;
    set('tdiv_lang', l);
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : l;
    paint();
    if(!silent) window.dispatchEvent(new CustomEvent('tdiv:lang', {detail:l}));
  }
  const tr = k => (L[k] && (L[k][lang()] || L[k].ja)) || k;
  window.TDIV = {lang, setLang, LANGS};

  const DARK_CSS = `
  html[data-theme="dark"]{--bg:#0d0d0d; --white:#171717; --black:#f0f0f0; --g1:#2a2a2a; --g2:#474747; --g3:#8f8f8f; --shadow:rgba(0,0,0,.6); color-scheme:dark;}
  html[data-theme="dark"] body{background:#000;}
  html[data-theme="dark"] :is(.t-run, .timer, .rest, .wlatest, .wm-l, .toast, .hero, .chart, .week, .br, .player, .sp-big, .tm-sp, .tm-panel,
    .t-wo, .t-ac .go, .appbar .sub b, .tg, .seg button.on, .wdtabs button.on, .wm-open-btn, .wm-log, .btn.lime, .btn:hover, .btn:active,
    .pat button.on, .flow .play, .rest.fin, .timer.fin){
    --black:#000000; --white:#ffffff; --g1:#eeeeee; --g2:#cccccc; --g3:#aaaaaa; --bg:#fdfdfd;}
  html[data-theme="dark"] .wm{background:#000;}
  html[data-theme="dark"] :is(.t-wo, .t-ac .go, .appbar .sub b, .tg){color:var(--black);}
  html[data-theme="dark"] :is(.t-run, .timer, .wlatest, .chart, .week, .br, .sp-big:not([data-spotify-btn="mini"]), .rest){box-shadow:0 0 0 1px #2e2e2e;}
  html[data-theme="dark"] :is(.btn.ghost, .chip.add, .day-h small, .ent .m small, .ent .x, .flow .ed, .flow .meta, .flow .poses, .note, .pat button small,
    .hm-det small, .hm-leg, .hm-mo, .t-ac .meta, .rn .m, .warn p, .tile li){color:#a3a3a3;}
  html[data-theme="dark"] .chk input, html[data-theme="dark"] .opt input, html[data-theme="dark"] .opts input{accent-color:var(--lime,#ceff00);}
  html[data-theme="dark"] .appbar{border-bottom-color:#262626;}
  html[data-theme="dark"] .tm-btn{border-color:#f0f0f0; background:#171717;} html[data-theme="dark"] .tm-btn i{background:#f0f0f0;}
  html[data-theme="dark"] .tm-sp{border-color:#000;}
  html[data-theme="dark"] .t-ac{border-color:#f0f0f0;}
  html[data-theme="dark"] .hm button:is(.l1,.l2,.l3) :is(.r,.a){background:#000;}
  html[data-theme="dark"] img, html[data-theme="dark"] video{filter:none;}
  `;
  function theme(){ const v = get('tdiv_theme'); return v === 'dark' ? 'dark' : 'light'; }
  function applyTheme(){
    const th = theme();
    document.documentElement.dataset.theme = th;
    const m = document.querySelector('meta[name="theme-color"]'); if(m) m.content = th === 'dark' ? '#171717' : '#ffffff';
  }
  (function(){ const st = document.createElement('style'); st.id = 'tdiv-theme'; st.textContent = DARK_CSS; (document.head || document.documentElement).append(st); })();
  applyTheme();
  function setTheme(th){ set('tdiv_theme', th === 'dark' ? 'dark' : 'light'); applyTheme(); paint(); window.dispatchEvent(new CustomEvent('tdiv:theme', {detail:theme()})); }
  window.TDIV.theme = theme; window.TDIV.setTheme = setTheme;

  const css = `
  .tm-btn{width:44px; height:44px; flex:none; border:1px solid var(--black,#000); background:var(--white,#fff); cursor:pointer; display:inline-flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; padding:0;}
  .tm-btn i{display:block; width:20px; height:2px; background:var(--black,#000); transition:transform .4s ease, opacity .3s;}
  .tm-btn:hover i:nth-child(2){transform:translateX(3px);}
  .tm-btn:focus-visible{outline:none; box-shadow:inset 0 0 0 3px var(--lime,#ceff00);}
  .tm-slot{display:flex; align-items:center; gap:8px; flex:none;}
  .tm-sp{height:44px; min-width:44px; flex:none; border:1px solid var(--black,#000); background:var(--black,#000); color:var(--lime,#ceff00); display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 10px; text-decoration:none;
    font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:15px; letter-spacing:.08em; text-transform:uppercase; transition:background .3s, color .3s;}
  .tm-sp svg{width:20px; height:20px; flex:none;}
  .tm-sp span{display:none;}
  .tm-sp:hover{background:var(--lime,#ceff00); color:var(--black,#000);}
  .tm-sp:focus-visible{outline:none; box-shadow:0 0 0 3px var(--lime,#ceff00);}
  @media (min-width:600px){ .tm-sp span{display:inline;} .tm-sp{padding:0 14px;} }
  .sp-big{display:grid; grid-template-columns:56px 1fr auto; align-items:center; gap:0; margin-top:10px; min-height:60px; background:var(--black,#000); color:var(--white,#fff);
    text-decoration:none; border:2px solid var(--black,#000); overflow:hidden; position:relative; transition:transform .2s;}
  .sp-big .ic{height:100%; min-height:56px; background:var(--lime,#ceff00); color:var(--black,#000); display:flex; align-items:center; justify-content:center;}
  .sp-big .ic svg{width:26px; height:26px;}
  .sp-big .tx{padding:8px 14px; min-width:0;}
  .sp-big .tx b{display:block; font-size:16px; font-weight:700; line-height:1.3;}
  .sp-big .tx small{display:block; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.06em; color:var(--g3,#aaa); margin-top:2px;}
  .sp-big .go{padding:0 16px; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:16px; letter-spacing:.1em; color:var(--lime,#ceff00); white-space:nowrap;}
  .sp-big::after{content:''; position:absolute; right:-24px; top:0; bottom:0; width:60px; background:var(--lime,#ceff00); transform:skewX(-20deg); opacity:.12; pointer-events:none;}
  .sp-big:hover .go{text-decoration:underline;}
  .sp-big:active{transform:translateY(1px);}
  .sp-big:focus-visible{outline:none; box-shadow:0 0 0 3px var(--lime,#ceff00);}
  .sp-big[data-spotify-btn="mini"]{display:inline-flex; grid-template-columns:none; min-height:40px; height:40px; margin:0; border-color:#444;}
  .sp-big[data-spotify-btn="mini"] .ic{min-height:0; width:40px;}
  .sp-big[data-spotify-btn="mini"] .ic svg{width:20px; height:20px;}
  .sp-big[data-spotify-btn="mini"] .tx, .sp-big[data-spotify-btn="mini"]::after{display:none;}
  .sp-big[data-spotify-btn="mini"] .go{padding:0 12px; font-size:14px;}
  @media (orientation:landscape) and (max-height:520px){ .sp-big{min-height:48px;} .sp-big .ic{min-height:44px;} }
  .sp-big .go i{font-style:normal;}
  .sp-big .go{display:flex; align-items:center; gap:10px;}
  .sp-big .go .pl{width:30px; height:30px; padding:7px; box-sizing:border-box; background:var(--lime,#ceff00); color:var(--black,#000); flex:none; transition:transform .25s ease;}
  .sp-big:hover .go .pl{transform:scale(1.08);}
  .sp-big:hover .go{text-decoration:none;}
  .sp-big[data-spotify-btn="mini"] .go .pl{width:22px; height:22px; padding:5px;}
  @media (max-width:479px){ .sp-big:not([data-spotify-btn="mini"]) .go i{display:none;} .sp-big:not([data-spotify-btn="mini"]) .go{padding:0 14px;} }
  @media (max-width:400px){ .appbar .sub{font-size:10px; letter-spacing:.04em; white-space:nowrap;} .appbar h1{font-size:30px;} }
  .tm-ov{position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.45); opacity:0; pointer-events:none; transition:opacity .45s ease;}
  .tm-ov.open{opacity:1; pointer-events:auto;}
  .tm-panel{position:fixed; top:0; right:0; bottom:0; z-index:201; width:min(340px, 86vw); background:#000; color:#fff;
    transform:translateX(105%); transition:transform .5s cubic-bezier(.2,.8,.2,1); display:flex; flex-direction:column;
    padding:calc(env(safe-area-inset-top) + 14px) calc(env(safe-area-inset-right) + 20px) calc(env(safe-area-inset-bottom) + 20px) 22px; overflow-y:auto;}
  .tm-panel.open{transform:none;}
  .tm-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;}
  .tm-head span{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.18em; color:#aaa;}
  .tm-x{width:44px; height:44px; background:none; border:1px solid #444; color:#fff; font-size:22px; line-height:1; cursor:pointer;}
  .tm-x:focus-visible{outline:none; border-color:var(--lime,#ceff00);}
  .tm-nav{display:flex; flex-direction:column; border-top:1px solid #333;}
  .tm-nav a{display:flex; align-items:baseline; justify-content:space-between; gap:12px; padding:16px 2px; border-bottom:1px solid #333; color:#fff; text-decoration:none;
    opacity:0; transform:translateX(16px); transition:opacity .4s ease, transform .4s ease, color .2s;}
  .tm-panel.open .tm-nav a{opacity:1; transform:none;}
  .tm-panel.open .tm-nav a:nth-child(1){transition-delay:.12s;} .tm-panel.open .tm-nav a:nth-child(2){transition-delay:.18s;} .tm-panel.open .tm-nav a:nth-child(3){transition-delay:.24s;} .tm-panel.open .tm-nav a:nth-child(4){transition-delay:.30s;}
  .tm-nav b{font-family:'Barlow Condensed',sans-serif; font-weight:800; font-style:italic; font-size:34px; line-height:1; letter-spacing:.01em;}
  .tm-nav small{font-size:12px; color:#aaa; white-space:nowrap;}
  .tm-nav a:hover b, .tm-nav a:focus-visible b{color:var(--lime,#ceff00);}
  .tm-nav a:focus-visible{outline:none;}
  .tm-nav a.cur b{color:var(--lime,#ceff00);}
  .tm-nav a.cur b::before{content:''; display:inline-block; width:10px; height:22px; background:var(--lime,#ceff00); transform:skewX(-20deg); margin-right:10px; vertical-align:-1px;}
  .tm-lang{margin-top:28px;}
  .tm-lang .lb{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.18em; color:#aaa; margin-bottom:10px; text-transform:uppercase;}
  .tm-lang .g{display:grid; grid-template-columns:1fr 1fr; gap:8px;}
  .tm-lang button{height:46px; background:#000; color:#fff; border:1px solid #444; font-family:'Noto Sans JP',sans-serif; font-weight:700; font-size:15px; cursor:pointer;}
  .tm-lang button.on{background:var(--lime,#ceff00); color:#000; border-color:var(--lime,#ceff00);}
  .tm-theme{margin-top:24px;}
  .tm-theme button{display:flex; align-items:center; justify-content:center; gap:10px;}
  .tm-theme .sw{width:18px; height:18px; border:1px solid #888; display:inline-block; flex:none;}
  .tm-lang button:focus-visible{outline:none; border-color:var(--lime,#ceff00);}
  .tm-foot{margin-top:auto; padding-top:28px; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-style:italic; font-size:20px; letter-spacing:.04em; color:#444;}
  .tm-foot::before{content:''; display:block; width:30px; height:4px; background:var(--lime,#ceff00); transform:skewX(-20deg); margin-bottom:8px;}
  body.tm-lock{overflow:hidden;}
  @media (prefers-reduced-motion: reduce){ .tm-ov,.tm-panel,.tm-nav a,.tm-btn i{transition:none !important;} }
  @media (orientation:landscape) and (max-height:520px){ .tm-btn{width:38px; height:38px;} .tm-sp{height:38px; min-width:38px;} .tm-nav a{padding:10px 2px;} .tm-nav b{font-size:26px;} .tm-lang{margin-top:16px;} }
  `;

  let ov, panel, btn, sp, lastFocus;

  function here(){
    const f = location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html?$/i, '');
    const p = PAGES.find(p => p.files.includes(f));
    return p ? p.key : (location.pathname.endsWith('/') ? 'home' : null);
  }

  function build(){
    const st = document.createElement('style'); st.textContent = css; document.head.append(st);
    const slot = document.querySelector('[data-menu-slot]');
    btn = document.createElement('button');
    btn.className = 'tm-btn'; btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<i></i><i></i><i></i>';

    if(slot){
      slot.classList.add('tm-slot');
      if(slot.hasAttribute('data-spotify')){
        sp = document.createElement('a');
        sp.className = 'tm-sp'; sp.href = 'https://open.spotify.com/'; sp.target = '_blank'; sp.rel = 'noopener';
        sp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg><span>Spotify</span>';
        slot.append(sp);
      }
    }
    (slot || document.body).append(btn);

    ov = document.createElement('div'); ov.className = 'tm-ov';
    panel = document.createElement('nav'); panel.className = 'tm-panel';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.inert = true;
    const cur = here();
    panel.innerHTML =
      '<div class="tm-head"><span>MENU</span><button class="tm-x" type="button">✕</button></div>' +
      '<div class="tm-nav">' + PAGES.map(p => `<a href="${p.href}" data-k="${p.key}" class="${p.key === cur ? 'cur' : ''}"${p.key === cur ? ' aria-current="page"' : ''}><b>${p.en}</b><small></small></a>`).join('') + '</div>' +
      '<div class="tm-lang tm-theme"><div class="lb"></div><div class="g">' +
        '<button type="button" data-th="light"><span class="sw" style="background:#fff"></span><span class="nm"></span></button>' +
        '<button type="button" data-th="dark"><span class="sw" style="background:#000; border-color:#666"></span><span class="nm"></span></button></div></div>' +
      '<div class="tm-lang"><div class="lb"></div><div class="g">' + LANGS.map(l => `<button type="button" data-l="${l}">${LANG_NAME[l]}</button>`).join('') + '</div></div>' +
      '<div class="tm-foot">TIVS</div>';
    document.body.append(ov, panel);

    btn.onclick = open;
    ov.onclick = close;
    panel.querySelector('.tm-x').onclick = close;
    panel.querySelectorAll('[data-l]').forEach(b => b.onclick = () => setLang(b.dataset.l));
    panel.querySelectorAll('[data-th]').forEach(b => b.onclick = () => setTheme(b.dataset.th));
    panel.querySelectorAll('.tm-nav a').forEach(a => a.addEventListener('click', e => { if(a.classList.contains('cur')){ e.preventDefault(); close(); } }));
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && panel.classList.contains('open')) close(); });
    paint();
  }

  const NOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>';
  function fillBig(){
    document.querySelectorAll('[data-spotify-btn]').forEach(a => {
      a.innerHTML = `<span class="ic">${NOTE}</span><span class="tx"><b>${tr('spBig')}</b><small>${tr('spSub')}</small></span><span class="go"><i>SPOTIFY</i><svg class="pl" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg></span>`;
      a.setAttribute('aria-label', tr('spBig'));
    });
  }
  window.TDIV.fillSpotify = fillBig;

  function paint(){
    if(!panel) return;
    const l = lang();
    btn.setAttribute('aria-label', tr('menu'));
    if(sp){ sp.setAttribute('aria-label', tr('spotify')); sp.title = tr('spotify'); }
    fillBig();
    panel.setAttribute('aria-label', tr('menu'));
    panel.querySelector('.tm-x').setAttribute('aria-label', tr('close'));
    panel.querySelectorAll('.tm-nav a').forEach(a => a.querySelector('small').textContent = tr(a.dataset.k));
    panel.querySelector('.tm-lang:not(.tm-theme) .lb').textContent = 'LANGUAGE / ' + tr('lang');
    panel.querySelector('.tm-theme .lb').textContent = 'BACKGROUND / ' + tr('theme');
    panel.querySelectorAll('[data-th]').forEach(b => { const on = b.dataset.th === theme(); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.querySelector('.nm').textContent = tr(b.dataset.th); });
    panel.querySelectorAll('[data-l]').forEach(b => { const on = b.dataset.l === l; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }

  function open(){
    lastFocus = document.activeElement;
    panel.inert = false;
    ov.classList.add('open'); panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('tm-lock');
    setTimeout(() => panel.querySelector('.tm-x').focus(), 60);
  }
  function close(){
    ov.classList.remove('open'); panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('tm-lock');
    panel.inert = true;
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.TDIV.closeMenu = () => panel && close();

  document.documentElement.lang = lang() === 'zh' ? 'zh-CN' : lang();
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
