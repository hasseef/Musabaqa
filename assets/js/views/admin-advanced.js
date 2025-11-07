
import { comps, wallet, pledges, computeFee } from '../data.js';
import { fmtDate } from '../utils.js';

function num(n){ return Number(n||0); }
function sum(arr, pick){ return arr.reduce((s,x)=>s+num(pick(x)),0); }

export default function AdminAdvanced(){
  const cs = comps();
  const w = wallet();
  const ps = pledges();

  const invs = w.invoices||[];
  const k_totalComps = cs.length;
  const k_open = cs.filter(c=>c.status==='open').length;
  const k_soon = cs.filter(c=>c.status==='soon').length;
  const k_closed = cs.filter(c=>c.status==='closed').length;
  const k_invoices = invs.length;
  const k_paidSum = sum(invs.filter(i=>i.status==='paid'), i=>i.amount);
  const k_pendingSum = sum(invs.filter(i=>i.status!=='paid'), i=>i.amount);
  const k_pledges = ps.length;
  const k_pledgesSum = sum(ps, p=>p.amount);
  const feeSum = cs.reduce((s,c)=> s + computeFee(c.budget, c.feeRate), 0);

  const rowsInv = invs.map(i=>`<tr><td>${i.id.slice(0,6)}</td><td>${i.title||'-'}</td><td>${i.amount||0}</td><td>${i.status}</td><td>${fmtDate(i.createdAt)}</td></tr>`).join('') || `<tr><td colspan="5" class="muted">لا توجد فواتير.</td></tr>`;
  const rowsComp = cs.map(c=>`<tr><td>${c.id}</td><td>${c.title}</td><td>${c.status}</td><td>${c.budget||0}</td><td>${computeFee(c.budget,c.feeRate)}</td></tr>`).join('') || `<tr><td colspan="5" class="muted">لا توجد مسابقات.</td></tr>`;

  return `<section class='grid'>
    <div class='card'>
      <h2>لوحة المدير المتقدمة</h2>
      <div class='kpis'>
        <div class='kpi'><strong>${k_totalComps}</strong><span>المسابقات</span></div>
        <div class='kpi'><strong>${k_open}/${k_soon}/${k_closed}</strong><span>مفتوحة/قريبًا/مغلقة</span></div>
        <div class='kpi'><strong>${w.balance}</strong><span>رصيد المحفظة</span></div>
        <div class='kpi'><strong>${k_invoices}</strong><span>فواتير</span></div>
        <div class='kpi'><strong>${k_paidSum}</strong><span>مدفوع</span></div>
        <div class='kpi'><strong>${k_pendingSum}</strong><span>قيد السداد</span></div>
        <div class='kpi'><strong>${k_pledges}</strong><span>تعهدات</span></div>
        <div class='kpi'><strong>${k_pledgesSum}</strong><span>إجمالي التعهدات</span></div>
        <div class='kpi'><strong>${feeSum}</strong><span>عمولة متوقعة</span></div>
      </div>
    </div>
    <div class='card'>
      <h3>الفواتير</h3>
      <table class='table'><thead><tr><th>#</th><th>العنوان</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>${rowsInv}</tbody></table>
    </div>
    <div class='card'>
      <h3>المسابقات</h3>
      <table class='table'><thead><tr><th>ID</th><th>العنوان</th><th>الحالة</th><th>الميزانية</th><th>عمولة</th></tr></thead><tbody>${rowsComp}</tbody></table>
    </div>
  </section>`;
}
