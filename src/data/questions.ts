import type { Locale } from '../store/game';

/**
 * Placeholder bank.
 *
 * The anti-AI format means every question is meant to be anchored to a piece
 * of media the player has to actually look at — in production each record
 * carries a server-issued image URL plus the `mediaId` shown in the frame, so
 * an answer can be traced back to the exact asset that was served. Until that
 * endpoint exists these stand in as general knowledge and the media falls back
 * to the bundled estate illustration.
 *
 * The bank must hold at least ROUND_LENGTH questions: buildRound draws without
 * replacement, and a round that repeats a question hands the player the answer
 * the second time around.
 *
 * Prompts and answers carry both languages inline rather than living in the
 * string tables: they are content, and a server will return them the same way
 * — one row, every locale it has.
 */

export type CategoryKey = 'travel' | 'culture' | 'tech' | 'experience';

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
  {
    id: 6,
    category: 'travel',
    prompt: {
      en: 'Which sea borders Georgia to the west?',
      ka: 'რომელი ზღვა ესაზღვრება საქართველოს დასავლეთიდან?',
    },
    answers: {
      en: ['Caspian Sea', 'Sea of Azov', 'Black Sea', 'Mediterranean Sea'],
      ka: ['კასპიის ზღვა', 'აზოვის ზღვა', 'შავი ზღვა', 'ხმელთაშუა ზღვა'],
    },
    correct: 2,
    mediaId: '4826',
  },
  {
    id: 7,
    category: 'travel',
    prompt: {
      en: 'What is the highest peak in Georgia?',
      ka: 'რომელია საქართველოს უმაღლესი მწვერვალი?',
    },
    answers: {
      en: ['Kazbegi', 'Shkhara', 'Ushba', 'Tetnuldi'],
      ka: ['ყაზბეგი', 'შხარა', 'უშბა', 'თეთნულდი'],
    },
    correct: 1,
    mediaId: '4827',
  },
  {
    id: 8,
    category: 'travel',
    prompt: {
      en: 'Which town was the ancient capital of the Georgian kingdom?',
      ka: 'რომელი ქალაქი იყო ქართლის სამეფოს ძველი დედაქალაქი?',
    },
    answers: {
      en: ['Kutaisi', 'Telavi', 'Gori', 'Mtskheta'],
      ka: ['ქუთაისი', 'თელავი', 'გორი', 'მცხეთა'],
    },
    correct: 3,
    mediaId: '4828',
  },
  {
    id: 9,
    category: 'travel',
    prompt: {
      en: 'Which Tbilisi district is known for its sulphur baths?',
      ka: 'თბილისის რომელი უბანია გოგირდის აბანოებით ცნობილი?',
    },
    answers: {
      en: ['Abanotubani', 'Vake', 'Saburtalo', 'Gldani'],
      ka: ['აბანოთუბანი', 'ვაკე', 'საბურთალო', 'გლდანი'],
    },
    correct: 0,
    mediaId: '4829',
  },
  {
    id: 10,
    category: 'travel',
    prompt: {
      en: 'Batumi is the capital of which region?',
      ka: 'ბათუმი რომელი მხარის ცენტრია?',
    },
    answers: {
      en: ['Guria', 'Samegrelo', 'Adjara', 'Imereti'],
      ka: ['გურია', 'სამეგრელო', 'აჭარა', 'იმერეთი'],
    },
    correct: 2,
    mediaId: '4830',
  },
  {
    id: 11,
    category: 'culture',
    prompt: {
      en: 'What clay vessel is Georgian wine traditionally fermented in?',
      ka: 'თიხის რომელ ჭურჭელში დუღს ტრადიციულად ქართული ღვინო?',
    },
    answers: {
      en: ['Amphora', 'Qvevri', 'Pithos', 'Dolium'],
      ka: ['ამფორა', 'ქვევრი', 'პითოსი', 'დოლიუმი'],
    },
    correct: 1,
    mediaId: '4831',
  },
  {
    id: 12,
    category: 'culture',
    prompt: {
      en: 'How many letters does the modern Georgian alphabet have?',
      ka: 'რამდენი ასოა თანამედროვე ქართულ ანბანში?',
    },
    answers: {
      en: ['28', '31', '33', '38'],
      ka: ['28', '31', '33', '38'],
    },
    correct: 2,
    mediaId: '4832',
  },
  {
    id: 13,
    category: 'culture',
    prompt: {
      en: 'Which Georgian folk song travelled on the Voyager Golden Record?',
      ka: 'რომელი ქართული ხალხური სიმღერა წაიღო Voyager-ის ოქროს ფირფიტამ?',
    },
    answers: {
      en: ['Chakrulo', 'Suliko', 'Mravalzhamier', 'Shen khar venakhi'],
      ka: ['ჩაკრულო', 'სულიკო', 'მრავალჟამიერ', 'შენ ხარ ვენახი'],
    },
    correct: 0,
    mediaId: '4833',
  },
  {
    id: 14,
    category: 'culture',
    prompt: {
      en: 'Which of these is a Georgian dumpling?',
      ka: 'რომელია ქართული მოხარშული ცომეული?',
    },
    answers: {
      en: ['Khachapuri', 'Lobio', 'Pkhali', 'Khinkali'],
      ka: ['ხაჭაპური', 'ლობიო', 'ფხალი', 'ხინკალი'],
    },
    correct: 3,
    mediaId: '4834',
  },
  {
    id: 15,
    category: 'culture',
    prompt: {
      en: 'Which script is Georgian written in today?',
      ka: 'რომელი დამწერლობით იწერება ქართული დღეს?',
    },
    answers: {
      en: ['Asomtavruli', 'Mkhedruli', 'Nuskhuri', 'Cyrillic'],
      ka: ['ასომთავრული', 'მხედრული', 'ნუსხური', 'კირილიცა'],
    },
    correct: 1,
    mediaId: '4835',
  },
  {
    id: 16,
    category: 'experience',
    prompt: {
      en: 'Which autumn festival marks the Georgian grape harvest?',
      ka: 'რომელი შემოდგომის დღესასწაული აღნიშნავს ყურძნის მოსავალს?',
    },
    answers: {
      en: ['Tbilisoba', 'Alilo', 'Rtveli', 'Berikaoba'],
      ka: ['თბილისობა', 'ალილო', 'რთველი', 'ბერიკაობა'],
    },
    correct: 2,
    mediaId: '4836',
  },
  {
    id: 17,
    category: 'tech',
    prompt: {
      en: 'Which company created React Native?',
      ka: 'რომელმა კომპანიამ შექმნა React Native?',
    },
    answers: {
      en: ['Google', 'Apple', 'Meta', 'Microsoft'],
      ka: ['Google', 'Apple', 'Meta', 'Microsoft'],
    },
    correct: 2,
    mediaId: '4837',
  },
  {
    id: 18,
    category: 'tech',
    prompt: {
      en: 'Which protocol encrypts traffic on modern websites?',
      ka: 'რომელი პროტოკოლი შიფრავს თანამედროვე საიტების ტრაფიკს?',
    },
    answers: {
      en: ['FTP', 'TLS', 'SMTP', 'DNS'],
      ka: ['FTP', 'TLS', 'SMTP', 'DNS'],
    },
    correct: 1,
    mediaId: '4838',
  },
  {
    id: 19,
    category: 'tech',
    prompt: {
      en: 'In what year was the first iPhone released?',
      ka: 'რომელ წელს გამოვიდა პირველი iPhone?',
    },
    answers: {
      en: ['2004', '2005', '2006', '2007'],
      ka: ['2004', '2005', '2006', '2007'],
    },
    correct: 3,
    mediaId: '4839',
  },
  {
    id: 20,
    category: 'tech',
    prompt: {
      en: 'Which language runs natively in a web browser?',
      ka: 'რომელი ენა სრულდება ბრაუზერში პირდაპირ?',
    },
    answers: {
      en: ['JavaScript', 'Python', 'Ruby', 'Go'],
      ka: ['JavaScript', 'Python', 'Ruby', 'Go'],
    },
    correct: 0,
    mediaId: '4840',
  },
];

/** Fisher-Yates, in place. */
function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * A question as it is actually asked: same content, answers in a fresh order.
 *
 * `correct` points at the new position, so the screen needs no idea that
 * anything moved.
 */
export type RoundQuestion = Question;

/**
 * Deals one question with its answers reordered.
 *
 * Both locales get the *same* permutation — they are the same four options in
 * two languages, and shuffling them independently would put the Georgian
 * answer under a different letter than the English one.
 */
export function shuffleAnswers(q: Question): RoundQuestion {
  const order = shuffle([0, 1, 2, 3]);
  const pickFrom = (answers: readonly string[]) =>
    order.map((i) => answers[i]) as [string, string, string, string];

  return {
    ...q,
    answers: { en: pickFrom(q.answers.en), ka: pickFrom(q.answers.ka) },
    correct: order.indexOf(q.correct) as 0 | 1 | 2 | 3,
  };
}

/**
 * One round's worth of questions, drawn without replacement.
 *
 * The bank used to be cycled with a modulo, which meant a ten-question round
 * over a five-question bank showed every question twice — the second half was
 * free marks. Shuffling a copy and taking the first `length` makes a repeat
 * impossible within a round.
 *
 * Answers are reordered too. The bank is fixed and small, so a player who
 * sees a question twice across two rounds would otherwise be answering from
 * the position they remember rather than the question.
 */
export function buildRound(
  length = ROUND_LENGTH,
  bank: Question[] = questions,
): RoundQuestion[] {
  return shuffle([...bank])
    .slice(0, Math.min(length, bank.length))
    .map(shuffleAnswers);
}
