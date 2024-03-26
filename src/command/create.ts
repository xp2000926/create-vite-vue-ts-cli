import { select, input } from "@inquirer/prompts";
import { clone } from "../utils/clone";
import { name, version } from "../../package.json";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import axios, { AxiosResponse } from "axios";
import { gt } from "lodash";

export interface TemplateInfo {
  name: string; // 项目名称
  downloadUrl: string; // 下载地址
  description: string; // 项目描述
  branch: string; // 项目分支
}
// 这里保存了我写好了咱们的之前开发的模板
export const templates: Map<string, TemplateInfo> = new Map([
  [
    "Vite-Vue-TypeScript-Template",
    {
      name: "Vite-Vue-TypeScript-Template",
      downloadUrl:
        "https://gitee.com/xupeng888/vue-vite-ts-backstage-template.git",
      description: "Vue3技术站开发模板",
      branch: "dev13",
    },
  ],
  [
    "Vite-temp",
    {
      name: "Vite-Vue-TypeScript-Template",
      downloadUrl:
        "https://gitee.com/xupeng888/vue-vite-ts-backstage-template.git",
      description: "Vue3技术站开发模板",
      branch: "dev12",
    },
  ],
]);
export async function isOverwrite(fileName: string) {
  console.log(chalk.yellow(`${fileName}文件夹存在`));
  return await select({
    message: "是否覆盖？",
    choices: [
      {
        name: "覆盖",
        value: true,
      },
      {
        name: "取消",
        value: false,
      },
    ],
  });
}
export const getNpmInfo = async (npmName: string) => {
  const npmUrl = `https://registry.npmjs.org/${npmName}`;
 
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    console.log(chalk.red(error));
  }
  return res;
};
export const getNpmLatestVersion = async (npmName: string) => {
  const { data } = (await getNpmInfo(npmName)) as AxiosResponse;
 
  return data["dist-tags"].latest;
};
export const checkVersion = async (name: string, version: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const need = gt(latestVersion, version);
  if (need) {
    console.log(
      chalk.yellow(
        `检测到 create-vite-vue-ts 最新版:${chalk.blueBright(
          latestVersion
        )} 当前版本:${chalk.blueBright(version)}`
      )
    );
    console.log(
      `可使用:${chalk.yellow(
        "npm install create-vite-vue-ts-cli@latest -g"
      )} 或者使用:${chalk.yellow("create-vite-vue-ts update")}更新`
    );
  }
  return need;
};
export async function create(projectName: string) {
  // 初始模板列表
  const templateList = Array.from(templates).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );
  if (!projectName) projectName = await input({ message: "请输入项目名称" });
  // 如果文件夹在，则提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const run = await isOverwrite(projectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return; // 不覆盖直接结束
    }
  }
  // 监测版本更新
  await checkVersion(name, version);

  const templateName = await select({
    message: "请选择一个模板",
    choices: templateList,
  });
  const info = templates.get(templateName) as TemplateInfo;
  if (info) clone(info.downloadUrl, projectName, ["-b", info.branch]);
}
