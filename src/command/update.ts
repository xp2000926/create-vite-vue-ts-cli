import chalk from "chalk";
import ora from "ora";
import process from "child_process";
const spinner = ora({
  text: "create-vite-vue-ts-cli 正在更新...",
  spinner: {
    interval: 300, // 变换时间 ms
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.blue(item)
    ), // 设置加载动画
  },
}).start();
export function update() {
  spinner.start();
  process.exec("npm i create-vite-vue-ts-cli -g", (error) => {
    spinner.stop();
    if (!error) {
      console.log(chalk.green("create-vite-vue-ts-cli 更新成功"));
    } else {
      console.log(chalk.red(error));
    }
  });
}
