import { redirect } from 'next/navigation';

import Sidebar from "@/app/common/sidebar"
import { getCurrentSession } from '@/services/auth';


export default async function RootLayout({ children }) {
  const userSession = await getCurrentSession();

  if (!userSession) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-100 to-beige-200 flex">
      <aside className="w-64 shadow-md p-6 flex flex-col justify-between bg-gradient-to-b from-[#FAF8F4]/90 to-[#C7B590]/90 text-[#1C1C1C]">
        <Sidebar />
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
