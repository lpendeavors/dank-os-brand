import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Science", href: "#science" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "TikTok", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-forest-950 border-t border-white/5">
      <div className="container-wide py-16 flex flex-col items-center gap-10">
        {/* Logo */}
        <div className="scale-75 origin-center">
          <Logo />
        </div>

        {/* Nav */}
        <ul className="flex flex-wrap justify-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm uppercase tracking-widest text-white/60 hover:text-gold-400 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Social */}
        <ul className="flex gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {s.label === "Instagram" && (
                    <path d="M4.5 1h7A3.5 3.5 0 0 1 15 4.5v7A3.5 3.5 0 0 1 11.5 15h-7A3.5 3.5 0 0 1 1 11.5v-7A3.5 3.5 0 0 1 4.5 1zm0 1.5A2 2 0 0 0 2.5 4.5v7A2 2 0 0 0 4.5 14h7a2 2 0 0 0 2-2v-7A2 2 0 0 0 11.5 2.5h-7zM8 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 1.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm3.5-2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
                  )}
                  {s.label === "Twitter / X" && (
                    <path d="M12.6 1h2.1l-4.6 5.3L15.5 15h-4.2L8.1 10.6 3.4 15H1.3l5-5.7L.9 1h4.3L8.8 5l4.2-4zm-.7 12.6h1.2L5.6 2.2H4.3l7.6 11.4z" />
                  )}
                  {s.label === "TikTok" && (
                    <path d="M9 1v4h4v4h-4v7.1c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6h.3V7c-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3 6.3-2.8 6.3-6.3V5h-2v3.6A4.3 4.3 0 0 0 3 12.9a3.3 3.3 0 1 0 6.6 0V5h-1V1h1.4z" />
                  )}
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-xs text-white/30 uppercase tracking-widest">
          © {new Date().getFullYear()} DankOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
