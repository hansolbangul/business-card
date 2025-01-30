'use client';

import { AddText } from '@/features/elements/ui/AddText';
import { AddImage } from '@/features/elements/ui/AddImage';
import { DownloadCard } from '@/features/export/ui/DownloadCard';

export const Sidebar = () => {
  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">요소 추가</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">텍스트</h3>
            <AddText />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">이미지</h3>
            <AddImage />
          </div>
          <div className="pt-4 border-t border-gray-200">
            <DownloadCard />
          </div>
        </div>
      </div>
    </aside>
  );
};
