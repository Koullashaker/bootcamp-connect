// record.js
// Steps 3 and 4 of PLAN.md: records the demo video clips.
// It makes a fresh demo database, starts the app on this laptop using it,
// then a robot browser (Playwright) clicks through each clip while
// recording. Each clip is saved as its own file in the videos folder.
//
// In PowerShell, from the demo-video folder:
//   $env:DEMO_PASSWORD='pick-something'; node record.js
// The password is used for the made-up students, the admin and Mia.
// It is never written in a file.

const path = require('path');
// spawn starts another program and lets it keep running alongside us
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const { makeDemoData, DB_PATH, ADMIN_EMAIL } = require('./make-demo-data');

// ---------------------------------------------------------
// 1. SETTINGS
// ---------------------------------------------------------

const APP_DIR = path.join(__dirname, '..', 'node-express-app');
const VIDEOS_DIR = path.join(__dirname, 'videos');

// Port 3100, not 3000, so it never clashes with "npm run dev"
const PORT = '3100';
const BASE_URL = `http://localhost:${PORT}`;

// The size of the browser window AND of the video: 1280 x 720 is "720p"
const SIZE = { width: 1280, height: 720 };

// How much bigger to make the page, so text is easy to read in the video
const PAGE_ZOOM = 1.25;

// Speeds, in milliseconds (1000 ms = 1 second)
const TYPING_DELAY = 70; // between letters when typing
const GLIDE_STEPS = 25; // how many small moves the dot makes to reach a button
const SHORT_PAUSE = 800;
const LONG_PAUSE = 2500; // on important screens, so viewers can read them

// In the one-long-video version: show a title card before each scene.
// Change to false to join the scenes with no cards.
const SHOW_CARDS = true;
const CARD_PAUSE = 2500;

// ---------------------------------------------------------
// 2. THE CLICK DOT
// ---------------------------------------------------------

// The video shows no mouse pointer, so this little script is added to every
// page. It draws a coloured dot that follows the mouse, and a ring that
// grows and fades on every click. It is written as text because Playwright
// sends it into the browser to run there.
// sessionStorage remembers where the dot was, so after a page change it
// starts from the same place instead of jumping to the corner.
const CLICK_DOT_SCRIPT = `
(() => {
  window.addEventListener('DOMContentLoaded', () => {
    // Make the page bigger. Only the body is zoomed, so the dot (which sits
    // outside the body) still lines up with the real mouse position.
    document.body.style.zoom = '${PAGE_ZOOM}';

    const style = document.createElement('style');
    style.textContent = \`
      .demo-dot, .demo-ring {
        position: fixed; pointer-events: none; z-index: 2147483647;
        border-radius: 50%; transform: translate(-50%, -50%);
      }
      .demo-dot {
        width: 22px; height: 22px;
        background: rgba(255, 90, 95, 0.85); border: 3px solid white;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
      }
      .demo-ring {
        width: 22px; height: 22px; border: 3px solid rgba(255, 90, 95, 0.9);
        animation: demo-ring 0.6s ease-out forwards;
      }
      @keyframes demo-ring {
        to { width: 70px; height: 70px; opacity: 0; }
      }
    \`;
    document.documentElement.appendChild(style);

    const dot = document.createElement('div');
    dot.className = 'demo-dot';
    document.documentElement.appendChild(dot);

    function moveDot(x, y) {
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      try { sessionStorage.setItem('demoDot', x + ',' + y); } catch (e) {}
    }

    // Start where the dot was on the last page, or near the middle
    let start = '640,360';
    try { start = sessionStorage.getItem('demoDot') || start; } catch (e) {}
    const [x, y] = start.split(',');
    moveDot(x, y);

    document.addEventListener('mousemove', (e) => moveDot(e.clientX, e.clientY));
    document.addEventListener('mousedown', (e) => {
      const ring = document.createElement('div');
      ring.className = 'demo-ring';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      document.documentElement.appendChild(ring);
      setTimeout(() => ring.remove(), 700);
    });
  });
})();
`;

// ---------------------------------------------------------
// 3. HELPERS: how the robot moves, clicks and types
// ---------------------------------------------------------

// Waits, so the viewer has time to see the screen
function hold(page, ms) {
  return page.waitForTimeout(ms);
}

// If something is off the screen (or close to the edge), scrolls the page
// smoothly so it sits a third of the way down, like a person scrolling.
// (Playwright's own scrolling jumps in one go, which looks jerky on video.)
async function scrollGentlyTo(page, target) {
  const box = await target.boundingBox();
  const tooLow = box.y + box.height > SIZE.height - 60;
  const tooHigh = box.y < 90;
  if (tooLow || tooHigh) {
    const distance = box.y - SIZE.height / 3;
    await page.evaluate((top) => window.scrollBy({ top, behavior: 'smooth' }), distance);
    await hold(page, 900);
  }
}

// Glides the dot smoothly to the middle of something on the page
async function glideTo(page, target) {
  await scrollGentlyTo(page, target);
  const box = await target.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: GLIDE_STEPS });
  await hold(page, 250);
}

// Glides to something, then clicks it
async function clickOn(page, target) {
  await glideTo(page, target);
  await target.click();
}

// Clicks a box, then types into it letter by letter, like a person
async function typeInto(page, target, text) {
  await clickOn(page, target);
  await target.pressSequentially(text, { delay: TYPING_DELAY });
}

// Ticks one box inside a group of tick boxes, e.g. "Graphic design" inside
// "Skills I have". The group matters, because some skills appear in two
// groups. A fieldset with a legend counts as a "group", named by its legend.
async function tick(page, groupName, boxLabel) {
  const group = page.getByRole('group', { name: groupName, exact: true });
  await clickOn(page, group.getByLabel(boxLabel, { exact: true }));
}

// Replaces what is in a box: select everything in it, then type over it
async function retype(page, target, text) {
  await clickOn(page, target);
  await target.press('Control+A');
  await target.pressSequentially(text, { delay: TYPING_DELAY });
}

// Shows a full-screen title card, e.g. before a scene. The words fade in.
// setContent swaps the whole page for this little page of our own.
async function showCard(page, title, subtitle = '') {
  await page.setContent(`
    <style>
      body {
        margin: 0; height: 100vh; display: flex; flex-direction: column;
        align-items: center; justify-content: center; text-align: center;
        font-family: system-ui, sans-serif; color: white;
        background: linear-gradient(135deg, #0b3d91, #6a1b9a);
      }
      h1 { font-size: 64px; margin: 0 40px; animation: rise 0.8s ease-out; }
      p { font-size: 30px; margin: 24px 40px 0; opacity: 0.85; animation: rise 1.2s ease-out; }
      @keyframes rise { from { opacity: 0; transform: translateY(20px); } }
    </style>
    <h1>${title}</h1>
    <p>${subtitle}</p>
  `);
  await hold(page, CARD_PAUSE);
}

// Glides to a drop-down list and picks an option by its words.
// (A real click would open the list, which the video does not show.)
async function choose(page, target, label) {
  await glideTo(page, target);
  await target.selectOption({ label });
  await hold(page, SHORT_PAUSE);
}

// ---------------------------------------------------------
// 4. THE CLIPS (see the table in PLAN.md)
// ---------------------------------------------------------

const CLIPS = [
  {
    number: 1,
    name: 'register',
    caption: 'Mia, a business student, signs up',
    // Mia, a new Business development student, signs up
    async run(page, password) {
      await page.goto(`${BASE_URL}/login`);
      await hold(page, LONG_PAUSE);

      // The Register link in the header
      await clickOn(page, page.locator('.site-nav a[href="/register"]'));
      await hold(page, SHORT_PAUSE);

      await typeInto(page, page.locator('#name'), 'Mia Carter');
      await typeInto(page, page.locator('#email'), 'mia@example.com');
      // Shows as dots on screen, so the password is never visible
      await typeInto(page, page.locator('#password'), password);
      await choose(page, page.locator('#course_id'), 'Business development');
      await clickOn(page, page.locator('#privacy'));
      await hold(page, SHORT_PAUSE);

      await clickOn(page, page.getByRole('button', { name: 'Create account' }));
      // Registering leads to the profile setup form (the setup gate)
      await page.waitForURL('**/profile/edit');
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 2,
    name: 'profile-setup',
    caption: 'She tells everyone what she is looking for',
    loggedInAs: 'mia@example.com',
    // Mia fills in the setup form. Her ticks are chosen so that Cleo
    // (a coder who wants to be a mentor) comes top of her matches.
    async run(page) {
      await page.goto(`${BASE_URL}/profile/edit`);
      await hold(page, LONG_PAUSE);

      await tick(page, 'Looking for', 'Find a mentor');
      await tick(page, 'Looking for', 'Project collaborator');
      await tick(page, 'Skills I have', 'Graphic design');
      await tick(page, 'Skills I have', 'Branding');
      await tick(page, 'Skills I am looking for', 'JavaScript');
      await tick(page, 'Skills I am looking for', 'Testing');
      await tick(page, 'Interests', 'Education');
      await tick(page, 'Interests', 'Artificial intelligence');

      await typeInto(page, page.locator('#bio'),
        'Business student with a brand of eco-friendly study kits. I need a coder to help me build the website.');
      await typeInto(page, page.locator('#business_idea'),
        'Eco-friendly study kits for students, sold online.');
      await hold(page, SHORT_PAUSE);

      await clickOn(page, page.getByRole('button', { name: 'Save my profile' }));
      // Saving leads to the dashboard
      await page.waitForURL(`${BASE_URL}/`);
      await hold(page, SHORT_PAUSE);
    },
  },
  {
    number: 3,
    name: 'matches',
    caption: 'Smart matching shows who fits, and why',
    loggedInAs: 'mia@example.com',
    // The big moment: Mia's matches, best first, each with its reasons
    async run(page) {
      await page.goto(`${BASE_URL}/`);
      await hold(page, LONG_PAUSE);

      // Point at Cleo's mentor reason, and stay there so it can be read
      const firstCard = page.locator('.match-card').first();
      await glideTo(page, firstCard.getByText('You are looking for a mentor and they want to be one'));
      await hold(page, LONG_PAUSE * 2);

      // Then glide down past the other matches
      await glideTo(page, page.locator('.match-card').nth(2));
      await hold(page, SHORT_PAUSE);
      await glideTo(page, page.locator('.match-card').last());
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 4,
    name: 'connection-request',
    caption: 'Mia asks Cleo to connect',
    loggedInAs: 'mia@example.com',
    // Mia opens Cleo's profile and asks to connect
    async run(page) {
      await page.goto(`${BASE_URL}/`);
      await hold(page, SHORT_PAUSE);

      await clickOn(page, page.getByRole('link', { name: 'Cleo Demo' }));
      await hold(page, LONG_PAUSE);

      await clickOn(page, page.getByRole('button', { name: 'Send connection request' }));
      await page.getByText('Request sent').waitFor();
      await glideTo(page, page.getByText('Request sent'));
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 5,
    name: 'accept-and-message',
    caption: 'Cleo accepts and says hello',
    loggedInAs: 'cleo@example.com',
    // Cleo accepts Mia's request and writes the first message
    async run(page) {
      await page.goto(`${BASE_URL}/`);
      await hold(page, SHORT_PAUSE);

      // The Connections link in the header
      await clickOn(page, page.locator('.site-nav').getByRole('link', { name: 'Connections' }));
      await hold(page, LONG_PAUSE);

      await clickOn(page, page.getByRole('button', { name: 'Accept Mia Carter' }));
      await hold(page, LONG_PAUSE);

      await clickOn(page, page.getByRole('link', { name: 'Open conversation with Mia Carter' }));
      await hold(page, SHORT_PAUSE);

      await typeInto(page, page.locator('#message'),
        'Hi Mia! Happy to help with the website. What do you have so far?');
      await clickOn(page, page.getByRole('button', { name: 'Send' }));
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 6,
    name: 'reply',
    caption: 'Private messages between connections',
    loggedInAs: 'mia@example.com',
    // Mia reads Cleo's message and answers
    async run(page) {
      await page.goto(`${BASE_URL}/`);
      await hold(page, SHORT_PAUSE);

      await clickOn(page, page.locator('.site-nav').getByRole('link', { name: 'Connections' }));
      await hold(page, SHORT_PAUSE);

      await clickOn(page, page.getByRole('link', { name: 'Open conversation with Cleo Demo' }));
      await hold(page, LONG_PAUSE);

      await typeInto(page, page.locator('#message'),
        'Thanks Cleo! I have a logo and a plan. Can we meet on Thursday?');
      await clickOn(page, page.getByRole('button', { name: 'Send' }));
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 7,
    name: 'account',
    caption: 'Students manage their own account',
    loggedInAs: 'mia@example.com',
    // Mia changes her name on the Account page
    async run(page) {
      await page.goto(`${BASE_URL}/`);
      await hold(page, SHORT_PAUSE);

      await clickOn(page, page.locator('.site-nav').getByRole('link', { name: 'Account' }));
      await hold(page, LONG_PAUSE);

      await retype(page, page.locator('#name'), 'Mia Carter-Jones');
      await clickOn(page, page.getByRole('button', { name: 'Save details' }));

      // The "saved" message, and the new name in the header
      await glideTo(page, page.getByText('Your details have been saved.'));
      await hold(page, SHORT_PAUSE);
      await glideTo(page, page.locator('.site-nav-name'));
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 8,
    name: 'admin-adds-skill',
    caption: 'Admins look after the lists of skills',
    loggedInAs: ADMIN_EMAIL,
    // The admin adds a new skill, "Video editing", to the Design category
    async run(page) {
      await page.goto(`${BASE_URL}/admin`);
      await hold(page, LONG_PAUSE);

      await clickOn(page, page.getByRole('link', { name: 'Skills', exact: true }));
      await hold(page, SHORT_PAUSE);

      await typeInto(page, page.locator('#name'), 'Video editing');
      await choose(page, page.locator('#parent_id'), 'Design');
      await clickOn(page, page.getByRole('button', { name: 'Add' }));
      await hold(page, SHORT_PAUSE);

      // Point at the new skill in the list
      await glideTo(page, page.locator('.admin-rows li', { hasText: 'Video editing' }));
      await hold(page, LONG_PAUSE);
    },
  },
  {
    number: 9,
    name: 'new-skill-on-profile',
    caption: 'New skills appear for every student',
    loggedInAs: 'mia@example.com',
    // The admin's new skill now appears on Mia's profile form
    async run(page) {
      await page.goto(`${BASE_URL}/profile/edit`);
      await hold(page, SHORT_PAUSE);

      const newSkill = page
        .getByRole('group', { name: 'Skills I have', exact: true })
        .getByLabel('Video editing', { exact: true });
      await glideTo(page, newSkill);
      await hold(page, LONG_PAUSE * 2);
    },
  },
];

// ---------------------------------------------------------
// 5. STARTING THE APP
// ---------------------------------------------------------

// Starts the app (node index.js) using the demo database
function startApp() {
  return spawn('node', ['index.js'], {
    cwd: APP_DIR,
    env: { ...process.env, DB_PATH, PORT },
    stdio: 'inherit',
  });
}

// Asks the app for the login page every half second until it answers,
// so recording only starts once the app is ready. Gives up after 15 s.
async function waitForApp() {
  for (let tries = 0; tries < 30; tries++) {
    try {
      const response = await fetch(`${BASE_URL}/login`);
      if (response.ok) {
        return;
      }
    } catch (e) {
      // Not ready yet: try again
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('The app did not start within 15 seconds.');
}

// ---------------------------------------------------------
// 6. RECORDING
// ---------------------------------------------------------

// Logs someone in OFF CAMERA, in a window that is not recorded, so the
// clips do not all start with the same login screen. Gives back the
// window's "storage state" (its cookies), so the recorded window can start
// already logged in, like a browser that remembers you.
async function logInOffCamera(browser, email, password) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/login`);
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  // Logging in leaves the login page; wait for that before keeping the cookie
  await page.waitForURL((url) => !url.pathname.startsWith('/login'));
  const state = await context.storageState();
  await context.close();
  return state;
}

// Records one clip into its own video file
async function recordClip(browser, clip, password) {
  // Clips with "loggedInAs" start already logged in as that person
  const storageState = clip.loggedInAs
    ? await logInOffCamera(browser, clip.loggedInAs, password)
    : undefined;

  // A "context" is like a fresh private browser window with its own
  // cookies. Everything in it is recorded.
  const context = await browser.newContext({
    viewport: SIZE,
    storageState,
    recordVideo: { dir: path.join(VIDEOS_DIR, 'raw'), size: SIZE },
  });
  await context.addInitScript(CLICK_DOT_SCRIPT);
  const page = await context.newPage();

  await clip.run(page, password);

  // The video file is only finished once the window closes
  const video = page.video();
  await context.close();

  // Give it a clear name, e.g. clip-01-register.webm, and remove the raw copy
  const fileName = `clip-${String(clip.number).padStart(2, '0')}-${clip.name}.webm`;
  await video.saveAs(path.join(VIDEOS_DIR, fileName));
  await video.delete();
  console.log(`Saved videos/${fileName}`);
}

// Records the WHOLE story as one long video, in one window.
// Between scenes it swaps who is logged in by swapping the cookies, the
// way a browser would after logging out and in again (off camera).
async function recordTogether(browser, password) {
  const context = await browser.newContext({
    viewport: SIZE,
    recordVideo: { dir: path.join(VIDEOS_DIR, 'raw'), size: SIZE },
  });
  await context.addInitScript(CLICK_DOT_SCRIPT);
  const page = await context.newPage();

  if (SHOW_CARDS) {
    await showCard(page, 'Bootcamp Connect', 'A place for ideas to meet action');
  }

  for (const clip of CLIPS) {
    // Log out, then (if this scene needs it) log in as the scene's person
    await context.clearCookies();
    if (clip.loggedInAs) {
      const state = await logInOffCamera(browser, clip.loggedInAs, password);
      await context.addCookies(state.cookies);
    }

    if (SHOW_CARDS) {
      await showCard(page, clip.caption);
    }
    await clip.run(page, password);
  }

  if (SHOW_CARDS) {
    await showCard(page, 'Bootcamp Connect', 'node-express-app-production.up.railway.app');
  }

  const video = page.video();
  await context.close();
  await video.saveAs(path.join(VIDEOS_DIR, 'bootcamp-connect-demo.webm'));
  await video.delete();
  console.log('Saved videos/bootcamp-connect-demo.webm');
}

// "node record.js" records the 9 separate clips.
// "node record.js together" records one long video instead.
async function main() {
  const password = process.env.DEMO_PASSWORD;
  const together = process.argv[2] === 'together';

  // A fresh demo database every time (this also checks the password)
  makeDemoData();

  const app = startApp();
  let browser;
  try {
    await waitForApp();
    browser = await chromium.launch();
    if (together) {
      await recordTogether(browser, password);
    } else {
      for (const clip of CLIPS) {
        await recordClip(browser, clip, password);
      }
    }
  } finally {
    // Always tidy up, even if a clip went wrong: close the robot browser
    // and stop the app
    if (browser) {
      await browser.close();
    }
    app.kill();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
