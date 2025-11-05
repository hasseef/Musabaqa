import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "مسابقة", description: "منصة وطنية للمسابقات التوعوية والتسويقية" };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2 font-extrabold">
              <Image src="/Musabaqa_logo_colored.svg" alt="مسابقة" width={120} height={40} />
            </div>
            <nav className="flex items-center gap-3 flex-wrap text-sm">
              <Link href="/">الواجهة</Link>
              <Link href="/individual">فرد</Link>
              <Link href="/entity">جهة</Link>
              <Link href="/sponsor">راعٍ</Link>
              <Link href="/admin">الإدارة</Link>
              <Link href="/investor">المستثمر</Link>
            </nav>
            <div className="flex items-center gap-2 opacity-80">
              <Image alt="Vision2030" src="/Vision2030.png" width={90} height={30} />
              <Image alt="Talabiya" src="/Talabiya.png" width={90} height={30} />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
        <footer className="mt-10 border-t bg-white/60">
          <div className="max-w-6xl mx-auto p-4 text-slate-600 text-sm flex items-center justify-between">
            <span>© {new Date().getFullYear()} Musabaqa — جميع الحقوق محفوظة</span>
            <a href="/manifest.json" className="underline">PWA</a>
          </div>
        </footer>
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`}} />
      </body>
    </html>
  );
}
