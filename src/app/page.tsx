'use client'
import { useEffect, useState } from "react";
type KPI = { label: string, value: string };
export default function Page(){
  const [kpis, setKpis] = useState<KPI[]>([]);
  useEffect(()=>{ fetch('/api/kpis').then(r=>r.json()).then(setKpis).catch(()=>setKpis([])); },[]);
  return (
    <section className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3 items-center">
        <div>
          <span className="ribbon">هوية جديدة • متوافقة مع رؤية 2030</span>
          <h1 className="text-3xl font-black mt-2">مسابقة — خيارك الأمثل للمسابقات <span className="text-primary">التوعوية</span> و<span className="text-secondary">التسويقية</span></h1>
          <p className="text-slate-600">استهداف دقيق + فيديوهات قصيرة + رمز دخول من الفيديو + مشاركة داخلية وخارجية + نظام نقاط.</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <a href="/individual" className="btn-accent">ابدأ التحدي (فرد)</a>
            <a href="/entity" className="btn">للجهات الحكومية/غير الربحية</a>
            <a href="/sponsor" className="btn">للرعاة والشركات</a>
            <a href="/investor" className="btn">لوحة المستثمر</a>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="pill">استهداف دقيق</span>
            <span className="pill">رمز من الفيديو</span>
            <span className="pill">نقاط وولاء</span>
            <span className="pill">تقارير ROI</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {kpis.length? kpis.map((k,i)=>(
            <div key={i} className="kpi"><div className="text-xl font-black">{k.value}</div><div className="text-slate-500 text-sm">{k.label}</div></div>
          )) : Array.from({length:6}).map((_,i)=>(<div key={i} className="kpi"><div className="h-6 bg-slate-200 rounded mb-1" /><div className="h-4 bg-slate-100 rounded" /></div>))}
        </div>
      </div>
    </section>
  );
}
