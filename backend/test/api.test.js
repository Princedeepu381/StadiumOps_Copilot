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
});
