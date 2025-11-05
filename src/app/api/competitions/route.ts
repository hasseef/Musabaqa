import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(){ 
  const items = await prisma.competition.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ items }); 
}

export async function POST(req: Request){
  const body = await req.json();
  const created = await prisma.competition.create({ data: {
    title: body.title, type: body.type || 'توعوية', ownerName: body.ownerName || 'مستخدم',
    city: body.city || 'الرياض', prize: Number(body.prize||0), prizeType: body.prizeType || 'رقمية',
    winners: Number(body.winners||1), videoUrl: body.videoUrl || null,
    requiresCode: Boolean(body.requiresCode||false), accessCode: body.accessCode || null,
    targetCities: body.target?.cities || [], targetMinAge: body.target?.minAge || null, targetMaxAge: body.target?.maxAge || null, targetInterests: body.target?.interests || []
  }});
  return NextResponse.json({ ok:true, created });
}
