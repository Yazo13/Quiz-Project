/**
 * Placeholder round.
 *
 * The anti-AI format means every question is anchored to a piece of media
 * the player has to actually look at — in production each record carries a
 * server-issued image URL plus the `mediaId` shown in the frame, so an
 * answer can be traced back to the exact asset that was served. Until that
 * endpoint exists the media falls back to the bundled estate illustration.
 */
export interface Question {
  id: number;
  category: string;
  prompt: string;
  answers: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  mediaId: string;
}

export const ROUND_LENGTH = 10;
/** Seconds per question. Short by design — it is the anti-cheat budget. */
export const TIME_LIMIT = 5;

export const questions: Question[] = [
  {
    id: 1,
    category: 'Travel',
    prompt: 'Which village hosts this 19th-century wine estate?',
    answers: ['Sighnaghi', 'Tsinandali', 'Telavi', 'Kvareli'],
    correct: 1,
    mediaId: '4821',
  },
  {
    id: 2,
    category: 'Travel',
    prompt: 'Which range rises behind the vineyard in this frame?',
    answers: ['Greater Caucasus', 'Lesser Caucasus', 'Carpathians', 'Pontics'],
    correct: 0,
    mediaId: '4822',
  },
  {
    id: 3,
    category: 'Culture',
    prompt: 'What grape is these terraces best known for?',
    answers: ['Saperavi', 'Rkatsiteli', 'Mtsvane', 'Kisi'],
    correct: 1,
    mediaId: '4823',
  },
  {
    id: 4,
    category: 'Travel',
    prompt: 'Roughly what hour is the light in this photograph?',
    answers: ['Dawn', 'Noon', 'Golden hour', 'Blue hour'],
    correct: 2,
    mediaId: '4824',
  },
  {
    id: 5,
    category: 'Culture',
    prompt: 'What is the roof of the estate building made of?',
    answers: ['Slate', 'Clay tile', 'Thatch', 'Corrugated iron'],
    correct: 1,
    mediaId: '4825',
  },
];

/** Rounds are 10 questions; the bank cycles until the bank is bigger. */
export function questionAt(index: number): Question {
  return questions[index % questions.length];
}
