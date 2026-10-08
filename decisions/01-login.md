# Decision 01: Login

Decided by both partners on 8 October 2026.

## What we chose

Email and password login that we build ourselves. Passwords are stored scrambled,
so nobody can read them. The app remembers who is logged in.

## Why

- We learn how login really works and can explain it.
- No outside accounts or secret keys to set up.
- Everyone's information stays in one place, which makes our GDPR promises
  easier to keep.

## What we rejected

- **Sign in with Google**: fiddly to set up and test, and everyone needs a
  Google account.
- **A ready-made login service**: a sealed box we could not explain, and people's
  details would go to another company.

## What this means

- We are responsible for doing it safely.
- No "forgot password" email at first. An admin resets it instead.
- It needs two small helper libraries (one to scramble passwords, one to remember
  who is logged in). Which ones is still to be approved.
