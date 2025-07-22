import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const API_KEY = 'AIzaSyBf6sat7D9cj_HGnV_YdJVi1om_P4zL5mI';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface GraduationData {
  name: string;
  subtitle: string;
  graduationDate: string;
  graduationTime: string;
  graduationPlace: string;
  graduationMapEmbedUrl: string;
  storyDescription: string;
  synopsis: string;
  episodes: {
    number: number;
    title: string;
    duration: string;
    description: string;
    image: string;
  }[];
  galleryImages: {
    src: string;
    alt: string;
  }[];
  wishes: {
    name: string;
    message: string;
    profileType: 'green' | 'yellow' | 'red';
  }[];
}

export interface GraduationInput {
  name: string;
  university: string;
  graduationDate: string;
  movieGenre: string;
}

export async function generateGraduationStory(input: GraduationInput): Promise<GraduationData> {
  // Access the model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Generate a Netflix-style graduation story for a student with the following details:
    - Name: ${input.name}
    - University: ${input.university}
    - Graduation Date: ${input.graduationDate}
    - Movie Genre for their bachelor journey: ${input.movieGenre}

    From only these details, you must invent a central conflict and a narrative arc that perfectly fits the specified movie genre. The tone, plot points, and episode titles must be heavily influenced by the ${input.movieGenre}.

    Create a graduation journey narrative with the following components:

    - A catchy subtitle: A genre-appropriate tagline for the series.
    - A logline: A powerful, one-sentence hook that captures the essence of a university journey as if it were a ${input.movieGenre} film.
    - A compelling synopsis: A descriptive paragraph (3-5 sentences) that sets the scene at ${input.university}. It should introduce ${input.name} as the protagonist and establish the high stakes and a central, genre-specific conflict leading up to their ${input.graduationDate}.
    - Four episodes that follow a clear narrative arc:
      - Episode 1 (The Setup): Introduce the protagonist's initial hopes and the first signs of the genre-specific conflict.
      - Episode 2 (The Rising Stakes): Depict the main struggle escalating, pushing the protagonist to their limits.
      - Episode 3 (The Climax): Showcase the peak of their academic or personal struggle—the final, make-or-break moment of their degree.
      - Episode 4 (The Finale): Show the resolution of the conflict, the graduation itself, and a final scene that reflects the journey's genre.
    
    Format your response as a JSON object without any explanations or additional text.
    
    The JSON structure should match this format:
    {
      "subtitle": "...",
      "storyDescription": "...",
      "synopsis": "...",
      "episodes": [
        {
          "number": 1,
          "title": "Episode 1: ...",
          "duration": "26m 10s",
          "description": "..."
        },
        ...
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    const generatedContent = JSON.parse(jsonContent);

    // Create a map URL based on the university
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.49131625626!2d106.66470603628709!3d-6.2297209292163895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1752330835231!5m2!1sid!2sid`;

    // Sample images for episodes
    const sampleImages = [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511968/DSC00322_wqazoc.jpg',
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752512189/DSC00418_kam90v.jpg',
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511974/DSC00350_ba15tz.jpg',
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511968/DSC00322_wqazoc.jpg'
    ];

    // Add images to episodes
    const episodesWithImages = generatedContent.episodes.map((episode: any, index: number) => ({
      ...episode,
      image: sampleImages[index % sampleImages.length]
    }));

    // Create gallery images
    const galleryImages = Array(6).fill(null).map((_, index) => ({
      src: sampleImages[index % sampleImages.length],
      alt: `Graduation gallery image ${index + 1}`
    }));

    // Sample wishes
    const sampleWishes = [
      {
        name: 'Veronica Erlinda Kristyowati',
        message: `Congratulations on your graduation, ${input.name}! Your hard work has paid off!`,
        profileType: 'green' as const
      },
      {
        name: 'Andhika Shafian',
        message: `So proud of you, ${input.name}! This is just the beginning of your amazing journey!`,
        profileType: 'yellow' as const
      },
      {
        name: 'Anita Dwi Ristanti',
        message: `Congratulations! Wishing you all the best in your future endeavors!`,
        profileType: 'red' as const
      }
    ];

    // Construct the complete graduation data
    const graduationData: GraduationData = {
      name: `${input.name}: Graduation Day`,
      subtitle: generatedContent.subtitle,
      graduationDate: input.graduationDate,
      graduationTime: '16:00 WIB',
      graduationPlace: input.university,
      graduationMapEmbedUrl: mapUrl,
      storyDescription: generatedContent.storyDescription,
      synopsis: generatedContent.synopsis,
      episodes: episodesWithImages,
      galleryImages: galleryImages,
      wishes: sampleWishes
    };

    return graduationData;
  } catch (error) {
    throw new Error('Failed to generate graduation story');
  }
}
