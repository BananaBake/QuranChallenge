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
  const [isDragging, setIsDragging] = useState(false);
  const [touchY, setTouchY] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchY === null) return;
    const currentY = e.touches[0].clientY;
    const element = ref.current;
    const container = element?.parentElement;
    if (!element || !container) return;
    const elementsBelow = document.elementsFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );
    const droppableBelow = elementsBelow.find(
      el => el !== element && el.getAttribute('data-draggable-index') !== null
    );
    if (droppableBelow) {
      const hoverIndex = Number(droppableBelow.getAttribute('data-draggable-index'));
      if (hoverIndex !== index) {
        onMoveItem(index, hoverIndex);
      }
    }
  };
  const handleTouchEnd = () => {
    setTouchY(null);
  };
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.6';
    }
  };
  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex !== index) {
      onMoveItem(dragIndex, index);
    }
  };
  return (
    <div
      ref={ref}
      draggable
      data-draggable-index={index}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`border-2 ${isDragging ? 'border-primary' : 'border-gray-300'} bg-white rounded-lg p-4 flex justify-between items-center cursor-move shadow-sm mb-3 hover:border-primary transition-colors`}
    >
      <div className="flex items-center">
        <div className="bg-secondary/20 text-secondary w-10 h-10 rounded-full flex items-center justify-center mr-4">
          <GripVertical className="w-5 h-5" />
        </div>
        <div>
          <span className="font-english font-bold text-md">{name}</span>
        </div>
      </div>
      {showNumber && (
        <span className="font-bold text-xl bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">{number}</span>
      )}
    </div>
  );
}