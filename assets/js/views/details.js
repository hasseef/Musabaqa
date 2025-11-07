
import { comps } from '../data.js';
import { fmtDate } from '../utils.js';

export default function Details([id]){
  const c = comps().find(x=>x.id===id);
  if(!c) throw new Error("المسابقة غير موجودة");
  const rubric = c.rubric.map(r=>`<li>${r.k} — وزن ${(r.w*100).toFixed(0)}%</li>`).join('');
  return `
    <section class="grid">
      <div class="card">
        <h2>${c.title}</h2>
        <p class="muted">${c.org} • ${c.category}</p>
        <p>${c.brief}</p>
        <p><strong>آخر موعد:</strong> ${fmtDate(c.deadline)}</p>
        <p class="muted">${c.requiresCode ? '🔐 هذه المسابقة تتطلب رمزًا من مرفق المنظّم لفتح نموذج الأسئلة.' : ''}</p>
        <a class="btn" href="#/submit/${c.id}">قدّم مشاركتك</a>
      </div>
      <div class="card">
        <h3>معايير التحكيم</h3>
        <ul>${rubric}</ul>
      </div>
      ${c.videoUrl ? `<div class="card"><h3>مقطع تعريفي</h3><video controls playsinline style="width:100%;border-radius:12px"><source src="${c.videoUrl}"></video></div>` : ''}
      ${c.stickers?.length ? `<div class="card"><h3>ملصقات</h3><div class="row">` + c.stickers.map(s=>`<span class="badge">${s}</span>`).join('') + `</div></div>` : ''}
    </section>
  `;
}
