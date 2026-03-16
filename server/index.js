const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const claudeRouter = require('./routes/claude');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/claude', claudeRouter);

// Landing page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/landing.html'));
});

// React app at /app
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
