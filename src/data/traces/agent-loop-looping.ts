// Synthetic traces for the lesson agents/agent-loop/looping-agents. One recorded trace and three injected faults, each
// leaving a different loop signature. Token counts are approximate and chosen by the author.
import type { TraceFault, TraceStep } from './types.ts';

const S = (role: TraceStep['role'], body: string, tok: number, warn = false): TraceStep => ({ role, body, tok, warn });

const SYSTEM = S(
  'system',
  'You triage alerts for the payments service. Tools: get_deploys(service), search_logs(query, since), post_summary(text). Post one summary, then stop.',
  70,
);
const USER = S('user', 'Alert: payments p99 latency above SLO since 14:05 UTC. Find the likely cause.', 24);
const DEPLOYS = [
  S('assistant', 'calls get_deploys(service="payments")', 22),
  S('tool', '[{"id":"d-311","at":"2026-10-27T14:02Z","change":"ledger-db pool size 50 to 20"}]', 40),
];
const EMPTY = '{"results":[],"count":0}';
const LOGS =
  '{"count":212,"results":["14:06:11 ledger-db acquire timeout after 2000ms", "14:06:12 ledger-db acquire timeout after 2000ms", "... 210 more"]}';
const SUMMARY = 'calls post_summary(text="Likely cause: d-311 cut the ledger-db pool from 50 to 20 at 14:02; 212 acquire timeouts since 14:06.")';

const emptySearch: TraceStep[] = [
  S('assistant', 'A deploy at 14:02 precedes the alert. Checking logs.\ncalls search_logs(query="timeout", since="14:00")', 38),
  S('tool', EMPTY, 12, true),
  S('assistant', 'No timeouts logged. Broadening the search.\ncalls search_logs(query="error", since="14:00")', 32),
  S('tool', EMPTY, 12, true),
  S('assistant', 'calls search_logs(query="slow OR latency", since="14:00")', 26),
  S('tool', EMPTY, 12, true),
  S('assistant', 'Trying the service name.\ncalls search_logs(query="payments", since="14:00")', 28),
  S('tool', EMPTY, 12, true),
  S('assistant', 'calls search_logs(query="payments-api", since="14:00")', 24),
  S('tool', EMPTY, 12, true),
  S('assistant', 'calls search_logs(query="ledger", since="14:00")', 24),
  S('tool', EMPTY, 12, true),
];

export const faults: TraceFault[] = [
  {
    id: 'recorded',
    label: 'As recorded',
    note: 'production trace, no fault injected',
    steps: [
      SYSTEM,
      USER,
      ...DEPLOYS,
      ...emptySearch,
      S('note', 'Continues with a new query on every call until the step cap of 20. No call repeats its arguments; every result is empty.', 0, true),
    ],
  },
  {
    id: 'tz',
    label: '`search_logs` reads `since` as local time (UTC-7)',
    note: 'the window starts 7 hours after the alert',
    steps: [
      SYSTEM,
      USER,
      ...DEPLOYS,
      ...emptySearch,
      S('note', 'Same shape: varied queries, identical empty results, no repeated arguments. The tool reports success on a window that cannot contain logs.', 0, true),
    ],
  },
  {
    id: 'required',
    label: '`tool_choice` forced to "required" on every call',
    note: 'the model must call a tool each turn',
    steps: [
      SYSTEM,
      USER,
      ...DEPLOYS,
      S('assistant', 'calls search_logs(query="timeout", since="14:00")', 26),
      S('tool', LOGS, 120),
      S('assistant', SUMMARY, 48),
      S('tool', '{"ok":true}', 6),
      S('assistant', 'Summary posted.\n' + SUMMARY, 52, true),
      S('tool', '{"ok":true}', 6),
      S('assistant', 'Done.\n' + SUMMARY, 50, true),
      S('tool', '{"ok":true}', 6),
      S('note', 'The summary is posted at call 3. Every later call repeats post_summary with identical arguments because the turn cannot end without a tool call.', 0, true),
    ],
  },
  {
    id: 'window',
    label: 'Client keeps only the last 300 tokens of history',
    note: 'older turns are dropped before each call',
    steps: [
      SYSTEM,
      USER,
      ...DEPLOYS,
      S('assistant', 'calls search_logs(query="timeout", since="14:00")', 26),
      S('tool', LOGS, 240),
      S('assistant', 'Many ledger-db timeouts. I need the recent deploys to find a cause.\ncalls get_deploys(service="payments")', 40, true),
      S('tool', '[{"id":"d-311","at":"2026-10-27T14:02Z","change":"ledger-db pool size 50 to 20"}]', 40),
      S('assistant', 'A deploy changed the pool. Checking logs for its effect.\ncalls search_logs(query="timeout", since="14:00")', 40, true),
      S('tool', LOGS, 240),
      S('assistant', 'calls get_deploys(service="payments")', 22, true),
      S('tool', '[{"id":"d-311","at":"2026-10-27T14:02Z","change":"ledger-db pool size 50 to 20"}]', 40),
      S('assistant', 'calls search_logs(query="timeout", since="14:00")', 26, true),
      S('note', 'Successful calls repeat with identical arguments: each large log result pushes the deploy list out of the kept window, so the agent fetches it again.', 0, true),
    ],
  },
];
