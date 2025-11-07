
import { storage } from './state.js'; import { uid } from './utils.js';
const COMP_KEY='musabaqa_comps', SUBM_KEY='musabaqa_submissions', SCORE_KEY='musabaqa_scores', PRIZE_KEY='musabaqa_prizes'; const FEE_RATE_MAX=0.05;
const seed=[
 {id:'c1',title:'المسابقة الوطنية للابتكار',org:'المنصة',category:'وطني',status:'open',deadline:'2025-12-31',brief:'مسابقة وطنية شاملة مع رعاة وشركاء.',rubric:[{k:'الأثر',w:0.4},{k:'الجدوى',w:0.3},{k:'الابتكار',w:0.3}],requiresCode:false,code:'',videoUrl:'',stickers:['🇸🇦','🌟'],featured:true,budget:200000,feeRate:0.05,form:[{id:'q1',type:'radio',title:'هل الفكرة جديدة؟',options:['نعم','لا'],correct:'نعم'}]},
 {id:'c2',title:'جائزة التصميم الحضري',org:'أمانة المدينة',category:'تصميم',status:'soon',deadline:'2025-12-05',brief:'أفكار لإحياء الساحات العامة.',rubric:[{k:'الجمالية',w:0.35},{k:'الفائدة',w:0.35},{k:'الاستدامة',w:0.3}],requiresCode:false,code:'',videoUrl:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',stickers:['🌿','✨'],featured:false,budget:50000,feeRate:0.03,form:[{id:'q1',type:'radio',title:'المرحلة الحالية',options:['مفهوم','نمذجة ثلاثية','جاهز للتنفيذ'],correct:'نمذجة ثلاثية'}]}
];
export const comps=()=>{let c=storage.read(COMP_KEY); if(!c){storage.write(COMP_KEY,seed); c=seed;} return c}; export const saveComps=a=>storage.write(COMP_KEY,a);
export const submissions=()=>storage.read(SUBM_KEY,[]); export const saveSubmissions=a=>storage.write(SUBM_KEY,a);
export const scores=()=>storage.read(SCORE_KEY,[]); export const saveScores=a=>storage.write(SCORE_KEY,a);
export const prizeClaims=()=>storage.read(PRIZE_KEY,[]); export const savePrizeClaims=a=>storage.write(PRIZE_KEY,a);
export const createComp=p=>{const arr=comps(); const id=uid(); const feeRate=Math.min(Number(p.feeRate??0.05),FEE_RATE_MAX); arr.push({id,requiresCode:false,code:'',videoUrl:'',stickers:[],featured:false,budget:0,feeRate, rubric:[],form:[],...p}); saveComps(arr); return id;};
export const computeFee=(budget,feeRate)=>{const rate=Math.min(feeRate??FEE_RATE_MAX,FEE_RATE_MAX); const b=Number(budget||0); return Math.round(b*rate)};
export const createSubmission=p=>{const arr=submissions(); arr.push({id:uid(),at:Date.now(),winner:false,...p}); saveSubmissions(arr);};
export const markWinner=(submId,isWinner=true)=>{const arr=submissions(); const i=arr.findIndex(s=>s.id===submId); if(i>-1){arr[i].winner=isWinner; saveSubmissions(arr)}};
export const createPrizeClaim=p=>{const arr=prizeClaims(); arr.push({id:uid(),status:'pending',createdAt:Date.now(),...p}); savePrizeClaims(arr)};
export const updatePrizeStatus=(id,status)=>{const arr=prizeClaims(); const i=arr.findIndex(x=>x.id===id); if(i>-1){arr[i].status=status; arr[i].updatedAt=Date.now(); savePrizeClaims(arr)}};


// --- Wallet & Billing ---
const WALLET_KEY='musabaqa_wallet';
export const wallet=()=>storage.read(WALLET_KEY,{balance:0,invoices:[]});
export const saveWallet=w=>storage.write(WALLET_KEY,w);
export function createInvoice(payload){
  const w=wallet();
  w.invoices.push({ id: uid(), status:'unpaid', createdAt: Date.now(), ...payload });
  saveWallet(w);
}
export function markInvoicePaid(id){
  const w=wallet(); const i=w.invoices.findIndex(x=>x.id===id);
  if(i>-1){ w.invoices[i].status='paid'; w.invoices[i].paidAt=Date.now(); w.balance+=Number(w.invoices[i].amount||0); saveWallet(w); }
}

// --- Media Stories for featured comps (client-only demo) ---
export function featuredStories(){
  return comps().filter(c=>c.featured).map(c=>({ id: c.id, title: c.title, slides:[ {type:'cover', text:c.title}, {type:'text', text:c.brief}, {type:'cta', text:'قدّم الآن', href:'#/submit/'+c.id} ] }));
}
