import { featuredStories } from '../data.js';
export default function MediaHub(){
  const list = featuredStories();
  const cards = list.map(s => `<div class='card'>
      <h3>${s.title}</h3>
      <div class='row'>
        ${s.slides.map((sl,i)=>`<span class='badge'>${sl.type==='cover'?'غلاف':sl.type==='cta'?'دعوة':'نص'} ${i+1}</span>`).join('')}
      </div>
      <a class='btn' href='${s.slides.find(x=>x.type==='cta')?.href ?? "#/"}'>شاهد/قدّم</a>
    </div>`).join('') || `<div class='card'><p class='muted'>لا توجد مسابقات وطنية مميزة حالياً.</p></div>`;
  return `<section class='grid grid-3'>${cards}</section>`;
}