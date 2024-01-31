import simpleGit, { SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";
// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 300, // 变换时间 ms
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.blue(item)
    ), // 设置加载动画
  },
});

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 根目录
  binary: "git",
  maxConcurrentProcesses: 6, // 最大并发进程数
};
/**
 * 克隆
 * @param {string} url git的url
 * @param {string} projectName 项目的名称
 * @param {string[]} options
 */
export const clone = async (
  url: string,
  projectName: string,
  options: string[]
) => {
  const git = simpleGit(gitOptions);
  try {
    await logger(git.clone(url, projectName, options), "代码下载中...", {
      estimate: 8000, // 展示预估时间
    });
    console.log();
    console.log(chalk.green("代码下载完成"));
    console.log(
      chalk.blueBright(`==============================================`)
    );
    console.log(
      chalk.blueBright(`=== 欢迎使用 create-vite-vue-ts-cli 脚手架 ===`)
    );
    console.log(
      chalk.blueBright(`==============================================`)
    );
    console.log();
    console.log();
    console.log(chalk.green(`项目创建成功 ${chalk.blueBright(projectName)}`));
    console.log(chalk.green(`执行以下命令启动项目：`));
    console.log(`cd ${chalk.blueBright(projectName)}`);
    console.log(`${chalk.yellow("pnpm")} install`);
    console.log(`${chalk.yellow("pnpm")} run dev`);
  } catch (error) {
    console.log(chalk.red("下载失败"));
  }
};
