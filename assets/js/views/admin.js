
import { getAuth } from '../auth.js';
import { comps, createComp, submissions, scores } from '../data.js';
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
        <label>يتطلب رمز فتح الأسئلة؟
          <select name="requiresCode"><option value="false">لا</option><option value="true">نعم</option></select>
        </label>
        <label>الرمز (إن وجد)<input class="input" name="code" placeholder="مثال: 1234"></label>
        <label>رابط فيديو تعريفي (اختياري)<input class="input" name="videoUrl" placeholder="https://...mp4"></label>
        <label>ملصقات مفصولة بفواصل<input class="input" name="stickers" placeholder="🔥,✨"></label>
        <label>معايير (الاسم:الوزن مفصولة بفواصل) <input class="input" name="rubric" placeholder="الأثر:0.4,الجدوى:0.3,الابتكار:0.3"></label>
        <label>أسئلة (صيغة مبسطة) <textarea name="form" placeholder="radio:سؤال؟:خيار1|خيار2|...:الصحيح\ncheckbox:سؤال؟:خ1|خ2:خ1&خ2"></textarea></label>
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

    function parseForm(str){
      // line format: type:question:opt1|opt2|...:correct
      // checkbox correct uses &: correct1&correct2
      const out = [];
      (str||'').split('\n').map(s=>s.trim()).filter(Boolean).forEach(line=>{
        const [type,title,opts,correct] = line.split(':');
        const options = (opts||'').split('|').filter(Boolean);
        let corr = correct||'';
        if(type==='checkbox'){ corr = corr.split('&').filter(Boolean); }
        return out.push({ id: Math.random().toString(36).slice(2), type, title, options, correct: corr });
      });
      return out;
    }

    document.getElementById('newComp').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const rubric = (fd.get('rubric')||'').split(',').filter(Boolean).map(x=>{ const [k,w]=x.split(':'); return {k:k?.trim(), w:Number(w)}; });
      const stickers = (fd.get('stickers')||'').split(',').map(s=>s.trim()).filter(Boolean);
      const form = parseForm(fd.get('form'));
      createComp({
        title: fd.get('title'), org: fd.get('org'), category: fd.get('category'),
        status: fd.get('status'), deadline: fd.get('deadline'), brief: fd.get('brief'),
        requiresCode: fd.get('requiresCode')==='true', code: fd.get('code')||'',
        videoUrl: fd.get('videoUrl')||'', stickers, rubric, form
      });
      alert('تمت الإضافة'); location.reload();
    });

    function toCSV(rows, headers){
      const esc = v => `"\${String(v??'').replaceAll('"','""')}"`;
      return [headers.join(','), ...rows.map(r => headers.map(h=>esc(r[h])).join(','))].join('\n');
    }

    document.getElementById('exportCsv').addEventListener('click', ()=>{
      const rows = comps();
      const csv = toCSV(rows, ['id','title','org','category','status','deadline','brief','requiresCode','videoUrl']);
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
