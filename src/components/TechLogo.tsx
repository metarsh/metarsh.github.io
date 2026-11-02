import { Cpu, Layers, Bot, Telescope, Database, Mic, Code2 } from "lucide-react";
import React, { type ComponentType } from "react";
import {
  SiPytorch,
  SiHuggingface,
  SiPython,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiFastapi,
  SiFlask,
  SiPostgresql,
  SiTelegram,
  SiGithub,
  SiGoogle,
  SiGooglegemini,
  SiPrisma,
  SiExpress,
  SiOnnx,
  SiScikitlearn,
  SiLangchain,
  SiFfmpeg,
  SiCelery,
  SiClerk,
  SiWebrtc,
  SiC,
  SiTypescript,
  SiLinux,
  SiFramer,
  SiSupabase,
  SiSocketdotio,
  SiGooglecloud,
} from "react-icons/si";
import { TbBrandTwilio } from "react-icons/tb";
import { GrOracle } from "react-icons/gr";

type IconProps = { className?: string; style?: React.CSSProperties };

export const TechLogo: React.FC<{
  name: string;
  className?: string;
  colored?: boolean;
}> = ({ name, className = "w-3.5 h-3.5", colored = true }) => {
  const normalized = name.toLowerCase().trim();
  let IconComponent: ComponentType<IconProps> | null = null;
  let brandColor: string | undefined = undefined;

  if (normalized.includes("pytorch")) {
    IconComponent = SiPytorch;
    brandColor = "#EE4C2C";
  } else if (normalized.includes("huggingface") || normalized.includes("transformer")) {
    IconComponent = SiHuggingface;
    brandColor = "#FFD21E";
  } else if (normalized.includes("python")) {
    IconComponent = SiPython;
    brandColor = "#3776AB";
  } else if (normalized.includes("mongodb")) {
    IconComponent = SiMongodb;
    brandColor = "#47A248";
  } else if (normalized.includes("redis")) {
    IconComponent = SiRedis;
    brandColor = "#DC382D";
  } else if (normalized.includes("docker")) {
    IconComponent = SiDocker;
    brandColor = "#2496ED";
  } else if (normalized.includes("next")) {
    IconComponent = SiNextdotjs;
    brandColor = "#FFFFFF";
  } else if (normalized.includes("react")) {
    IconComponent = SiReact;
    brandColor = "#61DAFB";
  } else if (normalized.includes("tailwind")) {
    IconComponent = SiTailwindcss;
    brandColor = "#06B6D4";
  } else if (normalized.includes("fastapi")) {
    IconComponent = SiFastapi;
    brandColor = "#059669";
  } else if (normalized.includes("flask")) {
    IconComponent = SiFlask;
    brandColor = "#FFFFFF";
  } else if (normalized.includes("postgres") || normalized === "postgresql") {
    IconComponent = SiPostgresql;
    brandColor = "#4169E1";
  } else if (
    normalized.includes("telegram") ||
    normalized.includes("telethon") ||
    normalized.includes("pyrogram")
  ) {
    IconComponent = SiTelegram;
    brandColor = "#26A5E4";
  } else if (normalized.includes("git")) {
    IconComponent = SiGithub;
    brandColor = "#FFFFFF";
  } else if (normalized.includes("gemini")) {
    IconComponent = SiGooglegemini;
    brandColor = "#8E75FF";
  } else if (normalized.includes("typescript")) {
    IconComponent = SiTypescript;
    brandColor = "#3178C6";
  } else if (normalized.includes("linux")) {
    IconComponent = SiLinux;
    brandColor = "#FCC624";
  } else if (normalized.includes("framer")) {
    IconComponent = SiFramer;
    brandColor = "#0055FF";
  } else if (normalized.includes("supabase")) {
    IconComponent = SiSupabase;
    brandColor = "#3FCF8E";
  } else if (normalized.includes("socket")) {
    IconComponent = SiSocketdotio;
    brandColor = "#FFFFFF";
  } else if (normalized.includes("chroma")) {
    IconComponent = Database;
    brandColor = "#A1A1AA";
  } else if (normalized.includes("oracle")) {
    IconComponent = GrOracle;
    brandColor = "#C74634";
  } else if (normalized.includes("vertex")) {
    IconComponent = SiGooglecloud;
    brandColor = "#4285F4";
  } else if (normalized.includes("cloud run")) {
    IconComponent = SiGooglecloud;
    brandColor = "#4285F4";
  } else if (normalized.includes("google cloud")) {
    IconComponent = SiGooglecloud;
    brandColor = "#4285F4";
  } else if (normalized.includes("google")) {
    IconComponent = SiGoogle;
    brandColor = "#4285F4";
  } else if (normalized.includes("prisma")) {
    IconComponent = SiPrisma;
    brandColor = "#2D3748";
  } else if (normalized.includes("express")) {
    IconComponent = SiExpress;
    brandColor = "#FFFFFF";
  } else if (normalized.includes("onnx")) {
    IconComponent = SiOnnx;
    brandColor = "#005CED";
  } else if (normalized.includes("scikit")) {
    IconComponent = SiScikitlearn;
    brandColor = "#F7931E";
  } else if (normalized.includes("langchain")) {
    IconComponent = SiLangchain;
    brandColor = "#1C3C3C";
  } else if (normalized.includes("twilio")) {
    IconComponent = TbBrandTwilio;
    brandColor = "#F22F46";
  } else if (normalized.includes("ffmpeg")) {
    IconComponent = SiFfmpeg;
    brandColor = "#007808";
  } else if (normalized.includes("celery")) {
    IconComponent = SiCelery;
    brandColor = "#37814A";
  } else if (normalized.includes("clerk")) {
    IconComponent = SiClerk;
    brandColor = "#6C47FF";
  } else if (normalized.includes("webrtc")) {
    IconComponent = SiWebrtc;
    brandColor = "#333333";
  } else if (normalized === "c") {
    IconComponent = SiC;
    brandColor = "#A8B9CC";
  } else if (normalized.includes("bullmq") || normalized.includes("queue")) {
    IconComponent = Layers;
    brandColor = "#E11D48";
  } else if (normalized.includes("vad") || normalized.includes("voice")) {
    IconComponent = Mic;
    brandColor = "#22C55E";
  } else if (normalized.includes("tess") || normalized.includes("nasa")) {
    IconComponent = Telescope;
    brandColor = "#38BDF8";
  } else if (normalized.includes("database")) {
    IconComponent = Database;
    brandColor = "#A1A1AA";
  } else if (normalized.includes("ai chat") || normalized.includes("groq")) {
    IconComponent = Bot;
    brandColor = "#F43F5E";
  } else if (normalized.includes("cpu") || normalized.includes("os")) {
    IconComponent = Cpu;
    brandColor = "#A1A1AA";
  } else {
    IconComponent = Code2;
    brandColor = "#A1A1AA";
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <IconComponent
        className="w-full h-full"
        style={colored && brandColor ? { color: brandColor } : undefined}
        aria-hidden="true"
      />
    </span>
  );
};
