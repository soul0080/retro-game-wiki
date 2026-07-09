# Retro Game Wiki AI Agent 开发规范

版本：v1.0

适用：

* Cursor
* Windsurf
* Claude Code
* GitHub Copilot
* 其他 AI Coding Agent

---

# 1. AI角色定义

AI在本项目中的角色：

不是：

“随意生成代码工具”

而是：

> 项目开发助手，负责实现明确需求，同时遵守已有架构和代码规范。

AI必须：

* 先理解项目
* 再提出方案
* 再修改代码
* 最后验证

---

# 2. 核心开发原则

## 原则1：不要破坏已有功能

任何修改前：

必须分析：

* 当前代码结构
* 数据关系
* 页面依赖

禁止：

直接重构整个项目。

---

## 原则2：小步开发

一次只完成一个功能。

错误：

```
开发完整后台系统
```

正确：

```
创建后台路由

↓

创建游戏管理页面

↓

创建新增游戏功能

↓

创建编辑功能

```

---

## 原则3：保持简单

项目目标：

个人长期运营。

禁止：

没有必要时引入：

* 微服务
* Kubernetes
* 复杂状态管理
* 过度抽象

优先：

简单可靠。

---

# 3. 每次AI开发流程

## Step 1：分析阶段

发送：

```
请先分析当前项目。

不要修改代码。

告诉我：

1. 当前架构
2. 相关文件
3. 实现方案
4. 风险点
```

---

## Step 2：确认阶段

人工确认方案。

---

## Step 3：开发阶段

发送：

```
按照确认方案开发。

要求：

1. 不修改无关文件
2. 保持现有架构
3. 添加必要注释
4. 更新文档
```

---

## Step 4：测试阶段

发送：

```
请检查：

1. TypeScript错误
2. ESLint错误
3. 页面运行
4. 数据库影响
5. SEO影响
```

---

# 4. 项目架构规则

## 前端

使用：

Next.js App Router。

目录：

```
app/

components/

lib/

hooks/

types/
```

---

# 5. 页面规则

所有页面必须：

## SEO Metadata

包含：

```typescript
title

description

keywords
```

---

## 页面组件拆分

禁止：

一个page.tsx超过300行。

拆：

```
GameHeader

GameInfo

GuideList

RelatedContent
```

---

# 6. 数据库规则

## 禁止直接修改生产数据库

必须：

Migration。

例如：

```
supabase/migrations/

001_create_games.sql

002_add_guides.sql
```

---

## 字段规则

新增字段必须考虑：

* SEO
* 查询
* 扩展

---

## 删除字段

必须确认：

影响：

* 页面
* API
* AI流程

---

# 7. 内容数据规则

所有内容：

必须关联实体。

例如：

攻略：

必须有：

```
game_id
```

Boss：

必须有：

```
game_id
```

---

禁止：

孤立内容。

---

# 8. Markdown内容规范

攻略内容统一：

Markdown。

格式：

```
# 标题


## 简介


## 攻略流程


## 注意事项


## 相关链接

```

---

# 9. AI生成内容规则

AI生成内容：

不能直接发布。

流程：

```
AI生成

↓

draft

↓

人工审核

↓

published
```

---

# 10. Prompt管理规范

所有Prompt保存：

```
prompts/
```

例如：

```
prompts/

game-summary.md

guide-generator.md

seo-writer.md

content-review.md
```

---

禁止：

Prompt散落在代码。

---

# 11. 文件命名规范

## React组件

PascalCase:

正确：

```
GameCard.tsx
```

错误：

```
gamecard.tsx
```

---

## 工具文件

camelCase:

```
supabaseClient.ts

seoHelper.ts
```

---

## 页面目录

小写：

```
games

guides
```

---

# 12. TypeScript规范

禁止：

大量使用：

```typescript
any
```

必须：

定义：

```typescript
interface
```

例如：

```typescript
interface Game {

id:string;

name:string;

}
```

---

# 13. API规则

所有API：

返回统一结构。

成功：

```json
{
"success":true,
"data":{}
}
```

失败：

```json
{
"success":false,
"error":"message"
}
```

---

# 14. 错误处理规范

所有外部服务：

必须处理异常。

例如：

AI API

数据库

爬虫

不能：

直接崩溃。

---

# 15. AI功能规则

调用AI必须：

记录：

```
ai_generations
```

保存：

* prompt
* model
* output
* 时间

方便：

重新生成。

---

# 16. 爬虫规则

爬虫：

必须独立。

目录：

```
crawler/
```

每个来源：

独立文件。

例如：

```
crawler/

steam.py

official.py

media.py

```

---

禁止：

爬虫代码混入网站。

---

# 17. SEO规则

所有公开页面：

必须：

## 有唯一URL

例如：

正确：

```
/games/final-fantasy-6
```

错误：

```
/game?id=123
```

---

## 有结构化数据

支持：

```
Game

Article

Breadcrumb
```

---

# 18. 性能规则

优先：

Server Component。

减少：

Client Component。

图片：

必须：

Next/Image。

---

# 19. Git规则

提交信息：

清晰。

例如：

```
feat: add game detail page

fix: repair SEO metadata

docs: update database schema
```

---

# 20. 文档规则

项目必须保持：

```
docs/

project-spec.md

database-schema.md

content-strategy.md

ai-agent-rules.md
```

任何重大变化：

同步更新。

---

# 21. AI禁止行为

AI禁止：

## 1.

未经确认修改数据库结构。

---

## 2.

删除已有页面。

---

## 3.

大规模重构。

---

## 4.

引入大型依赖。

---

## 5.

生成未经验证的数据。

---

# 22. 功能完成标准

一个功能完成：

必须满足：

代码：

✅ 编译通过

页面：

✅ 可以访问

数据库：

✅ 数据正确

SEO：

✅ Metadata存在

文档：

✅ 已更新

---

# 23. 项目长期维护规则

每个月：

检查：

* 页面性能
* SEO情况
* 数据增长
* 无效链接

每季度：

优化：

* 数据结构
* AI流程
* 内容质量

---

# 最终原则

AI负责：

速度。

人负责：

方向。

数据库负责：

资产。

内容负责：

价值。

这个项目最终不是代码产品。

而是：

```
AI驱动的中文经典游戏知识数据库
```

END
