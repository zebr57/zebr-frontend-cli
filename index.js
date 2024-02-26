#!/usr/bin/env node
import fse from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { Command } from "commander";
import downGit from "download-git-repo";
import ora from "ora";

import vueInquirer from "./lib/vue-inquirer.js";
import reactInquirer from "./lib/react-inquirer.js";

const program = new Command();

program.option("-a [num]", "this is a ", (num) => {});
program.version("1.0.0"); // 定义版本
program.command("create <name>").action(async (name) => {
  // 窗口交互，提问等...
  inquirer
    .prompt([
      {
        type: "list",
        message: "project type",
        choices: ["vue", "react"],
        name: "projectType",
      },
    ])
    .then(async (res) => {
      let _gitUrl = "";
      switch (res.projectType) {
        case "vue":
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
program.parse(process.argv);
