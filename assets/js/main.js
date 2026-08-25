/* =========================================================
   shared behaviour
   ========================================================= */

/* --- status bar clock, like the poster's 12/17 03:27 --- */
function startClock(){
  const el = document.getElementById("clock");
  if(!el) return;
  const tick = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    el.textContent = `${p(d.getMonth()+1)}/${p(d.getDate())}  ${p(d.getHours())}:${p(d.getMinutes())}`;
  };
  tick();
  setInterval(tick, 15000);
}

/* pages all sit at the repo root, so no prefix is needed today —
   kept as one knob in case the site ever moves into subfolders */
const ART_PREFIX = "";

/* --- artwork images: try the common extensions, else show a slot --- */
const ART_EXT = ["png", "jpg", "jpeg", "webp"];

function mountArtImage(host, art, alt){
  let i = 0;
  const img = new Image();
  img.alt = alt || art.title;
  img.onerror = () => {
    i++;
    if(i < ART_EXT.length){ img.src = `${ART_PREFIX}assets/art/${art.file}.${ART_EXT[i]}`; }
    else{
      host.innerHTML =
        `<div class="ph"><b>${art.title}</b><span>image slot</span>` +
        `<code>assets/art/${art.file}.png</code></div>`;
    }
  };
  img.onload = () => { host.innerHTML = ""; host.appendChild(img); };
  img.src = `${ART_PREFIX}assets/art/${art.file}.${ART_EXT[0]}`;
}

/* --- tiny helpers --- */
const qs  = k => new URLSearchParams(location.search).get(k);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));

document.addEventListener("DOMContentLoaded", startClock);
