'use client';

import { useCanvasStore } from '@/entities/canvas/model/store';
import { IText } from '@/shared/lib/fabric';

const EMOJI_CATEGORIES = [
  {
    name: '표정',
    emojis: ['😀', '😊', '🥰', '😎', '🤔', '😅', '😂', '🥳'],
  },
  {
    name: '사물',
    emojis: ['💼', '📱', '💻', '📧', '📎', '📌', '🔍', '💡'],
  },
  {
    name: '기호',
    emojis: ['✨', '💫', '⭐', '❤️', '✅', '☑️', '✔️', '➡️'],
  },
];

interface AddEmojiProps {
  close: () => void;
}

export const AddEmoji = ({ close }: AddEmojiProps) => {
  const { canvas } = useCanvasStore();

  const handleAddEmoji = (emoji: string) => {
    if (!canvas) return;

    const text = new IText(emoji, {
      left: 10,
      top: 10,
      fontSize: 30,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    close();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-600">이모지</h3>
      <div className="space-y-4">
        {EMOJI_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-2">
            <h4 className="text-xs text-gray-500">{category.name}</h4>
            <div className="grid grid-cols-4 gap-2">
              {category.emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAddEmoji(emoji)}
                  className="p-2 text-xl bg-white border border-gray-200 rounded hover:bg-gray-50"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
