
import { getAuth } from '../auth.js';
import { submissions, comps } from '../data.js';
import { fmtDate } from '../utils.js';

export default function Dashboard(){
  const u = getAuth();
  if(!u) return `<div class="card"><p>فضلاً سجّل الدخول للوصول إلى لوحة المستخدم.</p></div>`;
  const mine = submissions().filter(s => s.author===u.email);
  const rows = mine.map(m => {
    const c = comps().find(x=>x.id===m.compId);
    return `<tr><td>${c?.title ?? '-'}</td><td>${m.title}</td><td>${fmtDate(m.at)}</td></tr>`;
  }).join('') || `<tr><td colspan="3" class="muted">لا توجد مشاركات بعد.</td></tr>`;
  return `
  <section class="grid">
    <div class="card">
      <h2>لوحة المستخدم</h2>
      <table class="table">
        <thead><tr><th>المسابقة</th><th>العنوان</th><th>التاريخ</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="row" style="margin-top:8px">
        <a class="btn" href="#/competitions">قدّم إلى مسابقة</a>
      </div>
    </div>
  </section>`;
}
