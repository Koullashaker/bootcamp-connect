# Decision 02: Database

Chosen in the partner's planning notes (`notes/partner-notes.md`), 8 October 2026.

## What we chose

SQLite, which keeps all the data in a single file. We write the SQL ourselves,
using prepared statements (a safe way to put people's input into the database).

## Why

To confirm with the partner. Our understanding: it is simple, there is no
separate database program to run, and writing the SQL ourselves means we learn it
and can explain every query.

## What we rejected

- **ORMs such as Sequelize or Prisma** (tools that write the SQL for you).

## What this means

- The whole database is one file, kept with the app.
- The place we host the app must offer a permanent disk, or the file is wiped on
  every update.
