
import { initAuthUI } from './auth.js'; import { route, startRouter, updateBN } from './router.js';
import Home from './views/home.js'; import Competitions from './views/competitions.js'; import Details from './views/details.js'; import Submit from './views/submit.js'; import Dashboard from './views/dashboard.js'; import Judge from './views/judge.js'; import Admin from './views/admin.js'; import Profile from './views/profile.js'; import Prizes from './views/prizes.js'; import About from './views/about.js'; import Privacy from './views/privacy.js'; import Terms from './views/terms.js';
const THEME='musabaqa_theme'; const saved=localStorage.getItem(THEME); if(saved==='dark') document.documentElement.classList.add('dark'); document.getElementById('toggleTheme').addEventListener('click',()=>{ document.documentElement.classList.toggle('dark'); localStorage.setItem(THEME, document.documentElement.classList.contains('dark')?'dark':'light'); });
document.getElementById('year').textContent=new Date().getFullYear();
let deferredPrompt=null; addEventListener('beforeinstallprompt',e=>{e.preventDefault(); deferredPrompt=e; const btn=document.getElementById('installBtn'); if(btn) btn.hidden=false;}); addEventListener('appinstalled',()=>{ const btn=document.getElementById('installBtn'); if(btn) btn.hidden=true;}); document.getElementById('installBtn').addEventListener('click',async()=>{ if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; }});
if('serviceWorker' in navigator){ addEventListener('load',()=>navigator.serviceWorker.register('./sw.js')); }
initAuthUI();
route('/',Home); route('/competitions',Competitions); route('/details',Details); route('/submit',Submit); route('/dashboard',Dashboard); route('/judge',Judge); route('/admin',Admin); route('/profile',Profile); route('/prizes',Prizes); route('/about',About); route('/privacy',Privacy); route('/terms',Terms); route('*',Home);
startRouter(); updateBN();
