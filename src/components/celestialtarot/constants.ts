import { CardInstance } from './types';

export const CARD_BACKS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWxnSHOWYe2OrmI9Ux--ideeN7M_ty-RwP84-pWakSG_Ie1HatukoLou8EQz-5BZBhpa80HJFOUvLynLLihMn5f879KY1xeNeOLXTAvyis_tBx9mZR70vUeMjz8Dn0M__DwABKccnCXVdRayGxet_o0lBSsL3XlbH33TOIy4fzG9W3fhH536XSH--lckoXKwO6gt0y7k_YTzPTZfR35C7fDp6cSIKJh2DYHQLDPaYEJvQLSBWBaDmeXlE7hJ0Se-3VRUfvd0L4OPhs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBgnJ1CsjWp-crgNH3DtxzOpqJg3ymUB21qLdBty2osM28IAOgFtEKV4hSIZtNfImCjqhPkMQoejeseTyj-KH7_JCRjir8F1X0mh-XbG8ieWS38Nas51jzAgMwq5TULl7QoiR9ahKp8x4VVDhKl-6UonT8tA6l_AQztgy26MHqaldS9VNwJGmqDibcDsdg7u-RYfyteWdfHhk1AP-iqnV-h0Snna75LwOKqdCf1_V-XQKLqCHo5zx9V84hkLZ1dyAOgh3fS78HF6lQN',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBavBaP1T88drnqeavzmliIWDcEiXubTL7k-v2k47LLr-Tbp_NLC4o3oI5bR-xzLQAzEDQjfmQoFKv9TVFNey7z2CvNOPhPg1AZdbG88v43g1seH-MmySYO8AR9JfEpH0YvAebBZ9uDH-k7nMta8OxbPC9YymH_e_9sKKH7qHP5i_r_6bDPA-laDCwE9PLhFRsBeoiH02_SmE6DDNtJToJcmbduy2Qve3I5nIHd7FtGvb12EqqbgfYawCUziNFrynODIQ8q4pLWxYaz',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC9sIBgKZLOO2KNh0cIOYC2OeIdyfGbrzHHTCaQqJFUAewltvfRl-LWZ0sTvI4wA7w6d_XtlbTfjEI_ut2OUfhia3GEyiQt4N9txas1q9fks-TUtMD2Y4SP2U9yQGY8aB_2UNXTxsQDsDHmSct_TqwpQ3VSzQfNsQ4pD0HLZCHIba9H5K1brCnFY4ujdwO1o4MYpMPqn-n4LaovcKzL_gq4G3-wr0k3sGda-fRnmAmyKDS8-x6ehAHxie06qGxk_ZHfzw8ZDWOLL3bt',
];

export const INITIAL_CARDS: CardInstance[] = [
  {
    id: 1,
    backImage: CARD_BACKS[0],
    revealedImage:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1776790176/RWS_Tarot_00_Fool_hboyws.jpg',
    meaning: 'The Fool: New beginnings, optimism, trust in life.',
  },
  {
    id: 2,
    backImage: CARD_BACKS[1],
    revealedImage:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1776790176/RWS_Tarot_01_Magician_h8znwz.jpg',
    meaning: 'The Magician: Action, power, manifestation.',
  },
  {
    id: 3,
    backImage: CARD_BACKS[2],
    revealedImage:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1776790176/RWS_Tarot_02_High_Priestess_ymcxsa.jpg',
    meaning: 'The High Priestess: Intuition, mystery, inner knowledge.',
  },
  {
    id: 4,
    backImage: CARD_BACKS[3],
    revealedImage:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1776790177/RWS_Tarot_03_Empress_v3jt9y.jpg',
    meaning: 'The Empress: Abundance, nurturing, fertility.',
  },
  {
    id: 5,
    backImage: CARD_BACKS[0],
    revealedImage:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1776790177/RWS_Tarot_04_Emperor_ydty8b.jpg',
    meaning: 'The Emperor: Structure, stability, leadership.',
  },
  {
    id: 6,
    backImage: CARD_BACKS[1],
    revealedImage:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1776790177/RWS_Tarot_05_Hierophant_x67b6o.jpg',
    meaning: 'The Hierophant: Tradition, social norms, spiritual wisdom.',
  },
];
