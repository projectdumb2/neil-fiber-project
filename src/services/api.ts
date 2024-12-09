const API_BASE = '/api';

export async function fetchUnits() {
  const response = await fetch(`${API_BASE}/units`);
  if (!response.ok) throw new Error('Failed to fetch units');
  return response.json();
}

export async function saveUnit(unit: any) {
  const response = await fetch(`${API_BASE}/units`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unit),
  });
  if (!response.ok) throw new Error('Failed to save unit');
  return response.json();
}

export async function updateUnit(unit: any) {
  const response = await fetch(`${API_BASE}/units/${unit.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unit),
  });
  if (!response.ok) throw new Error('Failed to update unit');
  return response.json();
}

export async function fetchProjects() {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function saveProject(project: any) {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!response.ok) throw new Error('Failed to save project');
  return response.json();
}

export async function updateProject(project: any) {
  const response = await fetch(`${API_BASE}/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
}

export async function fetchSettings() {
  const response = await fetch(`${API_BASE}/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
}

export async function saveSettings(settings: any) {
  const response = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error('Failed to save settings');
  return response.json();
}