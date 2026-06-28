import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 72, height: 84 },
  md: { width: 96, height: 112 },
  lg: { width: 120, height: 140 },
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  const { width, height } = sizes[size];
  return (
    <Link href="/" aria-label="Fagurul de Aur — Acasă" className={`inline-block shrink-0 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Fagurul de Aur"
        width={width}
        height={height}
        priority
        className="w-auto"
        style={{ height: `${height * 0.65}px` }}
      />
    </Link>
  );
}
