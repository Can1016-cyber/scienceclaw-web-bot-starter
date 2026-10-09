# ScienceClaw Web Bot Starter

这是一个可修改、可自托管的网页知识助手起点，面向已经运行或准备运行 OpenClaw 与 MCP 知识服务的团队。

ScienceClaw 提供网页 Bot、接口约定、可运行的演示 MCP Server 和服务端 Gateway 代理；团队自己掌握 OpenClaw、模型、身份、权限、知识检索和生产运维。

## 已经安装 OpenClaw

不要重新安装，也不要覆盖现有配置。先执行只读检查：

```bash
npm install
npm run preflight
```

然后阅读 [接入已有 OpenClaw](docs/EXISTING_OPENCLAW.md)。检查程序不会修改 OpenClaw 配置、打印凭据或重启服务。

## 尚未安装 OpenClaw

先阅读 [OpenClaw 安装说明](openclaw/INSTALL.md)，再按照 [完整本地 Quickstart](docs/QUICKSTART.md)操作。

## 只体验网页 Bot

```bash
npm install
npm run dev
```

访问 <http://127.0.0.1:4301>。默认使用确定性模拟 adapter，不调用任何模型。

## 包含内容

- React + TypeScript 可复用 Bot UI 与集中配置。
- 流式交互、停止、重试、来源卡片和严格知识模式参考。
- 可构建、自测的四工具 MCP Server。
- 将 Gateway token 留在服务器端的 Bot API 代理。
- 已有 OpenClaw 的只读兼容检查。
- Bot、MCP、代理和仓库安全检查的 GitHub Actions。

## 验证是否真正有用

仓库“可以下载”不等于产品有用。一次有效接入应完成：

1. 不连接外部 API 也能运行网页 Bot。
2. MCP Server 能枚举并调用四个参考工具。
3. 专用测试 OpenClaw 能通过代理调用 MCP。
4. 有证据时显示可核验引用。
5. 没有证据时明确回答“当前知识库中没有找到足够依据”。
6. 替换演示数据时，无需重写 Bot UI。

详细验收方法见 [VALIDATION.md](docs/VALIDATION.md)。接入真实数据前请阅读 [SECURITY.md](docs/SECURITY.md)。

所有内置记录与引用均为虚构演示数据，不连接 PolyWiki、BioWiki 或任何私有知识源。
