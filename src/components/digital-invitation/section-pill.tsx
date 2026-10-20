/** The small outlined label above a section heading: "Our Templates", "FAQ". */
export default function SectionPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium capitalize leading-[normal] tracking-[-0.28px] text-[#e34013]">
      {children}
    </span>
  );
}
