import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, 'data');

const app = express();
app.use(express.json());

// Ensure data directory exists
try {
  await fs.access(dataDir);
} catch {
  await fs.mkdir(dataDir);
}

// Helper function to read JSON file
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(join(dataDir, filename));
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename, data) {
  await fs.writeFile(join(dataDir, filename), JSON.stringify(data, null, 2));
}

// Units endpoints
app.get('/api/units', async (req, res) => {
  try {
    const units = await readJsonFile('units.json');
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read units' });
  }
});

app.post('/api/units', async (req, res) => {
  try {
    const units = await readJsonFile('units.json');
    const newUnit = { ...req.body, id: crypto.randomUUID() };
    units.push(newUnit);
    await writeJsonFile('units.json', units);
    res.json(newUnit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save unit' });
  }
});

app.put('/api/units/:id', async (req, res) => {
  try {
    const units = await readJsonFile('units.json');
    const index = units.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }
    units[index] = { ...req.body, id: req.params.id };
    await writeJsonFile('units.json', units);
    res.json(units[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

// Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await readJsonFile('projects.json');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const projects = await readJsonFile('projects.json');
    const newProject = { ...req.body, id: crypto.randomUUID() };
    projects.push(newProject);
    await writeJsonFile('projects.json', projects);
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const projects = await readJsonFile('projects.json');
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    projects[index] = { ...req.body, id: req.params.id };
    await writeJsonFile('projects.json', projects);
    res.json(projects[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Settings endpoint
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await readJsonFile('settings.json');
    res.json(settings[0] || { monthlyIncomePerCustomer: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    await writeJsonFile('settings.json', [req.body]);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});