import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../store.js';
import { resetState, triggerGateBCongestion, triggerAccessibilityEscalation } from '../scenarioEngine.js';

describe('Scenario Engine Tests', () => {
  beforeEach(() => {
    resetState();
  });

  it('resetState restores all collections to initial seed values', () => {
    // Mutate the state
    store.zones.push({ id: 'zone-test', name: 'Test Zone' });
    store.incidents.push({ id: 'inc-test', type: 'test' });

    const result = resetState();
    
    assert.ok(result.message.includes('reset'), 'Should return a reset confirmation message');
    assert.ok(!store.zones.some(z => z.id === 'zone-test'), 'Test zone should be removed after reset');
    assert.ok(!store.incidents.some(i => i.id === 'inc-test'), 'Test incident should be removed after reset');
    assert.equal(store.zones.length, 6, 'Should have exactly 6 initial zones');
  });

  it('triggerGateBCongestion sets Gate B to critical and adds transport alert + incident', () => {
    const result = triggerGateBCongestion();

    assert.ok(result.message.includes('Gate B'), 'Should return Gate B confirmation');
    
    const gateB = store.zones.find(z => z.id === 'zone-gateB');
    assert.equal(gateB.congestionLevel, 'critical', 'Gate B should be critical');
    assert.equal(gateB.capacityPercent, 94, 'Gate B capacity should be 94%');

    const shuttleAlert = store.transportAlerts.find(t => t.id === 'trn-gateB');
    assert.ok(shuttleAlert, 'Should add East Shuttle transport alert');
    assert.equal(shuttleAlert.estimatedDelayMinutes, 25, 'Shuttle delay should be 25 minutes');

    const crowdIncident = store.incidents.find(i => i.id === 'inc-gateB');
    assert.ok(crowdIncident, 'Should add crowd bottleneck incident');
    assert.equal(crowdIncident.severity, 'high', 'Crowd incident should be high severity');
    assert.equal(crowdIncident.type, 'crowd', 'Crowd incident type should be crowd');
  });

  it('triggerGateBCongestion is idempotent (does not duplicate alerts)', () => {
    triggerGateBCongestion();
    triggerGateBCongestion(); // Call twice

    const shuttleAlerts = store.transportAlerts.filter(t => t.id === 'trn-gateB');
    assert.equal(shuttleAlerts.length, 1, 'Should not duplicate transport alerts');

    const crowdIncidents = store.incidents.filter(i => i.id === 'inc-gateB');
    assert.equal(crowdIncidents.length, 1, 'Should not duplicate crowd incidents');
  });

  it('triggerAccessibilityEscalation adds a critical wheelchair request aged past SLA', () => {
    const initialCount = store.accessibilityRequests.length;
    const result = triggerAccessibilityEscalation();

    assert.ok(result.message.includes('Accessibility'), 'Should return accessibility confirmation');
    assert.equal(store.accessibilityRequests.length, initialCount + 1, 'Should add one accessibility request');

    const escalated = store.accessibilityRequests[store.accessibilityRequests.length - 1];
    assert.equal(escalated.urgency, 'critical', 'Escalated request should be critical urgency');
    assert.equal(escalated.type, 'wheelchair', 'Escalated request should be wheelchair type');
    assert.equal(escalated.status, 'queued', 'Escalated request should be queued status');

    // Verify it's aged past 30-min SLA (requestedAt should be ~45 min ago)
    const ageMs = Date.now() - new Date(escalated.requestedAt).getTime();
    assert.ok(ageMs > 40 * 60 * 1000, 'Request should be at least 40 minutes old (past SLA)');
  });
});
