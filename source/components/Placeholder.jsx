const Placeholder = ({
  caption = "sketch coming soon",
  ratio = "aspect-[3/4]",
  className = "",
  note,
  dark = false,
}) => {
  return (
    <div
      data-testid="art-placeholder"
      className={`group relative ${ratio} ${className} ${
        dark ? "bg-ink text-cream border-cream/40" : "bg-paper text-ink border-ink/60"
      } border overflow-hidden transition-shadow duration-500 hover:shadow-[6px_6px_0px_#1A1A1A]`}
    >
      <div className="absolute inset-2 border border-dashed border-current opacity-25 pointer-events-none" />
      <span className="absolute top-3 left-3 w-2 h-2 border-t border-l border-current opacity-50" />
      <span className="absolute top-3 right-3 w-2 h-2 border-t border-r border-current opacity-50" />
      <span className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-current opacity-50" />
      <span className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-current opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="font-serif italic text-xs tracking-[0.3em] opacity-50">V.M.</span>
        <p className="font-hand text-xl sm:text-2xl leading-tight -rotate-2 text-wine">
          {caption}
        </p>
      </div>
      {note && (
        <div className={`absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out ${dark ? "bg-burgundy" : "bg-ink"} text-cream px-3 py-2`}>
          <p className="font-hand text-lg leading-tight text-blush">{note}</p>
        </div>
      )}
    </div>
  );
};

export default Placeholder;
