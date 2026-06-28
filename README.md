# Keepsake

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
