
import { comps } from '../data.js';
import { fmtDate } from '../utils.js';

export default function Competitions(){
  const list = comps();
  const cards = list.map(c => `
    <div class="card">
      <h3>${c.title}</h3>
      <p class="muted">${c.org} • ${c.category}</p>
      <p>${c.brief}</p>
      <div class="row" style="margin-top:8px">
        <span class="badge badge--${c.status}">${c.status==='open'?'مفتوحة':c.status==='soon'?'قريباً':'مغلقة'}</span>
        <div class="row">
          <a class="btn btn--light" href="#/submit/${c.id}">قدّم الآن</a>
          <a class="btn" href="#/details/${c.id}">التفاصيل</a>
        </div>
      </div>
      <small class="muted">آخر موعد: ${fmtDate(c.deadline)}</small>
    </div>
  `).join('');
  return `<section class="grid grid-3">${cards}</section>`;
}
