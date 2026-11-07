import app from './app.js';
const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Agendia API escuchando en http://localhost:${PUERTO}`);
});