/**
 * What people wrote in Memoify's own feedback form, for the home page.
 *
 * Chosen by hand from the feedback table (owner, 2026-11-17: "you pick the
 * praise"), from messages that are praise and nothing else - no requests,
 * no complaints mixed in. Each is as it was written, spelling and capitals
 * included; the only edit is a request cut from the end of one.
 *
 * Kept here, not fetched: the feedback endpoint returns every message with
 * its sender's email address, and none of that belongs in a page's data.
 * Nothing here says who wrote it - only what, and the month.
 *
 * To change the set, edit this list.
 */
export interface Testimonial {
  words: string;
  /** The month it was sent. */
  when: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    words:
      'This website is truly impressive. The design feels warm, inviting, and easy to navigate, making the whole experience enjoyable.',
    when: 'December 2025',
  },
  {
    words: 'SUKAKK BANGETT MAKASIH ATAS WEB INI HAHAHA SUDAH MEMBANTU LDR KU',
    when: 'April 2026',
  },
  {
    words:
      'this website really help me to make gift for my girlfriend. thanks for creating this web!',
    when: 'May 2026',
  },
  {
    words:
      'keren banget templatenya, so helpful for me yang males coding dari awal hehe, thank youu',
    when: 'October 2025',
  },
  { words: 'the coolest website i’ve ever come across', when: 'October 2025' },
  {
    words:
      'aku suka web inii, sangat bagus dan membantu untuk menyiapkan hadiah yang berkesan^^',
    when: 'April 2026',
  },
  {
    words: 'Thank you because I can give something beautiful to my beloved gf',
    when: 'February 2026',
  },
  {
    words:
      'it’s wonderful to know this web, as we can create and customize birthday gift in a creative way, hope this web get a spotlight!',
    when: 'September 2026',
  },
  {
    words: 'GEMES BANGETTT, MAKASIH UDAH BIKIN WEBSITE INIII',
    when: 'February 2026',
  },
  {
    words:
      'sangat bagus, dan merupakan inovasi baru dan cocok untuk pasangan ldr agar tidak bosan',
    when: 'October 2025',
  },
  {
    words:
      'Really good, easy to understand! thank you so much for making this!',
    when: 'March 2026',
  },
  {
    words:
      'i love this website, i will always use this website to made a gift for my boyfriend',
    when: 'January 2026',
  },
  { words: 'cool ways to give unforgettable gifts', when: 'May 2026' },
  {
    words:
      'sanga bagus dan saya senang bisa buat sesuatu untuk orang yang saya sayangi',
    when: 'December 2025',
  },
  {
    words: 'KEREN VGT AKU BAKAL BIKIN INI BUAT SMW ORG',
    when: 'October 2025',
  },
  {
    words: 'I love this website, so easy to use! Thank you.',
    when: 'October 2025',
  },
  {
    words:
      'this websitee is so goodd, i will recomend this site too my friendss',
    when: 'February 2026',
  },
  {
    words: 'great website! good for giving gifts virtually<33',
    when: 'February 2026',
  },
];
