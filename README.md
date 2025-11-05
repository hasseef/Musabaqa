# Musabaqa Platform — Production (Next.js 14 + Prisma + Tailwind)

## تشغيل محليًا
```bash
pnpm i
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
pnpm prisma:seed
pnpm dev
```

## نشر على Vercel
- اربط المستودع
- أضف `DATABASE_URL` (SQLite أو Postgres)
- نفّذ البناء

## API
- GET/POST `/api/competitions`
- GET/POST `/api/opportunities`
- GET `/api/kpis`
- POST `/api/ai/generate-questions`
