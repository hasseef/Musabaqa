
export default function Home(){
  return `
  <section class="grid grid-2">
    <div class="card">
      <h1>أطلق مسابقاتك باحترافية</h1>
      <p class="muted">إنشاء وإدارة المسابقات، استقبال المشاركات، التحكيم بمعايير موزونة، ولوحة مؤشرات لحظية — في مكان واحد.</p>
      <div class="kpis">
        <div class="kpi"><strong id="kpi-users">1,920</strong><span>مشترك</span></div>
        <div class="kpi"><strong id="kpi-competitions">31</strong><span>مسابقة نشطة</span></div>
        <div class="kpi"><strong id="kpi-judges">84</strong><span>محكّم</span></div>
        <div class="kpi"><strong id="kpi-subms">5,413</strong><span>مشاركة</span></div>
      </div>
      <div style="margin-top:10px">
        <a class="btn" href="#/competitions">ابدأ الآن</a>
      </div>
    </div>
    <div class="card">
      <h3>أهم المزايا</h3>
      <ul>
        <li>نماذج تقديم مرنة مع رفع الملفات</li>
        <li>لوحة تحكيم بالمعايير والأوزان</li>
        <li>دعم الأدوار: مشارك، محكّم، مدير</li>
        <li>تصدير CSV ونسخ احتياطي محلي</li>
        <li>تطبيق ويب متقدم (PWA)</li>
      </ul>
    </div>
  </section>`;
}
