# syntax-skill

> 中文版为默认入口。English version: [README.en.md](README.en.md)

> 在线阅读中文版：<https://shelf.notta.uk/book/6f8d032b-5775-43a1-ab7f-1e0c98da8e38>

`syntax-skill` 是一个可复用的 Codex skill。它以 Edward A. F. Gibson 的《Syntax: A Cognitive Approach》为理论基础，把语言形式、依存结构、记忆、上下文、噪声、规划和验证等概念，转化为可用于 AI 与 Agent 架构设计的方法论。

它适用于语言只是问题一部分的系统：长期记忆、对话管理、任务拆解、任务规划、工具调用、结果验证、不确定性处理和多 Agent 协作。它帮助设计者在继续增加 prompt 之前，先回答一个更基础的问题：语言模型之外，还需要哪些结构、状态、证据和控制循环？

## 这个 Skill 提供什么

Skill 由一个主入口、一个共享的 Agent 设计协议，以及八个可独立读取的领域参考组成：

1. **形式与意义的分离**：不要把流畅语言直接当成真实世界状态。
2. **依存结构与任务表示**：把用户请求转化为实体、动作、约束和依存关系构成的类型化任务图。
3. **噪声信道与鲁棒推断**：把输入、检索、工具和执行都看成可能出错的通信信道。
4. **有损记忆与可恢复上下文**：允许压缩记忆，但必须保留来源、置信度、范围和恢复路径。
5. **局部性与状态引用距离**：让关键事实靠近使用它们的动作，降低长上下文中的引用干扰。
6. **规划与语言生成分离**：把任务图、规划、执行、验证和最终措辞拆开。
7. **多维 Agent 评估**：分别评价任务理解、事实 grounding、工具选择、执行、验证、校准和修复能力。
8. **候选生成与最终裁决分离**：让 LLM 提出候选，让工具、规则、验证器和人来决定是否接受。

共享的 [Agent 设计协议](references/agent-design-protocol.md) 负责把这八个领域组合起来，定义统一状态模型、领域卡片规范、从观察到验证的控制循环、风险敏感的决策门槛、架构输出格式和反证测试。

## 为什么它对 AI 和 Agent 重要

语言系统最容易犯的根本错误，是把“句子说得通”误认为“任务已经解决”。这个 Skill 提供了一套更稳健的设计语言：

- 对话管理器可以把每轮对话看成依存任务图的证据，而不是孤立 prompt。
- 记忆系统可以压缩上下文，同时保留回到原始证据的路径。
- 规划器可以显式保存承诺、前置条件和后置条件，而不是把它们藏在生成文本里。
- 工具型 Agent 可以明确判断什么时候推断、什么时候追问、什么时候验证。
- 评估系统可以区分“理解错了”“规划错了”“工具失败了”和“结果没有验证”。

这不是一本直接给出现代 Agent 软件架构的书，而是一套从语言与认知理论中提炼出来的架构方法。仓库中的工程规则会明确标注为基于原文的设计应用，而不是伪装成书中的直接结论。

## 原文引用与上下文追溯

每个领域参考都包含：

- 书名与作者；
- 章节与小节；
- 印刷页码范围；
- 原始 EPUB 的 XHTML 文件；
- 小节锚点和页码锚点，例如 `#hsec10-1`、`#pg_274`；
- 用于重新检索上下文的关键词。

完整引用地图见 [references/source-map.md](references/source-map.md)。引用基于英文原书的实际 EPUB 结构，而不是摘要或重新抄写的段落。仓库不复制整本书。

## 书籍资源与引用

本仓库提供可追溯的书籍资源入口，但不把整本中文译本直接公开打包进仓库：

- 中文译本在线阅读：[NottaShelf 书籍页面](https://shelf.notta.uk/book/6f8d032b-5775-43a1-ab7f-1e0c98da8e38)。
- 英文原书的官方开放获取入口、出版社信息和许可证见 [references/source-assets.md](references/source-assets.md)。
- 中文译本的本地文件名、SHA-256、章节锚点映射和私有资源接入方式也记录在该文件中。
- 中文译本属于原书的翻译改编版本，公开再分发需要额外的授权；因此 GitHub 仓库只保存索引和引用协议，不保存整本译本。
- 仓库中的引用始终指向原始 EPUB XHTML 文件、章节锚点和页码锚点，便于 Agent 回读上下文。

## 安装与使用

本仓库同时支持 Codex 和 Cursor：

### Codex

将 `syntax-skill` 目录复制到 Codex skills 目录，或者安装后使用 `$syntax-skill` 显式调用。标准 skill 元数据保持自动发现，不需要额外配置。

### Cursor

直接在 Cursor 中打开本仓库即可使用项目规则 `.cursor/rules/syntax-skill.mdc`。Cursor 会根据规则描述判断何时加载它；也可以在对话中手动引用该规则。规则会引导 Cursor 先读取 `SKILL.md` 和 `references/agent-design-protocol.md`，再按当前任务选择需要的领域文件。

如果要把它用于其他 Cursor 项目，可以复制以下内容到目标项目：

1. `.cursor/rules/syntax-skill.mdc`；
2. `SKILL.md`；
3. `references/` 目录。

这样规则中的相对路径和原文引用索引仍然有效。

典型用途包括：

- 设计助手的长期记忆架构；
- review 会在多轮对话中丢失实体绑定的对话管理器；
- 建立任务拆解和任务规划协议；
- 设计工具调用、执行和验证闭环；
- 为多 Agent 工作流建立分阶段评估指标；
- 判断某个 LLM 输出是否需要 grounding、检索或人工确认；
- 把自然语言请求转化为包含证据要求和确认门槛的类型化任务图。

## 验证

运行：

```bash
python3 /Users/ruska/.codex/skills/.system/skill-creator/scripts/quick_validate.py /path/to/syntax-skill
python3 /path/to/syntax-skill/scripts/validate_source_links.py /path/to/syntax-skill
```

第一个命令检查 Codex skill 的目录结构和 YAML frontmatter；第二个命令检查八个领域是否都包含章节、页码、XHTML 文件、锚点和回读关键词。

## 许可证与致谢

本仓库是一个原创的方法论和引用索引层，基于 Edward A. F. Gibson 的《Syntax: A Cognitive Approach》及其原文定位信息构建。仓库不再分发整本受版权保护的英文原书或中文译本。
