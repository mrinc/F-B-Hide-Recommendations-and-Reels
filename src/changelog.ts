export interface ChangeLog {
  version: string;
  changes: {
    type: "BUGFIX" | "FEATURE" | "IMPROVEMENT" | "REFACTORING" | "OTHER";
    description: string;
  }[];
}
export const Logs: Array<ChangeLog> = [
  {
    version: "1.26.6",
    changes: [
      {
        type: "BUGFIX",
        description: "Fixed french lang search issue.",
      },
    ],
  },
  {
    version: "1.26.5",
    changes: [
      {
        type: "BUGFIX",
        description: "Changed the order of retrying to find the feed.",
      },
      {
        type: "IMPROVEMENT",
        description: "Added Chinese (Simplified)",
      },
      {
        type: "IMPROVEMENT",
        description: "Added Chinese (Traditional, Taiwan)",
      },
      {
        type: "IMPROVEMENT",
        description: "Added Swedish",
      },
      {
        type: "IMPROVEMENT",
        description: "Added new style FB feed finder",
      },
    ],
  },
  {
    version: "1.26.4",
    changes: [
      {
        type: "BUGFIX",
        description:
          "In the case where the page changes during load, before we show the error popup... lets just check the url again and fail silently. Else continue with error popup.",
      },
    ],
  },
  {
    version: "1.26.1",
    changes: [
      {
        type: "FEATURE",
        description: "Added Thai language",
      },
      {
        type: "FEATURE",
        description:
          "Added auto language identifier where lang does not match fb lang",
      },
      {
        type: "BUGFIX",
        description: "Changed the debug flow for our easy of assistance",
      },
    ],
  },
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
      },
    ],
  },
];
