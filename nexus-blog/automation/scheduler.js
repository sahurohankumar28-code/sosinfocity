const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

const fetchScriptPath = path.join(__dirname, 'fetch-news.js');

function runFetch() {
  exec(`node "${fetchScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return;
    }
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
  });
}

// Initial execution on startup
runFetch();

// Run every 2 hours at minute 0 (e.g., 00:00, 02:00, 04:00...)
cron.schedule('0 */2 * * *', () => {
  console.log('Running scheduled 2-hour blog update...');
  runFetch();
});