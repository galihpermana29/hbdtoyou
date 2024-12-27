"use client";

import { Volume2, Maximize2, LayoutList } from "lucide-react";
import { Slider } from "../ui/slider";

export default function PlayerVolume() {
  return (
    <div className="flex items-center gap-2 md:gap-4 w-[30%] justify-end">
      <button className="hidden md:block text-neutral-400 hover:text-white transition">
        <LayoutList className="h-5 w-5" />
      </button>
      <button className="hidden sm:block text-neutral-400 hover:text-white transition">
        <Volume2 className="h-5 w-5" />
      </button>
      <Slider 
        defaultValue={[100]}
        max={100}
        step={1}
        className="w-20 md:w-24 hidden sm:block"
      />
      <button className="hidden md:block text-neutral-400 hover:text-white transition">
        <Maximize2 className="h-5 w-5" />
      </button>
    </div>
  );
}