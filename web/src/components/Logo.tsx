import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" aria-label="DankOS Home" className="flex items-center gap-2">
      {/* Geometric cannabis leaf */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Central leaf */}
        <path
          d="M16 3C16 3 18.5 10 18.5 15C18.5 18.5 16 21 16 23C16 21 13.5 18.5 13.5 15C13.5 10 16 3 16 3Z"
          fill="#1B5E20"
        />
        {/* Right leaf */}
        <path
          d="M16 9C16 9 23 11 24.5 15C25.5 17.5 23 21 21 22C21.5 19 21 15 20 12.5C19 10 16 9 16 9Z"
          fill="#10B981"
        />
        {/* Left leaf */}
        <path
          d="M16 9C16 9 9 11 7.5 15C6.5 17.5 9 21 11 22C10.5 19 11 15 12 12.5C13 10 16 9 16 9Z"
          fill="#10B981"
        />
        {/* Bottom-right leaf */}
        <path
          d="M16 14C16 14 22 16 23 19.5C23.5 21.5 21 24 19.5 24.5C20 22.5 19.5 19.5 18.5 17.5C17.5 15.5 16 14 16 14Z"
          fill="#D4AF37"
        />
        {/* Bottom-left leaf */}
        <path
          d="M16 14C16 14 10 16 9 19.5C8.5 21.5 11 24 12.5 24.5C12 22.5 12.5 19.5 13.5 17.5C14.5 15.5 16 14 16 14Z"
          fill="#D4AF37"
        />
        {/* Stem */}
        <path
          d="M15.5 23L16 30L16.5 23"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="font-display text-xl tracking-widest text-white"
        style={{ letterSpacing: "0.2em" }}
      >
        DANKOS
      </span>
    </Link>
  );
}
