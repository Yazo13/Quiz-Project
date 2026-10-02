// Expo's shared flat config: React, React Hooks, React Native and import
// rules, already tuned for an expo-router tree.
const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,

  { ignores: ['dist/*', 'design/*', 'android/*', 'ios/*', '.expo/*'] },

  {
    rules: {
      /**
       * Off, not suppressed case by case.
       *
       * The rule reads `x.value = …` as writing to state React owns. Every
       * occurrence in this tree is a Reanimated shared value, where that
       * assignment *is* the API — it hands the value to the UI thread and
       * React never sees it. Five sites, all the same false positive, and
       * leaving the rule on would mean five disable comments explaining the
       * same thing.
       */
      'react-hooks/immutability': 'off',

      /**
       * A warning rather than an error.
       *
       * Both occurrences sync React state to a clock the moment the thing
       * being timed changes — a question, or a countdown's deadline. That is
       * what the rule is guarding against in general and what an effect is
       * for in this particular case, so it stays visible without failing the
       * run.
       */
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
