import app from './app';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Test server is now running on port ${port}`);
});
