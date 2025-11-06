
/* Simple localStorage auth mock (for demo only) */
const AUTH_KEY = "musabaqa_auth";

export function getAuth(){
  try{ return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; }
  catch{ return null; }
}

export function setAuth(user){
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  dispatchEvent(new CustomEvent("authchange", { detail: user }));
}

export function clearAuth(){
  localStorage.removeItem(AUTH_KEY);
  dispatchEvent(new CustomEvent("authchange", { detail: null }));
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

  function updateHeader(user){
    if(!authBtn) return;
    if(user){
      authBtn.textContent = `مرحبًا، ${user.email.split("@")[0]}`;
      authBtn.classList.remove("btn--ghost");
      authBtn.onclick = () => {
        if(confirm("تسجيل الخروج؟")) clearAuth();
      };
    }else{
      authBtn.textContent = "دخول / تسجيل";
      authBtn.classList.add("btn--ghost");
      authBtn.onclick = () => modal.showModal();
    }
  }

  updateHeader(getAuth());
  addEventListener("authchange", (e)=> updateHeader(e.detail));

  toggle?.addEventListener("click", (ev) => {
    ev.preventDefault();
    isNew.checked = !isNew.checked;
    title.textContent = isNew.checked ? "إنشاء حساب" : "تسجيل الدخول";
    toggle.textContent = isNew.checked ? "لدي حساب" : "إنشاء حساب جديد";
  });

  form?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if(!email.checkValidity() || !password.checkValidity()) return;
    const users = JSON.parse(localStorage.getItem("musabaqa_users") || "{}");
    if(isNew.checked){
      if(users[email.value]){
        alert("البريد مستخدم مسبقًا");
        return;
      }
      users[email.value] = { email: email.value, password: password.value, createdAt: Date.now() };
      localStorage.setItem("musabaqa_users", JSON.stringify(users));
      setAuth({ email: email.value });
      modal.close();
      alert("تم إنشاء الحساب بنجاح");
    }else{
      if(!users[email.value] || users[email.value].password !== password.value){
        alert("بيانات غير صحيحة");
        return;
      }
      setAuth({ email: email.value });
      modal.close();
      alert("مرحبًا بعودتك");
    }
  });

  document.querySelector(".modal__close")?.addEventListener("click", ()=> modal.close());
}
