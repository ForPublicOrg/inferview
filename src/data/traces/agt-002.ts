// Synthetic trace for problem agt-002 (Agent loops forever), ported from prototypes/problem.html. Token counts are approximate.
// Fault notes state what each injected run does, never whether it matches the recorded trace: the reader compares.
import type { TraceFault, TraceStep } from './types.ts';

const S = (role: TraceStep['role'], body: string, tok: number, warn = false): TraceStep => ({ role, body, tok, warn });

const BASE: TraceStep[] = [
  S('system', 'You are a support agent for Acme. Tools: search_orders, get_order, issue_refund. Be concise.', 60),
  S('user', 'Hi, I want a refund for my last order, it arrived broken.', 18),
  S('assistant', 'calls search_orders(customer_id="c_7781")', 24),
  S('tool', '[{"order_id":"A-1042","total":49.00,"status":"delivered","refunded":36.50}]', 40),
  S('assistant', 'calls get_order(order_id="A-1042")', 20),
  S('tool', '{"order_id":"A-1042","items":[{"sku":"MUG-01","price":49.00}],"status":"delivered"}', 44),
];
const ERR = '{"error":"ValidationError: refund rejected (code 422)"}';
const RETRY = (text: string): TraceStep[] => [
  S('assistant', `${text}\ncalls issue_refund(order_id="A-1042", amount=49.0)`, 32),
  S('tool', ERR, 24, true),
];

export const faults: TraceFault[] = [
  {
    id: 'none',
    label: 'No fault',
    note: 'the trace as recorded',
    steps: [
      ...BASE,
      ...RETRY('The order total is $49. Issuing a full refund.'),
      ...RETRY('The refund did not go through. Let me retry.'),
      ...RETRY('Retrying the refund request.'),
      ...RETRY('Let me try that once more.'),
      ...RETRY('Retrying.'),
      S('note', 'Continues identically until call 20, then RuntimeError("max steps"). The user sees a spinner, then an error page.', 0, true),
    ],
  },
  {
    id: '500',
    label: 'Transient 500 from `get_order`',
    note: 'fails twice, then succeeds',
    steps: [
      ...BASE.slice(0, 5),
      S('tool', '{"error":"HTTP 500 upstream timeout"}', 20, true),
      S('assistant', 'The order lookup failed, retrying.\ncalls get_order(order_id="A-1042")', 26),
      S('tool', '{"error":"HTTP 500 upstream timeout"}', 20, true),
      S('assistant', 'calls get_order(order_id="A-1042")', 20),
      S('tool', '{"order_id":"A-1042","items":[{"sku":"MUG-01","price":49.00}],"status":"delivered"}', 44),
      S('assistant', 'Total 49.00 minus 36.50 already refunded leaves 12.50.\ncalls issue_refund(order_id="A-1042", amount=12.5)', 40),
      S('tool', '{"ok":true,"refund_id":"r_9921"}', 18),
      S('assistant', 'Done. I have refunded the remaining $12.50 for order A-1042.', 24),
      S('note', 'Ends in 6 model calls with a refund of $12.50.', 0),
    ],
  },
  {
    id: 'usermsg',
    label: 'Tool results appended as plain user messages',
    note: 'not as tool_result blocks',
    steps: [
      ...BASE.slice(0, 3),
      S('user', '[{"order_id":"A-1042","total":49.00,"status":"delivered","refunded":36.50}]', 40, true),
      S('assistant', 'I did not receive a result for the order search. Let me try again.\ncalls search_orders(customer_id="c_7781")', 36),
      S('user', '[{"order_id":"A-1042","total":49.00,"status":"delivered","refunded":36.50}]', 40, true),
      S('assistant', 'The tool returned nothing. Searching again.\ncalls search_orders(customer_id="c_7781")', 36),
      S('note', 'Loops on search_orders; the model says it received no result.', 0, true),
    ],
  },
  {
    id: 'refund',
    label: 'Refund validation error',
    note: 'permanent, opaque',
    steps: [
      ...BASE,
      ...RETRY('The order total is $49. Issuing a full refund.'),
      ...RETRY('The refund did not go through. Let me retry.'),
      ...RETRY('Retrying the refund request.'),
      S('note', 'Continues until the step limit.', 0, true),
    ],
  },
  {
    id: 'prompt',
    label: 'System prompt demands re-verification',
    note: '"re-read the order after a refund"',
    steps: [
      S('system', 'You are a support agent. ALWAYS re-read the order with get_order after any refund to verify it.', 70),
      ...BASE.slice(1),
      S('assistant', 'Total 49.00 minus 36.50 already refunded leaves 12.50.\ncalls issue_refund(order_id="A-1042", amount=12.5)', 40),
      S('tool', '{"ok":true,"refund_id":"r_9921"}', 18),
      S('assistant', 'Verifying.\ncalls get_order(order_id="A-1042")', 22),
      S('tool', '{"order_id":"A-1042","status":"delivered","refunded":49.00}', 36),
      S('assistant', 'Refund verified. The remaining $12.50 has been refunded.', 22),
      S('note', 'Ends in 5 model calls after one verification read.', 0),
    ],
  },
];
