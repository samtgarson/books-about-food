# Homepage header: 3D book carousel

Handoff notes for building the new homepage header. It replaces the current `FeatureCarousel`, which only the homepage uses.

- **Reference mockup (interactive):** https://claude.ai/artifact/9iiA8tfme6ehwFFL5rGeAi. It's private, so ask for it to be shared with you. Add `#tune` to the end of the link to show the design tuning panel.
- **Mockup source:** [`mockup.html`](./mockup.html). It's a single annotated file, with comments numbered so they match the sections below.
- **Run it locally:** `python3 docs/homepage-header/build-mockup.py [covers-folder]` writes `mockup.built.html`, which you open in a browser. Without a covers folder it uses flat placeholder covers.

The mockup is a design reference, not production code. It's vanilla HTML/CSS/JS so it can be tuned in a browser. Port the behaviour and values into React + Tailwind following the conventions in `CLAUDE.md`: no semicolons, `function` declarations, no `any`.

---

## 1. What it does

| Part                                   | Behaviour                                                                                                                                                                                                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing slide** ("Today's Specials") | Date + title on the left. The first featured books sit as an overlapping **stack** peeking in from the right edge: up to 5 on tablet/desktop, 3 on phones. More books wait off screen. Tapping any book in the stack goes to the **first** book.                      |
| **Book slides**                        | One book per slide, shown as a **3D book** in the centre. The cover image is the front; the boards, spine and page block are drawn in CSS. The book's width follows the cover image's own ratio, so square and landscape covers work.                                 |
| **Pose**                               | The book in focus rests turned slightly to show its spine (−16°). Books peeking on the right show their pages (30°). Books on the left show their spine (−25°). The angle changes over the same 0.6s as the slide. Hovering the book in focus turns it to 6° over 2s. |
| **Peeks**                              | Tablet/desktop: the next and previous books peek 80px in from the edges. Phones: no peeks.                                                                                                                                                                            |
| **Design commentary**                  | `book.designCommentary`, centred over the book. It appears once the book has settled **and** 0.5s has passed, while the book fades to 18% behind it. Max 5 lines, with a **View Book** link underneath. It hides as soon as anything moves.                           |
| **Author credit**                      | Bottom centre. One author: avatar + name. Several: up to 3 overlapping avatars (first on top), then the first name and `+N`. The full list goes in `title` and `aria-label`. Hidden on the landing slide.                                                             |
| **Progress line**                      | A 2px line on the bottom edge of the nav, with one segment per slide (landing + each book). Segments already passed stay full, so it reads as one continuous line.                                                                                                    |
| **Auto-advance**                       | Each slide moves on 6s **after it has settled**. Manual navigation restarts the countdown on the new slide and it keeps running afterwards. Pauses while the tab is hidden. Off with `prefers-reduced-motion`.                                                        |
| **Navigation**                         | Tap/click the right half → next, left half → previous. Tapping the book in focus or the View Book link is excluded. Also swipe, arrow keys, and arrow buttons on phones.                                                                                              |
| **Header**                             | Always black. Nav icons and text are white with no bottom border, for every slide. The current per-slide light/dark switching is no longer needed on the homepage.                                                                                                    |
| **Phones**                             | No page dots. The ‹ › arrows sit at either end of the author row, aligned with the menu and account icons. Header height is calculated from the book, so the space above and below it matches.                                                                        |

### Motion rules (these were the fiddly part)

1. **Nothing sweeps across the screen.** A book only enters from the edge it's travelling from, and only leaves by the edge it's nearest. A book that needs to come in from the other side is first moved, without animation, to just outside that edge. See `render()` in mockup section C.
2. **Loop-around is choreographed** (mockup section D):
   - _Last book → landing:_ the books on screen slide off left. Once they're **actually off screen**, they're moved to the right edge unseen and slide back in as the stack.
   - _Landing → last book (backwards):_ the stack slides quickly (half duration) off the right edge. Once off screen, the books are lined up off the left edge in order, and the last book slides in from the left.
   - Both wait on the books' real on-screen positions (`whenBooksOffscreen`), not a timer. A slow first frame otherwise caused visible pops. Input is ignored (`busy`) during these sequences.
3. **Layering follows left-to-right position.** z-index order is off-prev 1, prev 5, current 10, next 20, stack-1…5 21–25, off-next 30. A book never jumps in front of another mid-move. Before this, the second book "popped" in front as the stack opened.
4. **No animation on first render**, or the books fly in from the left edge on page load.

---

## 2. Final design values

These are all in `mockup.html` section 1. Book sizes are measured at desktop size and scale with the book on smaller screens (`--k`).

| Group                               | Value                                                                                                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Book size                           | 93% of the base height for the breakpoint: phone 320px, tablet 380px, desktop 440px, short screens (≤650px tall) 200px                                                                                                                                       |
| Book thickness                      | 53px (desktop)                                                                                                                                                                                                                                               |
| Cover board thickness               | 3px                                                                                                                                                                                                                                                          |
| Cover overhang                      | 0.5px                                                                                                                                                                                                                                                        |
| Corner radius                       | 0                                                                                                                                                                                                                                                            |
| Resting turn                        | −16° (spine slightly visible)                                                                                                                                                                                                                                |
| Turn on hover                       | 6°, over 2s, `cubic-bezier(.2,.7,.2,1)`                                                                                                                                                                                                                      |
| Turn while leaving / parked left    | −25°                                                                                                                                                                                                                                                         |
| Turn while arriving / waiting right | 30°                                                                                                                                                                                                                                                          |
| Tilt                                | 0°                                                                                                                                                                                                                                                           |
| Perspective                         | 1400px                                                                                                                                                                                                                                                       |
| Slide duration                      | 0.6s `ease-in-out`                                                                                                                                                                                                                                           |
| Auto-advance                        | 6s after the slide settles                                                                                                                                                                                                                                   |
| Commentary idle delay               | 0.5s after the slide settles                                                                                                                                                                                                                                 |
| Shadow (on back board)              | `0 35px 87px 10px rgba(0,0,0,.3)`                                                                                                                                                                                                                            |
| Spine crease / sheen / page lines   | 0.08 / 0.02 / 0.12                                                                                                                                                                                                                                           |
| Page colour                         | `#fff`                                                                                                                                                                                                                                                       |
| **Phones**                          | Space above/below book 76px. Book nudged down 14px. Header height = 64 (nav) + 76 + book + 76 + 56 (author row).                                                                                                                                             |
| **Desktop**                         | Header max 800px (and ≤ 90vh). Books / stack / title nudged up 15px. Author row 40px from bottom. Stack books at 115%, spread across 560px from the right edge (never closer than 640px to the left), top book shows 150px. Commentary 26px, max 440px wide. |
| **Tablet**                          | Stack spread 460px (never closer than 380px), top book shows 110px. Title wraps to 2 lines (max 340px). Commentary 26px.                                                                                                                                     |
| Commentary on phones                | 18px, max 300px wide                                                                                                                                                                                                                                         |
| Book in focus behind commentary     | 18% opacity                                                                                                                                                                                                                                                  |

---

## 3. Data

No schema changes are needed. Everything comes from the existing `features` collection and its `book`:

| Mockup field                   | App source                         | Notes                                                                                                                                                                                                        |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cover.src/width/height`       | `feature.book.cover` (`Image`)     | `width`/`height` give the 3D ratio (`image.width / image.height`). Use `next/image`; the desktop book is about 470 CSS px tall, so request about 940px tall for high-density screens. Preload the first few. |
| `back` (boards + spine colour) | `feature.book.backgroundColor`     | Already generated from the cover. Fall back to `#1d1d1b` if it's missing.                                                                                                                                    |
| `designCommentary`             | `feature.book.designCommentary`    | Existing field, edited in the CMS. If it's empty, don't show the commentary overlay or dim the book.                                                                                                         |
| `href`                         | `feature.book.href`                | Used by the book in focus and the View Book link.                                                                                                                                                            |
| `authors`                      | `feature.book.authors` (`Profile`) | Use the existing `<Avatar>` (photo / initials + profile colours).                                                                                                                                            |

`feature.tagLine` (the black label on the old slides) isn't shown in the new design. Decide whether to keep the field.

---

## 4. Where it goes in the codebase

| Today                                                                    | Change                                                                                                                                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/feature-carousel/index.tsx`                              | Rewrite: positions, render plan, loop sequences, timers and input (mockup sections C–H).                                                                                              |
| `feature-carousel/item.tsx`, `slide.tsx`, `use-feature-carousel-item.ts` | Replace with a 3D book slide (section 7) and a position → class/style map (section 5). Framer Motion `layout` animations aren't needed: positions are CSS `translate` transitions.    |
| `feature-carousel/title.tsx`                                             | Keep as the landing slide, without the `setTheme` toggling.                                                                                                                           |
| `feature-carousel/faces.tsx`, `face.ts`, `takeover.tsx`                  | No longer used by the homepage header.                                                                                                                                                |
| `src/components/nav/top-nav.tsx`                                         | Add the progress line slot on the nav's bottom edge, and keep the nav dark on the homepage. One option is to expose progress from the carousel through `NavProvider`.                 |
| `src/app/(frontend)/(main)/page.tsx`                                     | Currently `h-[90vh] max-h-200`. Phone height becomes book-driven (see values).                                                                                                        |
| Styles                                                                   | The 3D faces need custom CSS (`transform-style: preserve-3d`, per-face transforms). A CSS module or `@layer components` in `globals.css` is cleaner than long Tailwind class strings. |

### Implementation notes

- **Use `translate`, not `left`, for slide positions.** It's animated on the compositor. In testing it cut layout passes from about 220 to 4 over 12 moves, and total rendering work by about 37%.
- **`cqw` units:** make the carousel element itself the container (`container-type: inline-size` / Tailwind `@container`) so `100cqw` is the carousel width. Note that a container query can't style its own container; set variables on its children.
- **Hiding off-screen books:** set `visibility: hidden` only after the slide's `translate` transition ends (the `data-settled` flag). A CSS `visibility` transition forces main-thread work every frame.
- **Progress fill:** a Web Animation on `transform: scaleX()` with `delay = slide duration`. Its `onfinish` advances the carousel. Pause it when `document.hidden`.
- **Peeking slides and the stack** handle their own clicks (`stopPropagation`). The full-width landing slide must have `pointer-events: none` whenever it isn't the slide in focus, or it swallows every tap.
- **Avatar stacking:** the avatars need `position: relative` for `z-index` to put the first author on top.
- **Phone arrows:** the 32px icons get a 2px downward optical nudge so they look level with the author name.
- **The date** on the landing slide is rendered from the client clock, as today. Watch for hydration mismatches around midnight.

---

## 5. Accessibility

- Arrow keys work; the phone ‹ › buttons and View Book link have labels; the credit has the full author list in `aria-label`.
- With `prefers-reduced-motion: reduce`: no slide/turn transitions and no auto-advance.
- **Open decision:** WCAG 2.2.2 expects a way to **pause** content that moves on its own for more than 5s. Hover-pause was removed at the designer's request, because it made the carousel look stuck after clicking. Suggestion: a small pause/play button at one end of the progress line.
- The View Book link is only focusable while the commentary is showing.

---

## 6. QA checklist

- [ ] Landing: up to 5 books stacked on desktop/tablet, 3 on phones; more books wait off screen.
- [ ] Tapping any stack book goes to the first book; the stack opens without any book popping in front.
- [ ] Forward through all books and round the loop: books slide off left, the stack slides back in from the right, and nothing crosses the screen.
- [ ] Backwards from the landing slide: the stack exits right, the last book enters from the left, and earlier books keep arriving from the left.
- [ ] Book width matches each cover's ratio (try a square cover).
- [ ] Commentary appears 0.5s after a book settles, hides immediately on any move, and doesn't appear when the field is empty.
- [ ] Author credit for 1, 2, 3 and 4+ authors (mockup: `#tune` → "Preview with extra authors").
- [ ] Progress segments build up and reset on the loop; auto-advance restarts after manual navigation and pauses when the tab is hidden.
- [ ] Tap zones: right half = next, left half = previous; the centre book and View Book are excluded.
- [ ] Phone: no dots; arrows level with the author name and aligned to the nav icons; equal space above and below the book.
- [ ] Reduced motion: no transitions, no auto-advance.
- [ ] Safari and a real phone: the 3D faces render the right way round (a software-rendered headless browser showed depth-sorting glitches that GPU rendering didn't).
- [ ] No books animate in on first page load.
