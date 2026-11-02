type Recaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Recaptcha;
  }
}

let scriptReady: Promise<void> | undefined;

/** Obtain a fresh token; Formcarry verifies it with the secret held in its dashboard. */
export const recaptchaToken = async (siteKey: string) => {
  scriptReady ??= new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      scriptReady = undefined;
      reject(new Error("Could not load spam protection. Please try again."));
    };
    document.head.append(script);
  });

  await scriptReady;
  const recaptcha = window.grecaptcha;
  if (!recaptcha) throw new Error("Spam protection is unavailable. Please try again.");
  await new Promise<void>((resolve) => recaptcha.ready(resolve));
  return recaptcha.execute(siteKey, { action: "contact" });
};
