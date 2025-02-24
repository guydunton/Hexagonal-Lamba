export type ScriptBlock = { type: 'TEXT'; text: string } | { type: 'PAUSE'; length: number };
export type Script = ScriptBlock[];
