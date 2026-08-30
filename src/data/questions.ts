import type { Locale } from '../store/game';

/**
 * Placeholder round.
 *
 * The anti-AI format means every question is anchored to a piece of media
 * the player has to actually look at — in production each record carries a
 * server-issued image URL plus the `mediaId` shown in the frame, so an
 * answer can be traced back to the exact asset that was served. Until that
 * endpoint exists the media falls back to the bundled estate illustration.
 *
 * Prompts and answers carry both languages inline rather than living in the
 * string tables: they are content, not chrome, and a server will return them
 * the same way — one row, every locale it has.
 */

export type CategoryKey = 'travel' | 'culture';

type Localised = Record<Locale, string>;
type LocalisedAnswers = Record<Locale, [string, string, string, string]>;

export interface Question {
  id: number;
  category: CategoryKey;
  prompt: Localised;
  answers: LocalisedAnswers;
  correct: 0 | 1 | 2 | 3;
  mediaId: string;
}

export const ROUND_LENGTH = 10;
/** Seconds per question. Short by design — it is the anti-cheat budget. */
export const TIME_LIMIT = 5;

export const questions: Question[] = [
  {
    id: 1,
    category: 'travel',
    prompt: {
      en: 'Which village hosts this 19th-century wine estate?',
      ka: 'რომელ სოფელშია ეს XIX საუკუნის მარანი?',
    },
    answers: {
      en: ['Sighnaghi', 'Tsinandali', 'Telavi', 'Kvareli'],
      ka: ['სიღნაღი', 'წინანდალი', 'თელავი', 'ყვარელი'],
    },
    correct: 1,
    mediaId: '4821',
  },
  {
    id: 2,
    category: 'travel',
    prompt: {
      en: 'Which range rises behind the vineyard in this frame?',
      ka: 'რომელი ქედი ჩანს ვენახის უკან ამ კადრში?',
    },
    answers: {
      en: ['Greater Caucasus', 'Lesser Caucasus', 'Carpathians', 'Pontics'],
      ka: ['დიდი კავკასიონი', 'მცირე კავკასიონი', 'კარპატები', 'პონტოს ქედი'],
    },
    correct: 0,
    mediaId: '4822',
  },
  {
    id: 3,
    category: 'culture',
    prompt: {
      en: 'What grape is these terraces best known for?',
      ka: 'რომელი ჯიშით არის ეს ტერასები ცნობილი?',
    },
    answers: {
      en: ['Saperavi', 'Rkatsiteli', 'Mtsvane', 'Kisi'],
      ka: ['საფერავი', 'რქაწითელი', 'მწვანე', 'ქისი'],
    },
    correct: 1,
    mediaId: '4823',
  },
  {
    id: 4,
    category: 'travel',
    prompt: {
      en: 'Roughly what hour is the light in this photograph?',
      ka: 'დღის რომელ მონაკვეთშია გადაღებული ეს კადრი?',
    },
    answers: {
      en: ['Dawn', 'Noon', 'Golden hour', 'Blue hour'],
      ka: ['გამთენიისას', 'შუადღისას', 'ოქროს საათი', 'ლურჯი საათი'],
    },
    correct: 2,
    mediaId: '4824',
  },
  {
    id: 5,
    category: 'culture',
    prompt: {
      en: 'What is the roof of the estate building made of?',
      ka: 'რისგან არის შენობის სახურავი?',
    },
    answers: {
      en: ['Slate', 'Clay tile', 'Thatch', 'Corrugated iron'],
      ka: ['ფიქალი', 'თიხის კრამიტი', 'ლერწამი', 'თუნუქი'],
    },
    correct: 1,
    mediaId: '4825',
  },
];

/** Rounds are 10 questions; the bank cycles until the bank is bigger. */
export function questionAt(index: number): Question {
  return questions[index % questions.length];
}
