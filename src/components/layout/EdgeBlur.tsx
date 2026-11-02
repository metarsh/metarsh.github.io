interface EdgeBlurProps {
  position?: "top" | "bottom";
  height?: number;
  className?: string;
}

export function EdgeBlur({ position = "top", height = 80, className = "" }: EdgeBlurProps) {
  const blurLayers = [1, 2, 4, 8, 16];
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-x-0 isolate z-40 pointer-events-none select-none transition-opacity duration-300 ${
        isTop ? "top-0" : "bottom-0"
      } ${className}`}
      style={{ height }}
    >
      {blurLayers.map((blur) => (
        <div
          key={blur}
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to ${isTop ? "bottom" : "top"}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
            WebkitMaskImage: `linear-gradient(to ${isTop ? "bottom" : "top"}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to ${isTop ? "bottom" : "top"}, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0.25) 60%, transparent 100%)`,
        }}
      />
    </div>
  );
}
export function TopBlur({ height = 80, className = "" }: { height?: number; className?: string }) {
  return <EdgeBlur position="top" height={height} className={className} />;
}
export function BottomBlur({
  height = 80,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return <EdgeBlur position="bottom" height={height} className={className} />;
}
