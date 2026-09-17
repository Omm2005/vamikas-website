const Marquee = ({ items, className = "", outline = false }) => {
  const row = [...items, ...items, ...items];
  return (
    <div
      data-testid="editorial-marquee"
      className={`overflow-hidden border-y border-ink/70 py-4 select-none ${className}`}
    >
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className={`mx-6 font-serif uppercase tracking-tight text-2xl sm:text-4xl ${
                  outline && i % 3 === 1
                    ? "text-outline"
                    : i % 3 === 2
                      ? "text-burgundy italic"
                      : "text-ink"
                }`}
              >
                {item}
                <span className={`mx-6 not-italic ${i % 2 ? "text-pink" : "text-burgundy"}`}>✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
