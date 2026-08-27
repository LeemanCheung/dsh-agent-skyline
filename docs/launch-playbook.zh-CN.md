# dsh-agent-skyline 首发与增长方案

## 目标

首发阶段的核心不是一次性刷高曝光，而是验证一个完整循环：

```text
看到城市 → 三秒理解 → 安装 → 生成自己的城市 → 导出 → 再次传播
```

## 1. 仓库发布配置

### Repository

- 名称：`dsh-agent-skyline`
- Description：`Turn every DeepSeek Harness Agent session into a private, animated, shareable developer city.`
- Website：`https://leemancheung.github.io/dsh-agent-skyline/`
- Topics：
  - `dsh-plugin`
  - `deepseek-harness`
  - `agent`
  - `generative-art`
  - `developer-tools`
  - `visualization`
  - `local-first`
  - `privacy`
  - `gamification`

### 首个 Release

- Tag：`v1.0.0`
- Title：`v1.0.0 — Your Agent session is now a city`
- Release Assets：源码压缩包之外，额外挂载 `preview.png`、`construction.gif`
- Social Preview：上传专用的 `docs/social-preview.png`（1280×640）
- Release Notes 首屏只放三个信息：
  1. Session → City；
  2. No prompts / no paths / no cloud；
  3. 安装命令。

## 2. 首发内容资产

仓库已准备：

- 在线交互演示：GitHub Pages 部署 `demo/`，直接操作范围、主题、回放与导出
- 完整桌面界面：`docs/ui-preview.png`
- 移动界面：`docs/mobile-preview.png`
- 导出卡片：`docs/preview.png`
- 仓库 Social Preview：`docs/social-preview.png`
- 建城动图：`docs/construction.gif`
- 四主题矩阵：`docs/themes.png`
- 隐私架构图：`docs/architecture.svg`
- 中英文 README
- 市场分析与本发布方案

仍建议在真实 DSH 中补录一段 10–15 秒视频：

1. Agent 执行工具；
2. 头部 Skyline 数字增长；
3. 打开面板；
4. 点击 Replay；
5. 导出 PNG；
6. 以导出的城市卡片结束。

不要录制 Prompt 或业务文件，只使用公开 Demo 仓库。

## 3. 首发节奏

### T-1：预热

发布一张只展示城市、暂不解释全部功能的图片：

> 我把 AI Agent 的一次工作过程，变成了一座城市。文件操作是建筑，测试是实验室，子 Agent 是协作枢纽。明天开源。

目的不是收集 Star，而是测试“城市隐喻是否无需解释”。评论若集中询问“怎么生成”，说明视觉钩子成立。

### T0：GitHub + DSH 社区首发

首发主标题：

> Your Agent session is now a city — open-source, local-only, zero extra tokens

正文结构：

1. 一张主视觉；
2. 一句话定义与在线演示入口；
3. 12 秒动图；
4. 三个差异点；
5. 安装命令；
6. 隐私说明；
7. 邀请用户晒出 City ID。

### T+1：中文开发者社区

不要复制 README。采用“问题—创意—实现—结果”的叙事：

- Agent 工具调用越来越复杂，但完成后只剩一串日志；
- Wrapped 已有人做，Office / Replay 也已经拥挤；
- 因此选择把工作痕迹压缩成程序化城市；
- 重点展示如何做到不读取 Prompt 和路径；
- 最后给安装命令和 GitHub。

### T+3：技术拆解

发布一篇偏硬核的实现文章：

- lossy privacy reducer；
- deterministic procedural generation；
- isometric SVG；
- DSH Header Slot 注入；
- Canvas PNG export；
- localStorage 幂等聚合；
- 隐私自动化测试。

技术文章承担第二波传播，并建立项目不是“套壳玩具”的可信度。

### T+7：城市周报挑战

发起 `#MyAgentSkyline`：

> 晒出你的 7-Day City，只发城市卡，不发工作内容。比较 City ID、Archetype 和解锁地标。

这个挑战应当在插件的分享文案中自然出现，而不是依赖官方持续运营。

## 4. 渠道适配

### GitHub

- README 首屏只保留一句话、主图、在线演示、安装命令、隐私承诺；
- 创建 `Show your city` Discussion；
- Issue Template 增加 `Share card rendering problem`；
- 在 Release 中附动图，不让用户先阅读长文。

### 小红书

标题候选：

- `我把 AI Agent 的工作过程，变成了一座会生长的城市`
- `写代码写出一座城：这个开源插件太适合晒了`
- `没有上传 Prompt，我的 AI 工作记录却变成了城市`

正文建议控制 500–750 字，图片顺序：主视觉 → 建城过程 → 四主题 → 隐私架构 → 安装命令。

### B 站 / 抖音

15 秒脚本：

```text
0–2s：空城市 + “AI Agent 做完任务后，日志就消失了？”
2–6s：建筑逐栋出现
6–9s：四种主题快速切换
9–12s：PNG 导出卡片
12–15s：“不上传 Prompt，不增加 Token，GitHub 开源”
```

### V2EX / 掘金 / 开源社区

强调技术决策和隐私，而不是使用“爆款”“颠覆”等宣传词。标题应包含 `DeepSeek Harness`、`local-first`、`procedural city` 中至少两个关键词。

## 5. 内置增长机制

### 5.1 每张卡片都是分发入口

导出图底部保留：

```text
github:LeemanCheung/dsh-agent-skyline
```

字号低调但可读，不使用大水印破坏用户分享意愿。

### 5.2 City ID 形成比较对象

城市名可能相同，但 City ID 稳定且可比较。社区互动可以围绕：

- 你的 Archetype 是什么；
- 解锁了哪些地标；
- 7-Day City 有多少 Blocks；
- 谁生成了稀有的 Phoenix Tower。

### 5.3 周期性内容

插件天然提供 Session / Today / 7-day / All-time 四个传播时点，不依赖开发者不断制作新模板。

### 5.4 隐私承诺成为传播卖点

导出卡固定包含 `No prompts · no paths · no cloud`。这既降低用户分享顾虑，也形成项目识别符号。

## 6. 首发文案模板

### 中文短版

> 我做了一个 DeepSeek Harness 插件：`dsh-agent-skyline`。
>
> 它会把 Agent 的一次工作过程变成一座程序化城市：文件操作是建筑，测试是验证中心，Web 检索是观测塔，子 Agent 是协作枢纽，失败后成功恢复还能解锁 Phoenix Tower。
>
> 支持本次会话、今天、近 7 天和全部历史；可以回放建城过程，导出 PNG / SVG，再直接复制分享文案。
>
> 最重要的是，它从数据层就丢弃 Prompt、回复、命令、参数和文件路径，只保留类别、状态、时长和时间戳。本地生成、没有云服务、不增加 Token。
>
> 安装：`dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.0.0"`

### English short version

> I built `dsh-agent-skyline`: every DeepSeek Harness Agent session becomes a deterministic developer city.
>
> File work creates towers, tests create verification labs, search creates observatories, subagents create collaboration hubs, and recovery after failure unlocks the Phoenix Tower.
>
> It supports session/day/7-day/all-time views, construction replay, four visual systems, PNG/SVG export, and share captions.
>
> Local-only by design: prompts, replies, commands, arguments, paths, and workspace names are discarded before the city model is built. No cloud and no extra tokens.

## 7. 30 天迭代计划

### Week 1：兼容与激活

- 收集真实 DSH Node 类型，补充分类型适配；
- 优先修复安装、空数据、导出和移动端问题；
- 不在第一周增加大量设置。

### Week 2：传播格式

- 增加 9:16、1:1 分享版式；
- 增加一键隐藏仓库标识的选项，但默认保留；
- 增加 GitHub Profile 600×300 卡片。

### Week 3：稀有地标

- 增加 12–20 个地标；
- 公开解锁规则，避免黑箱；
- 不加入付费或随机抽卡。

### Week 4：插件矩阵联动

- 与 `dsh-task-dag` 对接本地协作规模；
- 与 `dsh-token-usage` 对接可选能源指标；
- 发布“你的 DSH 城市如何形成”技术文章。

## 8. 发布前检查表

- [ ] 新仓库为 Public，默认分支 `main`
- [ ] Topics、Description、Website、Social Preview 已配置
- [ ] GitHub Pages 已设为 GitHub Actions，在线演示可访问
- [ ] `npm run check` 通过
- [ ] 在真实 DSH Web 中安装并打开面板
- [ ] Session / Today / 7-day / All-time 全部有数据
- [ ] PNG、SVG、复制文案均验证
- [ ] 中文与英文界面验证
- [ ] 375px 移动视口验证
- [ ] Reduced Motion 验证
- [ ] 使用包含敏感路径的模拟 Node 做最终泄漏检查
- [ ] 创建 `v1.0.0` Release
- [ ] 创建 Discussion：`Show your Agent Skyline`
