// make-demo-data.js
// Step 2 of PLAN.md: builds a FRESH demo database for the video.
// It throws away the old demo-data folder, then uses the app's own scripts
// to add the 8 made-up students (scripts/seed.js) and an admin
// (scripts/create-admin.js).
//
// It never touches the app's real app.db, and never the live site.
//
// The password comes from the DEMO_PASSWORD setting, typed in PowerShell,
// so it is never written in a file. In PowerShell:
//   $env:DEMO_PASSWORD='pick-something'; node make-demo-data.js
// record.js runs this file for you, so you rarely need to run it alone.

const fs = require('fs');
const path = require('path');
// execFileSync runs another program and waits until it has finished
const { execFileSync } = require('child_process');

// ---------------------------------------------------------
// 1. SETTINGS
// ---------------------------------------------------------

// The app lives in the folder next to this one
const APP_DIR = path.join(__dirname, '..', 'node-express-app');

// The throwaway folder for the demo database
const DATA_DIR = path.join(__dirname, 'demo-data');
const DB_PATH = path.join(DATA_DIR, 'demo.db');

// The admin account used in clip 8. @example.com never reaches a real person.
const ADMIN_EMAIL = 'admin@example.com';

// ---------------------------------------------------------
// 2. BUILD THE DATABASE
// ---------------------------------------------------------

function makeDemoData() {
  const password = process.env.DEMO_PASSWORD;

  // Stop straight away with a clear message if the password is missing.
  // The app's rule: at least 8 characters.
  if (!password || password.length < 8) {
    throw new Error(
      "Set a demo password of 8 or more characters first, e.g. $env:DEMO_PASSWORD='pick-something'"
    );
  }

  // Start from nothing: delete the old demo folder, then make it again.
  // force: true means "no error if it is not there yet".
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  fs.mkdirSync(DATA_DIR);

  // The settings both app scripts read. "...process.env" keeps the
  // computer's normal settings and adds ours on top.
  // DB_PATH points the app at the demo database instead of app.db.
  const settings = {
    ...process.env,
    DB_PATH,
    SEED_PASSWORD: password,
    ADMIN_EMAIL,
    ADMIN_PASSWORD: password,
    ADMIN_NAME: 'Demo Admin',
  };

  // Run the app's seed script, then its admin script, inside the app folder.
  // stdio: 'inherit' shows their messages in this window.
  execFileSync('node', ['scripts/seed.js'], { cwd: APP_DIR, env: settings, stdio: 'inherit' });
  execFileSync('node', ['scripts/create-admin.js'], { cwd: APP_DIR, env: settings, stdio: 'inherit' });
}

// ---------------------------------------------------------
// 3. RUNNING THE SCRIPT
// ---------------------------------------------------------

// Runs only when this file is started directly (node make-demo-data.js),
// not when record.js loads it
if (require.main === module) {
  makeDemoData();
  console.log(`Demo database ready: ${DB_PATH}`);
}

// Share with record.js
module.exports = { makeDemoData, DATA_DIR, DB_PATH, ADMIN_EMAIL };
