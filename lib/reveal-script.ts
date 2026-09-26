/**
 * Inline script (first thing in <body>) that runs the <Reveal> entrance animations.
 *
 * - Adds `reveal-on` to <html>; only then does CSS hide [data-reveal] elements, so without
 *   JavaScript (or IntersectionObserver) everything is simply visible.
 * - A MutationObserver picks up elements as the HTML streams in and after client-side
 *   navigation; an IntersectionObserver fades each one in once, when it enters the viewport.
 * - Uses the Web Animations API, so it never changes attributes that React manages.
 * - Same timing as before: 0.8 s, cubic-bezier(0.22, 1, 0.36, 1), per-element delay; under
 *   prefers-reduced-motion it fades without movement.
 */
export const revealScript = `(()=>{
if(!("IntersectionObserver" in window)||!Element.prototype.animate)return;
var d=document.documentElement;d.classList.add("reveal-on");
var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;io.unobserve(t);var s=getComputedStyle(t);
t.animate([{opacity:0,transform:"translateY("+(still?"0px":(s.getPropertyValue("--reveal-y")||"18px"))+")"},{opacity:1,transform:"none"}],{duration:800,delay:(parseFloat(s.getPropertyValue("--reveal-delay"))||0)*1000,easing:"cubic-bezier(0.22,1,0.36,1)",fill:"both"});});},{rootMargin:"0px 0px -12% 0px"});
var seen=new WeakSet();
function add(n){if(n.nodeType!==1)return;var l=n.matches("[data-reveal]")?[n]:[];l.push.apply(l,n.querySelectorAll("[data-reveal]"));l.forEach(function(el){if(!seen.has(el)){seen.add(el);io.observe(el);}});}
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(add);});}).observe(d,{childList:true,subtree:true});
add(d);
})();`;
