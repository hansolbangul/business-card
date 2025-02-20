import { CardEditor } from "@/widgets/CardEditor/ui/CardEditor";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { getDeviceType } from "@/shared/lib/device/getDeviceType";

export default async function Home() {
  const { isMobile } = await getDeviceType();

  return (
    <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-4rem)]">
      <div className="flex-1 relative">
        <CardEditor initialIsMobile={isMobile} />
      </div>
      <Sidebar initialIsMobile={isMobile} />
    </div>
  );
}
