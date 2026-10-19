# Plan: a Playwright demo video

Agreed with Koulla on 19 October 2026.

## The idea in one line

A small script opens the app on Koulla's laptop, clicks through a student's
story by itself, and saves video files. Koulla then adds a title, an ending
and music in Clipchamp.

## Where it lives

This folder, `C:\Users\koull\projects\bootcamp-connect\demo-video\`, next to
the app and not inside it. The app's code, its tests and the shared repo with
Walied stay untouched. Playwright is installed only in this folder.

## The story it records

| Clip | Who | What happens on screen | About |
|---|---|---|---|
| 1 | Mia, new student | Register (Business course, privacy tick) | 20 s |
| 2 | Mia | Profile setup: "Find a mentor", skills, interests, a short bio | 30 s |
| 3 | Mia | Matches page; holds on Cleo's reason, "they want to be a mentor" | 20 s |
| 4 | Mia | Opens Cleo's profile and sends a connection request | 15 s |
| 5 | Cleo, demo student | Connections page: accepts, then writes "Hi Mia!" | 20 s |
| 6 | Mia | Reads the message and replies | 15 s |
| 7 | Mia | Account page: changes her name, sees "saved" | 15 s |
| 8 | Admin | Adds a skill, "Video editing", under Design | 14 s |
| 9 | Mia | The new skill appears on her profile form | 8 s |

Clip 8 was split into 8 and 9 (one person per clip). Recorded length:
2 min 25 s in total. Each clip is its own video file in `videos/`.
Clips 2 to 9 start already logged in: record.js logs in off camera first.

## How it looks good

- Recorded at 1280 x 720, browser zoomed so the text is easy to read.
- Typing appears letter by letter. The script pauses on important screens.
- A coloured dot shows where each click lands (the video has no mouse pointer).
- The 8 made-up seed students fill the matches page.

## Safety

- A brand-new demo database in this folder, made fresh on every run. Never
  Koulla's `app.db`, never the live site.
- Passwords come from settings typed in PowerShell, never written in a file.

## Steps (Koulla checks each before the next)

1. [x] Create this folder and install Playwright.
2. [x] A script that makes the fresh demo database (seed and admin):
   `make-demo-data.js`.
3. [x] Record clip 1 only. Koulla watched it: speed is fine (19 October).
4. [ ] Add clips 2 to 9. Go through the script together.
   All 9 recorded on 19 October and checked by Claude from still pictures.
   Waiting for Koulla to watch them, and for the walk-through of record.js.
5. [ ] Koulla adds music (and anything else) in Clipchamp. The one-long-video
   version already has a title card and an ending card.

## Decisions

1. Folder location: agreed.
2. Names: Mia (new student) and Cleo (seed student "Cleo Demo"): agreed.
3. Admin clip (8): kept, because it shows Walied's work.
4. Photo for Mia: no. She keeps the initials circle.
5. Click dot: yes.
6. Mia's full name: "Mia Carter" (surname picked by Claude; Koulla can change
   it). In clip 7 she changes it to "Mia Carter-Jones".

## How to record again

In PowerShell (any made-up password of 8 or more characters):

```
cd C:\Users\koull\projects\bootcamp-connect\demo-video
$env:DEMO_PASSWORD='pick-something'; node record.js
```

It always records all 9 clips, because each clip needs what the one before
it did (for example, Cleo can only accept a request Mia has sent).

To record ONE long video instead (`videos/bootcamp-connect-demo.webm`,
about 3 minutes), add the word `together`:

```
$env:DEMO_PASSWORD='pick-something'; node record.js together
```

Playwright's own video tool cannot join files, so this records the whole
story in one window, switching who is logged in between scenes. A title
card comes before each scene, plus an opening and an ending card. Set
`SHOW_CARDS` to `false` in record.js for no cards.

## Limits

- No mouse pointer (the click dot stands in for it) and no sound.
