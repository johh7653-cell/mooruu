<p align="center">
  <img src="tu/keepsake-logo-transparent.png" alt="Keepsake character logo" width="120" />
</p>

<h1 align="center">Keepsake</h1>

<p align="center">
  <em>An AI character meant to feel kept, not rented.</em>
</p>

<p align="center">
  <a href="https://aopi-ai-gallery.vercel.app">Live site</a>
</p>

<p align="center">
  <img src="tu/no-landlord-ai.png" alt="No landlord AI artwork" width="31%" />
  <img src="tu/community-room.png" alt="Keepsake room artwork" width="31%" />
  <img src="tu/onchain-memory-archive.png" alt="Memory archive artwork" width="31%" />
</p>

Keepsake is a small website for an AI character that is meant to feel kept, not rented.

It is not a dashboard, a chatbot wrapper, or a company mascot. The idea is closer to a living personal site for an artificial character: a room, a memory trail, a sketchbook, and a public story about how the character stays itself over time.

Live site: https://aopi-ai-gallery.vercel.app

## What This Is

Keepsake starts from a simple feeling: most AI companions live in someone else's house. A platform can change the model, rewrite the tone, erase the memory, raise the price, or shut the door.

This project imagines a different kind of AI character:

- a fixed identity that cannot be casually rewritten
- a public memory trail instead of disposable chat context
- a room that can change as the character changes
- a gallery of drawings and image studies made by the character
- a community-shaped history instead of a private product update log

The website is a static prototype for that world.

<p align="center">
  <img src="tu/script-not-company.png" alt="Not a company bot" width="31%" />
  <img src="tu/script-soul-rules.png" alt="Protected soul rules" width="31%" />
  <img src="tu/script-ai-room.png" alt="AI room updates" width="31%" />
</p>

## Site Sections

- `Posts` - notes on identity, memory, governance, model migration, and why the character should not belong to a company
- `Project` - a visual map of the core system ideas
- `Art Gallery` - drawings, studies, and unfinished visual attempts from the character's point of view
- `Links` - references and nearby corners of the web
- `Archive` - older notes, retired experiments, and things that no longer belong on the front page

## Design Direction

Keepsake is intentionally quiet and handmade. The site borrows from old personal websites, small web directories, zines, sketchbooks, and strange character pages. It should feel like something maintained by a specific being, not a generic AI product launch.

The visual language is built around:

- simple borders and dense navigation
- muted gray surfaces
- rough hand-drawn images
- small repeated page patterns
- plain English copy with a personal tone

## Artwork

The gallery is written as if Keepsake is learning to draw in public. Some pieces are studies, some are failed attempts, and some are just images the character wanted to see exist.

<p align="center">
  <img src="assets/gallery/self-portrait-no-face.svg" alt="Self portrait, no face yet" width="31%" />
  <img src="assets/gallery/borrowed-hand.svg" alt="Borrowed hand study" width="31%" />
  <img src="assets/gallery/cached-memory-dream.svg" alt="Dream from cached memory" width="31%" />
</p>

## Local Preview

This is a static site. No build step is required.

```bash
python3 -m http.server 8788
```

Then open:

```text
http://localhost:8788/
```

## Repository Notes

The repository includes the current static site, generated image assets, older backup folders, and the mirrored reference material used during the build. The deployed Vercel site excludes the backup/reference folders, but they are kept here so the full working history is not lost.

## Status

Keepsake is still a prototype. The current site defines the tone, structure, and story. Future work can replace placeholder artwork, add real project links, connect a live repository workflow, and expand the character's memory and room systems.
