const $ = s => document.querySelector(s)
const $$ = s => Array.from(document.querySelectorAll(s))

// Router
const routes = ["home","individual","entity","sponsor","investor","admin"]
function render(){
  const hash = location.hash.replace('#','') || 'home'
  routes.forEach(r => {
    const el = $('#view-'+r)
    if(el) el.classList.toggle('hidden', r!==hash)
  })
  $$('.nav a').forEach(a=> a.classList.toggle('active', a.getAttribute('href')==='#'+hash))
  $$('.bottom-nav a').forEach(a=> a.classList.toggle('active', a.getAttribute('href')==='#'+hash))
}
window.addEventListener('hashchange', render)

// Mock DB in localStorage (for demo only)
const db = JSON.parse(localStorage.getItem('musabaqa-db')||'{}')
db.users = db.users || [{name:'فهد',age:24,city:'الرياض',interests:['الثقافة','التقنية','الرياضة'],points:120}]
db.competitions = db.competitions || [
  {title:'التوعية بالأمن الرقمي', type:'توعوية', ownerName:'وزارة التعليم', city:'الرياض', prize:1000, prizeType:'رقمية', winners:3, requiresCode:true, video:'', createdAt:Date.now()},
  {title:'تحدي شعار المنتج الجديد', type:'تسويقية', ownerName:'شركة تموين الغذاء', city:'جدة', prize:5000, prizeType:'عينية', winners:1, requiresCode:false, video:'', createdAt:Date.now()}
]
db.opportunities = db.opportunities || [{ orgName:'جمعية وطن', title:'مسابقة أسبوع البيئة', description:'حملة توعوية عن تقليل الهدر', prizeBudget:30000 }]
localStorage.setItem('musabaqa-db', JSON.stringify(db))

function renderKPIs(){
  const kpis = [
    {label:'المسابقات النشطة', value:String(db.competitions.length)},
    {label:'مشاركات', value:String(Math.floor(Math.random()*10)+1)},
    {label:'جوائز مُسلَّمة', value:String(2)},
    {label:'رعاة نشطون', value:String(7)},
    {label:'قيمة الجوائز', value: String(db.competitions.reduce((a,c)=>a+Number(c.prize||0),0)) + ' ر.س'},
    {label:'المستخدمون', value:String(db.users.length)},
  ]
  const wrap = $('#kpis'); wrap.innerHTML = ''
  kpis.forEach(k=>{
    const d = document.createElement('div'); d.className='kpi'
    d.innerHTML = `<div style="font-weight:900;font-size:20px">${k.value}</div><div class="small">${k.label}</div>`
    wrap.appendChild(d)
  })
}

function cardHTML(c){
  return `<div class="card">
    <div class="pill">${c.prizeType||'رقمية'}</div>
    <h3 style="margin:4px 0;font-weight:800">${c.title}</h3>
    <div class="small">${c.ownerName||'—'} • ${c.city}</div>
    <div class="small">الجائزة: ${Number(c.prize).toLocaleString()} ر.س • فائزون: ${c.winners||1}</div>
    ${c.requiresCode?'<div class="small" style="color:#b45309">هذه المسابقة تتطلب إدخال رمز يظهر داخل الفيديو/البوست</div>':''}
    <div class="grid-2" style="margin-top:8px">
      ${c.requiresCode?'<input placeholder="ادخل الرمز إن طُلب" data-role="code"/>':''}
      <textarea class="colspan-2" placeholder="اكتب إجابتك بإيجاز" data-role="answer"></textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-accent" data-action="submit">أشارك الآن</button>
      <button class="btn" data-action="share">نسخ رابط المشاركة</button>
    </div>
  </div>`
}

function renderCompetitions(){
  const wrap = $('#cards'); wrap.innerHTML = ''
  db.competitions.slice().reverse().forEach(c=>{
    const container = document.createElement('div')
    container.innerHTML = cardHTML(c)
    const el = container.firstElementChild
    el.querySelector('[data-action="submit"]').addEventListener('click', ()=>{
      const code = el.querySelector('[data-role="code"]')?.value?.trim()
      const answer = el.querySelector('[data-role="answer"]')?.value?.trim()
      if(c.requiresCode && !code){ alert('هذه المسابقة تتطلب رمزًا من الفيديو'); return }
      if(!answer){ alert('اكتب إجابتك بإيجاز'); return }
      alert('تم إرسال المشاركة ✅')
    })
    el.querySelector('[data-action="share"]').addEventListener('click', ()=>{
      navigator.clipboard.writeText(location.origin + location.pathname + '?c=' + encodeURIComponent(c.title))
      alert('تم نسخ رابط المشاركة')
    })
    wrap.appendChild(el)
  })
}

// AI helper (demo)
function aiGenerate(){
  const topic = $('#ai-topic').value || 'موضوع'
  const count = parseInt($('#ai-count').value || '3')
  const list = $('#ai-list'); list.innerHTML=''
  for(let i=1;i<=count;i++){
    const d = document.createElement('div'); d.className='card'
    d.innerHTML = `<div style="font-weight:700">${i}. سؤال حول ${topic}</div>
                   <div class="small">الاختيارات: أ • ب • ج • د</div>`
    list.appendChild(d)
  }
}

// Simple “upload” -> data URL preview (demo only)
function handleAssetInput(file, done){
  const reader = new FileReader()
  reader.onload = e => done({ name:file.name, url:e.target.result })
  reader.readAsDataURL(file)
}
function submitEntity(){
  const title = $('#f-title').value.trim()
  const city  = $('#f-city').value.trim()
  const prize = parseInt($('#f-prize').value || '0')
  const type  = $('#f-type').value
  const winners = parseInt($('#f-winners').value || '1')
  const requiresCode = $('#f-requires').checked
  const video = $('#f-asset').dataset.url || ''
  if(!title){ alert('أدخل عنوان المسابقة'); return }
  db.competitions.push({
    title, type, ownerName:'جهة', city, prize,
    prizeType: type==='رقمية'?'رقمية':'عينية', winners, requiresCode, video, createdAt:Date.now()
  })
  localStorage.setItem('musabaqa-db', JSON.stringify(db))
  alert('تم إنشاء المسابقة ✅'); renderCompetitions(); location.hash='#home'
}

function renderOps(){
  const wrap = $('#ops'); wrap.innerHTML=''
  db.opportunities.forEach(o=>{
    const d=document.createElement('div'); d.className='card'
    d.innerHTML = `<div class="pill">جهة: ${o.orgName}</div>
      <h3 style="font-weight:800">${o.title}</h3>
      <div class="small">${o.description}</div>
      <div style="font-weight:700">ميزانية الجوائز: ${o.prizeBudget.toLocaleString()} ر.س</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <a class="btn btn-accent" href="thanks.html">أرعى هذه المسابقة</a>
        <button class="btn" onclick="navigator.clipboard.writeText(location.href)">نسخ الرابط</button>
      </div>`
    wrap.appendChild(d)
  })
}

document.addEventListener('DOMContentLoaded', ()=>{
  render(); renderKPIs(); renderCompetitions(); renderOps();
  const gen = document.getElementById('ai-generate'); if(gen) gen.addEventListener('click', aiGenerate)
  const input = document.getElementById('f-asset-input'); if(input) input.addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0]; if(!f) return;
    handleAssetInput(f, obj=>{
      const el = document.getElementById('f-asset')
      el.dataset.url = obj.url
      el.innerText = 'تم الرفع ✔︎ ' + obj.name
    })
  })
  const sub = document.getElementById('f-submit'); if(sub) sub.addEventListener('click', submitEntity)
})
