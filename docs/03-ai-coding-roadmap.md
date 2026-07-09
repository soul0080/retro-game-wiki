# Retro Game Wiki AI Coding 开发路线图

版本：v1.0

适用工具：

* Cursor
* Windsurf
* Claude Code
* GitHub Copilot

目标：

通过 AI 辅助开发，逐步建立一个中文经典游戏攻略百科网站。

---

# 0. 开发原则

## 0.1 不一次性生成整个项目

禁止：

```
帮我开发一个完整游戏百科网站
```

原因：

AI容易：

* 架构混乱
* 文件重复
* 数据模型失控

正确方式：

拆成：

```
基础架构

↓

核心页面

↓

数据系统

↓

后台

↓

AI功能

↓

自动化
```

---

# 0.2 每次开发流程

每个功能：

## Step 1

让AI分析：

Prompt:

```
请先分析当前项目结构。

不要修改代码。

告诉我：
1. 当前架构
2. 需要修改的文件
3. 是否会影响已有功能
4. 推荐实现方案
```

---

## Step 2

确认方案。

---

## Step 3

执行开发。

Prompt:

```
按照刚才方案实现。

要求：
1. 保持现有代码结构
2. 不删除已有功能
3. 添加必要注释
4. 更新相关文档
```

---

## Step 4

测试。

Prompt:

```
请检查：
1. 是否存在TypeScript错误
2. 是否影响SEO
3. 是否影响已有页面
4. 给出测试结果
```

---

# Phase 0 项目初始化

目标：

建立稳定开发环境。

---

## 技术初始化

创建：

```
Next.js

TypeScript

Tailwind

Supabase

Git
```

---

## 项目结构

最终：

```
retro-game-wiki

app/

components/

lib/

types/

hooks/

supabase/

public/

docs/

prompts/

```

---

## AI Prompt

```
创建一个Next.js 15项目。

要求：

TypeScript

App Router

Tailwind CSS

ESLint

项目结构适合长期维护。

创建docs目录保存项目文档。
```

---

## 验收

完成：

* 项目启动成功
* 首页显示
* Git初始化

---

# Phase 1 数据库建设

目标：

建立游戏知识库基础。

---

创建：

Supabase项目。

执行：

数据库Migration。

---

建立表：

```
platforms

games

guides

characters

items

bosses

news

seo_metadata
```

---

创建：

TypeScript类型：

```
types/database.ts
```

---

AI Prompt:

```
根据docs/database-schema.md。

创建Supabase数据库migration。

要求：

1. 所有表包含created_at和updated_at
2. 使用UUID主键
3. 创建必要外键
4. 创建索引
```

---

验收：

Supabase中：

可以看到所有表。

---

# Phase 2 网站基础框架

目标：

完成网站骨架。

---

创建Layout。

包含：

```
Header

Navigation

Footer
```

---

导航：

```
首页

游戏库

攻略

模拟器

专题
```

---

页面：

```
/

 /games

 /guides

 /emulator

 /topics
```

---

AI Prompt:

```
创建网站基础Layout。

要求：

SEO友好。

支持移动端。

组件拆分。

不要把所有代码写在page.tsx。
```

---

验收：

所有路由正常打开。

---

# Phase 3 游戏库系统

目标：

实现第一个核心功能。

---

功能：

## 游戏列表

Route:

```
/games
```

支持：

* 分页
* 平台筛选
* 类型筛选

---

## 游戏详情

Route:

```
/games/[slug]
```

展示：

```
封面

简介

平台

年份

攻略列表

角色

Boss
```

---

组件：

```
GameCard

GameInfo

GuideList

PlatformBadge
```

---

AI Prompt:

```
实现游戏库系统。

数据来源Supabase。

要求：

Server Component优先。

页面支持SEO。

生成动态metadata。
```

---

验收：

新增一个游戏后：

自动生成页面。

---

# Phase 4 攻略Wiki系统

目标：

建立核心流量页面。

---

数据：

guides表。

---

页面：

```
/guides/[slug]
```

---

功能：

Markdown渲染。

支持：

```
标题

目录

代码块

图片

引用
```

---

推荐：

安装：

```
react-markdown

remark-gfm
```

---

AI Prompt:

```
开发攻略Wiki页面。

要求：

支持Markdown。

自动生成目录。

优化阅读体验。

SEO友好。
```

---

验收：

可以发布：

一篇完整攻略。

---

# Phase 5 后台CMS

目标：

自己管理内容。

---

Route:

```
/admin
```

---

功能：

## 游戏管理

```
新增

修改

删除

上传封面
```

---

## 攻略管理

```
创建攻略

Markdown编辑

发布状态
```

---

## AI工具入口

```
生成内容

重新生成

优化SEO
```

---

AI Prompt:

```
开发管理员后台。

只有管理员使用。

不需要复杂权限。

重点：

内容管理效率。
```

---

# Phase 6 AI内容生产系统

目标：

建立内容生产能力。

---

流程：

```
输入游戏名称

↓

AI生成资料

↓

保存草稿

↓

人工审核

↓

发布
```

---

创建：

```
/ai

services/ai.ts

prompts/
```

---

Prompt文件：

```
game-summary.md

guide-generator.md

seo-generator.md
```

---

AI Prompt:

```
实现AI内容生成模块。

要求：

所有AI请求记录到ai_generations表。

支持重新生成。

不要直接覆盖已发布内容。
```

---

验收：

可以：

输入游戏名

生成草稿。

---

# Phase 7 爬虫系统

目标：

自动收集资料。

---

单独目录：

```
crawler/

```

---

第一批：

```
官方新闻

Steam新闻

游戏资料网站
```

---

流程：

```
抓取

↓

清洗

↓

AI整理

↓

数据库

```

---

注意：

不要直接自动发布。

必须：

```
draft
```

状态。

---

AI Prompt:

```
创建Python爬虫服务。

要求：

模块化。

每个来源独立。

保存抓取日志。
```

---

# Phase 8 SEO优化

目标：

获得搜索流量。

---

实现：

## Metadata

所有页面：

```
title

description

keywords
```

---

## Sitemap

生成：

```
/sitemap.xml
```

---

## Robots

生成：

```
robots.txt
```

---

## Schema.org

添加：

Game

Article

Breadcrumb

---

AI Prompt:

```
优化整个网站SEO。

要求：

符合Google SEO最佳实践。

不要使用黑帽SEO。
```

---

# Phase 9 广告系统

目标：

商业化。

---

增加：

广告组件。

目录：

```
components/ads
```

---

组件：

```
TopAd

ArticleAd

SidebarAd

FooterAd
```

---

后台配置：

```
广告代码

开关状态

位置
```

---

AI Prompt:

```
设计广告组件系统。

要求：

不影响页面体验。

支持未来接入多个广告平台。
```

---

# Phase 10 数据分析

安装：

Google Analytics。

统计：

```
访问量

热门游戏

热门攻略

搜索关键词
```

---

# Phase 11 部署上线

推荐：

## Frontend

Vercel

## Database

Supabase

## Storage

Supabase Storage

## Domain

Cloudflare

---

部署流程：

```
GitHub

↓

Vercel

↓

自动部署

```

---

# MVP最终目标

上线版本：

包含：

## 游戏

100个

## 攻略

500篇

## 平台

10个平台

## 功能

完成：

✅ 游戏库

✅ Wiki攻略

✅ 搜索

✅ SEO

✅ 后台管理

✅ AI辅助生成

✅ 广告接口

---

# 后续版本

## V2

增加：

```
地图系统

任务系统

装备数据库

Build系统

游戏评分
```

---

## V3

增加：

```
AI游戏助手

用户收藏

社区评论

账号系统
```

---

# AI开发总原则

1. 永远先分析再修改。

2. 小功能提交。

3. 保持数据库稳定。

4. 不为了炫技引入复杂技术。

5. 内容资产优先于代码。

最终目标：

建立：

```
AI驱动的中文经典游戏知识数据库
```

END
