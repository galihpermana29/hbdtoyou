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

export function mapContentToCard(contents: IContent[], purpose = 'client') {
  return contents.map((show) => {
    // Some records store invalid/corrupt JSON in detail_content_json_text.
    // Parse defensively and skip such records instead of crashing the listing.
    let jsonContent: any;
    try {
      jsonContent = JSON.parse(show?.detail_content_json_text || '{}');
    } catch {
      return;
    }

    // Some records (legacy/malformed) have a template_name without the expected
    // `{type}-{...} {route}` shape. Extract the route defensively so a single bad
    // record can't crash the whole listing (e.g. the dashboard).
    const templateName = show?.template_name || '';
    const route = templateName.split('-')[1]?.split(' ')[1];

    // add docs
    // this function is used to get the jumbotron image from the json content
    //also check if the json content is an array and has at least one item
    const handleJumbotron = () => {
      // photobox-newspaper stores its composited front page under `image`.
      // Matched with includes() because its slug contains a dash, which the
      // split('-')[1].split(' ')[1] extraction below would mangle into just
      // "photobox" and drop the card.
      if (templateName.includes('photobox-newspaper')) {
        return jsonContent?.image;
      }

      if (['albumgraduation1'].includes(route)) {
        return jsonContent
          ? Array.isArray(jsonContent?.images)
            ? jsonContent?.images.length > 0
              ? jsonContent?.images[0]
              : null
            : null
          : null;
      }

      if (
        [
          'scrapbook1',
          'scrapbook2',
          'scrapbook3',
          'scrapbook4',
          'scrapbook5',
          'scrapbook6',
          'scrapbook7',
          'scrapbook8',
          'scrapbook9',
          'scrapbook10',
        ].includes(route)
      ) {
        return jsonContent?.coverImage;
      }

      if (['magazinev1', 'spotifyv1', 'magazinev1'].includes(route)) {
        return Array.isArray(jsonContent.momentOfYou)
          ? jsonContent.momentOfYou.length > 0
            ? jsonContent.momentOfYou[0]
            : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg'
          : null;
      }

      if (
        ['netflixv1', 'disneyplusv1', 'newspaperv3', 'newspaperv1'].includes(
          route
        )
      ) {
        return jsonContent.jumbotronImage;
      }

      if (['f1historyv1'].includes(route)) {
        return jsonContent?.images.length > 0
          ? jsonContent.images[0]
          : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg';
      }

      if (['vinylv1', 'arcadeclawv1', 'boardofusv1'].includes(route)) {
        return Array.isArray(jsonContent?.memories) &&
          jsonContent.memories.length > 0
          ? jsonContent.memories[0].imageUrl
          : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg';
      }

      if (templateName.includes('journal')) {
        return 'journal';
      }
    };

    if (!handleJumbotron()) return;

    if (
      purpose === 'client' &&
      Object.prototype.hasOwnProperty.call(jsonContent, 'isPublic') &&
      jsonContent?.isPublic === false
    )
      return;

    return {
      ...show,
      jumbotronImage: handleJumbotron(),
      title: show?.title
        ? show.title
        : Object.prototype.hasOwnProperty.call(jsonContent, 'title')
          ? capitalizeFirstLetter(jsonContent.title?.toLowerCase())
          : Object.prototype.hasOwnProperty.call(jsonContent, 'modalContent')
            ? capitalizeFirstLetter(
                jsonContent.modalContent?.toLowerCase()
              )?.slice(0, 12)
            : 'A title',
      link: templateName.includes('journal')
        ? `/journal/${show.id}`
        : templateName.includes('photobox-newspaper')
          ? `/photobox-newspaper/${show.id}`
          : `/${route}/${show.id}`,
      desc: show?.caption
        ? show?.caption
        : jsonContent?.subTitle || 'A description',
      type: templateName.split('-')[0],
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

// create function to make thousand with comma separator
export function formatNumberWithComma(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
