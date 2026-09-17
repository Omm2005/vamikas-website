# Route-by-route site audit

This audit was produced by six parallel browser agents and verified against the shipped source.

## Shared design system

- Colors: warm ivory canvas — cream `#F7F5F0`, ivory `#FCFAF4`, paper `#F2EFEB`. Typography — ink `#1A1A1A`, charcoal `#2E2C2A`, smoke `#595959`. Statement — burgundy `#6B1226`, oxblood `#4A0C1B`, wine `#9E4751`, burgundy-light `#B04A5C`. Signature accent — pink `#F3A8BF`, pink-soft `#FADDE4`, blush `#D9A5B3`. Muted neutrals — stone `#B8B0A4`, sand `#E7E1D6`.
- Colour policy: ivory is the canvas, black/charcoal carries body text, burgundy takes headings, buttons, selected states and the occasional large block, pink is reserved for small interactive details, rules and highlights.
- Fonts: Bodoni Moda for editorial display, Inter for labels/body, La Belle Aurore for handwritten notes.
- Header: fixed and transparent with multiply blending. Desktop links animate a 1px pink underline over 300ms and turn burgundy when active. A bordered burgundy `DRESS ME` chip sits at the end of the row — the only nav item allowed to shout.
- Route changes: 500ms opacity fade in wait mode.
- Scroll reveals: opacity `0 → 1`, `translateY(48px) → 0`, 900ms, easing `cubic-bezier(.16,1,.3,1)`, once per element.
- Marquees: duplicated tracks, 42s linear infinite loop.
- Mobile breakpoint: 768px. The desktop nav becomes a full-screen ink menu with 500ms item entrances staggered by 80ms.

## Home `/`

- Full-height editorial collage with three rotated placeholders and scattered annotations.
- Hero: “a portfolio, sort of —”, “Vamika Menon”, “fashion designer / artist / future creative director”.
- CTA: “enter my mind”. Hover shifts 4px right/up, changes the hard shadow from 5px ink to 8px burgundy, and moves the arrow right. Press scale: 0.97.
- Pointer movement drives spring-smoothed parallax at different depths.
- CTA opens a 600ms clip-path overlay. `memory`, `chaos`, `obsession`, `identity`, `emotion`, and `creation` flash for 550ms each with 120ms stagger. It then routes to `/mind` after about 1.5s.
- Three-ways-in section: cards `01 ENTER MY MIND`, `02 DRESS ME`, `03 MOODBOARDS` on a staggered three-column grid. 01 and 03 are ivory with an ink hard shadow that turns burgundy on hover; 02 is a solid burgundy block with pink numerals — the page's one large colour moment. Hover lifts each card 4px, sweeps a pink rule across the title and fades in the handwritten note.
- Chapters: About, Project, Process, Archive, Moodboards. Rows change to paper, shift the title 16px, italicize it, reveal the handwritten note, and rotate the arrow 45°.

## About `/about`

- Intro tells the second-grade origin story and creative-director goal.
- Four taped fragment cards with alternating rotation and staggered vertical offsets.
- Philosophy quote: “Fashion is expressing your emotions without words… For me, it has always been dressing.”
- Hovering the final phrase reveals handwritten “always.”
- “Why fashion?” entries cover identity, living art, emotion, and history.
- Layout shifts from two fragment columns to four at large widths; philosophy and list typography scale fluidly.

## Mind `/mind` — experience 01

Four rooms, indexed at the top and linked by anchor.

1. **thoughts** — six handwritten fragments in a balanced three-column flow, each on a pink left rule, rotated ±2°.
2. **memories** — three quiet editorial entries (`2nd grade`, `age 12`, `every monsoon`) as a date / prose / placeholder row.
3. **emotions** — the interactive moment, on an ink ground with a 4px burgundy border. `WHAT ARE YOU FEELING TODAY?` offers messy, romantic, angry, nostalgic, playful, dreamy, chaotic. Selecting one crossfades in the garment or artwork it produced (title, medium, year, prose, handwritten note) plus the palette it came out of. Selected chips are burgundy with a pink hard shadow. “another piece in this feeling” cycles the second piece for that emotion.
4. **inspirations** — a quiet reference list ending in a link to the moodboards.

## Dress Me `/dress-me` — experience 02

Six sequential decisions, in order: silhouette → fabric → colour → print → detail → accessory.

- Options: silhouette (column, a-line, cocoon, bias), fabric (cotton poplin, silk satin, organza, wool crepe), colour (ivory, soft pink, burgundy, charcoal, sand), print (none, hand-blocked dots, pinstripe, bloom), detail (clean finish, puff sleeve, bell sleeve, knife pleats, exposed seams), accessory (nothing, oversized bow, leather belt, pearls, corsage).
- A six-cell step rail shows each decision's state; the current step is burgundy, completed steps are clickable, upcoming steps are muted stone. A pink progress rule tracks completion.
- Choosing redraws the SVG croquis immediately, prints Vamika's handwritten response, then advances after 620ms.
- Colour drives the garment fill, fabric drives its treatment (satin sheen, 38% organza, crepe grain), print and pleats are pattern overlays, exposed seams are dashed stitch lines.
- Completing the sixth decision reveals **LOOK CREATED**: an ivory card with a burgundy header bar, look number, generated look name, the six-row spec, a swatch row and the footer line `DESIGNED IN VAMIKA'S WORLD.`
- `/atelier` still resolves here.

## Moodboards `/moodboards` — experience 03

Six taped boards — romantic decay, mythology retold, city noise, surreal tailoring, texture study, the colour burgundy — on a staggered grid, each with three pinned placeholders, a four-stop swatch strip and a reference count. Opening one raises a full spread over an ink backdrop: thesis, pinned reference list, hex-labelled swatches and a dashed burgundy “what it became” note. Escape or a click outside closes it. Below, a quieter four-part “how a board gets made” section.

## Project `/project`

Fragment tabs:

- obsession: “a chronicle of obsessions”
- memory: “rooms i grew up in, half-remembered”
- emotion: “feelings without words”
- chaos: “contradictions stacked on contradictions”
- creation: “what the mess became”
- identity: “dressing as a way of saying what i couldn't”

Tab panels crossfade with 30px vertical travel and about 1° rotation over 500ms. The inspiration wall contains ten draggable cards constrained to the dashed wall. Dragging scales a card to 1.06 and removes its rotation; hover scales it to 1.04.

Other sections include “making the garments”, “what i learned”, and “what i'm proud of”, with crisp hard-shadow placeholder cards and dark ink contrast sections.

## Process `/process`

Six steps:

1. hand sketches
2. anatomy studies
3. digital design
4. textile experiments
5. garment construction
6. final garment

Desktop uses a descending three-column stagger of 0, 56, and 112px. Cards alternate ±1° and straighten on hover. Technique cards cover watercolour, oil painting, acrylic, textiles, embroidery, clay, print, block printing, sewing, and digital design. Hover lifts and inverts them to ink with a burgundy hard shadow.

## Archive `/archive`

Filters: all, garments, sketchbook, textiles, art, experiments, editorial, process.

Five live records were found:

1. New Project, experiments, cotton/linen, 2026
2. silhouette draft, sketchbook, pencil on paper, 2026
3. watercolour wash, art, watercolour on paper, 2026
4. seam study no.1, process, muslin + thread, 2026
5. blush swatch study, textiles, cotton/dye, 2026

Cards use one/two/three masonry columns, scale images to 1.04 on hover, and change the hard shadow from ink to burgundy. Clicking opens a full-screen blurred ink lightbox. Lightbox content enters from scale 0.94 and 24px below over 400ms. Diary notes expand from zero height while fading and rotating over 450ms.

Empty filters show: “the archive is quiet — for now.” and “first pieces being photographed…”.

## Atelier `/atelier`

Superseded by **Dress Me**. The route still resolves so old links keep working; see the Dress Me section above for the current interaction.

## Contact `/contact`

- Heading: “let's make something.”
- Email: unset, displayed as “add it in the studio”.
- Instagram: `fwminks.w`, linking to `https://instagram.com/fwminks.w`.
- Elsewhere: unset, displayed as “portfolio links, soon”.
- Footer: “vamika menon” and “messy · fluid · visual · personal · artistic”.
- Instagram hover changes the row to paper, turns the value burgundy, shifts it 8px right, and fades in the arrow.

## Accessibility observation

The source does not define a global `prefers-reduced-motion` policy, and keyboard focus uses the browser default outline. Those can be improved in a future pass without changing the visual design.