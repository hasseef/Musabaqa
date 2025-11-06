
import { getAuth, requireRole } from '../auth.js';
import { submissions, comps, upsertScore, scores } from '../data.js';

export default function Judge(){
  try{ requireRole(); }catch{ return '<div class="card"><p>فضلاً سجّل الدخول للوصول إلى منطقة التحكيم.</p></div>'; }
  const u = getAuth();
  if(u.role!=='judge' && u.role!=='admin') return '<div class="card"><p>هذه المنطقة للمحكّمين فقط.</p></div>';
  const list = submissions();
  if(!list.length) return '<div class="card"><p>لا توجد مشاركات للتحكيم حالياً.</p></div>';
  const html = list.map(s => {
    const c = comps().find(x=>x.id===s.compId);
    const rubric = c.rubric.map(r => {
      const id = `${s.id}-${r.k}`;
      return `<label>${r.k} (${Math.round(r.w*100)}%)
        <input class="input" type="number" id="${id}" min="0" max="100" step="5" placeholder="من 0 إلى 100">
      </label>`;
    }).join('');
    return `<div class="card">
      <h3>${s.title}</h3>
      <p class="muted">${c.title} — بواسطة ${s.author}</p>
      <p>${s.summary}</p>
      ${s.link? `<p><a class="link" href="${s.link}" target="_blank" rel="noopener">رابط العرض</a></p>` : ''}
      <form data-subm="${s.id}" data-comp="${c.id}" class="scoreForm grid">${rubric}
        <button class="btn">حفظ التقييم</button>
      </form>
    </div>`;
  }).join('');

  return `<section class="grid">${html}</section>
  <script type="module">
    import { upsertScore } from '../data.js';
    const forms = document.querySelectorAll('.scoreForm');
    forms.forEach(f => f.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(f);
      const submId = f.dataset.subm;
      const compId = f.dataset.comp;
      const rows = [...f.querySelectorAll('input[type=number]')].map(i=>({k:i.id.split('-').slice(1).join('-'), v:Number(i.value||0)}));
      upsertScore({ compId, submId, judge: "${u.email}", scores: rows });
      alert('تم حفظ التقييم');
    }));
  </script>`;
}
