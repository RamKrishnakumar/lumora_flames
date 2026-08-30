import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';

/** Props for {@link ErrorBoundary}. */
interface ErrorBoundaryProps {
  /** Subtree to guard. */
  children: React.ReactNode;
}

/** Internal state for {@link ErrorBoundary}. */
interface ErrorBoundaryState {
  /** The caught error, or `null` while the subtree is healthy. */
  error: Error | null;
}

/**
 * ErrorBoundary catches render-time errors anywhere below it and shows a branded
 * recovery screen instead of React unmounting the tree to a blank page.
 *
 * Must remain a class component — `componentDidCatch` has no hook equivalent.
 *
 * Note this catches **render** errors only. Errors thrown from event handlers,
 * timers, or promise rejections bypass boundaries entirely and still need local
 * `try`/`catch`.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // No monitoring service is wired up yet; the console keeps the component
    // stack visible during development.
    // TODO: forward to Sentry (or equivalent) once an account exists.
    console.error('Unhandled render error:', error, info.componentStack);
  }

  /** Clears the error so the subtree re-mounts and re-renders from scratch. */
  private handleReset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <main
        role="alert"
        className="flex min-h-screen items-center justify-center bg-stone-50 px-6 dark:bg-stone-950"
      >
        <div
          className={cn(
            'max-w-lg space-y-6 rounded-3xl p-10 text-center',
            DESIGN_TOKENS.glass.card
          )}
        >
          <div className="inline-flex rounded-full bg-amber-500/10 p-4 text-amber-500">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1
            className={cn(
              DESIGN_TOKENS.typography.sectionTitle,
              'text-stone-900 dark:text-stone-100'
            )}
          >
            The flame flickered out
          </h1>

          <p className={cn(DESIGN_TOKENS.typography.body, 'text-stone-600 dark:text-stone-400')}>
            Something went wrong rendering this page. Reloading usually clears it — if it keeps
            happening, we&apos;d like to hear about it.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className={cn(
                'rounded-full bg-amber-500 px-7 py-3.5 text-stone-950 transition-colors hover:bg-amber-400',
                DESIGN_TOKENS.typography.button
              )}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className={cn(
                'rounded-full border border-stone-300 px-7 py-3.5 text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-500 dark:border-stone-700 dark:text-stone-300',
                DESIGN_TOKENS.typography.button
              )}
            >
              Back to home
            </button>
          </div>
        </div>
      </main>
    );
  }
}
