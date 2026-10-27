// Shapes for recorded agent traces used by src/components/widgets/AgentTrace.astro.

/** `note` rows are narration from the author, shown without a step number. `tok` is the step's approximate token count. */
export type TraceStep = {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'note';
  body: string;
  tok: number;
  warn?: boolean;
};

/** One selectable trace. The first fault passed to AgentTrace is the trace as recorded. */
export type TraceFault = { id: string; label: string; note: string; steps: TraceStep[] };
