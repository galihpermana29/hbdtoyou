import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addLineBreaksEveryThreeSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g); // split by sentence end
  if (!sentences) return text; // fallback if no match

  const grouped = [];
  for (let i = 0; i < sentences.length; i += 3) {
    grouped.push(
      sentences
        .slice(i, i + 3)
        .join(' ')
        .trim()
    );
  }

  return grouped.join('<br/><br/>');
}
