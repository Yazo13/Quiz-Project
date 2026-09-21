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
 * Every category must clear that bar on its own, not just the bank as a whole.
 * The arena offers four of them as a choice, and a category that cannot fill a
 * round is a choice that leads somewhere shorter and poorer than the others.
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
  {
    id: 21,
    category: 'travel',
    prompt: {
      en: 'Which region holds Georgia’s highest inhabited villages?',
      ka: 'რომელ მხარეშია საქართველოს ყველაზე მაღალმთიანი დასახლებები?',
    },
    answers: {
      en: ['Kakheti', 'Svaneti', 'Imereti', 'Guria'],
      ka: ['კახეთი', 'სვანეთი', 'იმერეთი', 'გურია'],
    },
    correct: 1,
    mediaId: '4841',
  },
  {
    id: 22,
    category: 'travel',
    prompt: {
      en: 'Which river runs through Tbilisi?',
      ka: 'რომელი მდინარე მიედინება თბილისში?',
    },
    answers: {
      en: ['Rioni', 'Alazani', 'Mtkvari', 'Enguri'],
      ka: ['რიონი', 'ალაზანი', 'მტკვარი', 'ენგური'],
    },
    correct: 2,
    mediaId: '4842',
  },
  {
    id: 23,
    category: 'culture',
    prompt: {
      en: 'Who wrote The Knight in the Panther’s Skin?',
      ka: 'ვინ დაწერა „ვეფხისტყაოსანი“?',
    },
    answers: {
      en: ['Shota Rustaveli', 'Vazha-Pshavela', 'Galaktion Tabidze', 'Ilia Chavchavadze'],
      ka: ['შოთა რუსთაველი', 'ვაჟა-ფშაველა', 'გალაკტიონ ტაბიძე', 'ილია ჭავჭავაძე'],
    },
    correct: 0,
    mediaId: '4843',
  },
  {
    id: 24,
    category: 'culture',
    prompt: {
      en: 'Who leads a Georgian feast?',
      ka: 'ვინ უძღვება ქართულ სუფრას?',
    },
    answers: {
      en: ['The eldest guest', 'The cook', 'The host’s neighbour', 'The tamada'],
      ka: ['უხუცესი სტუმარი', 'მზარეული', 'მასპინძლის მეზობელი', 'თამადა'],
    },
    correct: 3,
    mediaId: '4844',
  },
  {
    id: 25,
    category: 'culture',
    prompt: {
      en: 'Which Georgian script was used for religious manuscripts?',
      ka: 'ქართული დამწერლობის რომელი სახეობით იწერებოდა სასულიერო ხელნაწერები?',
    },
    answers: {
      en: ['Mkhedruli', 'Nuskhuri', 'Latin', 'Cyrillic'],
      ka: ['მხედრული', 'ნუსხური', 'ლათინური', 'კირილიცა'],
    },
    correct: 1,
    mediaId: '4845',
  },
  {
    id: 26,
    category: 'tech',
    prompt: {
      en: 'Which company develops Android?',
      ka: 'რომელი კომპანია ავითარებს Android-ს?',
    },
    answers: {
      en: ['Apple', 'Google', 'Meta', 'Samsung'],
      ka: ['Apple', 'Google', 'Meta', 'Samsung'],
    },
    correct: 1,
    mediaId: '4846',
  },
  {
    id: 27,
    category: 'tech',
    prompt: {
      en: 'What does a VPN mainly give you?',
      ka: 'რას გაძლევს VPN უპირველესად?',
    },
    answers: {
      en: ['More storage', 'Faster charging', 'An encrypted tunnel', 'A louder speaker'],
      ka: ['მეტ მეხსიერებას', 'სწრაფ დამუხტვას', 'დაშიფრულ არხს', 'ხმამაღალ დინამიკს'],
    },
    correct: 2,
    mediaId: '4847',
  },
  {
    id: 28,
    category: 'tech',
    prompt: {
      en: 'Which of these is a version control system?',
      ka: 'რომელია ვერსიების კონტროლის სისტემა?',
    },
    answers: {
      en: ['Nginx', 'Redis', 'Docker', 'Git'],
      ka: ['Nginx', 'Redis', 'Docker', 'Git'],
    },
    correct: 3,
    mediaId: '4848',
  },
  {
    id: 29,
    category: 'tech',
    prompt: {
      en: 'How many bits are in a byte?',
      ka: 'რამდენი ბიტია ერთ ბაიტში?',
    },
    answers: {
      en: ['4', '8', '16', '32'],
      ka: ['4', '8', '16', '32'],
    },
    correct: 1,
    mediaId: '4849',
  },
  {
    id: 30,
    category: 'tech',
    prompt: {
      en: 'Which language is TypeScript built on?',
      ka: 'რომელ ენაზეა TypeScript აგებული?',
    },
    answers: {
      en: ['Java', 'Python', 'JavaScript', 'C#'],
      ka: ['Java', 'Python', 'JavaScript', 'C#'],
    },
    correct: 2,
    mediaId: '4850',
  },
  {
    id: 31,
    category: 'tech',
    prompt: {
      en: 'What is "the cloud", in plain terms?',
      ka: 'რა არის „ღრუბელი“ მარტივად რომ ვთქვათ?',
    },
    answers: {
      en: ['Someone else’s computers', 'Satellites', 'A wireless signal', 'A weather system'],
      ka: ['სხვისი კომპიუტერები', 'თანამგზავრები', 'უსადენო სიგნალი', 'ამინდის სისტემა'],
    },
    correct: 0,
    mediaId: '4851',
  },
  {
    id: 32,
    category: 'experience',
    prompt: {
      en: 'Which Georgian resort is known for skiing?',
      ka: 'რომელი ქართული კურორტია თხილამურებით ცნობილი?',
    },
    answers: {
      en: ['Sighnaghi', 'Gudauri', 'Mtskheta', 'Poti'],
      ka: ['სიღნაღი', 'გუდაური', 'მცხეთა', 'ფოთი'],
    },
    correct: 1,
    mediaId: '4852',
  },
  {
    id: 33,
    category: 'experience',
    prompt: {
      en: 'What is a supra?',
      ka: 'რა არის სუფრა?',
    },
    answers: {
      en: ['A mountain pass', 'A type of bread', 'A folk instrument', 'A feast with a toastmaster'],
      ka: ['მთის უღელტეხილი', 'პურის სახეობა', 'ხალხური საკრავი', 'ნადიმი თამადით'],
    },
    correct: 3,
    mediaId: '4853',
  },
  {
    id: 34,
    category: 'experience',
    prompt: {
      en: 'What kind of instrument is the panduri?',
      ka: 'როგორი საკრავია ფანდური?',
    },
    answers: {
      en: ['A three-string lute', 'A drum', 'A flute', 'A horn'],
      ka: ['სამსიმიანი საკრავი', 'დასარტყამი', 'სასულე', 'რქა'],
    },
    correct: 0,
    mediaId: '4854',
  },
  {
    id: 35,
    category: 'experience',
    prompt: {
      en: 'Which word is the Georgian toast?',
      ka: 'რომელი სიტყვაა ქართული სადღეგრძელო?',
    },
    answers: {
      en: ['Gamarjoba', 'Nakhvamdis', 'Gaumarjos', 'Madloba'],
      ka: ['გამარჯობა', 'ნახვამდის', 'გაუმარჯოს', 'მადლობა'],
    },
    correct: 2,
    mediaId: '4855',
  },
  {
    id: 36,
    category: 'experience',
    prompt: {
      en: 'Which Black Sea city has the famous botanical garden?',
      ka: 'შავი ზღვის რომელ ქალაქშია ცნობილი ბოტანიკური ბაღი?',
    },
    answers: {
      en: ['Batumi', 'Poti', 'Anaklia', 'Kobuleti'],
      ka: ['ბათუმი', 'ფოთი', 'ანაკლია', 'ქობულეთი'],
    },
    correct: 0,
    mediaId: '4856',
  },
  {
    id: 37,
    category: 'experience',
    prompt: {
      en: 'What is a marani?',
      ka: 'რა არის მარანი?',
    },
    answers: {
      en: ['A bell tower', 'A wine cellar', 'A bridge', 'A market'],
      ka: ['სამრეკლო', 'ღვინის სარდაფი', 'ხიდი', 'ბაზარი'],
    },
    correct: 1,
    mediaId: '4857',
  },
  {
    id: 38,
    category: 'experience',
    prompt: {
      en: 'Which fortress looks over old Tbilisi?',
      ka: 'რომელი ციხე დგას ძველ თბილისს ზემოთ?',
    },
    answers: {
      en: ['Narikala', 'Rabati', 'Ananuri', 'Khertvisi'],
      ka: ['ნარიყალა', 'რაბათი', 'ანანური', 'ხერთვისი'],
    },
    correct: 0,
    mediaId: '4858',
  },
  {
    id: 39,
    category: 'experience',
    prompt: {
      en: 'Which of these is a stew?',
      ka: 'რომელია ამათგან მოხარშული კერძი?',
    },
    answers: {
      en: ['Khinkali', 'Churchkhela', 'Chakapuli', 'Pkhali'],
      ka: ['ხინკალი', 'ჩურჩხელა', 'ჩაქაფული', 'ფხალი'],
    },
    correct: 2,
    mediaId: '4859',
  },
  {
    id: 40,
    category: 'experience',
    prompt: {
      en: 'In which season is rtveli?',
      ka: 'წელიწადის რომელ დროსაა რთველი?',
    },
    answers: {
      en: ['Spring', 'Summer', 'Winter', 'Autumn'],
      ka: ['გაზაფხული', 'ზაფხული', 'ზამთარი', 'შემოდგომა'],
    },
    correct: 3,
    mediaId: '4860',
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
