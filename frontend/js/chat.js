// Chat UI. Talks to the backend at /api/chat; falls back to a labelled demo reply if the backend is down.
const log=document.getElementById("log"),form=document.getElementById("form"),box=document.getElementById("q");
const API="/api/chat"; // use the full URL here if the backend is hosted separately
async function sendToAssistant(question){
  try{
    const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,lang:getLang()})});
    if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||"Request failed");
    return await r.json();
  }catch(e){
    if(e instanceof TypeError||/Request failed/.test(e.message)){
      await new Promise(r=>setTimeout(r,700));
      return {answer:"Demo mode: the backend is not connected, so this is only a placeholder for: “"+question+"”. It is not BIS information.",sources:[]};
    }
    throw e;
  }
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function add(cls,html){const d=document.createElement("div");d.className="msg "+cls;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function renderRefs(src){
  if(!src.length)return '<div class="refs"><strong>Sources:</strong> none attached</div>';
  return '<div class="refs"><strong>Sources (select to view the excerpt):</strong><ol>'+src.map((s,i)=>
    '<li><button class="srcbtn" data-i="'+i+'">'+esc(s.title)+(s.documentNo?" ("+esc(s.documentNo)+")":"")+"</button></li>").join("")+"</ol></div>";
}
function openSource(s){
  const d=document.getElementById("srcDlg");
  document.getElementById("srcTitle").textContent=s.title;
  document.getElementById("srcMeta").textContent=[s.documentNo&&"Document no: "+s.documentNo,s.section].filter(Boolean).join(" | ")||"Document number not recorded";
  document.getElementById("srcText").textContent=s.excerpt||"";
  const l=document.getElementById("srcLink");l.textContent="";
  if(/^https?:\/\//.test(s.url||"")){const a=document.createElement("a");a.href=s.url;a.target="_blank";a.rel="noopener";a.textContent="Open the official source";l.appendChild(a)}
  d.showModal();
}
async function ask(text){
  text=text.trim();if(!text)return;
  add("user",esc(text));box.value="";
  const wait=add("bot",'<span class="typing" aria-label="Assistant is typing"><span></span><span></span><span></span></span>');
  try{
    const r=await sendToAssistant(text),src=r.sources||[];
    wait.innerHTML=esc(r.answer).replace(/\n/g,"<br>")+renderRefs(src);
    wait.querySelectorAll(".srcbtn").forEach(b=>b.addEventListener("click",()=>openSource(src[b.dataset.i])));
  }catch(e){wait.textContent=(e.message||"Could not get a reply.")+" Send the question again."}
}
form.addEventListener("submit",e=>{e.preventDefault();ask(box.value)});
box.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask(box.value)}});
document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>ask(c.textContent)));
add("bot","Hello. Ask me about Indian Standards, BIS certification, testing, laboratories or hallmarking.");
const preset=new URLSearchParams(location.search).get("q");
if(preset)ask(preset);
