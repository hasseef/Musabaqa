
import { initAuthUI, getAuth } from "./auth.js";

// PWA install prompt
let deferredPrompt = null;
addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("installBtn");
  if(btn) btn.hidden = false;
});
addEventListener("appinstalled", () => {
  const btn = document.getElementById("installBtn");
  if(btn) btn.hidden = true;
});
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("installBtn");
  if(btn) btn.addEventListener("click", async () => {
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
});

// Service worker
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

// Year
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
});

// Mock competitions
const data = [
  { id:1, title:"تحدي الابتكار الصحي", org:"وزارة الصحة", category:"ابتكار", status:"open", deadline:"2025-12-20", brief:"حلول رقمية لتحسين تجربة المرضى." },
  { id:2, title:"جائزة التصميم الحضري", org:"أمانة المدينة", category:"تصميم", status:"soon", deadline:"2025-12-05", brief:"أفكار لإحياء الساحات العامة." },
  { id:3, title:"مسابقة الأبحاث الرقمية", org:"جامعة المعرفة", category:"بحث علمي", status:"open", deadline:"2026-01-10", brief:"أبحاث الذكاء الاصطناعي وتطبيقاته." },
  { id:4, title:"هاكاثون الأعمال", org:"غرفة التجارة", category:"أعمال", status:"closed", deadline:"2025-10-01", brief:"حلول لتعزيز نمو الشركات الناشئة." }
];

function renderList(items){
  const list = document.getElementById("compList");
  list.innerHTML = "";
  items.forEach(c => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h3>${c.title}</h3>
      <p class="muted">${c.org} • ${c.category}</p>
      <p>${c.brief}</p>
      <div class="row" style="margin-top:8px">
        <span class="badge badge--${c.status}">${statusLabel(c.status)}</span>
        <button class="btn btn--light" data-id="${c.id}">شارك الآن</button>
      </div>
      <small class="muted">آخر موعد: ${c.deadline}</small>
    `;
    el.querySelector("button").addEventListener("click", () => joinCompetition(c));
    list.appendChild(el);
  });
}

function statusLabel(s){
  return s === "open" ? "مفتوحة" : s === "closed" ? "مغلقة" : "قريباً";
}

function filterList(){
  const q = document.getElementById("searchInput").value.trim();
  const cat = document.getElementById("categoryFilter").value;
  const st = document.getElementById("statusFilter").value;
  const out = data.filter(d => {
    const okQ = !q || d.title.includes(q) || d.org.includes(q);
    const okC = !cat || d.category === cat;
    const okS = !st || d.status === st;
    return okQ && okC && okS;
  });
  renderList(out);
}

["searchInput","categoryFilter","statusFilter"].forEach(id => {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById(id)?.addEventListener("input", filterList);
  });
});

function joinCompetition(c){
  const user = getAuth();
  if(!user){
    alert("فضلاً سجّل دخولك أولاً");
    document.getElementById("authModal").showModal();
    return;
  }
  alert(`تم تسجيل اهتمامك في: ${c.title} — سنتواصل معك عبر بريدك.`);
  const key = "musabaqa_interests";
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  if(!arr.find(x => x.id === c.id)){
    arr.push({ id:c.id, at:Date.now() });
    localStorage.setItem(key, JSON.stringify(arr));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderList(data);
  filterList();
  initAuthUI();
});
