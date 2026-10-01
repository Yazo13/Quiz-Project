import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

import { color } from '../src/theme/tokens';

/**
 * The HTML shell around the web build.
 *
 * Static export was shipping `<title></title>` on every page — the route
 * titles are set client-side, so the document that actually reaches the
 * browser had none, and a tab, a bookmark or a history entry showed the URL
 * instead of a name.
 *
 * The body also painted white until React mounted, which is a flash of the
 * one colour this design does not use. Setting it here means the first frame
 * is already paper.
 *
 * Rendered only at build time, so there is no client runtime in here.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content={color.bgPaper} />
        <title>Gargari Quiz</title>

        {/* Keeps body scrolling off, so the app's own scroll views own it. */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: shell }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const shell = `
body { background-color: ${color.bgPaper}; }
`;
