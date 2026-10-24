/**
 * The small pill over every section heading on the landing: "How it works",
 * "FAQ". The plan call-out sets its own on the photograph, in white.
 */
export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium capitalize leading-[normal] tracking-[-0.28px] text-[#e34013]">
      {children}
    </span>
  );
}
