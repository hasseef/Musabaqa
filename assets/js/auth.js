
import { storage, bus } from './state.js';

const AUTH_KEY = "musabaqa_auth";
const USERS_KEY = "musabaqa_users";

export function getAuth(){ return storage.read(AUTH_KEY); }
export function onAuth(cb){ addEventListener("authchange", e => cb(e.detail)); }

export function setAuth(user){
  storage.write(AUTH_KEY, user);
  dispatchEvent(new CustomEvent("authchange", { detail: user }));
}

export function clearAuth(){
  storage.del(AUTH_KEY);
  dispatchEvent(new CustomEvent("authchange", { detail: null }));
}

export function users(){ return storage.read(USERS_KEY, {}); }
export function saveUsers(u){ storage.write(USERS_KEY, u); }

export function requireRole(role){
  const u = getAuth();
  if(!u || (role && u.role !== role)) throw new Error("UNAUTHORIZED");
}

export function initAuthUI(){
  const authBtn = document.getElementById("authBtn");
  const modal = document.getElementById("authModal");
  const form = document.getElementById("authForm");
  const title = document.getElementById("authTitle");
  const toggle = document.getElementById("toggleAuth");
  const isNew = document.getElementById("isNew");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const role = document.getElementById("role");

  function updateButtons(u){
    const roleNav = document.getElementById("roleNav");
    const roleInfo = document.getElementById("roleInfo");
    const judgeTab = document.getElementById("judgeTab");
    const adminTab = document.getElementById("adminTab");
    if(u){
      authBtn.textContent = `مرحبًا، ${u.email.split("@")[0]} (${labelRole(u.role)})`;
      authBtn.classList.remove("btn--ghost");
      authBtn.onclick = () => { if(confirm("تسجيل الخروج؟")) clearAuth(); };
      roleNav.hidden = false;
      roleInfo.textContent = `الدور: ${labelRole(u.role)}`;
      judgeTab.hidden = u.role !== "judge" && u.role !== "admin";
      adminTab.hidden = u.role !== "admin";
    }else{
      authBtn.textContent = "دخول / تسجيل";
      authBtn.classList.add("btn--ghost");
      authBtn.onclick = () => modal.showModal();
      roleNav.hidden = true;
    }
  }

  updateButtons(getAuth());
  addEventListener("authchange", (e)=> updateButtons(e.detail));

  toggle?.addEventListener("click", (ev) => {
    ev.preventDefault();
    isNew.checked = !isNew.checked;
    title.textContent = isNew.checked ? "إنشاء حساب" : "تسجيل الدخول";
    toggle.textContent = isNew.checked ? "لدي حساب" : "إنشاء حساب جديد";
  });

  form?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if(!email.checkValidity() || !password.checkValidity()) return;
    const all = users();
    if(isNew.checked){
      if(all[email.value]) return alert("البريد مستخدم مسبقًا");
      all[email.value] = { email: email.value, password: password.value, role: role.value, createdAt: Date.now() };
      saveUsers(all);
      setAuth({ email: email.value, role: role.value });
      modal.close(); alert("تم إنشاء الحساب بنجاح");
    }else{
      if(!all[email.value] || all[email.value].password !== password.value) return alert("بيانات غير صحيحة");
      setAuth({ email: email.value, role: all[email.value].role });
      modal.close(); alert("مرحبًا بعودتك");
    }
  });

  document.querySelector(".modal__close")?.addEventListener("click", ()=> modal.close());
}

export function labelRole(r){
  return r==="participant" ? "مشارك" : r==="judge" ? "محكّم" : "مدير";
}
