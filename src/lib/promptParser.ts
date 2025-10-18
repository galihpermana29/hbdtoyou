import { message } from 'antd';

export interface ParsedPrompt {
  main_theme: string;
  specific_instructions: Array<{
    page: number;
    texts: string[];
  }>;
}

export function parsePromptContent(htmlContent: string): ParsedPrompt | null {
  try {
    // Check if required sections exist
    if (
      !htmlContent.includes('Main Story &amp; Vibe:') &&
      !htmlContent.includes('Main Story & Vibe:')
    ) {
      message.error(
        'Missing "Main Story & Vibe:" section. Please include this required section.'
      );
      return null;
    }

    if (!htmlContent.includes('Specific Page Instructions:')) {
      message.error(
        'Missing "Specific Page Instructions:" section. Please include this required section.'
      );
      return null;
    }

    // Parse main theme
    let mainTheme = '';
    const mainStoryRegex =
      /<h4>Main Story &(?:amp;)? Vibe:<\/h4>([\s\S]*?)(?=<h4>|$)/;
    const mainStoryMatch = htmlContent.match(mainStoryRegex);

    if (mainStoryMatch && mainStoryMatch[1]) {
      // Remove HTML tags and clean up the text
      mainTheme = mainStoryMatch[1]
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    if (!mainTheme) {
      message.error(
        'Main Story & Vibe section is empty. Please provide content for this section.'
      );
      return null;
    }

    // Parse specific instructions
    const specificInstructions: Array<{ page: number; texts: string[] }> = [];
    const instructionsRegex =
      /<h4>Specific Page Instructions:<\/h4>([\s\S]*?)(?=<p><em>|$)/;
    const instructionsMatch = htmlContent.match(instructionsRegex);

    if (instructionsMatch && instructionsMatch[1]) {
      const instructionsContent = instructionsMatch[1];

      // Find all page sections (both bolded and non-bolded)
      const pageRegex =
        /<p>(?:<strong>)?Page (\d+):?(?:<\/strong>)?<\/p><ul>([\s\S]*?)<\/ul>/g;
      let pageMatch;

      while ((pageMatch = pageRegex.exec(instructionsContent)) !== null) {
        const pageNumber = parseInt(pageMatch[1]);
        const listContent = pageMatch[2];

        // Extract list items
        const listItemRegex = /<li><p>(.*?)<\/p><\/li>/g;
        const texts: string[] = [];
        let listItemMatch;

        while ((listItemMatch = listItemRegex.exec(listContent)) !== null) {
          const text = listItemMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          if (text) {
            texts.push(text);
          }
        }

        if (texts.length > 0) {
          specificInstructions.push({
            page: pageNumber,
            texts: texts,
          });
        }
      }
    }

    // Validate that we have at least some specific instructions
    // if (specificInstructions.length === 0) {
    //   message.error('No specific page instructions found. Please add at least one page with instructions.');
    //   return null;
    // }

    return {
      main_theme: mainTheme,
      specific_instructions: specificInstructions,
    };
  } catch (error) {
    console.error('Error parsing prompt content:', error);
    message.error('Failed to parse prompt content. Please check the format.');
    return null;
  }
}

// Helper function to validate prompt structure
export function validatePromptStructure(htmlContent: string): boolean {
  const hasMainStory =
    htmlContent.includes('Main Story &amp; Vibe:') ||
    htmlContent.includes('Main Story & Vibe:');
  const hasInstructions = htmlContent.includes('Specific Page Instructions:');

  if (!hasMainStory) {
    message.error('Missing "Main Story & Vibe:" section.');
    return false;
  }

  if (!hasInstructions) {
    message.error('Missing "Specific Page Instructions:" section.');
    return false;
  }

  return true;
}
