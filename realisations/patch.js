/* NOESIS · patch du 5 novembre 2026
 * S'exécute APRÈS build.js. Il modifie public/index.html :
 *   1. section « En ce moment » (Black Web November), juste après l'introduction ;
 *   2. bloc « Réalisations » (La Maison Dorée + Chez Sam) en tête de la section Résultats ;
 *   3. télécharge les médias (captures + vidéos) dans public/assets/realisations/.
 * Les adresses et la date de retrait se changent ci-dessous, nulle part ailleurs.
 */
const fs = require('fs');
const path = require('path');

const CFG = {
  maison: { site: 'https://lamaisondoree-valence.vercel.app' },
  sam: {
    site: 'https://chez-sam-valence.vercel.app',
    carte: 'https://chez-sam-valence.vercel.app/carte.html'
  },
  instagram: 'https://www.instagram.com/noesis_ia/',
  retrait: '2026-12-01T00:00:00+01:00', // 1er décembre 2026, 00 h 00, heure de Paris
  mediaBase: 'https://raw.githubusercontent.com/jlbridon13-glitch/Noesis-ia/apercu-realisations/realisations/',
  version: '20261105'
};

const MEDIA = [
  'md-home-d.webp', 'md-home-m.webp', 'md-poster.webp', 'md-demo.mp4',
  'cs-home-d.webp', 'cs-home-m.webp', 'cs-carte-d.webp', 'cs-carte-m.webp',
  'cs-four-poster.webp', 'cs-four.mp4'
];

const ARR = '<svg aria-hidden="true"><use href="#i-arr"></use></svg>';
const M = (f) => 'assets/realisations/' + f + '?v=' + CFG.version;

/* ---------- CSS ---------- */
const CSS = `
/* ===== NOESIS · En ce moment + Réalisations (nov. 2026) ===== */
.np-now{position:relative;background:#101010;color:var(--tx,#F6F5F2);border-top:1px solid rgba(184,154,88,.28);border-bottom:1px solid rgba(184,154,88,.28)}
.np-now-in{display:grid;gap:22px 64px;padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px);grid-template-columns:1fr;grid-template-areas:"kick" "title" "act" "lead" "card" "valid"}
.np-now-kick{grid-area:kick;display:flex;align-items:center;flex-wrap:wrap;gap:10px 14px;margin:0;font:500 .75rem/1 var(--mono,monospace);letter-spacing:.18em;text-transform:uppercase;color:var(--tx-3,#8F8B82)}
.np-now-kick b{font-weight:500;color:var(--gold,#B89A58)}
.np-now-kick i{width:28px;height:1px;background:linear-gradient(90deg,var(--gold,#B89A58),transparent)}
.np-now-t{grid-area:title;margin:0;font:400 clamp(1.9rem,4.4vw,3.1rem)/1.1 var(--serif,Georgia,serif);letter-spacing:-.01em}
.np-price{display:block;margin-top:.1em;font-weight:500;font-size:clamp(3.8rem,11vw,7.2rem);line-height:1;color:var(--gold,#B89A58);white-space:nowrap}
.np-now-lead{grid-area:lead;margin:0;max-width:34em;font:400 1.05rem/1.7 var(--sans,sans-serif);color:var(--tx-2,#C4C0B6)}
.np-now-act{grid-area:act;display:flex;flex-direction:column;align-items:stretch;gap:14px}
.np-now-act .btn{width:100%;justify-content:center;min-height:56px}
.np-now-act .txt-link{align-self:flex-start}
.np-now-card{grid-area:card;padding:26px 24px;border:1px solid rgba(184,154,88,.34);background:rgba(246,245,242,.03)}
.np-now-incl{margin:0 0 14px;font:500 .8rem/1.5 var(--mono,monospace);letter-spacing:.12em;text-transform:uppercase;color:var(--gold,#B89A58)}
.np-now-desc{margin:0;font:400 1rem/1.7 var(--sans,sans-serif);color:var(--tx-2,#C4C0B6)}
.np-now-valid{grid-area:valid;margin:6px 0 0;font:500 .75rem/1.6 var(--mono,monospace);letter-spacing:.1em;text-transform:uppercase;color:var(--tx-3,#8F8B82)}
@media (min-width:900px){
  .np-now-in{grid-template-columns:1.1fr .9fr;grid-template-areas:"kick kick" "title card" "lead card" "act card" "valid valid";align-items:start}
  .np-now-act{flex-direction:row;align-items:center;flex-wrap:wrap;gap:14px 26px}
  .np-now-act .btn{width:auto;min-width:260px}
  .np-now-card{padding:34px 32px}
}

.np-real{grid-column:1/-1;width:100%;min-width:0;padding:0 0 clamp(40px,6vw,72px)}
.np-real-head{max-width:760px;margin:0 0 clamp(32px,5vw,56px)}
.np-real-t{margin:14px 0 0;font:400 clamp(2rem,4.6vw,3.4rem)/1.08 var(--serif,Georgia,serif);color:#0D0D0D}
.np-real-lead{margin:16px 0 0;font:400 1.05rem/1.7 var(--sans,sans-serif);color:#4f4b43}
.np-proj{padding:clamp(28px,5vw,56px) 0;border-top:1px solid rgba(13,13,13,.14)}
.np-ph{display:grid;gap:14px 40px;margin-bottom:clamp(24px,4vw,40px)}
.np-ph h3{margin:6px 0 0;font:400 clamp(1.7rem,3.4vw,2.5rem)/1.1 var(--serif,Georgia,serif);color:#0D0D0D}
.np-ph p{margin:0}
.np-meta{font:500 .78rem/1.6 var(--mono,monospace);letter-spacing:.1em;text-transform:uppercase;color:#6a655b}
.np-pact{display:flex;flex-wrap:wrap;gap:12px}
.np-pact .btn{min-height:52px}
@media (min-width:900px){.np-ph{grid-template-columns:1fr auto;align-items:end}}
@media (max-width:640px){.np-pact .btn{width:100%;justify-content:center}}

.np-stage{position:relative;padding-bottom:clamp(0px,4vw,56px)}
.np-browser{border-radius:10px;overflow:hidden;background:#171717;box-shadow:0 40px 90px -40px rgba(0,0,0,.55),0 0 0 1px rgba(13,13,13,.18)}
.np-bar{display:flex;align-items:center;gap:7px;padding:10px 14px;background:#1d1d1d}
.np-bar i{width:9px;height:9px;border-radius:50%;background:#3a3a3a}
.np-bar span{margin-left:10px;flex:1;min-width:0;padding:4px 12px;border-radius:99px;background:#2a2a2a;font:400 .7rem/1.4 var(--mono,monospace);color:#a9a49a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.np-browser img,.np-phone img{display:block;width:100%;height:auto}
.np-phone{width:min(260px,64vw);margin:-28px auto 0;position:relative;padding:9px;border-radius:34px;background:#0e0e0e;box-shadow:0 30px 70px -28px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08)}
.np-phone img{border-radius:26px}
@media (min-width:900px){
  .np-stage{padding-right:0}
  .np-browser{width:84%}
  .np-phone{position:absolute;right:0;bottom:0;width:min(250px,22%);margin:0}
}

.np-vid{margin:clamp(28px,4vw,44px) 0 0}
.np-vid-box{position:relative;display:block;width:100%;aspect-ratio:16/9;border:0;padding:0;border-radius:10px;overflow:hidden;background:#111 center/cover no-repeat;cursor:pointer;box-shadow:0 30px 70px -40px rgba(0,0,0,.5)}
.np-vid-box video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}
.np-vid-box::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.55));pointer-events:none}
.np-vid-box.on::after{display:none}
.np-play{position:absolute;z-index:2;left:50%;top:50%;translate:-50% -50%;display:flex;align-items:center;gap:12px;padding:14px 22px 14px 16px;border-radius:99px;background:rgba(13,13,13,.82);color:#F6F5F2;font:500 .9rem/1 var(--sans,sans-serif);backdrop-filter:blur(6px);box-shadow:0 0 0 1px rgba(184,154,88,.55)}
.np-play svg{width:34px;height:34px;flex:none;color:#B89A58}
.np-vid-box:focus-visible{outline:3px solid #B89A58;outline-offset:3px}
.np-vid-cap{margin:12px 0 0;font:400 .85rem/1.6 var(--sans,sans-serif);color:#6a655b}

.np-carte{margin-top:clamp(28px,4vw,44px);display:grid;gap:22px 40px;grid-template-columns:1fr}
.np-carte h4{margin:0;font:400 clamp(1.5rem,2.8vw,2rem)/1.15 var(--serif,Georgia,serif);color:#0D0D0D}
.np-carte p{margin:10px 0 0;font:400 1rem/1.7 var(--sans,sans-serif);color:#4f4b43}
.np-carte-view{position:relative;max-height:520px;overflow:hidden;border-radius:10px;box-shadow:0 30px 70px -40px rgba(0,0,0,.5),0 0 0 1px rgba(13,13,13,.14);background:#fdfcf9}
.np-carte-view img{display:block;width:100%;height:auto}
.np-carte-view::after{content:"";position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(180deg,rgba(253,252,249,0),#fdfcf9);pointer-events:none}
.np-carte-view .m{display:none}
.np-carte-act{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}
.np-carte-act .btn{min-height:52px}
.np-carte-note{margin:14px 0 0;font:400 .85rem/1.6 var(--sans,sans-serif);color:#6a655b}
@media (min-width:900px){.np-carte{grid-template-columns:.8fr 1.2fr;align-items:center}}
@media (max-width:640px){
  .np-carte-view{max-height:560px;width:min(340px,88vw);margin:0 auto}
  .np-carte-view .d{display:none}.np-carte-view .m{display:block}
  .np-carte-act .btn{width:100%;justify-content:center}
}
.np-lb{border:0;padding:0;width:min(1260px,96vw);max-height:94vh;border-radius:12px;background:#fdfcf9;color:#0D0D0D}
.np-lb::backdrop{background:rgba(8,8,8,.82)}
.np-lb-bar{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:#0D0D0D;color:#F6F5F2}
.np-lb-bar a{color:#E3CB92;font:500 .9rem/1.2 var(--sans,sans-serif)}
.np-lb-bar button{min-height:44px;padding:0 18px;border:1px solid rgba(246,245,242,.4);border-radius:99px;background:transparent;color:#F6F5F2;font:500 .9rem/1 var(--sans,sans-serif);cursor:pointer}
.np-lb-body{overflow:auto;max-height:calc(94vh - 70px)}
.np-lb-body img{display:block;width:100%;height:auto}
@media (max-width:640px){.np-lb{width:100vw;max-height:100vh;border-radius:0}.np-lb-body{max-height:calc(100vh - 70px)}}
@media (prefers-reduced-motion:no-preference){.np-play{transition:transform .25s}.np-vid-box:hover .np-play{transform:scale(1.04)}}
`;

/* ---------- HTML ---------- */
const NOW_HTML = `
<section class="np-now" id="en-ce-moment" aria-labelledby="np-now-t" data-retrait="${CFG.retrait}">
  <div class="wrap np-now-in">
    <p class="np-now-kick"><b>En ce moment</b><i aria-hidden="true"></i><span>Black Web November</span></p>
    <h2 class="np-now-t" id="np-now-t">Votre site vitrine professionnel à <span class="np-price">199&nbsp;€&nbsp;HT</span></h2>
    <p class="np-now-lead">Pour les artisans, commerçants et indépendants qui veulent présenter leur activité en ligne et faciliter les demandes de contact.</p>
    <div class="np-now-act">
      <a class="btn btn-gold" href="${CFG.instagram}" target="_blank" rel="noopener">Parler de mon projet${ARR}</a>
      <a class="txt-link" href="#diagnostic" data-offer="" data-subject="Black Web November — Site vitrine à 199 € HT">Ou remplir le formulaire de diagnostic ${ARR}</a>
    </div>
    <div class="np-now-card">
      <p class="np-now-incl">Jusqu’à 5 pages · Audit marketing et plan d’action offerts</p>
      <p class="np-now-desc">Site adapté aux mobiles et aux ordinateurs, formulaire de contact, référencement naturel de base, intégration des contenus fournis et un aller-retour de corrections.</p>
    </div>
    <p class="np-now-valid">Offre valable du 1er au 30 novembre 2026 · Livraison sous 5 à 7 jours ouvrés</p>
  </div>
</section>
`;

const PLAY = '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M13.5 10.5v13l11-6.5z" fill="currentColor"/></svg>';

const video = (id, poster, src, label, cap) => `
      <figure class="np-vid">
        <button class="np-vid-box" type="button" data-np-video="${M(src)}" data-poster="${M(poster)}" style="background-image:url(${M(poster)})" aria-label="${label}">
          <span class="np-play">${PLAY}<span>${label}</span></span>
        </button>
        <figcaption class="np-vid-cap">${cap}</figcaption>
      </figure>`;

const REAL_HTML = `
    <div class="np-real" id="realisations">
      <header class="np-real-head">
        <p class="eyebrow">Réalisations</p>
        <h2 class="np-real-t">Deux établissements de Valence, deux sites réalisés.</h2>
        <p class="np-real-lead">Des vraies pages, en ligne, pensées pour qu’un client trouve la carte, l’adresse et le bouton pour réserver en quelques secondes.</p>
      </header>

      <article class="np-proj" id="real-maison-doree" aria-labelledby="np-md-t">
        <div class="np-ph">
          <div>
            <p class="np-meta">Bistrot · restaurant · pizzeria</p>
            <h3 id="np-md-t">La Maison Dorée <span aria-hidden="true">—</span> Valence</h3>
          </div>
          <div class="np-pact">
            <a class="btn btn-dark" href="${CFG.maison.site}" target="_blank" rel="noopener">Voir le site${ARR}</a>
            <a class="btn btn-ghost" href="#h-case">Voir les résultats mesurés</a>
          </div>
        </div>
        <div class="np-stage">
          <div class="np-browser">
            <div class="np-bar"><i></i><i></i><i></i><span>lamaisondoree-valence.vercel.app</span></div>
            <img src="${M('md-home-d.webp')}" width="1440" height="900" loading="lazy" decoding="async" alt="Accueil du site de La Maison Dorée : titre « On se retrouve à la Maison » et photo du comptoir du restaurant">
          </div>
          <div class="np-phone"><img src="${M('md-home-m.webp')}" width="780" height="1688" loading="lazy" decoding="async" alt="Le même site sur téléphone, avec les boutons Découvrir la carte et Réserver par téléphone"></div>
        </div>${video('md', 'md-poster.webp', 'md-demo.mp4', 'Voir la visite du site (11 s)', 'Parcours réel du site de La Maison Dorée, défilement lent, sans son.')}
      </article>

      <article class="np-proj" id="real-chez-sam" aria-labelledby="np-cs-t">
        <div class="np-ph">
          <div>
            <p class="np-meta">Pizzeria au feu de bois &amp; rhumerie</p>
            <h3 id="np-cs-t">Chez Sam <span aria-hidden="true">—</span> Valence</h3>
          </div>
          <div class="np-pact">
            <a class="btn btn-dark" href="${CFG.sam.site}" target="_blank" rel="noopener">Voir le site${ARR}</a>
            <a class="btn btn-ghost" href="${CFG.sam.carte}" target="_blank" rel="noopener">Voir la carte${ARR}</a>
          </div>
        </div>
        <div class="np-stage">
          <div class="np-browser">
            <div class="np-bar"><i></i><i></i><i></i><span>chez-sam-valence.vercel.app</span></div>
            <img src="${M('cs-home-d.webp')}" width="1440" height="900" loading="lazy" decoding="async" alt="Accueil du site de Chez Sam : la vraie devanture sur la place des Clercs, avec les boutons Réserver et Appeler">
          </div>
          <div class="np-phone"><img src="${M('cs-home-m.webp')}" width="780" height="1688" loading="lazy" decoding="async" alt="Le même site sur téléphone, avec le bouton Appeler pour réserver"></div>
        </div>${video('cs', 'cs-four-poster.webp', 'cs-four.mp4', 'Voir le four à bois (5 s)', 'Plan réel du four à bois de Chez Sam, sans son.')}
        <div class="np-carte">
          <div>
            <h4>Une carte lisible partout</h4>
            <p>Pizzas, base tomate, base crème, spéciales : chaque plat avec sa photo, ses ingrédients et son prix, en deux colonnes sur ordinateur et en une seule sur téléphone.</p>
            <div class="np-carte-act">
              <button class="btn btn-dark" type="button" data-np-lightbox aria-haspopup="dialog">Ouvrir la carte en grand</button>
            </div>
            <p class="np-carte-note">Aperçu de la carte : ouvrez-la en grand pour voir tous les plats et les prix.</p>
          </div>
          <div class="np-carte-view">
            <img class="d" src="${M('cs-carte-d.webp')}" width="1220" height="1244" loading="lazy" decoding="async" alt="La carte des pizzas de Chez Sam sur ordinateur, avec photos, ingrédients et prix">
            <img class="m" src="${M('cs-carte-m.webp')}" width="708" height="3750" loading="lazy" decoding="async" alt="La carte des pizzas de Chez Sam sur téléphone, avec photos, ingrédients et prix">
          </div>
        </div>
      </article>
    </div>
`;

const LIGHTBOX = `
<dialog class="np-lb" id="np-lb" aria-label="La carte de Chez Sam">
  <div class="np-lb-bar"><a href="${CFG.sam.carte}" target="_blank" rel="noopener">Voir la carte sur le site ↗</a><button type="button" data-np-close>Fermer</button></div>
  <div class="np-lb-body"><img id="np-lb-img" alt="La carte des pizzas de Chez Sam en grand" width="1220" height="1244"></div>
</dialog>
`;

const JS = `
(function(){
  try{
    var s=document.getElementById('en-ce-moment');
    if(s){
      var end=Date.parse(s.getAttribute('data-retrait'));
      if(!isNaN(end)){
        if(Date.now()>=end){s.remove();}
        else{var ms=end-Date.now();if(ms<2147483000){setTimeout(function(){var e=document.getElementById('en-ce-moment');if(e)e.remove();},ms);}}
      }
    }
  }catch(e){}
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('[data-np-video]');
    if(b&&!b.classList.contains('on')){
      var v=document.createElement('video');
      v.src=b.getAttribute('data-np-video');v.poster=b.getAttribute('data-poster');
      v.controls=true;v.muted=true;v.playsInline=true;v.loop=false;v.preload='auto';
      v.setAttribute('playsinline','');v.setAttribute('aria-label',b.getAttribute('aria-label')||'');
      b.classList.add('on');b.setAttribute('aria-label','Vidéo en lecture');
      var p=b.querySelector('.np-play');if(p)p.remove();
      b.appendChild(v);var r=v.play();if(r&&r.catch)r.catch(function(){});
      return;
    }
    var l=ev.target.closest&&ev.target.closest('[data-np-lightbox]');
    if(l){
      var d=document.getElementById('np-lb'),i=document.getElementById('np-lb-img');
      if(!d||!i)return;
      var mob=window.matchMedia&&window.matchMedia('(max-width:640px)').matches;
      var src=document.querySelector('.np-carte-view img.'+(mob?'m':'d')).getAttribute('src');
      i.src=src;i.width=mob?708:1220;i.height=mob?3750:1244;
      if(d.showModal){d.showModal();}else{d.setAttribute('open','');}
      return;
    }
    if(ev.target.closest&&ev.target.closest('[data-np-close]')){var dd=document.getElementById('np-lb');if(dd)dd.close?dd.close():dd.removeAttribute('open');}
    else if(ev.target&&ev.target.id==='np-lb'){ev.target.close();}
  });
})();
`;

/* ---------- Médias ---------- */
async function fetchMedia(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const local = process.env.NP_MEDIA_DIR;
  for (const f of MEDIA) {
    if (local) { fs.copyFileSync(path.join(local, f), path.join(outDir, f)); continue; }
    let lastErr;
    for (let k = 0; k < 4; k++) {
      try {
        const r = await fetch(CFG.mediaBase + f);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 1000) throw new Error('fichier trop petit');
        fs.writeFileSync(path.join(outDir, f), buf);
        lastErr = null; break;
      } catch (e) { lastErr = e; await new Promise((res) => setTimeout(res, 800 * (k + 1))); }
    }
    if (lastErr) throw new Error('Média introuvable : ' + f + ' (' + lastErr.message + ')');
  }
}

/* ---------- Patch ---------- */
module.exports = async function patch(publicDir) {
  const file = path.join(publicDir, 'index.html');
  let t = fs.readFileSync(file, 'utf8');
  const must = (cond, msg) => { if (!cond) throw new Error('Ancre introuvable : ' + msg); };

  /* 1. CSS */
  must(t.includes('</head>'), '</head>');
  t = t.replace('</head>', '<style id="np-css">' + CSS + '</style>\n</head>');

  /* 2. « En ce moment » : juste après l'introduction (avant #promesse), sauf si la date de retrait est passée */
  const iProm = t.indexOf('id="promesse"');
  must(iProm > 0, '#promesse');
  const iSec = t.lastIndexOf('<section', iProm);
  must(iSec > 0, 'section #promesse');
  if (Date.now() < Date.parse(CFG.retrait)) t = t.slice(0, iSec) + NOW_HTML + '\n' + t.slice(iSec);

  /* 3. Réalisations : en tête de la section Résultats */
  const iRes = t.indexOf('id="resultats"');
  must(iRes > 0, '#resultats');
  const iWrap = t.indexOf('<div class="wrap">', iRes);
  must(iWrap > 0, '.wrap de #resultats');
  const at = iWrap + '<div class="wrap">'.length;
  t = t.slice(0, at) + '\n' + REAL_HTML + '\n<div class="np-sep" aria-hidden="true" style="grid-column:1/-1;height:1px;background:rgba(13,13,13,.12);margin:0 0 clamp(32px,5vw,56px)"></div>\n' + t.slice(at);

  /* 4. Fenêtre de la carte + script */
  must(t.includes('</body>'), '</body>');
  t = t.replace('</body>', LIGHTBOX + '<script id="np-js">' + JS + '</script>\n</body>');

  fs.writeFileSync(file, t);
  await fetchMedia(path.join(publicDir, 'assets', 'realisations'));
  return t.length;
};
