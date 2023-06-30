import * as Sentry from '@sentry/react';

import Routes from '~libs/routes';

function ErrorComponent({ error, componentStack }: {
  error: Error;
  componentStack: string | null;
}) {
  Logger.error(`${error}`);
  Logger.error(`${componentStack}`);

  return (
    <>
      <h1>You have encountered an error</h1>
      <a href={Routes.home}>
        <u>← Back to home</u>
      </a>
      <pre>
        {error.toString()}
        {componentStack}
      </pre>
    </>
  );
}

function SentryErrorBoundary({ children }: { children: React.ReactNode }) {
  Logger.debug('SentryErrorBoundary rendering...');
  return <Sentry.ErrorBoundary fallback={ErrorComponent}>{children}</Sentry.ErrorBoundary>;
}

export default SentryErrorBoundary;
