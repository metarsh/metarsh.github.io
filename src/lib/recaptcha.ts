type Recaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Recaptcha;
  }
}
let scriptElement: HTMLScriptElement | undefined;

/** Obtain a fresh token within the contact request's cancellation deadline. */
export const recaptchaToken = (siteKey: string, signal: AbortSignal): Promise<string> =>
  new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      signal.removeEventListener("abort", abort);
      if (scriptElement) {
        scriptElement.onload = null;
        scriptElement.onerror = null;
      }
    };
    const fail = (reason: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      scriptElement?.remove();
      scriptElement = undefined;
      delete window.grecaptcha;
      reject(reason);
    };
    const abort = () => fail(signal.reason);
    const execute = () => {
      if (settled) return;
      const recaptcha = window.grecaptcha;
      if (!recaptcha) {
        fail(new Error("Spam protection is unavailable. Please try again."));
        return;
      }
      try {
        recaptcha.ready(() => {
          if (settled) return;
          try {
            recaptcha.execute(siteKey, { action: "contact" }).then(
              (token) => {
                if (settled) return;
                if (!token) {
                  fail(
                    new Error("Spam protection could not verify this request. Please try again."),
                  );
                  return;
                }
                settled = true;
                cleanup();
                resolve(token);
              },
              () =>
                fail(new Error("Spam protection could not verify this request. Please try again.")),
            );
          } catch {
            fail(new Error("Spam protection could not verify this request. Please try again."));
          }
        });
      } catch {
        fail(new Error("Spam protection is unavailable. Please try again."));
      }
    };
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    if (window.grecaptcha) {
      execute();
      return;
    }
    scriptElement = document.createElement("script");
    scriptElement.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    scriptElement.async = true;
    scriptElement.onload = execute;
    scriptElement.onerror = () =>
      fail(new Error("Could not load spam protection. Please try again."));
    document.head.append(scriptElement);
  });
