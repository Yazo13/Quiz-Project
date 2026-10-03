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
       * One occurrence left: the quiz resetting its clock as the question
       * changes. The countdown hook used to be the other, and deriving the
       * count from a ticking clock instead of pushing it into state turned
       * out to be the simpler shape — so this stays visible rather than
       * silenced, since it found something real once.
       */
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
