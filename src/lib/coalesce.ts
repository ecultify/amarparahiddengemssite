/**
 * Wraps a job so calls never overlap: a call made while it runs marks it
 * dirty, and one more run follows once the current one ends. Ten calls in a
 * burst cost at most two runs, and the last run always starts after the last
 * call, so it sees the newest data. Errors go to `onError`, never to callers.
 * ponytail: in-process only; fine for the single pm2 instance, needs a lock
 * in the database if the app ever runs as several processes.
 */
export function coalesce(job: () => Promise<unknown>, onError: (error: unknown) => void) {
  let running: Promise<void> | null = null;
  let dirty = false;
  return function trigger(): Promise<void> {
    if (running) {
      dirty = true;
      return running;
    }
    running = (async () => {
      do {
        dirty = false;
        try {
          await job();
        } catch (error) {
          onError(error);
        }
      } while (dirty);
      running = null;
    })();
    return running;
  };
}
