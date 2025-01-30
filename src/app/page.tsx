import Image from "next/image";
import { CardEditor } from '@/widgets/CardEditor';
import { Header } from '@/widgets/Header/ui/Header';
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50">
            <CardEditor />
            <div className="lg:hidden">
              <Sidebar />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
