import type { BoardOfUsData } from './board-of-us';

export const BOARD_OF_US_SAMPLE_DATA: BoardOfUsData = {
  title: 'Board of Us',
  recipientName: 'Jamie',
  token: {
    nickname: 'Lovebug',
    color: '#f05f78',
  },
  memories: [
    {
      imageUrl: '/arcadeclawv1/coffee-date.svg',
      label: 'First coffee',
      caption: 'One tiny table, two cold coffees, and hours of talking.',
      alt: 'Two coffee cups beside a vase of flowers',
    },
    {
      imageUrl: '/arcadeclawv1/sunset-date.svg',
      label: 'Golden hour',
      caption: 'The sunset that made us completely forget the time.',
      alt: 'Two people watching a pink sunset by the sea',
    },
    {
      imageUrl: '/arcadeclawv1/road-trip.svg',
      label: 'Wrong turn',
      caption: 'We missed the exit and somehow found our favorite view.',
      alt: 'A little car driving through green hills',
    },
    {
      imageUrl: '/arcadeclawv1/picnic-day.svg',
      label: 'Picnic day',
      caption: 'Just snacks, sunshine, and your very best laugh.',
      alt: 'A picnic blanket under a leafy tree',
    },
    {
      imageUrl: '/arcadeclawv1/stargazing.svg',
      label: 'Our sky',
      caption: 'The night every star felt like it had shown up for us.',
      alt: 'Two people sitting under a starry night sky',
    },
    {
      imageUrl: '/boardofusv1/kitchen-dance.svg',
      label: 'Kitchen dance',
      caption: 'No music video has ever topped our midnight kitchen tour.',
      alt: 'Two people dancing together in a colorful kitchen',
    },
    {
      imageUrl: '/boardofusv1/rainy-day.svg',
      label: 'Rainy walk',
      caption: 'Wet shoes, one umbrella, absolutely no regrets.',
      alt: 'Two people walking together beneath an umbrella',
    },
    {
      imageUrl: '/boardofusv1/birthday-cake.svg',
      label: 'Cake o’clock',
      caption: 'Proof that every year with you deserves extra sprinkles.',
      alt: 'Two people celebrating beside a birthday cake',
    },
  ],
  chanceTexts: [
    'Name the song that always makes you think of us.',
    'Do your best impression of my laugh. No holding back.',
    'Pick our next tiny adventure: sunrise, picnic, or late-night drive?',
    'Say one thing you hope we are still doing together in ten years.',
  ],
  finishMessage:
    'Happy birthday, Jamie! Every stop with you is my favorite place to be. Here’s to another lap of loud laughs, soft moments, and stories only we understand. I love you.',
};
