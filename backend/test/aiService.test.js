import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  handleCopilotChat, 
  getIncidentRecommendation, 
  generateMultilingualAnnouncement, 
  generateSituationSummary 
} from '../services/aiService.js';

// These tests verify that mock fallback responses are structurally correct
// since the test environment has no GEMINI_API_KEY configured.

const mockState = {
  zones: [
    { id: "zone-gateB", name: "Gate B", congestionLevel: "critical", capacityPercent: 94 }
  ],
  incidents: [
    { id: "inc-1", type: "crowd", zoneId: "zone-gateB", severity: "high", status: "open", description: "Crowd bottleneck" }
  ],
  accessibilityRequests: [],
  transportAlerts: [
    { id: "trn-1", route: "East Shuttle", alertType: "delay", affectedZoneId: "zone-gateB", estimatedDelayMinutes: 25 }
  ],
  staffing: [
    { id: "staff-1", name: "Vol-A", zone: "zone-gateB", status: "available" }
  ]
};

describe('AI Service Mock Fallback Tests', () => {

  it('handleCopilotChat returns a non-empty string for a general question', async () => {
    const response = await handleCopilotChat([], "What is the current stadium status?", mockState);
    assert.equal(typeof response, 'string', 'Response should be a string');
    assert.ok(response.length > 10, 'Response should be substantive');
  });

  it('handleCopilotChat returns context-aware response for Gate B question', async () => {
    const response = await handleCopilotChat([], "What is happening at gate B?", mockState);
    assert.equal(typeof response, 'string', 'Response should be a string');
    assert.ok(response.length > 20, 'Response should contain operational context');
  });

  it('getIncidentRecommendation returns structured triage object', async () => {
    const incident = mockState.incidents[0];
    const zone = mockState.zones[0];
    const transport = mockState.transportAlerts;
    const staffing = mockState.staffing;

    const result = await getIncidentRecommendation(incident, zone, transport, staffing);
    
    assert.equal(typeof result, 'object', 'Result should be an object');
    assert.ok(result.whatIsHappening, 'Should have whatIsHappening field');
    assert.ok(result.whyItMatters, 'Should have whyItMatters field');
    assert.ok(result.recommendedAction, 'Should have recommendedAction field');
    assert.ok(result.suggestedOwnerRole, 'Should have suggestedOwnerRole field');
    assert.equal(typeof result.announcementNeeded, 'boolean', 'announcementNeeded should be boolean');
  });

  it('generateMultilingualAnnouncement returns EN/HI/ES texts', async () => {
    const context = { 
      id: "inc-1", 
      type: "crowd", 
      description: "Crowd bottleneck at Gate B",
      zoneId: "zone-gateB"
    };

    const result = await generateMultilingualAnnouncement(context);

    assert.equal(typeof result, 'object', 'Result should be an object');
    assert.ok(result.textEn, 'Should have English text');
    assert.ok(result.textHi, 'Should have Hindi text');
    assert.ok(result.textEs, 'Should have Spanish text');
    assert.ok(result.textEn.length > 10, 'English text should be substantive');
  });

  it('generateSituationSummary returns a non-empty summary string', async () => {
    const result = await generateSituationSummary(
      "Shift Handoff",
      [{ module: "incident", entityId: "inc-1", action: "created", timestamp: new Date().toISOString() }],
      mockState.incidents,
      mockState.accessibilityRequests,
      mockState.transportAlerts
    );

    assert.equal(typeof result, 'string', 'Summary should be a string');
    assert.ok(result.length > 20, 'Summary should be substantive');
  });
});
