
import { storage } from './state.js'; import { uid } from './utils.js';
const COMP_KEY='musabaqa_comps', SUBM_KEY='musabaqa_submissions', SCORE_KEY='musabaqa_scores', PRIZE_KEY='musabaqa_prizes';
const WALLET_KEY='musabaqa_wallet', PLEDGE_KEY='musabaqa_pledges'; const FEE_RATE_MAX=0.05;
const seed=[
 {id:'c1',title:'المسابقة الوطنية للابتكار',org:'المنصة',category:'وطني',status:'open',deadline:'2025-12-31',brief:'مسابقة وطنية شاملة مع رعاة وشركاء.',rubric:[{k:'الأثر',w:0.4},{k:'الجدوى',w:0.3},{k:'الابتكار',w:0.3}],budget:200000,feeRate:0.05,needsSponsorship:true,funding:{required:150000,collected:30000,pledges:[]}},
 {id:'c2',title:'جائزة التصميم الحضري',org:'أمانة المدينة',category:'تصميم',status:'soon',deadline:'2025-12-05',brief:'أفكار لإحياء الساحات العامة.',rubric:[{k:'الجمالية',w:0.35},{k:'الفائدة',w:0.35},{k:'الاستدامة',w:0.3}],budget:50000,feeRate:0.03,needsSponsorship:false,funding:{required:0,collected:0,pledges:[]}}
];
export const comps=()=>{let c=storage.read(COMP_KEY); if(!c){storage.write(COMP_KEY,seed); c=seed;} return c}; export const saveComps=a=>storage.write(COMP_KEY,a);
export const submissions=()=>storage.read(SUBM_KEY,[]); export const saveSubmissions=a=>storage.write(SUBM_KEY,a);
export const scoresStore=()=>storage.read(SCORE_KEY,[]); export const saveScores=a=>storage.write(SCORE_KEY,a);
export const prizeClaims=()=>storage.read(PRIZE_KEY,[]); export const savePrizeClaims=a=>storage.write(PRIZE_KEY,a);
export const wallet=()=>storage.read(WALLET_KEY,{balance:0,invoices:[]}); export const saveWallet=w=>storage.write(WALLET_KEY,w);
export const pledges=()=>storage.read(PLEDGE_KEY,[]); export const savePledges=p=>storage.write(PLEDGE_KEY,p);
export const computeFee=(budget,feeRate)=>{const rate=Math.min(feeRate??FEE_RATE_MAX,FEE_RATE_MAX); const b=Number(budget||0); return Math.round(b*rate)};
export const INVOICE_TYPES={ SPONSOR_PLEDGE:'SPONSOR_PLEDGE', SPONSOR_PACKAGE:'SPONSOR_PACKAGE', SELF_FUND:'SELF_FUND' };
export function createInvoice(payload){ const w=wallet(); w.invoices.push({ id: uid(), status: payload.status||'unpaid', createdAt: Date.now(), paymentMethod: payload.paymentMethod||null, paymentUrl: payload.paymentUrl||null, ...payload }); saveWallet(w); }
