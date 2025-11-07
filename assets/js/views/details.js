
import { comps } from '../data.js'; import { fmtDate, pct } from '../utils.js';
export default function Details([id]){ const c=comps().find(x=>x.id===id); if(!c) throw new Error('المسابقة غير موجودة');
  const rubric=c.rubric.map(r=>`<li>${r.k} — ${(r.w*100).toFixed(0)}%</li>`).join('');
  const funding = c.needsSponsorship? `<div class='card'><h3>حالة التمويل</h3><p>مطلوب: <b>${c.funding?.required||0}</b> • مُجمّع: <b>${c.funding?.collected||0}</b> • متبقي: <b>${Math.max(0,(c.funding?.required||0)-(c.funding?.collected||0))}</b></p><div class='progress'><span style='width:${pct(c.funding?.collected||0,c.funding?.required||0)}%'></span></div><div class='row' style='margin-top:8px'><a class='btn' href='#/sponsor-market'>رعاية هذه المسابقة</a></div></div>`:'';
  return `<section class="grid"><div class="card"><h2>${c.title} ${c.featured?'<span class="badge badge--featured">مسابقة وطنية</span>':''}</h2><p class="muted">${c.org} • ${c.category}</p><p>${c.brief}</p><p><strong>آخر موعد:</strong> ${fmtDate(c.deadline)}</p><a class="btn" href="#/submit/${c.id}">قدّم مشاركتك</a></div><div class="card"><h3>معايير التحكيم</h3><ul>${rubric}</ul></div>${funding}</section>`; }
