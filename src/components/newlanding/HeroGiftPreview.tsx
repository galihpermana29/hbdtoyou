'use client';

import { BookOpen, Gamepad2, Play } from 'lucide-react';
import { useState } from 'react';

type PreviewId = 'memoflix' | 'claw' | 'scrapbook';

const PREVIEWS: {
  id: PreviewId;
  label: string;
  detail: string;
  src: string;
  chromeUrl: string;
  icon: typeof Play;
}[] = [
  {
    id: 'memoflix',
    label: 'Memoflix',
    detail: 'Netflix parody gift',
    src: '/hero-preview/netflix',
    chromeUrl: 'memoify.live/netflixv1',
    icon: Play,
  },
  {
    id: 'claw',
    label: 'Claw of Us',
    detail: 'Playable arcade gift',
    src: '/hero-preview/claw',
    chromeUrl: 'memoify.live/arcadeclawv1',
    icon: Gamepad2,
  },
  {
    id: 'scrapbook',
    label: 'Scrapbook',
    detail: 'Flip through pages',
    src: '/hero-preview/scrapbook',
    chromeUrl: 'memoify.live/scrapbook1',
    icon: BookOpen,
  },
];

export default function HeroGiftPreview() {
  const [active, setActive] = useState<PreviewId>('memoflix');
  const [loaded, setLoaded] = useState<PreviewId[]>(['memoflix']);
  const current = PREVIEWS.find((preview) => preview.id === active)!;

  const showPreview = (id: PreviewId) => {
    setActive(id);
    setLoaded((currentLoaded) =>
      currentLoaded.includes(id) ? currentLoaded : [...currentLoaded, id]
    );
  };

  return (
    <div>
      <div
        className="mb-4 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Gift preview">
        {PREVIEWS.map((preview) => {
          const Icon = preview.icon;
          const isActive = preview.id === active;
          return (
            <button
              key={preview.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => showPreview(preview.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-left transition ${
                isActive
                  ? 'border-[#E34013] bg-[#fff0e9] text-[#E34013] shadow-sm'
                  : 'border-[#e5ded7] bg-white text-[#5f5852] hover:border-[#c9b8aa]'
              }`}>
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="text-[13px] font-bold leading-none">
                {preview.label}
              </span>
              <span className="hidden text-[11px] font-medium opacity-70 sm:inline">
                {preview.detail}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[16px] border border-black/15 bg-[#111] shadow-[0_30px_80px_rgba(28,18,12,0.18)] md:rounded-[22px]">
        <div className="flex h-10 items-center border-b border-white/10 bg-[#f4f4f2] px-3 md:h-12 md:px-5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff665c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd44]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00ca4e]" />
          </div>
          <div className="mx-auto rounded-md border border-black/10 bg-white px-5 py-1 text-[9px] font-medium text-[#737373] md:px-16 md:text-[11px]">
            {current.chromeUrl}
          </div>
          <div className="w-10" aria-hidden="true" />
        </div>
        <div className="relative h-[420px] bg-[#0b0b0b] sm:h-[520px] lg:h-[620px]">
          {PREVIEWS.filter((preview) => loaded.includes(preview.id)).map(
            (preview) => (
              <iframe
                key={preview.id}
                src={preview.src}
                title={`${preview.label} gift preview`}
                className={`absolute inset-0 h-full w-full border-0 ${
                  preview.id === active ? 'z-10' : 'pointer-events-none z-0 hidden'
                }`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
