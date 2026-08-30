import { group } from '../lib/number';
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
    battles: {
      geography: 'Speed Run · Geography',
      tech: 'Tech Quickfire',
      culture: 'Culture Clash',
    },
  },

  quiz: {
    progress: (n: number, total: number) => `Q ${n} / ${total}`,
    secure: 'Secure',
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
    store: 'STORE',
    activity: 'ACTIVITY',
    packs: 'Token Packs',
    oneTap: 'One-tap buy ✓',
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
    trophyList: {
      grand: 'Kakheti Grand · 3rd',
      speedRun: 'Speed Run · Winner',
      quickfire: 'Tech Quickfire · 2nd',
    },
    months: {
      may: 'May 2026',
      april: 'April 2026',
      march: 'March 2026',
    },
    language: 'Language',
    previewEndStates: 'Preview end states',
    victoryScreen: 'Victory screen',
    defeatScreen: 'Defeat screen',
    dangerZone: 'Danger zone',
    reset: 'Reset progress',
  },
};

export type Strings = typeof en;
