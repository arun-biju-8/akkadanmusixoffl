import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');

// Serve static files from the Vite build output directory
app.use(express.static(DIST_DIR));

// SPA fallback: return index.html for any navigation routes handled by client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
