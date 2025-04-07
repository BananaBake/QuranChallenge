import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";

interface DraggableSurahProps {
  name: string;
  arabicName: string;
  number: string | number;
  index: number;
  onMoveItem: (dragIndex: number, hoverIndex: number) => void;
}

export function DraggableSurah({ name, arabicName, number, index, onMoveItem }: DraggableSurahProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    onMoveItem(dragIndex, index);
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border border-gray-300 bg-white rounded-lg p-3 flex justify-between items-center cursor-move shadow-sm mb-2"
    >
      <div className="flex items-center">
        <div className="bg-secondary/20 text-secondary w-8 h-8 rounded-full flex items-center justify-center mr-3">
          <GripVertical className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold">{name}</span>
          <span className="block text-xs text-gray-500">{arabicName}</span>
        </div>
      </div>
      <span className="font-arabic text-xl">{number}</span>
    </div>
  );
}
