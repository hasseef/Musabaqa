
import { storage } from './state.js';
const AUTH_KEY="musabaqa_auth"; const USERS_KEY="musabaqa_users"; const DEMO={user:'admin',pass:'M1234'};
export const getAuth=()=>storage.read(AUTH_KEY); export const setAuth=u=>{storage.write(AUTH_KEY,u);dispatchEvent(new CustomEvent('authchange',{detail:u}))}; export const clearAuth=()=>{storage.del(AUTH_KEY);dispatchEvent(new CustomEvent('authchange',{detail:null}))};
export const users=()=>storage.read(USERS_KEY,{}); export const saveUsers=u=>storage.write(USERS_KEY,u);
export const labelRole=r=>r==='participant'?'مشارك':r==='judge'?'محكّم':'مدير';
export const labelAccount=t=>({individual:'الأفراد',sponsor:'الرعاة',government:'الجهات الحكومية',nonprofit:'الجهات غير الربحية',company:'الشركات',investor:'المستثمرين'})[t]??t;
export function initAuthUI(){
  const authBtn=document.getElementById('authBtn'); const modal=document.getElementById('authModal'); const form=document.getElementById('authForm');
  const title=document.getElementById('authTitle'); const toggle=document.getElementById('toggleAuth'); const isNew=document.getElementById('isNew');
  const email=document.getElementById('email'); const password=document.getElementById('password'); const role=document.getElementById('role'); const accountType=document.getElementById('accountType');
  const roleNav=document.getElementById('roleNav'); const roleInfo=document.getElementById('roleInfo'); const judgeTab=document.getElementById('judgeTab'); const adminTab=document.getElementById('adminTab'); const prizeTab=document.getElementById('prizeTab');
  function upd(u){ if(u){ authBtn.textContent=`مرحبًا، ${u.email} (${labelAccount(u.accountType)} • ${labelRole(u.role)})`; authBtn.classList.remove('btn--ghost'); authBtn.onclick=()=>{ if(confirm('تسجيل الخروج؟')) clearAuth(); }; roleNav.hidden=false; roleInfo.textContent=`الحساب: ${labelAccount(u.accountType)} • الدور: ${labelRole(u.role)}`; judgeTab.hidden=u.role!=='judge'&&u.role!=='admin'; adminTab.hidden=u.role!=='admin'; prizeTab.hidden=false; } else { authBtn.textContent='دخول / تسجيل'; authBtn.classList.add('btn--ghost'); authBtn.onclick=()=>modal.showModal(); roleNav.hidden=true; } }
  upd(getAuth()); addEventListener('authchange',e=>upd(e.detail));
  document.getElementById('quickLogins')?.addEventListener('click',e=>{const b=e.target.closest('button[data-role]'); if(!b) return; const r=b.dataset.role; email.value=DEMO.user; password.value=DEMO.pass; role.value=r; });
  toggle?.addEventListener('click',ev=>{ev.preventDefault(); isNew.checked=!isNew.checked; title.textContent=isNew.checked?'إنشاء حساب':'تسجيل الدخول'; toggle.textContent=isNew.checked?'لدي حساب':'إنشاء حساب جديد'; });
  form?.addEventListener('submit',ev=>{ev.preventDefault(); const all=users();
    if(!isNew.checked && (email.value===DEMO.user||email.value==='admin@demo') && password.value===DEMO.pass){ const u={email:'admin',role:role.value,accountType:accountType.value}; setAuth(u); modal.close(); alert('مرحبًا بك — دخول تجريبي'); location.hash=role.value==='admin'?'#/admin':role.value==='judge'?'#/judge':'#/dashboard'; return; }
    if(isNew.checked){ if(all[email.value]) return alert('الاسم مستخدم مسبقًا'); all[email.value]={email:email.value,password:password.value,role:role.value,accountType:accountType.value,createdAt:Date.now()}; saveUsers(all); setAuth({email:email.value,role:role.value,accountType:accountType.value}); modal.close(); alert('تم إنشاء الحساب'); location.hash=role.value==='admin'?'#/admin':role.value==='judge'?'#/judge':'#/dashboard'; }
    else { if(!all[email.value]||all[email.value].password!==password.value) return alert('بيانات غير صحيحة'); setAuth({email:email.value,role:all[email.value].role,accountType:all[email.value].accountType}); modal.close(); alert('مرحبًا بعودتك'); location.hash=all[email.value].role==='admin'?'#/admin':all[email.value].role==='judge'?'#/judge':'#/dashboard'; }
  });
  document.querySelector('.modal__close')?.addEventListener('click',()=>modal.close());
}