import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function GET(){
  const competitions = await prisma.competition.count({ where: { status: 'OPEN' } });
  const participants = await prisma.participant.count();
  const closedWinners = await prisma.competition.aggregate({ _sum: { winners: true }, where: { status: 'CLOSED' } });
  const sponsors = 7;
  const totalPrize = await prisma.competition.aggregate({ _sum: { prize: true } });
  const users = await prisma.user.count();
  return NextResponse.json([
    { label: 'المسابقات النشطة', value: String(competitions) },
    { label: 'مشاركات', value: String(participants) },
    { label: 'جوائز مُسلَّمة', value: String(closedWinners._sum.winners || 0) },
    { label: 'رعاة نشطون', value: String(sponsors) },
    { label: 'قيمة الجوائز', value: String(totalPrize._sum.prize || 0) + ' SAR' },
    { label: 'المستخدمون', value: String(users) },
  ]);
}
