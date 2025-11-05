import { NextResponse } from 'next/server';
export async function POST(req: Request){
  const { topic, difficulty, count } = await req.json();
  const items = Array.from({length: count || 3}, (_,i)=> ({
    q: `سؤال ${i+1} حول ${topic}`,
    choices: ["أ", "ب", "ج", "د"],
    answer: "أ"
  }));
  return NextResponse.json({ items, difficulty: difficulty||'متوسط' });
}
