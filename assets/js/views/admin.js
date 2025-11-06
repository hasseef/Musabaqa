
import { getAuth } from '../auth.js';
import { comps, createComp, saveComps, submissions, scores } from '../data.js';
import { fmtDate, downloadFile } from '../utils.js';

export default function Admin(){
  const u = getAuth();
  if(!u) return '<div class="card"><p>فضلاً سجّل الدخول.</p></div>';
  if(u.role!=='admin') return '<div class="card"><p>هذه المنطقة للمدراء فقط.</p></div>';

  const list = comps();
  const rows = list.map(c => `
    <tr>
      <td>${c.title}</td>
      <td>${c.org}</td>
      <td>${c.category}</td>
      <td>${c.status}</td>
      <td>${fmtDate(c.deadline)}</td>
    </tr>`).join('');

  return `
  <section class="grid">
    <div class="card">
      <h2>إدارة المسابقات</h2>
      <form id="newComp" class="grid grid-2">
        <label>العنوان<input class="input" name="title" required></label>
        <label>الجهة<input class="input" name="org" required></label>
        <label>الفئة<input class="input" name="category" required></label>
        <label>الحالة
          <select name="status">
            <option value="open">مفتوحة</option>
            <option value="soon">قريباً</option>
            <option value="closed">مغلقة</option>
          </select>
        </label>
        <label>آخر موعد<input class="input" name="deadline" type="date" required></label>
        <label>وصف موجز<textarea name="brief" required></textarea></label>
        <label>معايير (صيغة: الاسم:الوزن مفصولة بفواصل) 
          <input class="input" name="rubric" placeholder="الأثر:0.4,الجدوى:0.3,الابتكار:0.3">
        </label>
        <button class="btn">إضافة</button>
      </form>
    </div>

    <div class="card">
      <h3>القائمة الحالية</h3>
      <table class="table">
        <thead><tr><th>العنوان</th><th>الجهة</th><th>الفئة</th><th>الحالة</th><th>الحد النهائي</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="row">
        <button class="btn btn--light" id="exportCsv">تصدير CSV</button>
      </div>
    </div>
  </section>

  <section class="grid">
    <div class="card">
      <h3>تقارير سريعة</h3>
      <div class="row">
        <button class="btn" id="exportScores">تصدير نتائج التحكيم CSV</button>
        <button class="btn btn--light" id="exportSubs">تصدير المشاركات CSV</button>
      </div>
    </div>
  </section>

  <script type="module">
    import { createComp, comps, submissions, scores } from '../data.js';
    import { downloadFile } from '../utils.js';

    document.getElementById('newComp').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const rubricStr = fd.get('rubric') || '';
      const rubric = rubricStr.split(',').filter(Boolean).map(x=>{
        const [k,w] = x.split(':'); return {k:k?.trim(), w:Number(w)};
      });
      createComp({
        title: fd.get('title'), org: fd.get('org'), category: fd.get('category'),
        status: fd.get('status'), deadline: fd.get('deadline'), brief: fd.get('brief'), rubric
      });
      alert('تمت الإضافة'); location.reload();
    });

    function toCSV(rows, headers){
      const esc = v => `"\${String(v??'').replaceAll('"','""')}"`;
      return [headers.join(','), ...rows.map(r => headers.map(h=>esc(r[h])).join(','))].join('\n');
    }

    document.getElementById('exportCsv').addEventListener('click', ()=>{
      const rows = comps();
      const csv = toCSV(rows, ['id','title','org','category','status','deadline','brief']);
      downloadFile('competitions.csv', csv);
    });

    document.getElementById('exportSubs').addEventListener('click', ()=>{
      const rows = submissions();
      const csv = toCSV(rows, ['id','compId','author','title','summary','link','at']);
      downloadFile('submissions.csv', csv);
    });

    document.getElementById('exportScores').addEventListener('click', ()=>{
      const rows = scores();
      const csv = toCSV(rows.flatMap(r => r.scores.map(s => ({
        compId: r.compId, submId: r.submId, judge: r.judge, criterion: s.k, value: s.v
      }))), ['compId','submId','judge','criterion','value']);
      downloadFile('scores.csv', csv);
    });
  </script>
  `;
}
