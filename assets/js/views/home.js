
export default function Home(){
  return `
  <section class="grid grid-2">
    <div class="card">
      <h1>أطلق مسابقاتك باحترافية</h1>
      <p class="muted">إدارة المسابقات، استقبال المشاركات، التحكيم بمعايير موزونة، فيديوهات وملصقات — تجربة مهيأة للجوال كتطبيق.</p>
      <div class="kpis">
        <div class="kpi"><strong>2,150</strong><span>مشترك</span></div>
        <div class="kpi"><strong>35</strong><span>مسابقة نشطة</span></div>
        <div class="kpi"><strong>92</strong><span>محكّم</span></div>
        <div class="kpi"><strong>5,980</strong><span>مشاركة</span></div>
      </div>
      <div style="margin-top:10px">
        <a class="btn" href="#/competitions">ابدأ الآن</a>
      </div>
    </div>
    <div class="card">
      <h3>أهم المزايا</h3>
      <ul>
        <li>نموذج تقديم بخطوات مع أسئلة اختيار من متعدد</li>
        <li>رمز اختياري من مرفق المنظّم لفتح الأسئلة</li>
        <li>وسائط فيديو وملصقات مرفقة للمسابقة</li>
        <li>أدوار: مشارك / محكّم / مدير</li>
        <li>PWA + Bottom Nav للجوال</li>
      </ul>
    </div>
  </section>`;
}
