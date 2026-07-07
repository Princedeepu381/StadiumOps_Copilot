import test from 'node:test';
import assert from 'node:assert';
import { 
  store, 
  getPrioritizedIncidents, 
  getPrioritizedAccessibilityRequests 
} from '../store.js';

test('Store Prioritization Logic Unit Tests', async (t) => {
  
  await t.test('getPrioritizedIncidents sorts unresolved and severity first', () => {
    // Seed incidents for testing
    store.incidents = [
      { id: "inc-low", severity: "low", status: "open", createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
      { id: "inc-high-new", severity: "high", status: "open", createdAt: new Date(Date.now() - 2 * 60000).toISOString() },
      { id: "inc-high-old", severity: "high", status: "open", createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
      { id: "inc-resolved", severity: "critical", status: "resolved", createdAt: new Date(Date.now() - 30 * 60000).toISOString() }
    ];

    const sorted = getPrioritizedIncidents();
    
    // Assert resolved incident goes last
    assert.strictEqual(sorted[3].id, "inc-resolved", "Resolved incident should be sorted last");
    
    // Assert critical/high severity sorted before low
    // Assert high-old (older) is sorted before high-new (younger)
    assert.strictEqual(sorted[0].id, "inc-high-old", "Older high severity should be first");
    assert.strictEqual(sorted[1].id, "inc-high-new", "Newer high severity should be second");
    assert.strictEqual(sorted[2].id, "inc-low", "Low severity should be third");
  });

  await t.test('getPrioritizedAccessibilityRequests sorts by urgency then wait time', () => {
    // Seed requests
    store.accessibilityRequests = [
      { id: "acc-std", urgency: "standard", status: "queued", requestedAt: new Date(Date.now() - 5 * 60000).toISOString() },
      { id: "acc-crit", urgency: "critical", status: "queued", requestedAt: new Date(Date.now() - 2 * 60000).toISOString() },
      { id: "acc-high", urgency: "high", status: "queued", requestedAt: new Date(Date.now() - 10 * 60000).toISOString() },
      { id: "acc-resolved", urgency: "critical", status: "resolved", requestedAt: new Date(Date.now() - 20 * 60000).toISOString() }
    ];

    const sorted = getPrioritizedAccessibilityRequests();

    assert.strictEqual(sorted[0].id, "acc-crit", "Critical urgency request should be first");
    assert.strictEqual(sorted[1].id, "acc-high", "High urgency request should be second");
    assert.strictEqual(sorted[2].id, "acc-std", "Standard urgency request should be third");
    assert.strictEqual(sorted[3].id, "acc-resolved", "Resolved request should be last");
  });

});
