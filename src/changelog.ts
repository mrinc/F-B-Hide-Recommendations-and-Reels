// DO NOT CHANGE THIS FILE
// IT WILL BE OVERRIDEN DURING THE BUILD PROCESS
// SEE scripts/gitlog.js FOR MORE INFORMATION

export interface GitLog {
  tag: string;
  date: string;
  commits: string[];
}
export const Logs: Array<GitLog> = [];
