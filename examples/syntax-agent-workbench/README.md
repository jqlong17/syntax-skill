# Syntax Agent Workbench

这是 `syntax-skill` 的可运行 Next.js 实战参考：左侧包含由 `src/app/agent-state.json` 驱动的认知流程状态图和业务认知图谱，右侧是可以通过结构化 patch 更新页面的 AI 助手。

## 启动

```bash
pnpm install
pnpm dev
```

然后打开终端显示的本地地址。

## 使用方式

- 不配置 API Key 时，页面使用本地演示模式；输入“记忆”或“验证”即可看到结构焦点更新。
- 点击“连接设置”，填写 OpenAI-compatible API Base URL、API Key 和模型名称。
- 默认 Base URL 是 `https://api.aixhan.com/v1`，默认模型是 `gpt-5.5`，但项目不会预置任何 API Key。
- 模型下拉菜单支持 `gpt-5.5`、`gpt-6-astra`、`gpt-5.6-sol`、`gpt-5.6-terra`、`gpt-5.6-luna` 和 `gpt-5.2`。
- 页面默认使用中文，右上角可以切换到英文界面。
- 左侧可以切换“认知流程”和“业务认知图谱”两个视图；业务图谱会随对话新增或更新实体、对象类型和关系。
- 模型需要返回 JSON：

```json
{
  "reply": "给用户看的说明",
  "patch": {
    "focus": "可恢复记忆",
    "summary": "新的结构摘要",
    "nodes": [
      {
        "id": "memory",
        "status": "in_progress",
        "detail": "当前处理的内容",
        "confidence": 0.82
      }
    ],
    "entities": [
      { "id": "order", "name": "订单", "type": "业务对象", "detail": "当前请求相关的业务对象", "confidence": 0.92 }
    ],
    "relations": [
      { "id": "user-creates-order", "source": "user", "target": "order", "type": "创建", "confidence": 0.9 }
    ],
    "unresolved": ["仍需人工确认的业务规则"]
  }
}
```

前端只允许模型更新已有流程节点；业务图谱允许新增或更新当前请求直接相关的实体和关系，但会校验关系两端是否存在。真实项目应进一步加入服务端代理、权限校验、工具执行和独立验证器。

## 安全边界

API Key 仅保存在当前浏览器的 `localStorage`，不会写入仓库。使用第三方中转 API 时，应确认其 CORS、日志、计费和数据保留政策；生产环境建议使用服务端代理或短期令牌。
