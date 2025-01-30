import Image from "next/image";
import { CardEditor } from '@/widgets/CardEditor';
import { Header } from '@/widgets/Header/ui/Header';
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="w-full h-[calc(100vh-4rem)] bg-gray-50">
            <CardEditor />
          </div>
        </main>
      </div>
    </div>
  );
}
