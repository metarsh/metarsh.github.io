import { JensenHuangSticker } from "stick-it-up";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

const NotFound = () => {
  const showPortrait = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#050505] px-4 py-8 text-white">
      <div className="text-center max-w-md">
        <div className="mb-4 h-[106px]">
          {showPortrait && (
            <JensenHuangSticker
              size={96}
              peel
              aria-hidden="true"
              focusable="false"
              className="-rotate-8 cursor-default! motion-reduce:transform-none! motion-reduce:transition-none!"
            />
          )}
        </div>
        <h1 className="mb-2 text-5xl font-serif font-bold text-white tracking-tight">404</h1>
        <p className="mb-6 text-muted-foreground font-sans text-sm">
          The coordinates you followed don't exist in this sector.
        </p>
        <a
          href={import.meta.env.BASE_URL}
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-white text-zinc-950 font-sans text-xs font-medium hover:bg-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Return to Base
        </a>
      </div>
    </main>
  );
};

export default NotFound;
