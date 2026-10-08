# Roadmap: Bootcamp Connect

Features in the order we build them, one at a time. Each gets a spec in `specs/`
that is approved before any code. Target: a working app by early November 2026.
Agreed by both partners on 8 October 2026. Not yet approved by the tutor.

Every feature includes access checks: who is allowed to see or change what.
A feature is finished when its finish line can be checked, the checks pass, and
whoever built it can explain it.

| No. | Feature | Target week | Status |
|-----|---------|-------------|--------|
| 01 | Registration and login | 1 (8 to 14 Oct) | Not started |
| 02 | Admin screens | 2 (15 to 21 Oct) | Not started |
| 03 | Profiles | 2 (15 to 21 Oct) | Not started |
| 04 | Search and matching | 3 (22 to 28 Oct) | Not started |
| 05 | Connection requests, then messaging | 3 to 4 | Not started |
| 06 | Safety and privacy | 4 (29 Oct to 4 Nov) | Not started |
| 07 | Extras, one at a time | Only if ahead | Not started |
| 08 | Account deletion and data export | 4 (29 Oct to 4 Nov) | Not started |
| 09 | Try with both groups, then launch | 4 (29 Oct to 4 Nov) | Not started |

## Finish lines

**01 Registration and login**
- A new student can sign up, choose their course, and must agree to the privacy
  notice before the account is created.
- They can log in, log out, and change their account details.
- A wrong password or an email already in use is refused with a clear message.
- Access check: a logged-out visitor cannot open any logged-in page.

**02 Admin screens**
- An admin can add, rename and remove courses, skills, interests and categories.
- An admin can see the list of users and remove an account.
- Access check: a student who is not an admin cannot open any admin screen.

**03 Profiles**
- A student can add a photo, bio, skills, interests, and tick what they are
  looking for. Skills and interests come from the admin's lists.
- Access check: a student can change only their own profile. Other students
  never see their email address.

**04 Search and matching**
- A student can find students on either course using filters.
- Each result shows a reason that is true of both saved profiles.
- Nobody fits: the app says "No matches yet". A filter value that is not allowed
  gets a clear message.
- Access check: results never include anything the viewer may not see.

**05 Connection requests, then messaging**
- A student can send a request. The other person can accept or decline.
- Two students can message each other only after both have said yes.
- Access check: only the two people in a conversation can read it. Admins cannot.

**06 Safety and privacy**
- A student can block another student, and unblock them.
- Access check: a blocked person cannot send them a request or a message, and
  does not appear in their search results.

**07 Extras, one at a time**
- Events first, then favourites. Finish lines written if we reach them.

**08 Account deletion and data export**
- A student can download a copy of the information the app holds on them.
- A student can delete their account. After that they cannot log in and no
  longer appear anywhere in the app. Their photo file is removed too.
- Access check: a student can do both only for their own account.

**09 Try with both groups, then launch**
- At least one student from each course has used it from sign-up through to chat.
- The tutor has checked the privacy notice.
- The whole journey works at the app's online address.

## If we fall behind

- Skip 07 entirely. Then drop 06, then simplify photos in 03.
- Never drop 01 to 05. They are the five must-haves in the brief.
- Put the app online early, with only the login page, so week 4 has no surprises.
