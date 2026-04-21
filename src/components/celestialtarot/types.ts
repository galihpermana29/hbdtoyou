export interface TarotData {
  sayings: string[];
  specialSaying: string;
  recipient: {
    name: string;
    age: string;
    wish: string;
  };
}

export interface CardInstance {
  id: number;
  backImage: string;
  revealedImage: string;
  meaning: string;
  revealedOrder?: number;
}
