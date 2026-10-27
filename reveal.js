/* Scroll-Einblendungen – blendet Inhaltsbloecke beim Scrollen sanft ein.
   Robust: was beim Laden schon sichtbar ist, bleibt sofort sichtbar; der Rest
   blendet sich beim ersten Pixel ein (threshold 0, also auch sehr lange
   Abschnitte). Ohne IntersectionObserver / bei reduzierter Bewegung bleibt
   alles sichtbar. */
(function(){
  if(!('IntersectionObserver' in window)) return;
  try{
    var css = '.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease;}'
            + '.reveal.in{opacity:1;transform:none;}'
            + '@media(prefers-reduced-motion:reduce){.reveal{opacity:1!important;transform:none!important;transition:none!important;}}';
    var st = document.createElement('style');
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }catch(e){ return; }

  function run(){
    var nodes;
    try{ nodes = [].slice.call(document.querySelectorAll('article.story, .card, .log-entry, .entry')); }
    catch(e){ return; }
    if(!nodes.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:0, rootMargin:'0px 0px -5% 0px' });
    nodes.forEach(function(n){
      var top;
      try{ top = n.getBoundingClientRect().top; }catch(_){ top = vh + 1; }
      // Nur Bloecke unterhalb des sichtbaren Bereichs werden animiert;
      // alles bereits Sichtbare bleibt unangetastet (= immer sichtbar).
      if(top >= vh * 0.9){ n.classList.add('reveal'); io.observe(n); }
    });
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); }
  else { run(); }
})();
