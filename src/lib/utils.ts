import { IContent } from '@/action/interfaces';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(val: string) {
  if (!val) return;
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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

export function mapContentToCard(contents: IContent[]) {
  return contents.map((show) => {
    const jsonContent = JSON.parse(show.detail_content_json_text);
    const handleJumbotron = () => {
      if (
        ['magazinev1', 'spotifyv1', 'magazinev1'].includes(
          show.template_name.split('-')[1].split(' ')[1]
        )
      ) {
        return Array.isArray(jsonContent.momentOfYou)
          ? jsonContent.momentOfYou.length > 0
            ? jsonContent.momentOfYou[0]
            : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg'
          : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg';
      }

      if (
        ['netflixv1', 'disneyplusv1', 'newspaperv3', 'newspaperv1'].includes(
          show.template_name.split('-')[1].split(' ')[1]
        )
      ) {
        return jsonContent.jumbotronImage;
      }

      if (
        ['f1historyv1'].includes(show.template_name.split('-')[1].split(' ')[1])
      ) {
        return jsonContent?.images.length > 0
          ? jsonContent.images[0]
          : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg';
      }
    };

    if (!handleJumbotron()) return;

    if (
      Object.prototype.hasOwnProperty.call(jsonContent, 'isPublic') &&
      jsonContent?.isPublic === false
    )
      return;

    return {
      ...show,
      jumbotronImage: handleJumbotron(),
      title: Object.prototype.hasOwnProperty.call(jsonContent, 'title')
        ? capitalizeFirstLetter(jsonContent.title?.toLowerCase())
        : Object.prototype.hasOwnProperty.call(jsonContent, 'modalContent')
        ? capitalizeFirstLetter(jsonContent.modalContent?.toLowerCase())?.slice(
            0,
            12
          )
        : 'A title',
      link: `/${show.template_name.split('-')[1].split(' ')[1]}/${show.id}`,
      desc: jsonContent?.subTitle || 'A description',
      type: show.template_name.split('-')[0],
    };
  });
}

export async function getBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function parsingImageFromJSON(
  jsonContent: any,
  type: 'jumbotron' | 'collection-images',
  collectionFormName?: string
): any {
  if (type === 'jumbotron') {
    return { uid: uuidv4(), uri: jsonContent.jumbotronImage };
  } else {
    return Array.isArray(jsonContent?.[collectionFormName])
      ? jsonContent?.[collectionFormName]?.map((dx, index) => ({
          uid: `existing-${index}`,
          uri: dx,
          url: dx,
        }))
      : [];
  }
}

export function templateNameToRoute(templateName: string) {
  return templateName.split('-')[1].split(' ')[1];
}
