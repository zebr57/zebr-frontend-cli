#!/usr/bin/env node
import fse from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { Command } from "commander";
import downGit from "download-git-repo";
import ora from "ora";
import child_process from "child_process";

import vueInquirer from "./lib/vue-inquirer.js";
import reactInquirer from "./lib/react-inquirer.js";

const program = new Command();

// program.option("-a [num]", "this is a ", (num) => {});
program.version("1.0.0"); // 定义版本
/* ===================================== 创建项目 ===================================== */
program
  .command("create <name>")
  .description("create a new project")
  .action(async (name) => {
    // 窗口交互，提问等...
    inquirer
      .prompt([
        {
          type: "list",
          message: "project type",
          choices: ["vue3+Ts", "react"],
          name: "projectType"
        }
      ])
      .then(async (res) => {
        let _gitUrl = "";
        switch (res.projectType) {
          case "vue3+Ts":
            _gitUrl = await vueInquirer();
            break;
          case "react":
            _gitUrl = await reactInquirer();
            break;
          default:
            break;
        }
        console.log("_gitUrl:", _gitUrl);
        let _outputDir = path.join(process.cwd(), name);
        if (!_gitUrl) return;
        const spiner = ora("下载中").start();
        // 删除原目录
        if (fse.existsSync(_outputDir)) {
          fse.emptyDirSync(_outputDir);
          fse.rmdirSync(_outputDir);
        }
        // 创建
        fse.mkdirSync(_outputDir);

        downGit("github:" + _gitUrl, _outputDir, {}, function (err) {
          if (err) throw err;
          console.log("/n 下载成功");
          spiner.stop();
        });
      });
  });

/* ===================================== 自动在编辑器打开项目并启动本地服务 ===================================== */
// 获取包管理工具
const getToolShell = async () => {
  const files = await fse.readdirSync(process.cwd());
  let runShell = "";
  if (files.includes("yarn.lock")) {
    runShell = `yarn`;
  } else if (files.includes("pnpm-lock.yaml")) {
    runShell = `pnpm`;
  } else {
    runShell = `npm`;
  }
  return runShell;
};
// 启动本地服务
const runServer = async (runShell) => {
  const packageJsonPath = path.join(process.cwd() + "/package.json");
  const jsonData = await fse.readFileSync(packageJsonPath, "utf8");
  // 读取 "scripts" 对象的第一个属性，作为开启项目本地服务的关键字
  const firstScript = Object.keys(JSON.parse(jsonData).scripts)[0];
  console.log(` ${runShell} run ${firstScript}`); // 提示

  const npmProcess = child_process.spawn(runShell, ["run", firstScript], {
    shell: true, // 作为 shell 命令执行
    stdio: "inherit" // 使得子进程的标准输入、输出和错误与父进程共享。这样可以保留颜色和链接效果。
  });

  // 监听父进程的 SIGINT 信号（ctrl+c）
  process.on("SIGINT", () => {
    // 结束子进程
    if (process && npmProcess) process.kill(npmProcess.pid);
  });
};

program
  .command("open")
  .description("open vscode and run dev serve")
  .action(async (name) => {
    try {
      // 功能1：打开编辑器 vscode
      // child_process.exec("code .");
      // 功能1：启动项目
      let runShell = await getToolShell(); // npm、yarn、pnpm

      const isExitsNodeModule = fse.existsSync(process.cwd() + "/node_modules");
      // 不存在 node_modules 文件夹时，询问是否安装依赖
      if (!isExitsNodeModule) {
        console.error(
          "检测该项目未初始化依赖，请根据项目使用的包管理工具运行初始化命令（npm install）"
        );
        // 询问是否初始化依赖
        const { install } = await inquirer.prompt([
          {
            type: "confirm",
            message: "是否初始化依赖？",
            name: "install"
          }
        ]);
        if (!install) {
          child_process.exec("code .");
          return;
        }
        // 询问是否自动安装依赖
        const { isAuto } = await inquirer.prompt([
          {
            type: "list",
            message:
              "是否根据项目文件自动选择包管理工具（yarn.lock、pnpm-lock.yaml）并安装依赖呢？",
            choices: ["yes", "no"],
            default: "yes",
            name: "isAuto"
          }
        ]);
        // 选择否，手动选择包管理工具
        if (isAuto == "no") {
          const { tool } = await inquirer.prompt([
            {
              type: "list",
              message: "请选择包管理工具",
              choices: ["npm", "yarn", "pnpm"],
              default: "npm",
              name: "tool"
            }
          ]);
          runShell = tool;
        }

        console.log(runShell + " install "); // 提示开始安装
        const installLoading = ora("依赖下载安装中").start();
        child_process.exec(`${runShell} install`, (err) => {
          installLoading.stop();
          if (err) throw err;
          console.log(runShell + " install ", "success!"); // 提示安装成功
          runServer(runShell); // 安装成功启动服务
        });
        child_process.exec("code .");
      } else {
        // 最后一步：开启服务
        child_process.exec("code .");
        runServer(runShell);
      }
    } catch (error) {
      console.error(error);
    }
  });

/* ===================================== git commit ===================================== */

program
  .command("commit <type> <message>")
  .description("auto commit")
  .action(async () => {
    child_process.exec("git add .", (err, stdout) => {
      if (err) throw err;

      const _type = process.argv[3];
      const _message = process.argv[4];

      child_process.exec("git commit -m '" + _type + ": " + _message + "'", (err) => {
        if (err) throw err;
        // 询问是否推送代码
        inquirer
          .prompt([
            {
              type: "confirm",
              message: "git push?",
              name: "isPush"
            }
          ])
          .then((res) => {
            if (res.isPush) {
              child_process.exec("git push", (err) => {
                if (err) throw err;
              });
            }
          });
      });
    });
  });

program.parse(process.argv);
