export interface JournalEntry {
  id: string;
  title: string;
  author: string;
  date: string;
  volume: string;

  abstract: string;
  abstractSecondary?: string;
  keywords: string[];
  preamble: string;
  introduction: string;
  isPublic: boolean;
  language?: string;
  secondaryLanguage?: string;
}

export interface SectionContent {
  title: string;
  content: string;
}

export const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'To Widya: Support, Appreciation, and Birthday Joy',
    author: 'Galih P',
    date: '2025-05-23',
    volume: 'Volume (1)',
    abstract:
      'This message conveys heartfelt birthday wishes to Widya, acknowledging the sender`s less overtly romantic nature while emphasizing sincere effort and support. It highlights the positive impact Widya has had on the sender, particularly in teaching patience and calm conflict resolution. The sender expresses unwavering support for Widya`s aspirations and appreciates her past endeavors. Despite the current physical distance preventing a shared celebration, the message expresses hope for Widya`s happiness, references a recent positive meeting, and apologizes for the sender`s absence on the actual birthday. The core sentiments are deep appreciation, continued support, and warm wishes for Widya`s well-being, success, and happiness on her birthday and beyond.',
    abstractSecondary: '',
    keywords: ['Selamat Ulang Tahun', 'Birthday', 'Sincerity', 'Appreciation'],
    preamble:
      'Widya,\n' +
      "You probably know by now that I'm not exactly the type for grand romantic gestures or poetic words. But please believe me, every effort I make, big or small, has you in mind as a reason and a goal. I'm writing this, still figuring out the best way to put it, but one thing's for sure: this isn't about me. It's about you, an incredible person celebrating your special day today.\n" +
      "Happy birthday, Widya. It's the anniversary of your arrival, the day your first cry brought new hope and a new story to the world. As you step into this new year of life, I hope the universe showers you with goodness, smooth paths in all you do, sincerity from those around you, and unending good fortune.\n" +
      "You know, Widya, you've been one of my greatest teachers. I've learned so much from you that's truly invaluable. About how to savor every moment of life without rushing through it. About deep patience when facing life's inevitable challenges. About managing ego and not always resorting to anger when we disagree. And honestly, there are so many more precious lessons you've taught me without even realizing it, shaping me into a better person.\n",

    introduction:
      "Today, as you turn a year older, my prayers for you continue. I wish for good things not just to come your way, but to stay. I hope new doors of opportunity swing wide open for you: abundant blessings, a career that's both brilliant and fulfilling, excellent health in body and mind, and those simple joys that keep your heart warm. And don't worry, I'm not going anywhere. I'll always be here, your staunchest supporter, whatever dreams you chase or paths you choose to take.\n" +
      "Whether it's your desire to pursue a Master's degree for higher learning, chase your dream of working in Japan and experiencing a new culture, decide to move to another city for new challenges and growth, or even if (and I truly hope not) you find yourself in a tough spot again, like when you were looking for work before. I will always value and appreciate every bit of your sweat, effort, and hard work. Even though we've only known each other and built this trust for a year, I truly believe your past struggles were just as significant and full of sacrifice, shaping you into the strong and admirable Widya you are today.\n" +
      "Of course, special moments like these would feel more complete if we could meet and celebrate together. But hey, this isn't the first time we're celebrating your birthday online, right? We celebrated your last one together in person, and that's a sweet memory. So, it's okay for this time, isn't it? I really hope our warm meeting in Jakarta recently brought you enough happiness. Again, I'm so sorry I couldn't stay there with you until your actual birthday. Distance might keep us physically apart for now, but my sincere prayers and support will always find their way to you.\n" +
      'Keep being the Widya I know – full of spirit, genuine, and always with a unique way of seeing the world. Happy birthday once again. May today and all your days ahead be filled with laughter, love, and everything that brings you happiness.',
    isPublic: true,
    language: 'Indonesian',
    secondaryLanguage: 'English',
  },
  {
    id: '2',
    title: 'REFLECTIONS ON THE FIRST YEAR OF GRADUATE STUDIES',
    author: 'J. Parker',
    date: '2023-05-15',
    volume: 'Volume (2)',
    abstract:
      'This personal reflection documents the challenges, growth, and insights gained during the first year of graduate studies. It examines the transition from undergraduate to graduate-level academic work, the development of research skills, and the evolution of personal and professional identity in an academic setting.',
    keywords: [
      'Graduate Studies',
      'Academic Growth',
      'Research Development',
      'Personal Reflection',
    ],
    preamble:
      'The journey through graduate education represents a significant transformation in both academic and personal dimensions. This reflection seeks to explore the multifaceted nature of this experience, examining both the challenges and opportunities that arise during this critical period of intellectual development. The transition from undergraduate to graduate studies marks not only an advancement in academic pursuit but also a fundamental shift in how knowledge is approached, processed, and contributed to the broader academic discourse. Through this examination, we can better understand the complex interplay between personal growth, academic achievement, and professional development that characterizes the graduate school experience.',
    introduction:
      'The transition from undergraduate to graduate studies represents a significant shift in academic expectations, workload, and personal responsibility. This reflection seeks to document that journey through its various stages and challenges. The journey through graduate education represents a significant transformation in both academic and personal dimensions. This reflection seeks to explore the multifaceted nature of this experience, examining both the challenges and opportunities that arise during this critical period of intellectual development. The transition from undergraduate to graduate studies marks not only an advancement in academic pursuit but also a fundamental shift in how knowledge is approached, processed, and contributed to the broader academic discourse. Through this examination, we can better understand the complex interplay between personal growth, academic achievement, and professional development that characterizes the graduate school experience.',
    isPublic: true,
    language: 'English',
  },
  {
    id: '3',
    title: 'REFLECTIONS ON THE FIRST YEAR OF GRADUATE STUDIES',
    author: 'J. Parker',
    date: '2023-05-15',
    volume: 'Volume (2)',
    abstract:
      'This personal reflection documents the challenges, growth, and insights gained during the first year of graduate studies. It examines the transition from undergraduate to graduate-level academic work, the development of research skills, and the evolution of personal and professional identity in an academic setting.',
    keywords: [
      'Graduate Studies',
      'Academic Growth',
      'Research Development',
      'Personal Reflection',
    ],
    preamble:
      'The journey through graduate education represents a significant transformation in both academic and personal dimensions. This reflection seeks to explore the multifaceted nature of this experience, examining both the challenges and opportunities that arise during this critical period of intellectual development. The transition from undergraduate to graduate studies marks not only an advancement in academic pursuit but also a fundamental shift in how knowledge is approached, processed, and contributed to the broader academic discourse. Through this examination, we can better understand the complex interplay between personal growth, academic achievement, and professional development that characterizes the graduate school experience.',
    introduction:
      'The transition from undergraduate to graduate studies represents a significant shift in academic expectations, workload, and personal responsibility. This reflection seeks to document that journey through its various stages and challenges. The journey through graduate education represents a significant transformation in both academic and personal dimensions. This reflection seeks to explore the multifaceted nature of this experience, examining both the challenges and opportunities that arise during this critical period of intellectual development. The transition from undergraduate to graduate studies marks not only an advancement in academic pursuit but also a fundamental shift in how knowledge is approached, processed, and contributed to the broader academic discourse. Through this examination, we can better understand the complex interplay between personal growth, academic achievement, and professional development that characterizes the graduate school experience.',
    isPublic: true,
    language: 'English',
  },
];
