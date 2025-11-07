
import { comps, computeFee } from '../data.js'; import { fmtDate, pct } from '../utils.js';
export default function Competitions(){ const list=comps(); const cards=list.map(c=>{ const prog = c.needsSponsorship? `<div class='progress' title='تمويل: ${c.funding?.collected||0}/${c.funding?.required||0}'><span style='width:${pct(c.funding?.collected||0, c.funding?.required||0)}%'></span></div>` : ''; return `
  <div class="card">
    <h3>${c.title} ${c.featured?'<span class="badge badge--featured">مسابقة وطنية</span>':''}</h3>
    <p class="muted">${c.org} • ${c.category}</p>
    <p>${c.brief}</p>
    ${prog}
    <p class="muted">${c.videoUrl?'🎬 فيديو • ':''}${(c.stickers?.length||0)>0?'🎟️ ملصقات':''}</p>
    <div class="row" style="margin-top:8px">
      <span class="badge badge--${c.status}">${c.status==='open'?'مفتوحة':c.status==='soon'?'قريباً':'مغلقة'}</span>
      <div class="row">
        <a class="btn btn--light" href="#/submit/${c.id}">قدّم الآن</a>
        <a class="btn" href="#/details/${c.id}">التفاصيل</a>
      </div>
    </div>
    <small class="muted">آخر موعد: ${fmtDate(c.deadline)} • عمولة المنصة: ${computeFee(c.budget,c.feeRate)} ريال</small>
  </div>`}).join(''); return `<section class="grid grid-3">${cards}</section>`; }
