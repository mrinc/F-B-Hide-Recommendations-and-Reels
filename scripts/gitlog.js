const { execSync } = require("child_process");
const fs = require("fs");

// Run git log and get the output
let log = execSync(
  'git log --pretty=format:"%H%x1f%aN <%aE>%x1f%ad%x1f%d%x1f%B%x1e"',
  { encoding: "utf8" }
);

// Split the log into a list of commits
let commits = log.trim().split("\x1e").filter(Boolean);

// Process the commits
let commitsByTag = {};
commits.forEach((commit) => {
  // Split the commit into fields
  let [hash, author, date, refs, ...message] = commit.split("\x1f");
  message = message
    .join("\x1f")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  refs = refs.trim();

  // Filter out the unwanted commit messages
  message = message.filter((msg) => {
    return !(
      msg.startsWith("-") ||
      msg.startsWith("Signed-off-by") ||
      msg.startsWith("Co-authored-by") ||
      msg.startsWith("Bumps") ||
      msg.startsWith(".") ||
      msg.startsWith("build(deps-dev)") ||
      msg.startsWith("updated-dependencies") ||
      msg.startsWith("dependency-type:") ||
      msg.startsWith("update-type:") ||
      msg.startsWith("Merge branch")
    );
  });

  // Extract tags from refs
  let tags = [];
  let match;
  let re = /\s*tag: ([^,)]+)/g;
  while ((match = re.exec(refs))) {
    tags.push(match[1]);
  }

  // Associate commit with the newest tag
  if (tags.length > 0) {
    let newestTag = tags[0]; // Get the first tag as it's the newest one
    if (!commitsByTag[newestTag]) {
      commitsByTag[newestTag] = {
        date: date.trim(),
        commits: [],
      };
    }
    commitsByTag[newestTag].commits.push(...message);
  }
});

// Merge non-stable releases into stable ones
for (let tag in commitsByTag) {
  if (tag.includes("-rc")) {
    let stableTag = tag.split("-rc")[0];
    if (commitsByTag[stableTag]) {
      commitsByTag[stableTag].commits = [
        ...commitsByTag[stableTag].commits,
        ...commitsByTag[tag].commits,
      ];
    } else {
      commitsByTag[stableTag] = commitsByTag[tag];
    }
    delete commitsByTag[tag];
  }
}

// Remove tags with no commits
for (let tag in commitsByTag) {
  if (commitsByTag[tag].commits.length === 0) {
    delete commitsByTag[tag];
  }
}

// Convert dictionary to array
let output = Object.keys(commitsByTag).map((tag) => ({
  tag: tag,
  date: commitsByTag[tag].date,
  commits: commitsByTag[tag].commits,
}));

let lines = [
  "export interface GitLog { tag: string; date: string; commits: string[]; }",
  "export const Logs: Array<GitLog> = " + JSON.stringify(output) + ";",
];
fs.writeFileSync("./src/changelog.ts", lines.join("\n"));
