'use client';

import Image from 'next/image';
import {
  Heart,
  Moon,
  Navigation,
  Route,
  Sun,
  X,
} from 'lucide-react';
import { useState } from 'react';
import styles from './maps-of-us.module.css';

interface MemoryPin {
  id: number;
  label: string;
  area: string;
  date: string;
  story: string;
  imageUrl: string;
  imageAlt: string;
  x: number;
  y: number;
}

const MEMORY_PINS: MemoryPin[] = [
  {
    id: 1,
    label: 'where you stole my fries',
    area: 'Senopati',
    date: '12 Aug 2021',
    story:
      'Our first almost-date. You ordered “just a drink” and ate half my fries. I knew I wanted a second date anyway.',
    imageUrl: '/arcadeclawv1/coffee-date.svg',
    imageAlt: 'Two warm drinks beside flowers',
    x: 24,
    y: 25,
  },
  {
    id: 2,
    label: 'the wrong turn we kept',
    area: 'Puncak',
    date: '03 Apr 2022',
    story:
      'No signal, one questionable shortcut, and the loudest playlist. Getting lost with you felt exactly right.',
    imageUrl: '/arcadeclawv1/road-trip.svg',
    imageAlt: 'A little car driving through green hills',
    x: 67,
    y: 18,
  },
  {
    id: 3,
    label: 'our Sunday spot',
    area: 'Tebet',
    date: '19 Feb 2023',
    story:
      'The warung where they know our order and always give us the corner table. Home can be a plastic chair for two.',
    imageUrl: '/arcadeclawv1/picnic-day.svg',
    imageAlt: 'A picnic blanket beneath a leafy tree',
    x: 76,
    y: 43,
  },
  {
    id: 4,
    label: 'the hardest see you soon',
    area: 'Terminal 3',
    date: '07 Nov 2023',
    story:
      'We promised not to cry at departures. We were both terrible at it. This is where the distance started—and we stayed us.',
    imageUrl: '/arcadeclawv1/stargazing.svg',
    imageAlt: 'Two people sitting together beneath a starry sky',
    x: 51,
    y: 58,
  },
  {
    id: 5,
    label: 'the sunset that waited',
    area: 'Sanur',
    date: '22 Jun 2024',
    story:
      'After 227 days apart, the sky showed off for us. I would cross every map just to sit beside you again.',
    imageUrl: '/arcadeclawv1/sunset-date.svg',
    imageAlt: 'Two people watching a pink sunset by the sea',
    x: 22,
    y: 69,
  },
];

const ROUTE_POINTS = MEMORY_PINS.map((pin) => `${pin.x},${pin.y}`).join(' ');
const FINALE_POSITION = { x: 64, y: 84 };

export default function MapsOfUs() {
  const [activePin, setActivePin] = useState<MemoryPin | null>(MEMORY_PINS[0]);
  const [showFinale, setShowFinale] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [routeVisible, setRouteVisible] = useState(true);

  const selectMemory = (pin: MemoryPin) => {
    setShowFinale(false);
    setActivePin(pin);
  };

  const openFinale = () => {
    setActivePin(null);
    setShowFinale(true);
  };

  const closeCard = () => {
    setActivePin(null);
    setShowFinale(false);
  };

  return (
    <main className={`${styles.page} ${isNight ? styles.night : ''}`}>
      <section className={styles.mapApp} aria-label="Maps of Us preview">
        <div className={styles.mapCanvas}>
          <div className={styles.terrain} aria-hidden="true">
            <span className={styles.parkOne} />
            <span className={styles.parkTwo} />
            <span className={styles.water} />
          </div>

          <svg
            className={styles.streets}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true">
            <path d="M-8 12 C18 20 14 39 42 43 S78 34 108 50" />
            <path d="M8 -8 C22 16 41 22 38 48 S31 80 47 108" />
            <path d="M73 -8 C62 15 84 24 74 53 S57 73 71 108" />
            <path d="M-7 80 C20 61 38 74 57 67 S87 61 108 73" />
            <path d="M-5 42 C17 47 30 30 51 27 S84 29 105 17" />
          </svg>

          <header className={styles.header}>
            <div className={styles.brand}>
              <span className={styles.brandMark}>
                <Heart size={15} fill="currentColor" />
              </span>
              <div>
                <p>Maps of Us</p>
                <span>Naya &amp; Raka · 3 years</span>
              </div>
            </div>
            <button
              className={styles.iconButton}
              type="button"
              onClick={() => setIsNight((current) => !current)}
              aria-label={isNight ? 'Switch to day map' : 'Switch to night map'}>
              {isNight ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </header>

          <div className={styles.mapLabels} aria-hidden="true">
            <span style={{ left: '7%', top: '39%' }}>Little Sunday Park</span>
            <span style={{ left: '61%', top: '32%' }}>Jalan Pulang</span>
            <span style={{ left: '13%', top: '56%' }}>Memory Lake</span>
            <span style={{ left: '68%', top: '70%' }}>Our Side of Town</span>
          </div>

          {routeVisible ? (
            <svg
              className={styles.routeLine}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-label="Route of Us connecting the memories">
              <polyline
                points={`${ROUTE_POINTS} ${FINALE_POSITION.x},${FINALE_POSITION.y}`}
              />
            </svg>
          ) : null}

          <div className={styles.pins}>
            {MEMORY_PINS.map((pin) => (
              <button
                key={pin.id}
                type="button"
                className={`${styles.pinButton} ${
                  activePin?.id === pin.id ? styles.pinActive : ''
                }`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={() => selectMemory(pin)}
                aria-label={`Open memory ${pin.id}: ${pin.label}`}>
                <span className={styles.pin}>
                  <span>{pin.id}</span>
                </span>
                <span className={styles.pinLabel}>{pin.label}</span>
              </button>
            ))}

            <button
              type="button"
              className={`${styles.pinButton} ${styles.finalePinButton}`}
              style={{
                left: `${FINALE_POSITION.x}%`,
                top: `${FINALE_POSITION.y}%`,
              }}
              onClick={openFinale}
              aria-label="Open the You are here finale">
              <span className={`${styles.pin} ${styles.finalePin}`}>
                <Heart size={16} fill="currentColor" />
              </span>
              <span className={styles.pinLabel}>You are here ♥</span>
            </button>
          </div>

          <button
            type="button"
            className={`${styles.routeToggle} ${
              routeVisible ? styles.routeToggleOn : ''
            }`}
            onClick={() => setRouteVisible((current) => !current)}
            aria-pressed={routeVisible}>
            <Route size={17} />
            <span>Route of Us</span>
            <i>{routeVisible ? 'On' : 'Off'}</i>
          </button>

          <div className={styles.compass} aria-hidden="true">
            <Navigation size={18} fill="currentColor" />
          </div>

          <div
            className={`${styles.scrim} ${
              activePin || showFinale ? styles.scrimVisible : ''
            }`}
            onClick={closeCard}
            aria-hidden="true"
          />

          {activePin ? (
            <article className={styles.placeCard} aria-live="polite">
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeCard}
                aria-label="Close memory card">
                <X size={17} />
              </button>
              <div className={styles.photo}>
                <Image
                  src={activePin.imageUrl}
                  alt={activePin.imageAlt}
                  fill
                  priority={activePin.id === 1}
                  sizes="(max-width: 520px) 42vw, 210px"
                />
                <span>{String(activePin.id).padStart(2, '0')}</span>
              </div>
              <div className={styles.cardCopy}>
                <p>
                  {activePin.area} · {activePin.date}
                </p>
                <h1>{activePin.label}</h1>
                <blockquote>“{activePin.story}”</blockquote>
              </div>
            </article>
          ) : null}

          {showFinale ? (
            <article className={`${styles.placeCard} ${styles.finaleCard}`}>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeCard}
                aria-label="Close love letter">
                <X size={17} />
              </button>
              <span className={styles.finalHeart}>
                <Heart size={27} fill="currentColor" />
              </span>
              <p className={styles.finalEyebrow}>Destination reached</p>
              <h1>You are here, with me.</h1>
              <p className={styles.letter}>
                Every road before you was just a road. Then you arrived, and
                suddenly every place became a story I wanted to remember.
                Wherever we go next, my favorite place will always be beside
                you.
              </p>
              <p className={styles.signature}>Always yours, Raka ♥</p>
            </article>
          ) : null}
        </div>
      </section>
    </main>
  );
}
