import test from 'node:test';
import assert from 'node:assert';

// Set NODE_ENV to test before importing server.js to prevent it from calling app.listen on port 3001
process.env.NODE_ENV = 'test';
const appModule = await import('../server.js');
const app = appModule.default;

test('API Route Integration Tests', async (t) => {
  // Start server on an ephemeral random port
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://localhost:${port}/api`;

  t.after(() => {
    server.close();
  });

  await t.test('GET /api/state returns valid lists', async () => {
    const res = await fetch(`${baseUrl}/state`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.zones));
    assert.ok(Array.isArray(data.incidents));
    assert.ok(Array.isArray(data.accessibilityRequests));
  });

  await t.test('POST /api/incidents creates incident and validates inputs', async () => {
    const res = await fetch(`${baseUrl}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'crowd',
        zoneId: 'zone-gateA',
        severity: 'critical',
        description: 'Test crowd bottleneck'
      })
    });
    
    assert.strictEqual(res.status, 201);
    const logged = await res.json();
    assert.strictEqual(logged.type, 'crowd');
    assert.strictEqual(logged.severity, 'critical');
    
    // Check if zone-gateA capacity congestionLevel has elevated to high due to the critical incident
    const stateRes = await fetch(`${baseUrl}/state`);
    const stateData = await stateRes.json();
    const zoneA = stateData.zones.find(z => z.id === 'zone-gateA');
    assert.strictEqual(zoneA.congestionLevel, 'high');
  });

  await t.test('PATCH /api/incidents/:id assigns volunteer', async () => {
    // 1. Get first incident
    const stateRes = await fetch(`${baseUrl}/state`);
    const stateData = await stateRes.json();
    const targetInc = stateData.incidents[0];

    // 2. Patch it
    const patchRes = await fetch(`${baseUrl}/incidents/${targetInc.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'in-progress',
        assignedTo: 'Jane Smith'
      })
    });
    assert.strictEqual(patchRes.status, 200);
    const updated = await patchRes.json();
    assert.strictEqual(updated.status, 'in-progress');
    assert.strictEqual(updated.assignedTo, 'Jane Smith');
  });

  await t.test('POST /api/accessibility creates request in queue', async () => {
    const res = await fetch(`${baseUrl}/accessibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'wheelchair',
        zoneId: 'zone-gateC',
        urgency: 'high'
      })
    });
    assert.strictEqual(res.status, 201);
    const request = await res.json();
    assert.strictEqual(request.type, 'wheelchair');
    assert.strictEqual(request.urgency, 'high');
  });

  await t.test('PATCH /api/accessibility/:id updates status and assigns staff', async () => {
    const stateRes = await fetch(`${baseUrl}/state`);
    const stateData = await stateRes.json();
    const targetReq = stateData.accessibilityRequests[0];

    const patchRes = await fetch(`${baseUrl}/accessibility/${targetReq.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'in-progress',
        assignedTo: 'vol-4'
      })
    });
    assert.strictEqual(patchRes.status, 200);
    const updated = await patchRes.json();
    assert.strictEqual(updated.status, 'in-progress');
    assert.strictEqual(updated.assignedTo, 'vol-4');
  });

  await t.test('GET /api/transport returns active alerts', async () => {
    const res = await fetch(`${baseUrl}/transport`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  await t.test('GET /api/staffing returns staffing list', async () => {
    const res = await fetch(`${baseUrl}/staffing`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  await t.test('POST /api/ai/copilot returns copilot Q&A text', async () => {
    const res = await fetch(`${baseUrl}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatHistory: [],
        userQuestion: 'How is the crowd at Gate B?'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.text);
  });

  await t.test('POST /api/ai/recommend/:incidentId returns incident triage recommendations', async () => {
    const stateRes = await fetch(`${baseUrl}/state`);
    const stateData = await stateRes.json();
    const targetInc = stateData.incidents[0];

    const res = await fetch(`${baseUrl}/ai/recommend/${targetInc.id}`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.recommendedAction);
  });

  await t.test('POST /api/ai/announce returns multilingual translations', async () => {
    const res = await fetch(`${baseUrl}/ai/announce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incidentContext: {
          id: 'inc-gateB',
          description: 'Gate B turnstile congestion',
          zoneId: 'zone-gateB'
        }
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.id);
    assert.ok(data.textEn);
    assert.ok(data.textHi);
    assert.ok(data.textEs);
    assert.strictEqual(data.status, 'draft');

    // Also test publication
    const pubRes = await fetch(`${baseUrl}/ai/announce/publish/${data.id}`, { method: 'POST' });
    assert.strictEqual(pubRes.status, 200);
    const pubData = await pubRes.json();
    assert.strictEqual(pubData.status, 'published');
  });

  await t.test('POST /api/ai/summary returns situation briefing summary', async () => {
    const res = await fetch(`${baseUrl}/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ windowName: 'Last 30 Minutes' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.summary);
  });

  await t.test('POST /api/scenario/gateb triggers Gate B bottleneck and alerts', async () => {
    const res = await fetch(`${baseUrl}/scenario/gateb`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.message.includes('successfully'));

    // Confirm state has updated
    const stateRes = await fetch(`${baseUrl}/state`);
    const stateData = await stateRes.json();
    const gateB = stateData.zones.find(z => z.id === 'zone-gateB');
    assert.strictEqual(gateB.congestionLevel, 'critical');
  });

  await t.test('POST /api/scenario/accessibility triggers wheelchair SLA alert', async () => {
    const res = await fetch(`${baseUrl}/scenario/accessibility`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.message.includes('successfully'));

    // Confirm state has updated
    const stateRes = await fetch(`${baseUrl}/state`);
    const stateData = await stateRes.json();
    const hasSlaWarning = stateData.accessibilityRequests.some(r => r.urgency === 'critical');
    assert.ok(hasSlaWarning);
  });

  await t.test('POST /api/scenario/reset restores seeded state', async () => {
    const res = await fetch(`${baseUrl}/scenario/reset`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.message.includes('reset'));
  });

  await t.test('GET /health returns healthy status', async () => {
    const res = await fetch(`http://localhost:${port}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
  });
});
