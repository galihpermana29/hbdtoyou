export const modelSelectData = [
  {
    label: 'Memo AI 1.0 (Cropping & Layouting)',
    value: 'memo-ai-1.0',
  },
  {
    label: 'Memo AI 2.0 (Generative/Custom Text)',
    value: 'memo-ai-2.0',
  },
];

export const stringInitialPrompt =
  '<h4>Main Story &amp; Vibe:</h4><p></p><h4>Specific Page Instructions:</h4><p></p>';

export const templatesPrompt = [
  'Custom',
  'Birthday',
  'Anniversary',
  'Graduation',
  'Office Retirement',
  'Engagement',
  'Wedding',
  'Vacation',
];

export const templatePrompts = {
  Custom: stringInitialPrompt,
  Birthday:
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for <strong>Sarah's</strong> birthday.</p><p>I want the main theme to be about <strong>how amazing she is, our favorite memories together, and celebrating another year of life. </strong>The overall tone should be <strong>joyful and heartfelt.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>Happy <strong>25th</strong> birthday to the most incredible person!</p></li><li><p>Another year of adventures awaits you.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>Here's to all the laughs, memories, and cake we'll share this year!</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
  Anniversary:
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for <strong>John and Maria's</strong> anniversary.</p><p>I want the main theme to be about <strong>their journey together, milestones they've achieved, and the love that keeps growing. </strong>The overall tone should be <strong>romantic and nostalgic.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>Celebrating <strong>5 years</strong> of love, laughter, and endless adventures.</p></li><li><p>From our first date to building our home together.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>Here's to many more years of growing old together.</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
  Graduation:
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for <strong>Alex's</strong> graduation.</p><p>I want the main theme to be about <strong>their hard work, achievements, and the exciting future ahead. </strong>The overall tone should be <strong>proud and inspiring.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>Congratulations on graduating with your <strong>Bachelor's degree</strong>!</p></li><li><p>All those late nights studying finally paid off.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>The world is yours to conquer - go chase your dreams!</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
  'Office Retirement':
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for <strong>Robert's</strong> retirement.</p><p>I want the main theme to be about <strong>his incredible career, the impact he made, and the well-deserved rest ahead. </strong>The overall tone should be <strong>appreciative and celebratory.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>After <strong>30 years</strong> of dedicated service, it's time to enjoy life!</p></li><li><p>Thank you for being an amazing mentor and colleague.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>Wishing you endless golf games and peaceful mornings ahead.</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
  Engagement:
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for <strong>Emma and David's</strong> engagement.</p><p>I want the main theme to be about <strong>their love story, the proposal moment, and excitement for their future together. </strong>The overall tone should be <strong>romantic and joyful.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>She said <strong>YES</strong>! The perfect start to forever.</p></li><li><p>From dating to engaged - what a beautiful journey.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>Can't wait to celebrate your wedding day with you both!</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
  Wedding:
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for <strong>Lisa and Michael's</strong> wedding.</p><p>I want the main theme to be about <strong>their special day, the love they share, and the beginning of their married life. </strong>The overall tone should be <strong>romantic and celebratory.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>Two hearts became one on this beautiful <strong>June 15th</strong> day.</p></li><li><p>Surrounded by family and friends, you said 'I do'.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>May your marriage be filled with endless love and happiness.</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
  Vacation:
    "<p>Here's an example to guide our AI storyteller</p><p></p><h4>Main Story &amp; Vibe:</h4><p>Create a scrapbook story for our <strong>family trip to Bali</strong>.</p><p>I want the main theme to be about <strong>the amazing places we visited, funny moments, and memories we made together. </strong>The overall tone should be <strong>fun and adventurous.</strong></p><p></p><h4>Specific Page Instructions:</h4><p><strong>Page 2</strong></p><ul><li><p>Our <strong>7-day</strong> adventure in paradise was absolutely incredible!</p></li><li><p>From beautiful beaches to delicious local food.</p></li></ul><p><strong>Page 4</strong></p><ul><li><p>Already planning our next family getaway together!</p></li></ul><p></p><p><em>(Optional: Write your own text for specific pages below. Just fill in the bullet points. You can add or remove points as needed.)</em></p>",
};
