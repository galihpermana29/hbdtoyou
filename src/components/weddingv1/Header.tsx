import { Abril_Fatface, Cantata_One } from 'next/font/google';

const playfair = Abril_Fatface({ subsets: ['latin'], weight: '400' });

export function Header() {
  return (
    <div className=" border-black p-6 text-center">
      <h1
        className={`${playfair.className} text-4xl md:text-6xl font-bold mb-4 uppercase`}>
        The Wedding Times
      </h1>
      <p className="text-lg border-y-[1px] border-black">July 18, 2024</p>
    </div>
  );
}
