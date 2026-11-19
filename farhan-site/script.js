(function(){
var m=document.querySelector(".menu"),nv=document.querySelector("nav");
if(m)m.onclick=function(){var o=nv.classList.toggle("open");m.setAttribute("aria-expanded",o)};
var th=document.querySelector(".theme");
if(th)th.onclick=function(){var r=document.documentElement,n=r.dataset.theme==="dark"?"light":"dark";r.dataset.theme=n;try{localStorage.setItem("theme",n)}catch(e){}};
var still=matchMedia("(prefers-reduced-motion:reduce)").matches;
/* scroll reveal */
var rv=document.querySelectorAll(".rv");
if("IntersectionObserver"in window&&!still){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.08});rv.forEach(function(x){io.observe(x)})}else rv.forEach(function(x){x.classList.add("in")});
/* count-up */
document.querySelectorAll("[data-count]").forEach(function(b){var to=+b.dataset.count;if(still||!("IntersectionObserver"in window)){b.textContent=to;return}
var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();var t0=performance.now();(function s(t){var p=Math.min(1,(t-t0)/1100);b.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})(t0)});o.observe(b)});
/* publications: filter, search, count, BibTeX */
var L=[].slice.call(document.querySelectorAll(".pubs li"));
if(L.length){
var fb=document.querySelectorAll(".filters button"),q=document.getElementById("q"),ct=document.getElementById("count"),cur="all";
function apply(){var s=q?q.value.trim().toLowerCase():"",n=0;L.forEach(function(li){var ok=(cur==="all"||li.dataset.t===cur)&&(!s||li.textContent.toLowerCase().indexOf(s)>-1);li.hidden=!ok;if(ok)n++});if(ct)ct.textContent="Showing "+n+" of "+L.length}
fb.forEach(function(b){b.onclick=function(){cur=b.dataset.f;fb.forEach(function(x){x.setAttribute("aria-pressed",x===b)});apply()}});
if(q)q.oninput=apply;apply();
var all=[];
function bib(el){var t=el.querySelector("h3").textContent.replace(/First author/,"").trim(),p=el.querySelectorAll("p"),au=p[0].textContent.trim(),ven=p[1].textContent.trim(),yr=el.querySelector(".yr").textContent.trim(),a=el.querySelector("h3 a");
var names=au.split(/(?<=\.),\s+(?=[A-Z])/).join(" and ");
var key="Anjum"+yr+t.split(/\s+/).filter(function(w){return !/^(a|an|the|of)$/i.test(w)})[0].replace(/[^A-Za-z]/g,"");
var qv=ven.split(",");var f=["  author = {"+names+"}","  title = {{"+t+"}}","  year = {"+yr+"}","  journal = {"+qv[0].trim()+"}"];
if(qv.length>1)f.push("  note = {"+qv.slice(1).join(",").trim()+"}");
if(a&&/doi\.org\//.test(a.href))f.push("  doi = {"+a.href.split("doi.org/")[1]+"}");
return "@article{"+key+",\n"+f.join(",\n")+"\n}"}
function copy(s,b){var done=function(){var o=b.textContent;b.textContent="Copied";setTimeout(function(){b.textContent=o},1600)};
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(s).then(done,function(){})}else{var x=document.createElement("textarea");x.value=s;document.body.appendChild(x);x.select();try{document.execCommand("copy");done()}catch(e){}x.remove()}}
L.forEach(function(el){var s=bib(el);all.push(s);var b=document.createElement("button");b.type="button";b.className="cite";b.textContent="Copy BibTeX";b.onclick=function(){copy(s,b)};el.lastElementChild.appendChild(b)});
var tools=document.querySelector(".tools");if(tools){var d=document.createElement("button");d.type="button";d.className="cite";d.textContent="Download all BibTeX";d.onclick=function(){var u=URL.createObjectURL(new Blob([all.join("\n\n")+"\n"],{type:"text/plain"})),a=document.createElement("a");a.href=u;a.download="farhan-anjum.bib";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)};tools.appendChild(d)}
}
/* single-molecule localisation demo */
var c=document.getElementById("smlm");
if(c){var g=c.getContext("2d"),d=window.devicePixelRatio||1,W,H,glow,pts=[],em=[],hold=0,run=false,MAX=7000,PAD=28;
function f1(u){return .5+.2*Math.sin(u*6.9+.3)}function f2(u){return .5+.19*Math.cos(u*5.6+1.2)}
for(var i=0;i<=170;i++){var u=i/170;em.push([u,f1(u)]);em.push([u,f2(u)])}
function px(e,x0,pw){return x0+PAD+e[0]*(pw-2*PAD)}
function gauss(){return(Math.random()+Math.random()+Math.random()-1.5)*1.5}
function size(){W=c.clientWidth;H=c.clientHeight;c.width=W*d;c.height=H*d;g.setTransform(d,0,0,d,0,0);
glow=document.createElement("canvas");glow.width=W/2*d;glow.height=H*d;var x=glow.getContext("2d");x.setTransform(d,0,0,d,0,0);x.globalCompositeOperation="lighter";
em.forEach(function(e){var X=px(e,0,W/2),Y=e[1]*H,r=g.createRadialGradient(X,Y,0,X,Y,17);r.addColorStop(0,"rgba(79,209,197,.075)");r.addColorStop(1,"rgba(79,209,197,0)");x.fillStyle=r;x.fillRect(X-17,Y-17,34,34)});draw()}
function add(n){for(var i=0;i<n&&pts.length<MAX;i++){var e=em[Math.floor(Math.random()*em.length)];pts.push([px(e,W/2,W/2)+gauss(),e[1]*H+gauss()])}}
function draw(){g.clearRect(0,0,W,H);g.drawImage(glow,0,0,W/2,H);
g.fillStyle="rgba(255,127,191,.9)";for(var i=0;i<pts.length;i++)g.fillRect(pts[i][0]-.8,pts[i][1]-.8,1.6,1.6);
g.strokeStyle="rgba(191,216,214,.25)";g.beginPath();g.moveTo(W/2,10);g.lineTo(W/2,H-10);g.stroke();
g.fillStyle="#BFD8D6";g.font="600 12px Public Sans,sans-serif";g.fillText("Diffraction-limited image",12,20);g.fillText("Localisations: "+pts.length.toLocaleString(),W/2+12,20)}
function tick(t){if(!run)return;if(pts.length>=MAX){if(!hold)hold=t;if(t-hold>3500){pts=[];hold=0}}else add(4);draw();requestAnimationFrame(tick)}
function fill(){pts=[];add(MAX);draw()}
size();addEventListener("resize",size);
var rb=document.getElementById("replay");
if(rb)rb.onclick=function(){if(still)fill();else{pts=[];hold=0}};
if(still)fill();else if("IntersectionObserver"in window){new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!run){run=true;requestAnimationFrame(tick)}else if(!v)run=false}).observe(c)}else{run=true;requestAnimationFrame(tick)}}
/* project animations: pause off screen, hold a frame for reduced motion */
var s=document.querySelectorAll(".pa svg");
if(s.length&&s[0].pauseAnimations){if(still){s.forEach(function(v){try{v.setCurrentTime(2.4);v.pauseAnimations()}catch(e){}})}else if("IntersectionObserver"in window){var io2=new IntersectionObserver(function(es){es.forEach(function(x){try{x.isIntersecting?x.target.unpauseAnimations():x.target.pauseAnimations()}catch(e){}})},{threshold:.1});s.forEach(function(v){io2.observe(v)})}}
})();
