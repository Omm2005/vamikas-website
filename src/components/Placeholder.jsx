import { parseMedium, photoUrl, useSlotPhoto } from "@/lib/slots";

// Every photo on the site comes through here. Pass a `slot` and the admin can
// fill it; until someone does, the hand-drawn box below stands in, so the
// layout is identical whether or not a photo exists yet.
const Placeholder = ({
  caption = "sketch coming soon",
  ratio = "aspect-[3/4]",
  className = "",
  note,
  dark = false,
  slot,
  alt,
}) => {
  const photo = useSlotPhoto(slot);
  const frame = `group relative ${ratio} ${className} ${
    dark ? "bg-ink text-cream border-cream/40" : "bg-paper text-ink border-ink/60"
  } border overflow-hidden transition-shadow duration-500 hover:shadow-[6px_6px_0px_#1A1A1A]`;

  // The hover note is part of the site's voice, so it stays on real photos too.
  const hoverNote = note ? (
    <div
      className={`absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out ${
        dark ? "bg-burgundy" : "bg-ink"
      } text-cream px-3 py-2`}
    >
      <p className="font-hand text-lg leading-tight text-pink">{note}</p>
    </div>
  ) : null;

  // What the bubble cluster has to say about this photo: the diary note is the
  // hidden thought, with the catalogue line under it. `data-bubble` alone is
  // enough for the bubbles to gather — the rest is what a click reveals.
  const catalogue = photo
    ? [parseMedium(photo.medium).medium, photo.year].filter(Boolean).join(" · ")
    : "";

  if (photo) {
    return (
      <figure
        data-testid="art-photo"
        data-slot={slot}
        data-bubble=""
        data-bubble-note={photo.diary || photo.description || ""}
        data-bubble-title={photo.title || ""}
        data-bubble-meta={catalogue}
        className={frame}
      >
        <img
          src={photoUrl(photo)}
          alt={alt || photo.title || caption}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {hoverNote}
      </figure>
    );
  }

  return (
    <div data-testid="art-placeholder" data-slot={slot} data-bubble="" className={frame}>
      <div className="absolute inset-2 border border-dashed border-current opacity-25 pointer-events-none" />
      <span className="absolute top-3 left-3 w-2 h-2 border-t border-l border-current opacity-50" />
      <span className="absolute top-3 right-3 w-2 h-2 border-t border-r border-current opacity-50" />
      <span className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-current opacity-50" />
      <span className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-current opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="font-serif italic text-xs tracking-[0.3em] opacity-50">V.M.</span>
        <p className={`font-hand text-xl sm:text-2xl leading-tight -rotate-2 ${dark ? "text-pink" : "text-wine"}`}>
          {caption}
        </p>
      </div>
      {hoverNote}
    </div>
  );
};

export default Placeholder;
