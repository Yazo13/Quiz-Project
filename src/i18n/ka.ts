import { group } from '../lib/number';
import type { Strings } from './en';

/**
 * Georgian. Typed against the English shape, so a missing or renamed key is a
 * compile error rather than a blank label at runtime.
 *
 * Two things the script forces: there is no uppercase, so labels that read as
 * small caps in English are set sentence-case here; and words run longer, so
 * button copy is kept short rather than translated literally.
 */
export const ka: Strings = {
  tabs: {
    arena: 'არენა',
    ranks: 'რეიტინგი',
    wallet: 'საფულე',
    you: 'შენ',
  },

  categories: {
    travel: 'მოგზაურობა',
    tech: 'ტექნოლოგია',
    cash: 'ფული',
    experience: 'გამოცდილება',
    culture: 'კულტურა',
  },

  arena: {
    role: 'მოგზაური',
    title: 'არენა',
    live: (n: number) => `${group(n)} ონლაინ`,
    grandTournament: 'დიდი ტურნირი',
    place: 'კახეთი · საქართველო',
    prize: 'პრიზი',
    prizeName: 'წინანდლის მამული · 2 ღამე',
    worth: 'ღირებულება',
    startsIn: 'ტურნირი დაიწყება',
    hot: (n: number) => `● ცხელი · ${group(n)} მონაწილე`,
    hours: 'საათი',
    minutes: 'წუთი',
    seconds: 'წამი',
    reserveSeat: (cost: number) => `დაჯავშნე ადგილი · ${cost}`,
    enterTournament: 'ტურნირში შესვლა',
    notEnough: 'ტოკენი არ გყოფნის',
    choosePrize: 'აირჩიე პრიზი',
    seeAll: 'ყველა →',
    prizeCount: (n: number) => `${n} პრიზი`,
    cashPool: '∞ ფონდი',
    battlesToday: 'ბრძოლები · დღეს',
    roundLength: '5 წამი',
    playing: (n: number) => `${group(n)} თამაშობს`,
    pool: 'ფონდი',
    battles: {
      geography: 'სწრაფი რბოლა · გეოგრაფია',
      tech: 'ტექნო ბლიცი',
      culture: 'კულტურული შეჯიბრი',
    },
  },

  quiz: {
    progress: (n: number, total: number) => `კითხვა ${n} / ${total}`,
    secure: 'დაცული',
    liveImage: 'ცოცხალი სურათი',
    mediaId: (id: string) => `ID #${id} · დადასტურებული ✓`,
    powerup: (cost: number) => `50/50 დახმარება · ${cost} ტოკენი`,
    powerupUsed: '50/50 გამოყენებულია',
    notEnough: 'ტოკენი არ გყოფნის',
    use: 'გამოყენება',
    correct: (points: number) => `+${points} ქულა · სწორია!`,
    timeOut: 'დრო ამოიწურა',
    wrong: 'არასწორია',
    streak: (n: number) => `სერია: ×${n}`,
    streakReset: 'სერია: განულდა',
    next: 'შემდეგი →',
    finish: 'დასრულება →',
    playingNow: (n: number) => `+ ${group(n)} თამაშობს ახლა`,
  },

  result: {
    won: 'რაუნდი მოიგე',
    lost: 'რაუნდი დასრულდა',
    wonTitle: 'დიდება!',
    lostTitle: 'კვალი\nდაკარგე',
    correct: 'სწორი',
    streak: 'სერია',
    avgTime: 'საშუალო დრო',
    seconds: (s: string) => `${s} წმ`,
    reward: 'ჯილდო',
    consolation: 'სანუგეშო',
    claim: 'აიღე და გააგრძელე',
    tryAgain: (cost: number) => `თავიდან · ${cost}`,
    notEnough: 'ტოკენი არ გყოფნის',
    share: 'შედეგის გაზიარება',
    backToArena: 'არენაზე დაბრუნება',
  },

  leaderboard: {
    eyebrow: 'ცოცხალი რეიტინგი',
    title: 'რეიტინგი',
    live: 'ლაივი',
    yourRank: 'შენი ადგილი',
    lastRound: (points: number) => `+${points} ბოლო რაუნდში`,
    noRounds: 'ითამაშე პირველი რაუნდი',
    toOvertake: (points: number, name: string) =>
      `${name}-ს ${group(points)} ქულა აშორებს`,
    leading: 'წინ აღარავინაა',
    points: 'ქულა',
    you: 'შენ',
    accuracy: (percent: number) => `${percent}% სიზუსტე`,
    pts: 'ქულა',
    filters: {
      today: 'დღეს',
      weekly: 'კვირა',
      grand: 'დიდი',
      friends: 'მეგობრები',
    },
  },

  wallet: {
    eyebrow: 'შენი ხაზინა',
    title: 'საფულე',
    balance: 'ტოკენების ბალანსი',
    summary: (dollars: string, weekly: number) =>
      `≈ $${dollars} · ${group(weekly)} ამ კვირაში`,
    topUp: '＋ შევსება',
    cashOut: 'გატანა',
    store: 'მაღაზია',
    activity: 'ისტორია',
    packs: 'ტოკენების პაკეტები',
    oneTap: 'ერთი შეხებით ✓',
    bonus: (percent: string) => `${percent} ბონუსი`,
    tokens: 'ტოკენი',
    popular: '★ პოპულარული',
    bestValue: 'საუკეთესო ფასი',
    payMethod: 'Apple Pay · •••• 4821',
    payNote: 'ძირითადი · ერთი შეხებით',
    change: 'შეცვლა',
    recent: 'ბოლო ოპერაციები',
    emptyTitle: 'ჯერ ცარიელია',
    emptyBody: 'შედი ტურნირში ან იყიდე პაკეტი და აქ გამოჩნდება.',
    tx: {
      entry: 'ტურნირში შესვლა',
      reward: 'რაუნდის ჯილდო',
      consolation: 'სანუგეშო',
      pack: 'ტოკენების პაკეტი',
      powerup: 'დახმარება · 50/50',
      daily: 'ყოველდღიური ბონუსი',
    },
    when: {
      now: 'ახლახან',
      minute: (n: number) => `${n} წთ წინ`,
      hour: (n: number) => `${n} სთ წინ`,
      day: (n: number) => (n === 1 ? 'გუშინ' : `${n} დღის წინ`),
    },
  },

  profile: {
    eyebrow: 'შენი რეკორდი',
    title: 'პროფილი',
    streak: (n: number) => `${n} სწორი ზედიზედ`,
    noStreak: 'სერია ჯერ არ გაქვს',
    rank: (n: number) => `ადგილი #${n}`,
    rounds: 'რაუნდი',
    streakLabel: 'სერია',
    accuracy: 'სიზუსტე',
    trophies: 'ჯილდოების თარო',
    trophyList: {
      grand: 'კახეთის დიდი · III ადგილი',
      speedRun: 'სწრაფი რბოლა · გამარჯვებული',
      quickfire: 'ტექნო ბლიცი · II ადგილი',
    },
    months: {
      may: 'მაისი 2026',
      april: 'აპრილი 2026',
      march: 'მარტი 2026',
    },
    language: 'ენა',
    previewEndStates: 'დასრულების ეკრანები',
    victoryScreen: 'გამარჯვების ეკრანი',
    defeatScreen: 'დამარცხების ეკრანი',
    dangerZone: 'საშიში ზონა',
    reset: 'პროგრესის განულება',
  },
};
