// Sponsorship marketplace
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function GET(){ 
  const opportunities = await prisma.opportunity.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ opportunities });
}
export async function POST(req: Request){
  const body = await req.json();
  const created = await prisma.opportunity.create({ data: {
    orgName: body.orgName || 'جهة', title: body.title, description: body.description||'', prizeBudget: Number(body.prizeBudget||0), status: 'OPEN'
  }});
  return NextResponse.json({ ok:true, created });
}
