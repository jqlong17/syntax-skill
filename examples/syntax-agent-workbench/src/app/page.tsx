"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  KeyRound,
  Languages,
  Play,
  RotateCcw,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import styles from "./page.module.css";
import defaultStateJson from "./agent-state.json";

type NodeStatus = "ready" | "in_progress" | "needs_input" | "verified";

type AgentNode = {
  id: string;
  label: string;
  kind: string;
  status: NodeStatus;
  detail: string;
  confidence: number;
  children?: string[];
};

type AgentState = {
  title: string;
  summary: string;
  focus: string;
  nodes: AgentNode[];
  unresolved: string[];
  updatedAt: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

type ApiConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

const defaultState = defaultStateJson as AgentState;

const initialMessages: ChatMessage[] = [
  { role: "assistant", content: "我会把你的想法拆成目标、依存关系、约束、计划、记忆和验证节点。你可以直接告诉我想修改哪一块。", timestamp: "09:41" },
  { role: "user", content: "我想先把长期记忆和验证机制设计清楚。", timestamp: "09:42" },
  { role: "assistant", content: "已把注意力移动到“可恢复记忆”和“验证与裁决”。下一步建议明确记忆的来源、有效期和重新读取路径。", timestamp: "09:42" },
];

const defaultConfig: ApiConfig = { baseUrl: "https://api.aixhan.com/v1", apiKey: "", model: "gpt-5.5" };
const modelOptions = [
  { value: "gpt-5.5", label: "GPT-5.5" },
  { value: "gpt-6-astra", label: "GPT-6 Astra" },
  { value: "gpt-5.6-sol", label: "GPT-5.6 Sol" },
  { value: "gpt-5.6-terra", label: "GPT-5.6 Terra" },
  { value: "gpt-5.6-luna", label: "GPT-5.6 Luna" },
  { value: "gpt-5.2", label: "GPT-5.2" },
];
const uiCopy = {
  zh: {
    title: "句法 Agent 工作台",
    brand: "句法方法论",
    structure: "结构",
    assistant: "助手",
    summary: "把一次自然语言请求拆解为可验证的任务结构。",
    reset: "重置",
    exportJson: "导出 JSON",
    settings: "连接设置",
    copyJson: "复制 JSON",
    copied: "已复制",
    currentFocus: "当前焦点",
    updated: "更新于",
    graph: "依存任务图 / 实时状态",
    unresolved: "待解决依赖",
    assistantTitle: "结构化架构助手",
    localFirst: "本地优先",
    apiConnected: "API 已连接",
    localDemo: "本地演示",
    keyNote: "API Key 只保存在当前浏览器的 localStorage，不会写入仓库。",
    placeholder: "告诉助手你想修改哪一块结构…",
    sendHint: "Enter 发送 · Shift + Enter 换行",
    send: "发送",
    configure: "配置模型连接",
    getKey: "获取 API Key",
    connection: "连接",
    connectionTitle: "模型连接设置",
    connectionIntro: "支持 OpenAI-compatible 的 /chat/completions 接口。不要把生产密钥提交到代码仓库。",
    baseUrl: "API Base URL",
    apiKey: "API Key",
    model: "模型",
    save: "保存设置",
    clearKey: "清除 Key",
    localNote: "当前示例默认本地演示模式，不需要 API Key 也可以体验结构更新。",
    status: { ready: "待处理", in_progress: "进行中", needs_input: "待确认", verified: "已验证" },
  },
  en: {
    title: "Syntax Agent Workbench",
    brand: "Syntax Methodology",
    structure: "Structure",
    assistant: "Assistant",
    summary: "Turn a natural-language request into a verifiable task structure.",
    reset: "Reset",
    exportJson: "Export JSON",
    settings: "Connection",
    copyJson: "Copy JSON",
    copied: "Copied",
    currentFocus: "Focus",
    updated: "Updated",
    graph: "Dependency graph / live state",
    unresolved: "Open dependencies",
    assistantTitle: "Structured architecture assistant",
    localFirst: "Local-first",
    apiConnected: "API connected",
    localDemo: "Local demo",
    keyNote: "The API key stays in this browser's localStorage and is never written to the repository.",
    placeholder: "Tell the assistant which part of the structure to change…",
    sendHint: "Enter to send · Shift + Enter for a new line",
    send: "Send",
    configure: "Configure model",
    getKey: "Get API key",
    connection: "Connection",
    connectionTitle: "Model connection",
    connectionIntro: "Supports an OpenAI-compatible /chat/completions endpoint. Never commit a production key to the repository.",
    baseUrl: "API Base URL",
    apiKey: "API Key",
    model: "Model",
    save: "Save settings",
    clearKey: "Clear key",
    localNote: "This example starts in local demo mode. You can explore structure updates without an API key.",
    status: { ready: "Ready", in_progress: "In progress", needs_input: "Needs input", verified: "Verified" },
  },
} as const;

function nowLabel() {
  return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function updateNodes(state: AgentState, updates: Partial<AgentNode>[], focus?: string): AgentState {
  const updateById = new Map(updates.map((item) => [item.id, item]));
  return { ...state, focus: focus ?? state.focus, nodes: state.nodes.map((node) => ({ ...node, ...(updateById.get(node.id) ?? {}) })), updatedAt: "刚刚" };
}

type ModelPatch = {
  focus?: string;
  summary?: string;
  nodes?: Partial<AgentNode>[];
};

type ModelResponse = {
  reply?: string;
  patch?: ModelPatch;
};

function buildLocalResponse(text: string, state: AgentState) {
  const lower = text.toLowerCase();
  if (lower.includes("记忆") || lower.includes("memory")) {
    return { reply: "演示模式：我把长期记忆标记为当前焦点。建议先定义来源、时间范围、置信度、失效条件和回读路径。", nextState: updateNodes(state, [{ id: "memory", status: "in_progress", confidence: 0.82, detail: "当前焦点：来源、时间范围、置信度、失效条件和回读路径。" }], "可恢复记忆") };
  }
  if (lower.includes("验证") || lower.includes("verify")) {
    return { reply: "演示模式：我把验证节点标记为当前焦点。请为每个关键结论指定证据、检查项和失败后的恢复动作。", nextState: updateNodes(state, [{ id: "verification", status: "in_progress", confidence: 0.84, detail: "当前焦点：证据、检查项、权限边界和失败后的恢复动作。" }], "验证与裁决") };
  }
  return { reply: "演示模式：我已记录这条想法。请继续指定它影响的实体、约束或任务节点；配置 API Key 后可以让模型直接返回结构化更新。", nextState: { ...state, summary: text.slice(0, 72), updatedAt: "刚刚" } };
}

function extractJsonObject(content: string): ModelResponse | null {
  const normalized = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const candidates = [normalized];
  const firstBrace = normalized.indexOf("{");
  const lastBrace = normalized.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(normalized.slice(firstBrace, lastBrace + 1));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as ModelResponse;
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Providers sometimes add prose around an otherwise valid JSON object.
    }
  }
  return null;
}

function inferLocalPatch(text: string, state: AgentState) {
  const lower = text.toLowerCase();
  const target = state.nodes.find((node) => lower.includes(node.id.toLowerCase()) || lower.includes(node.label.toLowerCase()));
  if (!target) return null;
  const status: NodeStatus = lower.includes("完成") || lower.includes("验证") || lower.includes("verified") ? "verified" : lower.includes("确认") || lower.includes("输入") ? "needs_input" : "in_progress";
  return { id: target.id, status, detail: `根据当前请求更新：${text.slice(0, 72)}` } satisfies Partial<AgentNode>;
}

function parseModelResponse(content: string, state: AgentState, userText: string) {
  const parsed = extractJsonObject(content);
  if (parsed) {
    const patch = parsed.patch ?? {};
    const validIds = new Set(state.nodes.map((node) => node.id));
    const safeNodes = (patch.nodes ?? []).filter((node) => typeof node.id === "string" && validIds.has(node.id)).map((node) => ({
      ...node,
      confidence: typeof node.confidence === "number" ? Math.max(0, Math.min(1, node.confidence)) : undefined,
    }));
    return { reply: parsed.reply ?? "我完成了结构化分析，但没有返回额外说明。", nextState: updateNodes({ ...state, summary: patch.summary ?? state.summary }, safeNodes, patch.focus), parsed: true };
  }

  const inferred = inferLocalPatch(userText, state);
  return {
    reply: content,
    nextState: inferred ? updateNodes(state, [inferred], state.nodes.find((node) => node.id === inferred.id)?.label) : state,
    parsed: false,
  };
}

export default function Home() {
  const [locale, setLocale] = useState<"zh" | "en">("zh");
  const [agentState, setAgentState] = useState<AgentState>(defaultState);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [config, setConfig] = useState<ApiConfig>(() => {
    if (typeof window === "undefined") return defaultConfig;
    const stored = window.localStorage.getItem("syntax-agent-config");
    if (!stored) return defaultConfig;
    try {
      const nextConfig = { ...defaultConfig, ...(JSON.parse(stored) as ApiConfig) };
      if (!nextConfig.model || nextConfig.model === "gpt-4o-mini") nextConfig.model = "gpt-5.5";
      return nextConfig;
    } catch {
      window.localStorage.removeItem("syntax-agent-config");
      return defaultConfig;
    }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ goal: true, plan: true });
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = uiCopy[locale];

  const visibleJson = useMemo(() => JSON.stringify(agentState, null, 2), [agentState]);

  function renderNode(id: string, depth = 0): React.ReactNode {
    const node = agentState.nodes.find((item) => item.id === id);
    if (!node) return null;
    const hasChildren = Boolean(node.children?.length);
    const isExpanded = expanded[node.id] ?? false;
    return (
      <div className={styles.nodeBranch} key={node.id}>
        <div className={`${styles.node} ${agentState.focus === node.label ? styles.nodeFocused : ""}`} style={{ marginLeft: `${depth * 28}px` }}>
          <div className={styles.nodeAccent} data-status={node.status} />
          <div className={styles.nodeMain}>
            <div className={styles.nodeTopline}><span className={styles.nodeKind}>{node.kind}</span><span className={styles.nodeStatus} data-status={node.status}>{copy.status[node.status]}</span></div>
            <div className={styles.nodeTitleRow}><strong>{node.label}</strong>{hasChildren ? <button className={styles.iconButton} aria-label={isExpanded ? "收起节点" : "展开节点"} onClick={() => setExpanded((current) => ({ ...current, [node.id]: !current[node.id] }))}>{isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</button> : null}</div>
            <p>{node.detail}</p>
            <div className={styles.nodeMeta}><span>confidence {Math.round(node.confidence * 100)}%</span><span>id:{node.id}</span></div>
          </div>
        </div>
        {hasChildren && isExpanded ? <div className={styles.children}>{node.children?.map((childId) => renderNode(childId, depth + 1))}</div> : null}
      </div>
    );
  }

  function saveConfig(nextConfig: ApiConfig) {
    setConfig(nextConfig);
    window.localStorage.setItem("syntax-agent-config", JSON.stringify(nextConfig));
    setSettingsOpen(false);
  }

  function resetWorkspace() { setAgentState(defaultState); setMessages(initialMessages); setDraft(""); }

  function exportState() {
    const href = URL.createObjectURL(new Blob([visibleJson], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "syntax-agent-state.json";
    anchor.click();
    URL.revokeObjectURL(href);
  }

  async function copyState() {
    await navigator.clipboard.writeText(visibleJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;
    const timestamp = nowLabel();
    setMessages((current) => [...current, { role: "user", content: text, timestamp }]);
    setDraft("");
    setIsSending(true);
    try {
      if (!config.apiKey.trim()) {
        const local = buildLocalResponse(text, agentState);
        setAgentState(local.nextState);
        setMessages((current) => [...current, { role: "assistant", content: local.reply, timestamp: nowLabel() }]);
        return;
      }
      const baseUrl = config.baseUrl.replace(/\/$/, "");
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 60000);
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey.trim()}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: config.model.trim() || "gpt-5.5",
          temperature: 0.2,
          stream: false,
          messages: [
            { role: "system", content: "你是 Syntax Agent Workbench 中的架构助手。每次都必须只返回一个有效 JSON 对象，不要 Markdown、不要代码围栏、不要解释性前后缀。格式是 {reply:string,patch:{focus?:string,summary?:string,nodes?:Array<{id:string,label?:string,status?:'ready'|'in_progress'|'needs_input'|'verified',detail?:string,confidence?:number}>}}。即使用户只是打招呼，也返回 patch:{}。只能更新当前结构中已有的节点 id，不要伪造工具结果、事实或已完成状态。模型提出候选，验证器和用户决定是否接受。" },
            ...messages.slice(-8).map((message) => ({ role: message.role, content: message.content })),
            { role: "user", content: text },
            { role: "user", content: `当前结构 JSON：${visibleJson}` },
          ],
        }),
      });
      try {
        if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
        const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const content = payload.choices?.[0]?.message?.content;
        if (!content) throw new Error("API 没有返回 assistant 内容。");
        const parsed = parseModelResponse(content, agentState, text);
        setAgentState(parsed.nextState);
        setMessages((current) => [...current, { role: "assistant", content: parsed.reply, timestamp: nowLabel() }]);
      } finally {
        window.clearTimeout(timeout);
      }
    } catch (error) {
      const message = error instanceof DOMException && error.name === "AbortError" ? "请求超过 60 秒仍未返回。请检查中转服务、模型名称或网络连接。" : error instanceof Error ? error.message : "未知错误";
      setMessages((current) => [...current, { role: "assistant", content: `调用失败：${message} 你也可以先清空 API Key 使用本地演示模式。`, timestamp: nowLabel() }]);
    } finally { setIsSending(false); }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brandBlock}><div className={styles.brandMark}><Sparkles size={18} /></div><div><div className={styles.eyebrow}>{copy.brand}</div><h1>{copy.title}</h1></div></div>
        <div className={styles.topActions}>
          <span className={styles.modeBadge}><span className={styles.liveDot} />{config.apiKey ? copy.apiConnected : copy.localDemo}</span>
          <button className={styles.secondaryButton} onClick={resetWorkspace} title={copy.reset}><RotateCcw size={15} />{copy.reset}</button>
          <button className={styles.secondaryButton} onClick={exportState} title={copy.exportJson}><Download size={15} />{copy.exportJson}</button>
          <button className={styles.secondaryButton} onClick={() => setLocale((value) => value === "zh" ? "en" : "zh")} title="切换语言 / Switch language"><Languages size={15} />{locale === "zh" ? "中 / EN" : "EN / 中"}</button>
          <button className={styles.primaryButton} onClick={() => setSettingsOpen(true)}><Settings2 size={15} />{copy.settings}</button>
        </div>
      </header>

      <section className={styles.workspace}>
        <section className={styles.structurePanel}>
          <div className={styles.panelHeader}><div><div className={styles.panelKicker}>01 / {copy.structure}</div><h2>{agentState.title}</h2><p>{locale === "zh" ? agentState.summary : copy.summary}</p></div><div className={styles.panelHeaderActions}><button className={styles.iconTextButton} onClick={copyState} title={copy.copyJson}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? copy.copied : copy.copyJson}</button><button className={styles.iconTextButton} onClick={() => setJsonOpen((value) => !value)}><ChevronDown className={jsonOpen ? styles.rotated : ""} size={15} />JSON</button></div></div>
          <div className={styles.structureBody}>
            <div className={styles.structureIntro}><div className={styles.legend}><span><i data-status="in_progress" />{copy.status.in_progress}</span><span><i data-status="needs_input" />{copy.status.needs_input}</span><span><i data-status="verified" />{copy.status.verified}</span></div><div className={styles.focusLine}><span>{copy.currentFocus}</span><strong>{agentState.focus}</strong><span className={styles.updateTime}>{copy.updated} {agentState.updatedAt}</span></div></div>
            <div className={styles.graphCanvas}><div className={styles.graphLabel}><span />{copy.graph}</div><div className={styles.graphTree}>{renderNode("goal")}</div><div className={styles.unresolvedStrip}><div className={styles.unresolvedTitle}><CircleHelp size={15} />{copy.unresolved}</div>{agentState.unresolved.map((item) => <span key={item}>{item}</span>)}</div></div>
            {jsonOpen ? <pre className={styles.jsonPanel}>{visibleJson}</pre> : null}
          </div>
        </section>

        <aside className={styles.chatPanel}>
          <div className={styles.chatHeader}><div className={styles.assistantIdentity}><div className={styles.assistantAvatar}><Bot size={18} /></div><div><div className={styles.panelKicker}>02 / {copy.assistant}</div><h2>{copy.assistantTitle}</h2></div></div><span className={styles.secureLabel}><ShieldCheck size={14} />{copy.localFirst}</span></div>
          <div className={styles.chatMessages}><div className={styles.systemNote}><KeyRound size={14} />{copy.keyNote}</div>{messages.map((message, index) => <div key={`${message.timestamp}-${index}`} className={`${styles.messageRow} ${message.role === "user" ? styles.userRow : ""}`}><div className={styles.messageMeta}><span>{message.role === "user" ? (locale === "zh" ? "你" : "You") : (locale === "zh" ? "助手" : "Assistant")}</span><time>{message.timestamp}</time></div><div className={`${styles.messageBubble} ${message.role === "user" ? styles.userBubble : ""}`}>{message.content}</div></div>)}{isSending ? <div className={styles.typing}><span /><span /><span />{locale === "zh" ? "正在更新结构…" : "Updating structure…"}</div> : null}</div>
          <form className={styles.composer} onSubmit={sendMessage}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={copy.placeholder} rows={3} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} /><div className={styles.composerFooter}><span>{copy.sendHint}</span><button className={styles.sendButton} disabled={!draft.trim() || isSending} title={copy.send}><Send size={16} />{copy.send}</button></div></form>
          <div className={styles.chatFooter}><button className={styles.footerLink} onClick={() => setSettingsOpen(true)}><Settings2 size={14} />{copy.configure}</button><a href="https://cdk.aixhan.com/?aff=af_1bb942815b09" target="_blank" rel="noreferrer">{copy.getKey} <Play size={12} /></a></div>
        </aside>
      </section>

      {settingsOpen ? <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSettingsOpen(false)}><div className={styles.settingsModal} role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><div className={styles.panelKicker}>{copy.connection}</div><h2 id="settings-title">{copy.connectionTitle}</h2></div><button className={styles.iconButton} onClick={() => setSettingsOpen(false)} aria-label="关闭设置"><X size={18} /></button></div><p className={styles.modalIntro}>{copy.connectionIntro}</p><label>{copy.baseUrl}<input value={config.baseUrl} onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })} placeholder="https://api.example.com/v1" /></label><label>{copy.apiKey}<input type="password" value={config.apiKey} onChange={(event) => setConfig({ ...config, apiKey: event.target.value })} placeholder="sk-..." autoComplete="off" /></label><label>{copy.model}<select value={config.model} onChange={(event) => setConfig({ ...config, model: event.target.value })}>{modelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><div className={styles.modalActions}><button className={styles.secondaryButton} onClick={() => saveConfig({ ...defaultConfig, apiKey: "" })}>{copy.clearKey}</button><button className={styles.primaryButton} onClick={() => saveConfig(config)}><Check size={15} />{copy.save}</button></div><div className={styles.modalNote}><ShieldCheck size={15} />{copy.localNote}</div></div></div> : null}
    </main>
  );
}
