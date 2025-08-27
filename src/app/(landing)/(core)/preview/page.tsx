'use client';
import NavigationBar from '@/components/ui/navbar';
import { useSearchParams } from 'next/navigation';

const PreviewDraftContent = () => {
  const link = useSearchParams().get('link');

  //check if its valid link
  if (!link || link === '' || link === null) {
    return <div>Invalid link</div>;
  }

  return (
    <div className="min-h-screen mb-[80px]">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      <div className=" pt-[110px]">
        <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
          <h1 className="text-[#1B1B1B] font-[600] text-[30px]">
            Preview your content
          </h1>
          <p className="text-[#475467] font-[400] text-[16px] mb-[20px]">
            Please use desktop or tablet to preview your content
          </p>
          {/* Making the iframe display desktop version even on mobile devices */}
          <div className="w-full relative overflow-hidden">
            <div
              className="iframe-container w-full overflow-auto"
              style={{ WebkitOverflowScrolling: 'touch' }}>
              {typeof window !== 'undefined' && (
                <iframe
                  src={window?.location.origin + '/' + link}
                  className="h-screen preview-iframe"
                  style={{
                    width: '1280px', // Fixed desktop width
                    maxWidth: 'none',
                    border: 'none',
                    // On smaller screens, we'll scale down proportionally
                    transform: 'scale(var(--scale))',
                    transformOrigin: 'top left',
                    // This will make the iframe behave like it's the actual size after scaling
                    position: 'relative',
                  }}
                />
              )}
            </div>
          </div>

          {/* Add scaling script for responsive behavior */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              function setIframeScale() {
                const container = document.querySelector('.iframe-container');
                const iframe = document.querySelector('.preview-iframe');
                if (!container || !iframe) return;
                
                const scale = Math.min(1, container.offsetWidth / 1280);
                document.documentElement.style.setProperty('--scale', scale);
                
                // Set container height based on scaled iframe height
                // Use a timeout to ensure iframe has loaded
                setTimeout(() => {
                  const scaledHeight = iframe.offsetHeight * scale;
                  container.style.height = scaledHeight + 'px';
                }, 100);
              }
              
              // Set scale on load and resize
              window.addEventListener('load', setIframeScale);
              window.addEventListener('resize', setIframeScale);
              
              // Try to set it immediately too
              setTimeout(setIframeScale, 0);
              // And again after a short delay to ensure content is loaded
              setTimeout(setIframeScale, 500);
            `,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewDraftContent;
