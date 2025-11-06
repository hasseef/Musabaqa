
import { storage } from './state.js';
import { uid } from './utils.js';

const COMP_KEY = "musabaqa_comps";
const SUBM_KEY = "musabaqa_submissions";
const SCORE_KEY = "musabaqa_scores";

const seed = [
  // Each competition now has an optional 'form' with MCQ questions

  { id:"c1", title:"تحدي الابتكار الصحي", org:"وزارة الصحة", category:"ابتكار", status:"open", deadline:"2025-12-20", brief:"حلول رقمية لتحسين تجربة المرضى.", rubric:[{k:"الأثر",w:0.4},{k:"الجدوى",w:0.3},{k:"الابتكار",w:0.3}], form:[{id:'q1',type:'radio',title:'ما مرحلة نضج الحل؟',options:['فكرة','نموذج أولي','منتج أولي (MVP)','جاهز للإطلاق']},{id:'q2',type:'checkbox',title:'المجالات التي يغطيها الحل:',options:['المواعيد','السجلات الصحية','الطوارئ','الصيدلة']},{id:'q3',type:'select',title:'حجم الفريق',options:['فرد','2-5','6-10','أكثر من 10']}] },
  { id:"c2", title:"جائزة التصميم الحضري", org:"أمانة المدينة", category:"تصميم", status:"soon", deadline:"2025-12-05", brief:"أفكار لإحياء الساحات العامة.", rubric:[{k:"الجمالية",w:0.35},{k:"الفائدة",w:0.35},{k:"الاستدامة",w:0.3}], form:[{id:'q1',type:'radio',title:'المرحلة الحالية',options:['مفهوم','رسومات أولية','نمذجة ثلاثية','جاهز للتنفيذ']},{id:'q2',type:'checkbox',title:'عناصر التصميم',options:['ممرات مشاة','مساحات خضراء','إضاءة ليلية','أماكن جلوس']}] },
  { id:"c3", title:"مسابقة الأبحاث الرقمية", org:"جامعة المعرفة", category:"بحث علمي", status:"open", deadline:"2026-01-10", brief:"أبحاث الذكاء الاصطناعي وتطبيقاته.", rubric:[{k:"الأصالة",w:0.4},{k:"المنهجية",w:0.3},{k:"التطبيق",w:0.3}], form:[{id:'q1',type:'radio',title:'نوع الدراسة',options:['نظرية','تطبيقية','دراسة حالة']},{id:'q2',type:'select',title:'مجال البيانات',options:['نصوص','صور','أصوات','بيانات مهيكلة']}] }
];

export function comps(){
  let c = storage.read(COMP_KEY);
  if(!c){ storage.write(COMP_KEY, seed); c = seed; }
  return c;
}

export function saveComps(arr){ storage.write(COMP_KEY, arr); }

export function submissions(){ return storage.read(SUBM_KEY, []); }
export function saveSubmissions(arr){ storage.write(SUBM_KEY, arr); }

export function scores(){ return storage.read(SCORE_KEY, []); }
export function saveScores(arr){ storage.write(SCORE_KEY, arr); }

export function createComp(payload){
  const arr = comps();
  const id = uid();
  arr.push({ id, ...payload });
  saveComps(arr);
  return id;
}

export function createSubmission(payload){
  const arr = submissions();
  arr.push({ id: uid(), at: Date.now(), ...payload });
  saveSubmissions(arr);
}

export function upsertScore(payload){
  const arr = scores();
  const idx = arr.findIndex(s => s.compId===payload.compId && s.submId===payload.submId && s.judge===payload.judge);
  if(idx>-1) arr[idx] = payload; else arr.push(payload);
  saveScores(arr);
}
