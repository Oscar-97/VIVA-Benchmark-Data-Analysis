// PostToolUse hook: run eslint --fix on any edited .ts file under Src/ or Tests/.
const { spawnSync } = require("child_process");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const file = JSON.parse(input).tool_input?.file_path ?? "";
  if (!/[\\/](Src|Tests)[\\/].*\.ts$/.test(file) || file.endsWith(".d.ts")) return;
  const result = spawnSync("npx", ["eslint", "--fix", file], {
    encoding: "utf8",
    shell: true,
  });
  if (result.status !== 0) {
    // Exit code 2 feeds stderr back to Claude so it can fix remaining lint errors.
    console.error(result.stdout + result.stderr);
    process.exit(2);
  }
});
