import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export function WeddingDetails() {
  return (
    <div
      className={`${playfair.className} flex flex-col justify-center space-y-8 text-left`}>
      <div>
        <p className={`${playfair.className} text-xl mb-4`}>
          Kylie Kennedy and Mason Beach want to celebrate their special day with
          you!
        </p>
      </div>

      <div>
        <h3 className={`${playfair.className} text-2xl font-bold mb-2`}>
          WHEN
        </h3>
        <p className={`${playfair.className} text-xl`}>
          The wedding will be held on
          <br />
          July 18, 2024
        </p>
      </div>

      <div>
        <h3 className={`${playfair.className} text-2xl font-bold mb-2`}>
          WHERE
        </h3>
        <p className={`${playfair.className} text-xl`}>
          Crystal Gardens
          <br />
          New York, NY 10001
        </p>
      </div>

      <div>
        <p className={`${playfair.className} text-xl italic`}>
          "We would love to celebrate our love with you"
        </p>
      </div>
    </div>
  );
}
