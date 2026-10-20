/**
 * The MemoRoll gallery card in the "How it works" header, drawn on the
 * design's 420px card. Every measurement is converted to `cqw` against that
 * width so the stack of phone, gallery sheet, print and badges scales as one.
 */
const cq = (px: number) => `${((px / 420) * 100).toFixed(3)}cqw`;

const SHADOW =
  'drop-shadow-[0_2px_2px_rgba(132,27,1,0.12)] drop-shadow-[0_8px_8px_rgba(132,27,1,0.1)]';

export default function MemorollPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[420/318] w-full max-w-[420px] rounded-[19px] bg-white [container-type:inline-size]">
      <div
        className="absolute overflow-hidden"
        style={{
          left: cq(110.5),
          top: cq(-6.3),
          width: cq(199.6),
          height: cq(324),
        }}>
        <img
          src="/digital-invitation/mr-phone.png"
          alt=""
          className="absolute max-w-none"
          style={{
            left: '0.15%',
            top: '0.02%',
            width: '99.92%',
            height: '125.89%',
          }}
        />
      </div>

      <div
        className="absolute flex flex-col bg-[#f7f5f3] shadow-[0_6px_10px_rgba(132,27,1,0.14)]"
        style={{
          left: cq(142.2),
          top: cq(-17.3),
          width: cq(233.2),
          gap: cq(7.4),
          padding: `${cq(7.4)} 0`,
          borderRadius: cq(12.4),
        }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: `0 ${cq(9.9)}` }}>
          <span
            className="flex items-center justify-center rounded-full bg-[#ff3e09] shadow-[inset_0_-2px_3px_rgba(8,9,12,0.17)]"
            style={{ padding: `${cq(6.2)} ${cq(7.4)}` }}>
            <img
              src="/digital-invitation/mr-back.svg"
              alt=""
              style={{ width: cq(14.9), height: cq(14.9) }}
            />
          </span>
          <p
            className="flex-1 text-center font-bold text-[#232323]"
            style={{ fontSize: cq(12.4), lineHeight: 1.5 }}>
            Gallery
          </p>
          <span
            className="opacity-0"
            style={{ width: cq(29.8), height: cq(26.5) }}
          />
        </div>

        <div className="relative" style={{ padding: `${cq(6.2)} ${cq(9.9)}` }}>
          <img
            src="/digital-invitation/mr-camera.svg"
            alt=""
            className="absolute -scale-y-100 rotate-[53.34deg]"
            style={{
              left: cq(153.2 + 6.5),
              top: cq(-36.3 + 24.4),
              width: cq(92.7),
              height: cq(63.3),
            }}
          />
          <div className="flex flex-col" style={{ gap: cq(2.5) }}>
            <p
              className="flex items-center font-bold text-[#232323]"
              style={{ gap: cq(3.7), fontSize: cq(7.4), lineHeight: 1.5 }}>
              Ends in
              <span
                className="inline-flex items-center rounded-[2px] bg-[#232323] px-[2px] tracking-normal text-white"
                style={{ fontSize: cq(8.3) }}>
                08:08:28
              </span>
            </p>
            <p
              className="font-extrabold text-[#232323]"
              style={{ fontSize: cq(12.4), lineHeight: 1.5 }}>
              Elias &amp; Freya’s Wedding
            </p>
            <p
              className="font-medium text-[#232323]"
              style={{ fontSize: cq(7.4), lineHeight: 1.5 }}>
              615 Photos ・ 100 Participants
            </p>
          </div>
        </div>
        <img
          src="/digital-invitation/mr-union.svg"
          alt=""
          className="w-full"
          style={{ height: cq(1.24) }}
        />
      </div>

      <div
        className={`absolute ${SHADOW}`}
        style={{
          left: cq(31.1),
          top: cq(195.8),
          width: cq(118.3),
          height: cq(149.4),
        }}>
        <div
          className="size-full rotate-[3.79deg] bg-white"
          style={{ padding: cq(2.9) }}>
          <img
            src="/digital-invitation/mr-photo-frame.jpg"
            alt=""
            className="size-full object-cover"
          />
        </div>
      </div>

      <p
        className="absolute flex items-center whitespace-nowrap rounded-full bg-[#ff3e09] text-[#e8e1d9]"
        style={{
          left: cq(244.5),
          top: cq(252.5),
          height: cq(24.5),
          gap: cq(5.5),
          padding: `0 ${cq(9.7)}`,
          fontFamily: 'var(--font-mr-label)',
          fontSize: cq(8.3),
          letterSpacing: cq(0.35),
        }}>
        <span
          className="rounded-full bg-[#18d100]"
          style={{ width: cq(5.5), height: cq(5.5) }}
        />
        100 guests shooting right now
      </p>

      <div
        className="absolute"
        style={{
          left: cq(16.6),
          top: cq(16.2),
          width: cq(67.4),
          height: cq(35.2),
        }}>
        <span
          className="absolute left-0 top-0 block w-full text-center font-bold uppercase text-[#232323]"
          style={{
            fontFamily: 'var(--font-mr-display)',
            fontSize: cq(25.3),
            lineHeight: 1,
          }}>
          MEMO
        </span>
        <span
          className="absolute left-0 block font-bold text-[#232323]"
          style={{
            top: cq(19.5),
            fontFamily: 'var(--font-mr-display)',
            fontSize: cq(25.3),
            lineHeight: 1,
          }}>
          R
        </span>
        <span
          className="absolute right-0 block font-bold text-[#232323]"
          style={{
            top: cq(19.5),
            fontFamily: 'var(--font-mr-display)',
            fontSize: cq(25.3),
            lineHeight: 1,
          }}>
          LL
        </span>
        <img
          src="/digital-invitation/mr-logo-trade.svg"
          alt=""
          className="absolute"
          style={{
            left: cq(14.2),
            top: cq(18.8),
            width: cq(31.4),
            height: cq(16.5),
          }}
        />
      </div>
    </div>
  );
}
