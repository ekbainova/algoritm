const express = require('express');
const { execFile } = require('child_process');
const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const child = execFile(
        'claude',
        ['--print', '--model', 'sonnet'],
        { timeout: 120000, maxBuffer: 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(stderr || error.message));
          } else {
            resolve(stdout.trim());
          }
        }
      );
      child.stdin.write(prompt);
      child.stdin.end();
    });

    res.json({ text: result });
  } catch (error) {
    console.error('Claude CLI error:', error.message);
    res.status(500).json({ error: 'Failed to call Claude CLI' });
  }
});

module.exports = router;
