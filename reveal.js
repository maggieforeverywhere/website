/* Scroll-Einblendungen – blendet Inhaltsbloecke beim Scrollen sanft ein.
   Selbststaendig: bringt sein eigenes CSS mit, braucht nur eingebunden zu werden.
   Fallbacks: ohne IntersectionObserver bleibt alles sichtbar; respektiert prefers-reduced-motion. */
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
    nodes.forEach(function(n){ n.classList.add('reveal'); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:0.1, rootMargin:'0px 0px -6% 0px' });
    nodes.forEach(function(n){ io.observe(n); });
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); }
  else { run(); }
})();
