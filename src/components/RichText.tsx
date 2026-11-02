import { InlineLink } from "./InlineLink";
import { TechLogo } from "./TechLogo";
import type { TextPart } from "@/types/portfolio";

export const RichText = ({ parts }: { parts: TextPart[] }) => (
  <>
    {parts.map((part, index) =>
      typeof part === "string" ? (
        part
      ) : (
        <InlineLink
          key={index}
          href={part.href}
          icon={part.icon ? <TechLogo name={part.icon} className="h-3.5 w-3.5" /> : undefined}
        >
          {part.text}
        </InlineLink>
      ),
    )}
  </>
);
