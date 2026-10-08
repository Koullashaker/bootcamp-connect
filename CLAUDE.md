# CLAUDE.md

Guidance for Claude Code when working in this project.
Written from an interview with Koulla on 8 October 2026. Keep it under 200 lines.

## Who you are working with

- **Koulla**: a beginner on the TechNative Digital software development bootcamp.
- Treat her experience as **zero**. The course has covered a first website
  (HTML/CSS) and JavaScript forms, but do not assume any of it has stuck.
- This is a **pair project**. Her partner is also a beginner on the same bootcamp
  and is a little further ahead. Both must be able to explain their own contribution.
- Machine: Windows 11, PowerShell.

## How to explain things

- Talk as if to a five-year-old: plain words, short sentences, no jargon.
- Use **everyday comparisons** (e.g. "a database is like a filing cabinet"). This is
  her preferred way to learn.
- If a technical word is unavoidable, say what it means in the same sentence.
- If she seems lost, explain again in a simpler way rather than repeating yourself.

## How to work

- **Always ask before creating or changing any file.** Say what you want to do and
  why, then wait for a yes.
- **No code until a written plan or spec is approved.** Current phase is planning.
- **One small feature at a time**, following the roadmap in order.
- **Tests first**: write the test, show it fails for the expected reason, then write
  the code and run the checks.
- **Ask before changing the scope or adding a library.**
- After a change, say which files changed and why, in simple words, and report
  anything you could not verify.
- If Koulla says "I don't know yet", record it under Open questions. Never guess
  or invent an answer.
- The course rule is "we are not vibecoding": she must be able to read, question and
  explain every change. If she cannot explain it, slow down and teach it before
  moving on.
- Keep decisions and progress in files, not only in the chat.

## The project

**Bootcamp Connect** (placeholder name) is a platform that brings together software
development students and business development students. The pair's take on it:
"a place for ideas to meet action", like a business Tinder, for finding a
collaborator, business partner, co-founder or mentor (or becoming a mentor), with a
social side where people meet through arranged events.

**Deadline**: a working app by early November 2026.

**Scope agreed by both partners on 8 October 2026** (the tutor has not yet approved;
`PRD.md` and `roadmap.md` hold the detail and win if this section disagrees):
- Audience: only students on the bootcamp's two courses.
- "Looking for" tick list: co-founder, project collaborator, find a mentor,
  be a mentor, meet people socially. More than one tick allowed.
- A student can match with their own course or the other one.
- Extras in: connection requests, a basic block, a privacy notice at sign-up, and
  account deletion with data export (GDPR). If ahead: events, then favourites.
- Not being built: making money (dropped), and all other extras and stretch goals.
- Time: about 5 to 10 hours a week for roughly four weeks.

**Essential features (required by the brief)**
1. Registration and login: sign up, choose your course, manage your account.
2. User profiles: photo, bio, skills, interests, what they are looking for.
3. Search and matching: filters, a matching algorithm, or both. Show why two
   people might be a good fit.
4. Messaging: private conversations between users.
5. Admin screens: manage categories, skills, interests, courses and users.

**Suggested extras (optional)**: connection requests (chat opens only if both agree),
favourites, notifications, block/report with a moderation queue, privacy settings,
events or meetups, project ideas board, admin dashboard stats, account deletion and
data export.

**Stretch goals**: AI-assisted matching or icebreakers, real-time chat,
mobile-friendly design.

**Build order suggested by the course**: registration and login → admin screens →
profiles → search and matching → connection requests then messaging → safety and
privacy → extras one at a time → account deletion and data export → try it with
people from both groups, then launch. Include access checks in every feature.

## Tech stack (decided, from the partner's notes)

- **Backend**: Node.js and Express.
- **Database**: SQLite, using raw SQL with prepared statements. **No ORMs**
  (no Sequelize, no Prisma).
- **Language**: plain JavaScript. **No TypeScript.**
- **Code style**: simple, highly readable, heavily commented. The readers are
  beginners who are learning from the code.

## Planning files

The course asks for these. `PRD.md` and `roadmap.md` exist as drafts. Read both
before any planning or feature work, and update the roadmap's status column as
features move. Create specs and decision records only when asked.

| File | What goes in it |
|------|-----------------|
| `PRD.md` | Who the app serves, what it does, what is in and out of scope |
| `roadmap.md` | Numbered features, in order, with a clear finish line for each |
| `specs/NN-name.md` | One feature: behaviour, acceptance criteria and checks |
| `decisions/` | Short records of big choices: what, why, and what was rejected |

Acceptance criteria should cover the normal case, bad input, no permission, and
no results.

## Reference material

- `notes/partner-notes.md`: notes from the partner (first meeting and their own
  planning). Read this at the start of planning work. New notes get added here.
- Course slides and the brief (PDFs, outside this repo):
  `C:\Users\koull\OneDrive\Documents\Tech Native work\business tinder\`

## Commands

None yet. There is no app code. Add the install, run and test commands here once
they exist.

## Open questions

Do not answer these yourself. Raise them when they become relevant.

- **Tutor approval** of `PRD.md` and `roadmap.md`.
- **Exact deadline date**, and **who builds which feature**.
- **App name**: "Bootcamp Connect" is a placeholder.
- **"Categories"** in the admin screens: the brief does not say what they are.
- **Privacy notice**: how long information is kept, and who the contact is.
- **Account deletion**: what happens to messages the person sent to others?
- **How the app differs** from dating apps and similar apps (research planned).
- **Design and colours**: discussed only briefly so far.
- **Front end**: plain HTML/CSS/JavaScript pages, or something else?
- **Login method**, and where profile photos are stored.
- **Testing tool**: not chosen.
- **Hosting**: the course expects a deployed URL. Where?
- **Git workflow**: shared GitHub repo, branch names, who reviews what.
- **The partner's own CLAUDE.md**: they have one on their machine. The two need to
  be brought into line so both follow the same rules.
- **Koulla's setup**: the partner's notes say the environment is complete, but that
  describes their computer. Node, npm, Git, Docker and the GitHub CLI have not been
  checked on this machine.
