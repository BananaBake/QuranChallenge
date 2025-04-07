import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";

interface DraggableSurahProps {
  name: string;
  arabicName: string;
  number: string | number;
  index: number;
  onMoveItem: (dragIndex: number, hoverIndex: number) => void;
  showNumber?: boolean;
}

export function DraggableSurah({ name, arabicName, number, index, onMoveItem, showNumber = false }: DraggableSurahProps) {
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
      className="border-2 border-gray-300 bg-white rounded-lg p-4 flex justify-between items-center cursor-move shadow-sm mb-3 hover:border-primary transition-colors"
    >
      <div className="flex items-center">
        <div className="bg-secondary/20 text-secondary w-10 h-10 rounded-full flex items-center justify-center mr-4">
          <GripVertical className="w-5 h-5" />
        </div>
        <div>
          <span className="font-english font-bold text-sm">{name}</span>
          <span className="block font-arabic text-lg text-primary mt-1" dir="rtl">{arabicName}</span>
        </div>
      </div>
      {showNumber ? (
        <span className="font-bold text-xl bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">{number}</span>
      ) : (
        <span className="w-10 h-10 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
          <span className="text-primary/20 text-xs">?</span>
        </span>
      )}
    </div>
  );
}
