"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
type GraphView = "process" | "knowledge";

type AgentNode = {
  id: string;
  label: string;
  kind: string;
  status: NodeStatus;
  detail: string;
  confidence: number;
  children?: string[];
};

type KnowledgeEntity = {
  id: string;
  name: string;
  type: string;
  detail: string;
  confidence: number;
};

type KnowledgeRelation = {
  id: string;
  source: string;
  target: string;
  type: string;
  confidence: number;
};

type AgentState = {
  title: string;
  summary: string;
  focus: string;
  nodes: AgentNode[];
  entities: KnowledgeEntity[];
  relations: KnowledgeRelation[];
  unresolved: string[];
  updatedAt: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  id?: string;
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

const networkNodePositions: Record<string, { x: number; y: number }> = {
  goal: { x: 28, y: 176 },
  entities: { x: 330, y: 24 },
  constraints: { x: 330, y: 176 },
  plan: { x: 330, y: 328 },
  memory: { x: 638, y: 252 },
  verification: { x: 638, y: 404 },
};

const networkLinks = [
  ["goal", "entities"],
  ["goal", "constraints"],
  ["goal", "plan"],
  ["plan", "memory"],
  ["plan", "verification"],
] as const;

const networkNodeWidth = 246;
const networkNodeHeight = 118;
const statusOrder: NodeStatus[] = ["ready", "in_progress", "needs_input", "verified"];
const knowledgeNodePositions: Record<string, { x: number; y: number }> = {
  user: { x: 28, y: 28 },
  agent: { x: 330, y: 28 },
  employee: { x: 638, y: 28 },
  expense_report: { x: 28, y: 190 },
  invoice: { x: 330, y: 190 },
  extraction_result: { x: 638, y: 190 },
  reimbursement_policy: { x: 28, y: 352 },
  policy_version: { x: 330, y: 352 },
  manager: { x: 638, y: 352 },
  approval_record: { x: 28, y: 514 },
  finance_system: { x: 330, y: 514 },
  finance_staff: { x: 638, y: 514 },
  audit_log: { x: 28, y: 676 },
  evidence: { x: 330, y: 676 },
  human_review: { x: 638, y: 676 },
  memory_record: { x: 28, y: 838 },
};

const knowledgeNodeWidth = 246;
const knowledgeNodeHeight = 118;

function statusColor(status: NodeStatus) {
  return { ready: "#a6aaa5", in_progress: "#d7874d", needs_input: "#c96766", verified: "#5a927f" }[status];
}

function upsertKnowledgeGraph(state: AgentState, entityUpdates: Partial<KnowledgeEntity>[], relationUpdates: Partial<KnowledgeRelation>[]): AgentState {
  const entityMap = new Map(state.entities.map((entity) => [entity.id, entity]));
  entityUpdates.forEach((update) => {
    if (!update.id) return;
    const current = entityMap.get(update.id);
    if (!current && (!update.name || !update.type)) return;
    entityMap.set(update.id, {
      id: update.id,
      name: update.name ?? current?.name ?? update.id,
      type: update.type ?? current?.type ?? "未分类",
      detail: update.detail ?? current?.detail ?? "",
      confidence: typeof update.confidence === "number" ? Math.max(0, Math.min(1, update.confidence)) : current?.confidence ?? 0.5,
    });
  });

  const relationMap = new Map(state.relations.map((relation) => [relation.id, relation]));
  relationUpdates.forEach((update) => {
    if (!update.id || !update.source || !update.target || !update.type) return;
    if (!entityMap.has(update.source) || !entityMap.has(update.target)) return;
    const current = relationMap.get(update.id);
    relationMap.set(update.id, {
      id: update.id,
      source: update.source,
      target: update.target,
      type: update.type,
      confidence: typeof update.confidence === "number" ? Math.max(0, Math.min(1, update.confidence)) : current?.confidence ?? 0.5,
    });
  });
  return { ...state, entities: [...entityMap.values()], relations: [...relationMap.values()], updatedAt: "刚刚" };
}
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
    graph: "状态依存网络 / 实时状态",
    processGraph: "认知流程",
    knowledgeGraph: "业务认知图谱",
    entitySummary: "实体与对象类型",
    relationSummary: "条关系",
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
    recommendPurchase: "推荐购买",
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
    graph: "State dependency network / live state",
    processGraph: "Cognitive process",
    knowledgeGraph: "Business knowledge graph",
    entitySummary: "Entities and object types",
    relationSummary: "relations",
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
    recommendPurchase: "Recommended purchase",
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
  entities?: Partial<KnowledgeEntity>[];
  relations?: Partial<KnowledgeRelation>[];
  unresolved?: string[];
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
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const extracted = normalized.slice(firstBrace, lastBrace + 1);
    candidates.push(extracted, `${extracted}}`, `${extracted}}}`);
  }

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
    const nextState = updateNodes({ ...state, summary: patch.summary ?? state.summary, unresolved: Array.isArray(patch.unresolved) ? patch.unresolved.slice(0, 8) : state.unresolved }, safeNodes, patch.focus);
    return { reply: parsed.reply ?? "我完成了结构化分析，但没有返回额外说明。", nextState: upsertKnowledgeGraph(nextState, patch.entities ?? [], patch.relations ?? []), parsed: true };
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
  const [config, setConfig] = useState<ApiConfig>(defaultConfig);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [graphView, setGraphView] = useState<GraphView>("process");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = uiCopy[locale];

  useEffect(() => {
    const stored = window.localStorage.getItem("syntax-agent-config");
    if (!stored) return;
    try {
      const nextConfig = { ...defaultConfig, ...(JSON.parse(stored) as ApiConfig) };
      if (!nextConfig.model || nextConfig.model === "gpt-4o-mini") nextConfig.model = "gpt-5.5";
      // Browser storage is hydrated after the server/client markup has matched.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfig(nextConfig);
    } catch {
      window.localStorage.removeItem("syntax-agent-config");
    }
  }, []);

  const visibleJson = useMemo(() => JSON.stringify(agentState, null, 2), [agentState]);

  function renderNetworkGraph() {
    return (
      <div className={styles.networkViewport} aria-label="状态依存网络">
        <div className={styles.stateFlow} aria-label="节点状态流转">
          {statusOrder.map((status, index) => (
            <div className={styles.stateFlowItem} key={status}>
              <span className={styles.stateFlowDot} data-status={status} />
              <span>{copy.status[status]}</span>
              {index < statusOrder.length - 1 ? <ChevronRight size={13} /> : null}
            </div>
          ))}
        </div>
        <div className={styles.networkStage}>
          <svg className={styles.networkEdges} viewBox="0 0 930 540" role="img" aria-label="节点依赖连线">
            <defs>
              <marker id="network-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 z" fill="#8d938e" />
              </marker>
            </defs>
            {networkLinks.map(([sourceId, targetId]) => {
              const source = networkNodePositions[sourceId];
              const target = networkNodePositions[targetId];
              const targetNode = agentState.nodes.find((node) => node.id === targetId);
              const startX = source.x + networkNodeWidth;
              const startY = source.y + networkNodeHeight / 2;
              const endX = target.x;
              const endY = target.y + networkNodeHeight / 2;
              const bend = Math.max(38, Math.abs(endX - startX) * 0.42);
              const isFocused = agentState.focus === targetNode?.label || agentState.focus === agentState.nodes.find((node) => node.id === sourceId)?.label;
              return <path key={`${sourceId}-${targetId}`} className={styles.networkEdge} style={{ stroke: statusColor(targetNode?.status ?? "ready"), opacity: isFocused ? 1 : 0.62, strokeWidth: isFocused ? 2.2 : 1.4 }} d={`M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`} markerEnd="url(#network-arrow)" />;
            })}
          </svg>
          <div className={styles.networkNodes}>
            {agentState.nodes.map((node) => {
              const position = networkNodePositions[node.id];
              if (!position) return null;
              return (
                <div key={node.id} className={`${styles.node} ${styles.networkNode} ${agentState.focus === node.label ? styles.nodeFocused : ""}`} style={{ left: position.x, top: position.y }}>
                  <div className={styles.nodeAccent} data-status={node.status} />
                  <div className={styles.nodeMain}>
                    <div className={styles.nodeTopline}><span className={styles.nodeKind}>{node.kind}</span><span className={styles.nodeStatus} data-status={node.status}>{copy.status[node.status]}</span></div>
                    <div className={styles.nodeTitleRow}><strong>{node.label}</strong></div>
                    <div className={styles.nodeStateRail} aria-label={`当前状态：${copy.status[node.status]}`}>
                      {statusOrder.map((status, index) => <span key={status} className={styles.nodeStateStep} data-status={status} data-current={status === node.status} data-complete={index < statusOrder.indexOf(node.status)} />)}
                    </div>
                    <p>{node.detail}</p>
                    <div className={styles.nodeMeta}><span>confidence {Math.round(node.confidence * 100)}%</span><span>id:{node.id}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderKnowledgeGraph() {
    const getPosition = (entityId: string, index: number) => knowledgeNodePositions[entityId] ?? { x: 28 + (index % 3) * 302, y: 28 + Math.floor(index / 3) * 162 };
    return (
      <div className={styles.networkViewport} aria-label="业务知识图谱">
        <div className={styles.knowledgeIntro}><span>{copy.entitySummary}</span><span>{agentState.entities.length} {locale === "zh" ? "个实体" : "entities"}</span><span>{agentState.relations.length} {copy.relationSummary}</span></div>
        <div className={`${styles.networkStage} ${styles.knowledgeStage}`}>
          <svg className={styles.networkEdges} viewBox="0 0 930 980" role="img" aria-label="实体关系连线">
            <defs>
              <marker id="knowledge-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 z" fill="#8d938e" />
              </marker>
            </defs>
            {agentState.relations.map((relation) => {
              const sourceIndex = agentState.entities.findIndex((entity) => entity.id === relation.source);
              const targetIndex = agentState.entities.findIndex((entity) => entity.id === relation.target);
              if (sourceIndex < 0 || targetIndex < 0) return null;
              const source = getPosition(relation.source, sourceIndex);
              const target = getPosition(relation.target, targetIndex);
              const startX = source.x + knowledgeNodeWidth;
              const startY = source.y + knowledgeNodeHeight / 2;
              const endX = target.x;
              const endY = target.y + knowledgeNodeHeight / 2;
              const bend = Math.max(38, Math.abs(endX - startX) * 0.42);
              const isFocused = agentState.focus === agentState.entities[sourceIndex]?.name || agentState.focus === agentState.entities[targetIndex]?.name;
              const labelX = (startX + endX) / 2;
              const labelY = (startY + endY) / 2 - 5;
              return (
                <g key={relation.id}>
                  <path className={styles.knowledgeEdge} style={{ opacity: isFocused ? 1 : 0.72, strokeWidth: isFocused ? 2.2 : 1.4 }} d={`M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`} markerEnd="url(#knowledge-arrow)" />
                  <text className={styles.relationLabel} x={labelX} y={labelY}>{relation.type}</text>
                </g>
              );
            })}
          </svg>
          <div className={styles.networkNodes}>
            {agentState.entities.map((entity, index) => {
              const position = getPosition(entity.id, index);
              return (
                <div key={entity.id} className={`${styles.node} ${styles.networkNode} ${styles.knowledgeNode} ${agentState.focus === entity.name ? styles.nodeFocused : ""}`} style={{ left: position.x, top: position.y }}>
                  <div className={styles.nodeAccent} />
                  <div className={styles.nodeMain}>
                    <div className={styles.nodeTopline}><span className={styles.nodeKind}>{entity.type}</span><span className={styles.entityConfidence}>{Math.round(entity.confidence * 100)}%</span></div>
                    <div className={styles.nodeTitleRow}><strong>{entity.name}</strong></div>
                    <p>{entity.detail}</p>
                    <div className={styles.nodeMeta}><span>entity</span><span>id:{entity.id}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
    const assistantId = `assistant-${Date.now()}`;
    let assistantInserted = false;
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
          stream: true,
          messages: [
            { role: "system", content: "你是 Syntax Agent Workbench 中的架构助手。每次只返回一个有效 JSON 对象，不要 Markdown、代码围栏或解释性前后缀。格式：{reply:string,patch:{focus?:string,summary?:string,nodes?:Array<{id:string,label?:string,status?:'ready'|'in_progress'|'needs_input'|'verified',detail?:string,confidence?:number}>,entities?:Array<{id:string,name:string,type:string,detail?:string,confidence?:number}>,relations?:Array<{id:string,source:string,target:string,type:string,confidence?:number}>,unresolved?:string[]}}。打招呼时返回 patch:{}。流程节点只能更新已有 id；业务图谱只返回与当前请求直接相关的新增或变更实体和关系，source/target 必须存在于当前或本次新增实体中。为保证稳定性：最多返回 12 个 entities、18 个 relations 和 8 个 unresolved；不要重复未变化的实体或关系；detail 最多 80 个中文字符，relation type 最多 12 个中文字符；优先保留权限、证据、记忆、工具、人工确认和关键业务对象。不要把模型建议写成已完成事实。" },
            ...messages.slice(-8).map((message) => ({ role: message.role, content: message.content })),
            { role: "user", content: text },
            { role: "user", content: `当前结构 JSON：${visibleJson}` },
          ],
        }),
      });
      try {
        if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
        let content = "";
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          content = payload.choices?.[0]?.message?.content ?? "";
        } else if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          const upsertPreview = () => {
            assistantInserted = true;
            setMessages((current) => {
              const preview = { id: assistantId, role: "assistant" as const, content: "模型已开始响应，正在整理结构…", timestamp: nowLabel() };
              const exists = current.some((message) => message.id === assistantId);
              return exists ? current.map((message) => message.id === assistantId ? preview : message) : [...current, preview];
            });
          };
          const consumeLine = (line: string) => {
            if (!line.startsWith("data:")) return;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") return;
            try {
              const chunk = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                content += delta;
                if (!assistantInserted) upsertPreview();
              }
            } catch {
              // Ignore an incomplete SSE frame; the next read completes it.
            }
          };
          while (true) {
            const { done, value } = await reader.read();
            buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? "";
            lines.forEach(consumeLine);
            if (done) break;
          }
          if (buffer) consumeLine(buffer);
        }
        if (!content) throw new Error("API 没有返回 assistant 内容。");
        const parsed = parseModelResponse(content, agentState, text);
        setAgentState(parsed.nextState);
        setMessages((current) => {
          const finalMessage = { id: assistantId, role: "assistant" as const, content: parsed.reply, timestamp: nowLabel() };
          const exists = current.some((message) => message.id === assistantId);
          return exists ? current.map((message) => message.id === assistantId ? finalMessage : message) : [...current, finalMessage];
        });
      } finally {
        window.clearTimeout(timeout);
      }
    } catch (error) {
      const message = error instanceof DOMException && error.name === "AbortError" ? "请求超过 60 秒仍未返回。请检查中转服务、模型名称或网络连接。" : error instanceof Error ? error.message : "未知错误";
      setMessages((current) => {
        const errorMessage = { id: assistantId, role: "assistant" as const, content: `调用失败：${message} 你也可以先清空 API Key 使用本地演示模式。`, timestamp: nowLabel() };
        return assistantInserted ? current.map((item) => item.id === assistantId ? errorMessage : item) : [...current, errorMessage];
      });
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
            <div className={styles.graphTabs} role="tablist" aria-label="认知结构视图">
              <button className={styles.graphTab} data-active={graphView === "process"} role="tab" aria-selected={graphView === "process"} onClick={() => setGraphView("process")}>{copy.processGraph}</button>
              <button className={styles.graphTab} data-active={graphView === "knowledge"} role="tab" aria-selected={graphView === "knowledge"} onClick={() => setGraphView("knowledge")}>{copy.knowledgeGraph}</button>
            </div>
            <div className={styles.graphCanvas}><div className={styles.graphLabel}><span />{graphView === "process" ? copy.graph : copy.knowledgeGraph}</div>{graphView === "process" ? renderNetworkGraph() : renderKnowledgeGraph()}<div className={styles.unresolvedStrip}><div className={styles.unresolvedTitle}><CircleHelp size={15} />{copy.unresolved}</div>{agentState.unresolved.map((item) => <span key={item}>{item}</span>)}</div></div>
            {jsonOpen ? <pre className={styles.jsonPanel}>{visibleJson}</pre> : null}
          </div>
        </section>

        <aside className={styles.chatPanel}>
          <div className={styles.chatHeader}><div className={styles.assistantIdentity}><div className={styles.assistantAvatar}><Bot size={18} /></div><div><div className={styles.panelKicker}>02 / {copy.assistant}</div><h2>{copy.assistantTitle}</h2></div></div><span className={styles.secureLabel}><ShieldCheck size={14} />{copy.localFirst}</span></div>
          <div className={styles.chatMessages}><div className={styles.systemNote}><KeyRound size={14} />{copy.keyNote}</div>{messages.map((message, index) => <div key={`${message.timestamp}-${index}`} className={`${styles.messageRow} ${message.role === "user" ? styles.userRow : ""}`}><div className={styles.messageMeta}><span>{message.role === "user" ? (locale === "zh" ? "你" : "You") : (locale === "zh" ? "助手" : "Assistant")}</span><time>{message.timestamp}</time></div><div className={`${styles.messageBubble} ${message.role === "user" ? styles.userBubble : ""}`}>{message.content}</div></div>)}{isSending ? <div className={styles.typing}><span /><span /><span />{locale === "zh" ? "正在更新结构…" : "Updating structure…"}</div> : null}</div>
          <form className={styles.composer} onSubmit={sendMessage}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={copy.placeholder} rows={3} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} /><div className={styles.composerFooter}><span>{copy.sendHint}</span><button className={styles.sendButton} disabled={!draft.trim() || isSending} title={copy.send}><Send size={16} />{copy.send}</button></div></form>
          <div className={styles.chatFooter}><button className={styles.footerLink} onClick={() => setSettingsOpen(true)}><Settings2 size={14} />{copy.configure}</button><a className={styles.recommendedLink} href="https://cdk.aixhan.com/?aff=af_1bb942815b09" target="_blank" rel="noreferrer">{copy.recommendPurchase} <Play size={12} /></a></div>
        </aside>
      </section>

      {settingsOpen ? <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSettingsOpen(false)}><div className={styles.settingsModal} role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><div className={styles.panelKicker}>{copy.connection}</div><h2 id="settings-title">{copy.connectionTitle}</h2></div><button className={styles.iconButton} onClick={() => setSettingsOpen(false)} aria-label="关闭设置"><X size={18} /></button></div><p className={styles.modalIntro}>{copy.connectionIntro}</p><label>{copy.baseUrl}<input value={config.baseUrl} onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })} placeholder="https://api.example.com/v1" /></label><label>{copy.apiKey}<input type="password" value={config.apiKey} onChange={(event) => setConfig({ ...config, apiKey: event.target.value })} placeholder="sk-..." autoComplete="off" /></label><label>{copy.model}<select value={config.model} onChange={(event) => setConfig({ ...config, model: event.target.value })}>{modelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><div className={styles.modalActions}><button className={styles.secondaryButton} onClick={() => saveConfig({ ...defaultConfig, apiKey: "" })}>{copy.clearKey}</button><button className={styles.primaryButton} onClick={() => saveConfig(config)}><Check size={15} />{copy.save}</button></div><div className={styles.modalNote}><ShieldCheck size={15} />{copy.localNote}</div></div></div> : null}
    </main>
  );
}
