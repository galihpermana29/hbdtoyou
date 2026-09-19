import DisneyExperience from '@/components/disney+/DisneyExperience';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

export default function DisneyPage() {
  return (
    <DisneyExperience
      title="Tunggu Aku di Bandung"
      subTitle="Dan bila akupun rindu, pada nyamannya pelukmu, pada hangatnya tawamu"
    />
  );
}
