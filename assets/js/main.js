
import { initAuthUI } from './auth.js'; import { route, startRouter } from './router.js';
import Home from './views/home.js'; import Competitions from './views/competitions.js'; import About from './views/about.js'; import Dashboard from './views/dashboard.js'; import Judge from './views/judge.js'; import Admin from './views/admin.js'; import Profile from './views/profile.js'; import Prizes from './views/prizes.js'; import MediaHub from './views/media.js'; import Wallet from './views/wallet.js'; import Market from './views/market.js'; import SponsorReports from './views/sponsor-reports.js'; import AdminAdvanced from './views/admin-advanced.js';

const THEME='musabaqa_theme'; const saved=localStorage.getItem(THEME); if(saved==='dark') document.documentElement.classList.add('dark');
document.addEventListener('DOMContentLoaded', ()=>{ document.getElementById('year').textContent=new Date().getFullYear(); });
document.getElementById('toggleTheme').addEventListener('click',()=>{ document.documentElement.classList.toggle('dark'); localStorage.setItem(THEME, document.documentElement.classList.contains('dark')?'dark':'light'); });
initAuthUI();

route('/',Home); route('/competitions',Competitions); route('/about',About); route('/dashboard',Dashboard); route('/judge',Judge); route('/admin',Admin); route('/admin-adv',AdminAdvanced); route('/profile',Profile); route('/prizes',Prizes); route('/media',MediaHub); route('/wallet',Wallet); route('/sponsor-market',Market); route('/sponsor-reports',SponsorReports); route('*',Home);
startRouter();

if('serviceWorker' in navigator){ addEventListener('load',()=>navigator.serviceWorker.register('./sw.js')); }
