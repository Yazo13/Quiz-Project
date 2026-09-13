// Explicit extension: the parity suite imports these tables directly under
// Node, whose ESM loader resolves the real filename.
import { group } from '../lib/number.ts';
import type { RelativeUnit } from '../lib/time';
import type { TxKind } from '../store/game';

/**
 * The English strings, and the shape every other locale has to match. Entries
 * that need a number or a name are functions rather than templates with
 * placeholders, so word order stays the translator's decision.
 *
 * Deliberately not `as const`: literal types here would mean the Georgian
 * table has to equal the English words, not merely match the shape.
 */
export const en = {
  tabs: {
    arena: 'Arena',
    ranks: 'Ranks',
    wallet: 'Wallet',
    you: 'You',
  },

  categories: {
    travel: 'Travel',
    tech: 'Tech',
    cash: 'Cash',
    experience: 'Experience',
    culture: 'Culture',
  },

  arena: {
    role: 'Adventurer',
    title: 'The\nArena',
    live: (n: number) => `${group(n)} live`,
    daily: 'Daily bonus',
    dailyClaim: (n: number) => `Claim ${n}`,
    dailyTaken: 'Back tomorrow',
    grandTournament: 'Grand Tournament',
    place: 'Kakheti · GE',
    prize: 'Prize',
    prizeName: 'Tsinandali Estate · 2 nights',
    worth: 'Worth',
    startsIn: 'Tournament starts in',
    hot: (n: number) => `● Hot · ${group(n)} in`,
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec',
    reserveSeat: (cost: number) => `Reserve Seat · ${cost}`,
    enterTournament: 'Enter Tournament',
    notEnough: 'Not enough tokens',
    choosePrize: 'Choose your prize',
    seeAll: 'See all →',
    prizeCount: (n: number) => `${n} prizes`,
    cashPool: '∞ pool',
    battlesToday: 'Battles · Today',
    roundLength: '5s rounds',
    playing: (n: number) => `${group(n)} playing`,
    pool: 'Pool',
    seeAllActive: 'Clear filter ×',
    noBattles: 'No battles in this category today.',
    battles: {
      geography: 'Speed Run · Geography',
      tech: 'Tech Quickfire',
      culture: 'Culture Clash',
      cellar: 'Cellar Door · Kakheti',
      jackpot: 'Daily Jackpot',
      nightOwl: 'Night Owl · Doubles',
    },
  },

  quiz: {
    progress: (n: number, total: number) => `Q ${n} / ${total}`,
    secure: 'Secure',
    quit: 'Leave round',
    liveImage: 'Live image',
    mediaId: (id: string) => `ID #${id} · Verified ✓`,
    powerup: (cost: number) => `50/50 power-up · ${cost} tokens`,
    powerupUsed: '50/50 used',
    notEnough: 'Not enough tokens',
    use: 'Use',
    correct: (points: number) => `+${points} pts · Correct!`,
    timeOut: 'Time out',
    wrong: 'Wrong',
    streak: (n: number) => `Streak: ×${n}`,
    streakReset: 'Streak: reset to 0',
    next: 'Next →',
    finish: 'Finish →',
    playingNow: (n: number) => `+ ${group(n)} playing now`,
  },

  result: {
    won: 'You won the round',
    lost: 'Round over',
    wonTitle: 'Glory!',
    lostTitle: 'Lost the\ntrail',
    correct: 'Correct',
    streak: 'Streak',
    avgTime: 'Avg time',
    seconds: (s: string) => `${s}s`,
    reward: 'Reward',
    consolation: 'Consolation',
    claim: 'Claim & continue',
    tryAgain: (cost: number) => `Try again · ${cost}`,
    notEnough: 'Not enough tokens',
    share: 'Share result',
    shareMessage: (correct: number, total: number, points: number) =>
      `${correct}/${total} in Gargari Quiz — ${points} points. Five seconds a question.`,
    backToArena: 'Back to Arena',
  },

  leaderboard: {
    eyebrow: 'Live Standings',
    title: 'Leaderboard',
    live: 'Live',
    yourRank: 'Your rank',
    lastRound: (points: number) => `+${points} last round`,
    noRounds: 'Play your first round',
    toOvertake: (points: number, name: string) =>
      `${group(points)} pts to overtake ${name}`,
    leading: 'Nobody left to catch',
    points: 'Points',
    you: 'You',
    accuracy: (percent: number) => `${percent}% accuracy`,
    pts: 'pts',
    filters: {
      today: 'today',
      weekly: 'weekly',
      grand: 'grand',
      friends: 'friends',
    },
  },

  wallet: {
    eyebrow: 'Your Treasury',
    title: 'Wallet',
    balance: 'Token Balance',
    summary: (dollars: string, weekly: number) =>
      `≈ $${dollars} · Earned ${group(weekly)} this week`,
    topUp: '＋ TOP UP',
    cashOut: 'CASH OUT',
    /** Marks a control that is visibly present but not wired up yet. */
    soon: 'soon',
    store: 'STORE',
    activity: 'ACTIVITY',
    packs: 'Token Packs',
    oneTap: 'Tap twice to buy',
    confirmBuy: (price: string) => `Confirm ${price}`,
    bonus: (percent: string) => `${percent} BONUS`,
    tokens: 'Tokens',
    popular: '★ POPULAR',
    bestValue: 'BEST VALUE',
    payMethod: 'Apple Pay · •••• 4821',
    payNote: 'Default · One-tap enabled',
    change: 'Change',
    recent: 'Recent activity',
    emptyTitle: 'Nothing yet',
    emptyBody: 'Enter a tournament or buy a pack and it shows up here.',
    tx: {
      entry: 'Tournament entry',
      reward: 'Round reward',
      consolation: 'Consolation',
      pack: 'Token pack',
      powerup: 'Power-up · 50/50',
      daily: 'Daily check-in',
    } satisfies Record<TxKind, string>,
    when: {
      now: 'just now',
      minute: (n: number) => `${n}m ago`,
      hour: (n: number) => `${n}h ago`,
      day: (n: number) => (n === 1 ? 'yesterday' : `${n}d ago`),
    } satisfies Record<RelativeUnit, string | ((n: number) => string)>,
  },

  crash: {
    eyebrow: 'Something broke',
    title: 'Off the\nmap',
    body: 'This screen stopped working. Your tokens and progress are saved.',
    details: 'What happened',
    retry: 'Try this screen again',
  },

  profile: {
    eyebrow: 'Your Record',
    title: 'Profile',
    streak: (n: number) => `${n} answer streak`,
    noStreak: 'No streak yet',
    rank: (n: number) => `Rank #${n}`,
    rounds: 'Rounds',
    streakLabel: 'Streak',
    accuracy: 'Accuracy',
    trophies: 'Trophy shelf',
    lockedTrophies: (n: number) => `${n} still locked`,
    noTrophies: 'Nothing on the shelf yet. Finish a round.',
    achievements: {
      firstRound: { title: 'First light', note: 'Finish a round' },
      firstWin: { title: 'Trailblazer', note: 'Win a round' },
      perfect: { title: 'Spotless', note: 'Answer every question correctly' },
      streak10: { title: 'On fire', note: 'Ten correct in a row' },
      quickDraw: { title: 'Quick draw', note: 'Win with under 2.5s average' },
      regular: { title: 'Regular', note: 'Finish 25 rounds' },
      hoard: { title: 'Treasurer', note: 'Hold 5,000 tokens' },
    },
    recentRounds: 'Recent rounds',
    noRounds: 'No rounds yet.',
    roundScore: (correct: number, total: number) => `${correct} / ${total} correct`,
    roundReward: (n: number) => `+${n}`,
    language: 'Language',
    haptics: 'Vibration',
    hapticsOn: 'On',
    hapticsOff: 'Off',
    previewEndStates: 'Preview end states',
    victoryScreen: 'Victory screen',
    defeatScreen: 'Defeat screen',
    dangerZone: 'Danger zone',
    reset: 'Reset progress',
  },
};

export type Strings = typeof en;
