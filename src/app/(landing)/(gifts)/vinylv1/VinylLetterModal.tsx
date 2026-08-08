'use client';

import ModalWrapper from './ModalWrapper';

interface VinylLetterModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
}

export default function VinylLetterModal({
  open,
  onClose,
  title = 'A Letter For You',
  body,
}: VinylLetterModalProps) {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <h2 className="font-serif text-2xl text-[#2a1810] mb-4">{title}</h2>
      {body ? (
        <div className="font-serif text-[#3a2820] text-[15px] leading-relaxed whitespace-pre-line">
          {body}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-[#8a7060]">
          <p className="font-serif text-lg">No letter was written</p>
        </div>
      )}
    </ModalWrapper>
  );
}
