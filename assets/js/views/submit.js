
import { getAuth } from '../auth.js';
import { comps, createSubmission } from '../data.js';

function renderQuestion(q){
  if(q.type==='radio'){
    return `<div class="mcq-card"><p class="mcq-title">${q.title}</p>
      ${q.options.map((opt,i)=>`<label class="option"><input type="radio" name="${q.id}" value="${opt}" ${i===0?'checked':''}> <span>${opt}</span></label>`).join('')}
    </div>`;
  }
  if(q.type==='checkbox'){
    return `<div class="mcq-card"><p class="mcq-title">${q.title}</p>
      ${q.options.map((opt)=>`<label class="option"><input type="checkbox" name="${q.id}" value="${opt}"> <span>${opt}</span></label>`).join('')}
    </div>`;
  }
  if(q.type==='select'){
    return `<div class="mcq-card"><p class="mcq-title">${q.title}</p>
      <select class="input" name="${q.id}">
        ${q.options.map(opt=>`<option>${opt}</option>`).join('')}
      </select>
    </div>`;
  }
  return '';
}

export default function Submit([id]){
  const c = comps().find(x=>x.id===id);
  if(!c) throw new Error("المسابقة غير موجودة");
  const mcq = (c.form||[]).map(renderQuestion).join('') || '<p class="muted">لا توجد أسئلة إضافية.</p>';
  return `
  <section class="grid">
    <div class="card">
      <h2>تقديم مشاركة — ${c.title}</h2>
      <form id="submForm" class="grid">
        <div class="mcq-card">
          <h3 class="mcq-title">بيانات المشاركة</h3>
          <label>عنوان المشاركة
            <input class="input" name="title" required placeholder="اكتب عنوانًا واضحًا">
          </label>
          <label>ملخص
            <textarea name="summary" required placeholder="ملخص قصير عن الفكرة/العمل"></textarea>
          </label>
          <label>رابط العرض (اختياري)
            <input class="input" name="link" type="url" placeholder="https://">
          </label>
          <label>ملف مرفق (اختياري)
            <input class="input" name="file" type="file" accept=".pdf,.ppt,.zip,.png,.jpg">
          </label>
        </div>

        <div class="card">
          <h3>أسئلة اختيارية لتسهيل التحكيم</h3>
          <div class="grid">${mcq}</div>
        </div>

        <button class="btn">إرسال</button>
        <p class="note muted">* تحفظ البيانات محليًا لأغراض العرض فقط.</p>
      </form>
    </div>
  </section>
  <script type="module">
    import { getAuth } from '../auth.js';
    import { createSubmission, comps } from '../data.js';
    const form = document.getElementById('submForm');
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const u = getAuth();
      if(!u){ alert('فضلاً سجّل دخولك أولاً'); return; }
      const fd = new FormData(form);
      let fileMeta = null;
      const file = fd.get('file');
      if(file && file.name) fileMeta = { name:file.name, size:file.size, type:file.type };

      // collect MCQ answers
      const comp = comps().find(x=>x.id==="${id}");
      const answers = {};
      (comp.form||[]).forEach(q => {
        if(q.type==='checkbox'){
          answers[q.id] = [...form.querySelectorAll(`input[name="${q.id}"]:checked`)].map(i=>i.value);
        }else{
          answers[q.id] = fd.get(q.id);
        }
      });

      createSubmission({
        compId: "${id}",
        author: u.email,
        title: fd.get('title'),
        summary: fd.get('summary'),
        link: fd.get('link') || "",
        file: fileMeta,
        mcq: answers
      });
      alert('تم إرسال المشاركة بنجاح');
      location.hash = '#/dashboard';
    });
  </script>
  `;
}
