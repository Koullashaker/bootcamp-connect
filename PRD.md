# PRD: Bootcamp Connect

What we are building, who it is for, and what is in or out.
Agreed by both partners on 8 October 2026. Not yet approved by the tutor.
"Bootcamp Connect" is a placeholder name.

## Who it serves

Students on our bootcamp's two courses: software development and business
development. Nobody else can join in this version.

## What it does

A place for ideas to meet action. Students find each other, see why they might
fit, and a private chat opens only when both people say yes.

On their profile a student ticks what they are looking for (more than one allowed):
co-founder, project collaborator, find a mentor, be a mentor, meet people socially.
Matches can come from their own course or the other one.

## In scope for early November 2026

1. Registration and login, with a privacy notice agreed to at sign-up.
2. Admin screens: courses, skills, interests, categories and users.
3. Profiles: photo, bio, skills, interests, what they are looking for.
4. Search and matching, showing why two people fit.
5. Connection requests (both must agree), then private messaging.
6. A basic block: stop a person from contacting you.
7. Account deletion and data export (GDPR).

Only if we are ahead, one at a time: events, then favourites.

## Out of scope

- Anyone who is not a student on the two courses.
- Making money.
- Notifications, privacy settings, project ideas board, admin dashboard stats,
  reporting with a moderation queue.
- AI-assisted matching, real-time chat, a mobile-friendly design.

## Rules about people's information

- Only logged-in students can see profiles.
- Other students cannot see your email address.
- Only the two people in a conversation can read it. Admins cannot.
- A student can change or delete only their own profile and account.
- Passwords are stored scrambled. Nobody can read them, not even admins.

## Tech stack

Node.js and Express, SQLite with raw SQL and prepared statements (no ORMs), plain
JavaScript (no TypeScript). Big choices are recorded in `decisions/`.

## Open questions

- The exact deadline date, and who builds which feature.
- What "categories" means in the admin screens.
- What the pages are built with, and which testing tool we use.
- Where the app is hosted (it must offer a permanent disk).
- Privacy notice: how long we keep information, and who the contact is.
- What happens to sent messages when someone deletes their account.
- The app's real name, design and colours.
