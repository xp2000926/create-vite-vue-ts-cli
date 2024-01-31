import { select, input } from "@inquirer/prompts";
import { clone } from "../utils/clone";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";

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

  const templateName = await select({
    message: "请选择一个模板",
    choices: templateList,
  });
  const info = templates.get(templateName) as TemplateInfo;
  if (info) clone(info.downloadUrl, projectName, ["-b", info.branch]);
}
