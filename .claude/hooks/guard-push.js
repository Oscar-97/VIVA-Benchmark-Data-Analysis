// PreToolUse hook: block pushes from main and force pushes, and PR creation that is not a draft.
const { spawnSync } = require("child_process");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const command = JSON.parse(input).tool_input?.command ?? "";
  const block = (reason) => {
    // Exit code 2 blocks the call and feeds stderr back to Claude.
    console.error(reason);
    process.exit(2);
  };

  if (/\bgit\s+push\b/.test(command)) {
    if (/(\s--force\S*|\s-f\b|\s\+\S)/.test(command)) block("Force pushes are not allowed.");
    if (/\b(origin\s+)?(HEAD:)?(refs\/heads\/)?main\b/.test(command.replace(/^.*git\s+push/, ""))) {
      block("Pushing to main is not allowed. Use a feature branch and a PR.");
    }
    const branch = spawnSync("git", ["branch", "--show-current"], { encoding: "utf8" });
    if (branch.stdout.trim() === "main") block("The current branch is main. Create a branch first.");
  }

  if (/\bgh\s+pr\s+create\b/.test(command) && !/\s--draft\b/.test(command)) {
    block("Pull requests must be opened with --draft.");
  }
});
