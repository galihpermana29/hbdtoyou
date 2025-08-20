import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface GraduationData {
  name: string;
  subtitle: string;
  graduationDate: string;
  graduationTime: string;
  graduationPlace: string;
  storyDescription: string;
  synopsis: string;
  episodes: {
    number: number;
    title: string;
    duration: string;
    description: string;
    image: string;
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
    Primary Instruction: Generate a Netflix-style graduation story using simple, accessible English for a non-native audience.

    Core Creative Task (Two-Step Process):
    1. First, based on the user-provided '${input.movieGenre}', SILENTLY choose a single, globally popular, and iconic film or series that is a perfect example of that genre. (e.g., if genre is Fantasy, you might choose 'The Lord of the Rings'; if Comedy, 'The Office'; if Sci-Fi, 'The Matrix'; if Thriller, 'A Quiet Place').
    2. Your main goal is then to adapt the unique TONE, STYLE, character archetypes, and iconic MOMENTS from your chosen film/series into a compelling university narrative.

    IMPORTANT CONSTRAINT: Do NOT simply retell the plot of the chosen movie. Use it as an inspiration for the VIBE and for specific, adaptable scenes ONLY. The story must remain about the student's graduation journey.

    Generate a Netflix-style graduation story for a student with the following details:
    - Name: ${input.name}
    - University: ${input.university}
    - Graduation Date: ${input.graduationDate}
    - Movie Genre: ${input.movieGenre}

    Create a graduation journey narrative with the following components:

    - A creative main title: The title should be a clever parody or homage to the chosen film's title, adapted for a university context. AVOID generic titles.
    - A catchy subtitle: A tagline that feels like it could be on the poster for your chosen film.
    - A logline: A powerful, one-sentence hook that captures the university journey through the stylistic lens of the chosen film.
    - A compelling synopsis: A paragraph that sets up a central conflict mirroring a theme from the chosen film (e.g., an impossible journey for 'Lord of the Rings', surviving a chaotic workplace for 'The Office').
    - Four episodes where the titles and descriptions contain subtle references or stylistic nods to iconic scenes, quotes, or elements from the chosen film, following a classic four-act structure.
    
    Format your response as a JSON object without any explanations or additional text.
    
    The JSON structure should match this format:
    {
      "title": "...",
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

    // Construct the complete graduation data
    const graduationData: GraduationData = {
      name: `${input.name}: Graduation Day`,
      subtitle: generatedContent.subtitle,
      graduationDate: input.graduationDate,
      graduationTime: '16:00 WIB',
      graduationPlace: input.university,
      storyDescription: generatedContent.storyDescription,
      synopsis: generatedContent.synopsis,
      episodes: generatedContent.episodes,
    };

    return graduationData;
  } catch (error) {
    console.error('Error generating graduation story:', error);
    throw new Error('Failed to generate graduation story');
  }
}
