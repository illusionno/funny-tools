# 🎨 Funny Tools - 有趣的前端工具集

[![Vue](https://img.shields.io/badge/Vue-3.4.35-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-0.61.9-4285F4?style=flat&logo=css3)](https://unocss.dev/)

一个基于 Vue 3 + TypeScript + Vite 构建的有趣前端工具集合，包含多个实用的在线工具和炫酷的演示效果。

## ✨ 功能特性

### 🎮 核心工具

- **🎨 像素画转换器** - 将普通图片转换为像素风格，支持自定义像素大小
- **📊 人生小格** - 可视化人生时间轴，每个格子代表一周
- **🌈 颜色识别工具** - 智能识别图片中的主要颜色，支持调色板生成
- **🔍 DOM元素查看器** - 类似开发者工具的DOM结构查看器
- **💡 代码高亮显示** - 支持多种编程语言的代码高亮
- **📊 代码比较工具** - 代码差异对比，支持语法高亮
- **📱 二维码生成器** - 快速生成各种类型的二维码
- **🖥️ IP计算器** - 网络IP地址计算和子网划分工具
- **⚡ Linux命令工具** - Linux命令快速查询和学习

### 🤖 Chat AI 功能亮点

- **多模型切换**：支持 Qwen、DeepSeek、Kimi、MiniMax 等模型
- **流式输出**：逐字返回回答，交互体验更流畅
- **思考过程展示**：可折叠查看推理内容（支持 reasoning）
- **快捷能力**：内置翻译、摘要等常用入口
- **输入安全与治理**：包含输入清洗、长度限制与注入检测
- **上下文管理**：通过滑动窗口控制历史消息长度，平衡效果与成本

### 🎪 3D演示

基于 Three.js 构建的多种3D效果演示：
- **📝 3D文字效果** - 立体文字渲染
- **🌫️ 雾效果** - 大气雾效果模拟
- **💡 半球光照** - 自然光照效果
- **🎲 多几何体** - 复杂3D模型展示
- **✨ 粒子系统** - 动态粒子效果
- **🔮 PBR材质** - 基于物理的渲染材质
- **🎯 光线投射** - 交互式3D拾取
- **🌑 阴影效果** - 真实阴影渲染
- **🌌 天空盒** - 360度全景背景
- **🌊 水面效果** - 真实水波纹理
- **📦 纹理贴图** - 材质纹理应用

### 🎭 动效演示

- **🖱️ 跟随鼠标的渐变按钮** - 交互式按钮效果
- **⚡ 闪烁渐变背景** - 动态背景效果
- **🎯 图片悬停文字聚焦** - 图片交互效果

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Vue Router 4** - 官方路由管理器

### 构建工具
- **Vite** - 极速的前端构建工具
- **UnoCSS** - 原子化CSS引擎

### UI组件库
- **Element Plus** - 基于Vue 3的桌面端组件库
- **Naive UI** - 简洁优雅的Vue 3组件库

### 核心库
- **Three.js** - 3D图形渲染库
- **Monaco Editor** - VS Code编辑器核心
- **Highlight.js** - 代码语法高亮
- **html-dom-parser** - HTML DOM解析器
- **ColorThief** - 图片颜色提取
- **html2canvas** - HTML转Canvas
- **QRCode** - 二维码生成

### 开发工具
- **unplugin-auto-import** - 自动导入API
- **unplugin-vue-components** - 自动导入组件
- **unplugin-icons** - 图标自动导入

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- pnpm (推荐) 或 npm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发模式
```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问地址查看应用

### 构建部署
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### Vercel 部署（AI 对话）

项目内已使用同源接口 `"/api/chat"` 作为 AI 请求入口，生产环境通过 Vercel API Route 中转到 DashScope。

部署时请在 Vercel 项目中配置环境变量：

- `DASHSCOPE_API_KEY`：DashScope 的 API Key（仅服务端使用，不会暴露到前端）

可选本地环境变量：

- `VITE_API_URL=/api/chat`（默认即为该值，可不配置）
- `DASHSCOPE_API_KEY=你的key`（仅本地 `vite dev` 代理使用）

本地开发说明：

- 使用 `npm run dev` 时，`/api/chat` 通过 Vite 代理转发到 DashScope。
- 使用 Vercel 生产部署时，`/api/chat` 由 `api/chat.js` 处理并中转到 DashScope。

## 📁 项目结构
src/
├── components/ # 公共组件
│ ├── v-container/ # 容器组件
│ ├── v-element-parse/ # DOM元素解析组件
│ ├── v-title-bar/ # 标题栏组件
│ └── v-upload/ # 上传组件
├── views/ # 页面视图
│ ├── Pixel-art/ # 像素画转换
│ ├── life-grid/ # 人生小格
│ ├── color-identify/ # 颜色识别
│ ├── dom-display/ # DOM显示
│ ├── code-compare/ # 代码比较
│ ├── three-js/ # Three.js演示
│ ├── qrcode-generator/# 二维码生成
│ ├── ip-compute/ # IP计算
│ ├── linux-command/ # Linux命令
│ └── demo/ # 演示页面
├── assets/ # 静态资源
├── router/ # 路由配置
└── utils/ # 工具函数

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/Funny-Tools`)
3. 提交更改 (`git commit -m 'Add some Funny-Tools'`)
4. 推送到分支 (`git push origin feature/Funny-Tools`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Three.js](https://threejs.org/) - 3D图形库
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [UnoCSS](https://unocss.dev/) - 原子化CSS引擎

---

⭐ 如果这个项目对你有帮助，请给它一个星标！