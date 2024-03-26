import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
import { update } from "./command/update";

const program = new Command("create-vite-vue-ts");
program.version(version, "-v, --version");
program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .action(async (dirName) => await create(dirName));
program
  .command("update")
  .description("更新 create-vite-vue-ts 至最新版本")
  .action(async () => await update());
program.parse();
