# Decision 03: Photo storage

Decided by both partners on 8 October 2026.

## What we chose

Profile photos are saved in a folder kept with the app, next to the database
file. There is a size limit, and only picture files are allowed.

## Why

- Simplest to build. Nothing extra to sign up for.
- Deleting a person's information means one place to clean.

## What we rejected

- **A photo storage service**: needs an extra account and secret keys, and
  another company would hold the photos.
- **Photos inside the database**: the database gets big and slow.

## What this means

- The host must offer a permanent disk, the same as for the database.
- Deleting an account must also delete that person's photo file.
- If photos run late, a first version can show a circle with the person's
  initials instead.
