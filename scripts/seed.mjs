import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){
  await prisma.user.createMany({
    data: [
      { name: "فهد", email: "fahd@example.com", city:"الرياض", age:24, interests:["التقنية","الرياضة"], points:120, role:"USER" },
      { name: "وزارة التعليم", email: "edu@example.com", role:"ENTITY" },
      { name: "شركة تموين الغذاء", email: "sponsor@example.com", role:"SPONSOR" }
    ]
  });
  await prisma.competition.createMany({
    data: [
      { title:"التوعية بالأمن الرقمي", type:"توعوية", ownerName:"وزارة التعليم", city:"الرياض", prize:1000, prizeType:"رقمية", status:"OPEN", winners:3, requiresCode:true, accessCode:"SEC-2030", targetCities:["الرياض"], targetMinAge:16, targetMaxAge:60, targetInterests:["التقنية"] },
      { title:"تحدي شعار المنتج الجديد", type:"تسويقية", ownerName:"شركة تموين الغذاء", city:"جدة", prize:5000, prizeType:"عينية", status:"OPEN", winners:1, requiresCode:false, targetCities:["جدة"], targetMinAge:18, targetMaxAge:55, targetInterests:["التسويق","الابداع"] }
    ]
  });
  await prisma.opportunity.create({
    data: { orgName:"جمعية وطن", title:"مسابقة أسبوع البيئة", description:"حملة توعوية عن تقليل الهدر", prizeBudget:30000, status:"OPEN" }
  });
  console.log("Seeded ✅");
}
main().finally(()=>prisma.$disconnect());
