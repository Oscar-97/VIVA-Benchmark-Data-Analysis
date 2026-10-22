// PostToolUse hook: run `npm run build:pages` after an edit to a file under Src/Templates/,
// so report.html and Src/Pages/*.html never go out of date.
const { spawnSync } = require("child_process");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const file = JSON.parse(input).tool_input?.file_path ?? "";
  if (!/[\\/]Src[\\/]Templates[\\/]/.test(file)) return;
  const result = spawnSync("npm", ["run", "build:pages"], {
    encoding: "utf8",
    shell: true,
  });
  if (result.status !== 0) {
    // Exit code 2 feeds stderr back to Claude so it can fix the template.
    console.error(result.stdout + result.stderr);
    process.exit(2);
  }
});
