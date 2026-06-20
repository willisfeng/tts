# VoiceTTS - AI-Powered Voice Processing Platform

基于 Cloudflare Workers 的 AI 语音合成平台，支持文本转语音（TTS）、多种语音风格、语速/音调调节，以及文件上传批量处理。

## 功能特性

- **20+ 语音选项** — 支持多种语言和音色（中文、英文等）
- **闪电般快速** — 基于 Edge TTS 引擎，生成速度快
- **丰富的语音风格** — 通用、智能助手、聊天对话、客服、新闻播报、亲切温暖、平静舒缓、愉快欢乐、温和柔美、抒情诗意、严肃正式等
- **语速调节** — 很慢 / 慢速 / 正常 / 快速 / 很快 / 极速 六档可调
- **音调调节** — 很低沉 / 低沉 / 标准 / 高亢 / 很高亢 五档可调
- **多语言支持** — 界面支持中文 / English 切换
- **文件上传** — 支持上传 .txt 文件批量生成语音
- **音频下载** — 生成的语音可直接下载为 MP3
- **许可证管理** — 内置激活码系统，支持 KV 持久化存储
- **管理后台** — 可在线生成和管理激活码，支持自定义有效期（1~365 天，默认 30 天）

## 技术栈

- **运行环境**: Cloudflare Workers
- **存储**: Cloudflare KV（许可证数据持久化）
- **TTS 引擎**: Microsoft Edge TTS（Azure Speech）
- **音频格式**: MP3（24kHz, 48kbit, Mono）

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/` | 前端页面 |
| `POST` | `/v1/audio/speech` | 文本转语音（支持 JSON 和 multipart/form-data） |
| `POST` | `/v1/activate` | 激活许可证 |
| `POST` | `/v1/check-license` | 检查许可证状态 |
| `GET/POST` | `/admin` | 管理后台（需密码认证） |

### TTS 请求示例

```json
POST /v1/audio/speech
Content-Type: application/json
X-License-Token: <your-token>
X-Device-Id: <your-device-id>

{
  "input": "你好，欢迎使用 VoiceTTS！",
  "voice": "zh-CN-XiaoxiaoNeural",
  "speed": "1.0",
  "volume": "0",
  "pitch": "0",
  "style": "general"
}
```

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) (>= 16)
- [Cloudflare 账号](https://dash.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### 安装部署

```bash
# 1. 克隆项目
git clone <repo-url>
cd tts-master

# 2. 安装 Wrangler
npm install -g wrangler

# 3. 登录 Cloudflare
wrangler login

# 4. 创建 KV 命名空间
wrangler kv:namespace create "LICENSE_KV"
wrangler kv:namespace create "LICENSE_KV" --preview

# 5. 将创建的 KV ID 更新到 wrangler.toml 中

# 6. 本地开发
wrangler dev

# 7. 部署到生产环境
wrangler deploy
```

### 配置说明

编辑 `wrangler.toml`，更新 KV 命名空间 ID：

```toml
[[kv_namespaces]]
binding = "LICENSE_KV"
id = "<your-production-kv-id>"
preview_id = "<your-preview-kv-id>"
```

## 使用指南

1. 访问部署后的 URL，进入 VoiceTTS 主页
2. 输入激活码解锁全部功能（激活码可通过管理后台生成）
3. 选择输入方式：手动输入文本 或 上传 .txt 文件
4. 选择语音、语速、音调、风格等参数
5. 点击"开始生成语音"，等待处理完成
6. 在线播放或下载生成的 MP3 音频

## 项目结构

```
tts-master/
├── index.js          # 主程序入口（包含前端页面、API 路由、TTS 核心逻辑）
├── wrangler.toml     # Cloudflare Workers 配置文件
├── LICENSE           # MIT 许可证
└── README.md         # 项目说明
```

## 许可证

[MIT License](LICENSE)

Copyright (c) 2025 一只会飞的旺旺
