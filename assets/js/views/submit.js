
import { getAuth } from '../auth.js';
import { comps, createSubmission } from '../data.js';

function renderQuestion(q){
  if(q.type==='radio'){
    return `<div class="card"><p class="mcq-title">${q.title}</p>
      ${q.options.map((opt,i)=>`<label class="option"><input type="radio" name="${q.id}" value="${opt}" ${i===0?'checked':''}> <span>${opt}</span></label>`).join('')}
    </div>`;
  }
  if(q.type==='checkbox'){
    return `<div class="card"><p class="mcq-title">${q.title}</p>
      ${q.options.map((opt)=>`<label class="option"><input type="checkbox" name="${q.id}" value="${opt}"> <span>${opt}</span></label>`).join('')}
    </div>`;
  }
  if(q.type==='select'){
    return `<div class="card"><p class="mcq-title">${q.title}</p>
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
        <div class="card">
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
          <h3>أسئلة اختيار من متعدد</h3>
          <div id="gateWrap"></div>
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

    const comp = comps().find(x=>x.id="${id}");
    const gateWrap = document.getElementById('gateWrap');
    if(comp.requiresCode){
      gateWrap.innerHTML = \`<label>أدخل الرمز الموجود في المرفق
        <input class="input" id="gateCode" placeholder="أدخل الرمز المطلوب">
      </label>\`;
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const u = getAuth();
      if(!u){ alert('فضلاً سجّل دخولك أولاً'); return; }
      const fd = new FormData(form);
      let fileMeta = null;
      const file = fd.get('file');
      if(file && file.name) fileMeta = { name:file.name, size:file.size, type:file.type };

      if(comp.requiresCode){
        const val = document.getElementById('gateCode')?.value?.trim()||'';
        if(val !== comp.code){
          alert('الرمز غير صحيح — راجع المرفق الخاص بالمسابقة');
          return;
        }
      }

      // Validate MCQ correct answers
      const answers = {};
      let valid = true;
      (comp.form||[]).forEach(q => {
        if(q.type==='checkbox'){
          const arr = [...form.querySelectorAll(\`input[name="\${q.id}"]:checked\`)].map(i=>i.value);
          answers[q.id] = arr;
          if(Array.isArray(q.correct)){
            const a = [...arr].sort().join('|'), b = [...q.correct].sort().join('|');
            if(a!==b){ valid = false; }
          }
        }else{
          const v = fd.get(q.id);
          answers[q.id] = v;
          if(q.correct && v !== q.correct){ valid = false; }
        }
      });
      if(!valid){ alert('بعض الإجابات غير صحيحة. يرجى المراجعة.'); return; }

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
