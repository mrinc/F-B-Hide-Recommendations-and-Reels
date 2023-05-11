export interface ChangeLog {
  version: string;
  changes: {
    type: "BUGFIX" | "FEATURE" | "IMPROVEMENT" | "REFACTORING" | "OTHER";
    description: string;
  }[];
}
export const Logs: Array<ChangeLog> = [
  {
    version: "1.25.11",
    changes: [
      {
        type: "FEATURE",
        description: "Changelog info added",
      },
    ],
  },
  {
    version: "1.26.0",
    changes: [
      {
        type: "FEATURE",
        description: "Popup shows on error for diagnosis and ticket logging",
      },
      {
        type: "REFACTORING",
        description: "Cleaned up popup to include on the page on load",
      },
      {
        type: "FEATURE",
        description:
          "Added new/welcome page on load to handle config and new settings",
      }
    ],
  },
];
