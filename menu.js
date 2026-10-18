/* TIVS - 共通メニュー（右上の ≡）
 * 使い方: ページの見出しの中に <div data-menu-slot></div> を置いて、<script src="menu.js"></script> を読み込むだけ。
 * 言語は全ページ共通（localStorage: tdiv_lang）。変更すると window に 'tdiv:lang' イベントが飛ぶ。
 */
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
    spotify: {ja:'Spotifyを開く', en:'Open Spotify', ko:'Spotify 열기', zh:'打开 Spotify'}
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
  .tm-lang button:focus-visible{outline:none; border-color:var(--lime,#ceff00);}
  .tm-foot{margin-top:auto; padding-top:28px; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-style:italic; font-size:20px; letter-spacing:.04em; color:#444;}
  .tm-foot::before{content:''; display:block; width:30px; height:4px; background:var(--lime,#ceff00); transform:skewX(-20deg); margin-bottom:8px;}
  body.tm-lock{overflow:hidden;}
  @media (prefers-reduced-motion: reduce){ .tm-ov,.tm-panel,.tm-nav a,.tm-btn i{transition:none !important;} }
  @media (orientation:landscape) and (max-height:520px){ .tm-btn{width:38px; height:38px;} .tm-sp{height:38px; min-width:38px;} .tm-nav a{padding:10px 2px;} .tm-nav b{font-size:26px;} .tm-lang{margin-top:16px;} }
  `;

  let ov, panel, btn, sp, lastFocus;
  // 今いるページ。ホスティングによって /workout.html・/workout・/workout/ のどれでも開くので、
  // 末尾の / と .html を外した名前で見分ける（分からないときは null = どれも「現在地」にしない）
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
    // data-spotify が付いたページ（workout / run / active）は ≡ の左に Spotify ボタン
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
      '<div class="tm-lang"><div class="lb"></div><div class="g">' + LANGS.map(l => `<button type="button" data-l="${l}">${LANG_NAME[l]}</button>`).join('') + '</div></div>' +
      '<div class="tm-foot">TIVS</div>';
    document.body.append(ov, panel);

    btn.onclick = open;
    ov.onclick = close;
    panel.querySelector('.tm-x').onclick = close;
    panel.querySelectorAll('[data-l]').forEach(b => b.onclick = () => setLang(b.dataset.l));
    panel.querySelectorAll('.tm-nav a').forEach(a => a.addEventListener('click', e => { if(a.classList.contains('cur')){ e.preventDefault(); close(); } }));
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && panel.classList.contains('open')) close(); });
    paint();
  }
  function paint(){
    if(!panel) return;
    const l = lang();
    btn.setAttribute('aria-label', tr('menu'));
    if(sp){ sp.setAttribute('aria-label', tr('spotify')); sp.title = tr('spotify'); }
    panel.setAttribute('aria-label', tr('menu'));
    panel.querySelector('.tm-x').setAttribute('aria-label', tr('close'));
    panel.querySelectorAll('.tm-nav a').forEach(a => a.querySelector('small').textContent = tr(a.dataset.k));
    panel.querySelector('.tm-lang .lb').textContent = 'LANGUAGE / ' + tr('lang');
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
