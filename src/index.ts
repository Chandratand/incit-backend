import express from 'express';

const app = express();
const PORT = 5000;

app.get('', (req, res, next) => {
  res.json({ message: 'Welcome to INCIT API' });
});

app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`);
});
