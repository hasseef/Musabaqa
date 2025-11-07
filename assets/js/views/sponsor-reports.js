import { pledges, wallet, comps } from '../data.js';
import { fmtDate } from '../utils.js';
export default function SponsorReports(){
  const ps = pledges();
  const w = wallet();
  const byComp = {};
  ps.forEach(p=>{ byComp[p.compId] = byComp[p.compId] || {amount:0,count:0}; byComp[p.compId].amount += Number(p.amount||0); byComp[p.compId].count += 1; });
  const compMap = Object.fromEntries(comps().map(c=>[c.id,c.title]));
  const rows = Object.entries(byComp).map(([cid,stat])=>`<tr><td>${cid}</td><td>${compMap[cid]||'-'}</td><td>${stat.count}</td><td>${stat.amount}</td></tr>`).join('') || `<tr><td colspan="4" class="muted">لا توجد بيانات حالياً.</td></tr>`;
  const invPaid = (w.invoices||[]).filter(i=>i.type==='SPONSOR_PLEDGE' && i.status==='paid');
  const totalPaid = invPaid.reduce((s,i)=>s+Number(i.amount||0),0);
  const totalPending = (w.invoices||[]).filter(i=>i.type==='SPONSOR_PLEDGE' && i.status!=='paid').reduce((s,i)=>s+Number(i.amount||0),0);
  return `<section class='grid'>
    <div class='card'>
      <h2>تقارير الرعاة</h2>
      <div class='kpis'>
        <div class='kpi'><strong>${ps.length}</strong><span>تعهدات</span></div>
        <div class='kpi'><strong>${invPaid.length}</strong><span>تعهدات مدفوعة</span></div>
        <div class='kpi'><strong>${totalPaid}</strong><span>إجمالي مدفوع</span></div>
        <div class='kpi'><strong>${totalPending}</strong><span>قيد السداد</span></div>
      </div>
      <h3 style='margin-top:10px'>حسب المسابقة</h3>
      <table class='table'><thead><tr><th>معرّف</th><th>المسابقة</th><th>عدد التعهدات</th><th>المبلغ</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
  </section>`;
}
