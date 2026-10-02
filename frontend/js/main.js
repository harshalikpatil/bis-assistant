// Shared behaviour: mobile menu + language selector
document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.querySelector(".menu-btn"),nav=document.getElementById("nav");
  btn&&btn.addEventListener("click",()=>{const o=nav.classList.toggle("open");btn.setAttribute("aria-expanded",o)});
  document.querySelectorAll("select.lang").forEach(s=>s.addEventListener("change",e=>{localStorage.setItem("lang",e.target.value);applyLang()}));
  applyLang();
});
