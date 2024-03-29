# zebr-frontend-cli

前端脚手架、命令行工具，快速创建项目模版，提高前期开发效率。

## 功能

- 快速创建项目模版
- 在 vscode 打开项目并启动本地服务
- 一行命令搞定 git 提交代码流程

## 使用安装

```bash
npm i @zebr/zebr-frontend-cli -g
```

## 调试安装

如果是通过 npm install 安装可跳过该部分，请前往如何使用

1. 克隆项目：https://github.com/zebr57/zebr-frontend-cli.git

2. 终端进入项目所在目录

```sh
cd zebr-frontend-cli
```

3. 安装依赖

```sh
pnpm install
```

4. 通过 npm 本地安装

```sh
npm link
```

## 如何使用

```sh
zebr
# or
zebr-cli
```

- 获取提示，展示功能命令

::: tip
`zebr` 和 `zebr-cli` 命令是一样的，取决你的输入习惯，下面使用 `zebr-cli` 为例
:::

## 创建项目

```sh
zebr-cli create <name>
```

- 命令行窗口进入目录地址，输入执行
- 根据提示选择项目模版（vue3+Ts、react 等）
- 通过 git 仓库地址拷贝项目至本地

## 在编辑器打开项目并启动本地服务

```sh
zebr-cli open
```

- 支持 window/MacOs 系统（win 需要检查是否配置了 vscode 的环境变量）
- 命令行窗口进入项目地址
- 自动在编辑器打开项目
- 检测是否已初始化项目依赖
- （否）自动或者手动选择包管理工具进行初始化安装依赖
- （是）自动开启本地服务

## git 自动化提交代码

```sh
zebr-cli commit type message
#
zebr-cli commit feat git自动化提交代码
```

- 一行命令提交并推送代码
