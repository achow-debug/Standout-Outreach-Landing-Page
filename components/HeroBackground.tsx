const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_90%_40%_at_50%_35%,rgba(79,49,146,0.10),transparent_70%)] md:[background:radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(79,49,146,0.10),transparent_70%)]" />
      <div
        className="absolute inset-0 [background-size:32px_32px] md:[background-size:44px_44px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,49,146,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,49,146,0.05) 1px, transparent 1px)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grain,
          backgroundRepeat: "repeat",
          opacity: 0.03,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
