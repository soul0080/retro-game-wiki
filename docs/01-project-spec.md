# Retro Game Wiki 游戏百科站项目设计文档

版本：v1.0
项目类型：个人运营型游戏百科 / 攻略 Wiki / 模拟器资料站
目标：通过 AI 辅助开发，建立一个中文经典游戏资料库，并通过 SEO + 广告实现长期流量变现。

---

# 1. 项目概述

## 1.1 项目定位

本项目不是游戏新闻站，而是：

> 面向中文玩家的经典游戏知识库，提供 PC、主机、掌机平台的游戏资料、攻略 Wiki、模拟器教程和怀旧游戏专题内容。

核心方向：

* 怀旧游戏
* 模拟器玩家
* RPG攻略
* 经典主机游戏资料
* 游戏长期搜索流量

---

# 2. 用户定位

## 用户群体

### 用户1：怀旧玩家

年龄：

25-45岁

需求：

* 找小时候玩过的游戏资料
* 查看攻略
* 查秘籍
* 找隐藏内容

搜索关键词：

* FC魂斗罗攻略
* 最终幻想6攻略
* GBA火焰纹章攻略

---

### 用户2：年轻玩家

需求：

* 了解经典游戏
* 使用模拟器体验老游戏
* 寻找推荐作品

---

### 用户3：收藏玩家

需求：

* 游戏历史资料
* 平台信息
* 完美攻略
* 隐藏内容

---

# 3. 产品核心原则

## 3.1 内容优先

网站核心资产：

不是新闻。

而是：

```
游戏页面
+
攻略页面
+
数据库资料
+
模拟器教程
```

---

## 3.2 SEO优先

所有页面需要考虑：

* 搜索关键词
* 页面标题
* Meta Description
* 结构化数据
* 内链

---

# 4. 技术方案

## 4.1 总体技术架构

采用：

```
Frontend
    |
Next.js
    |
Supabase
    |
PostgreSQL

Storage

Analytics
```

---

# 5. 技术栈选择

## 前端

### Next.js

用途：

* 网站页面
* SEO
* SSR
* 静态生成

技术：

```
Next.js 15+
TypeScript
React
Tailwind CSS
shadcn/ui
```

---

## 后端

初期不独立部署后端。

使用：

```
Next.js Server Actions
+
Supabase API
```

原因：

降低 AI Coding 复杂度。

---

## 数据库

使用：

Supabase PostgreSQL

原因：

* 免费起步
* 可扩展
* 自带后台
* 支持 JSONB

---

## 文件存储

Supabase Storage

保存：

```
游戏封面

攻略图片

地图图片

截图
```

---

## 搜索

第一阶段：

PostgreSQL Full Text Search

第二阶段：

Elasticsearch

---

## 缓存

Redis：

后期使用。

用途：

* 热门页面缓存

---

# 6. 项目目录结构

```
retro-game-wiki/

├── app/
│
│   ├── page.tsx
│   │
│   ├── games/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │        └── page.tsx
│   │
│   ├── guides/
│   │   └── [slug]/
│   │
│   ├── emulator/
│   │
│   ├── topics/
│   │
│   ├── news/
│   │
│   └── admin/
│
├── components/
│
├── lib/
│
├── database/
│
└── docs/

```

---

# 7. 网站结构设计

## 首页

Route:

```
/
```

模块：

```
搜索框

热门游戏

游戏平台入口

热门攻略

模拟器教程

专题推荐

最新更新内容
```

---

# 游戏库

Route:

```
/games
```

功能：

展示所有游戏。

筛选：

```
平台

年份

类型

厂商
```

---

# 游戏详情页

Route:

```
/games/[slug]
```

示例：

```
/games/final-fantasy-6
```

页面结构：

```
游戏标题

基本信息

游戏简介

攻略目录

角色资料

装备资料

秘籍

模拟器教程

相关文章
```

---

# 攻略页面

Route:

```
/guides/[slug]
```

示例：

```
/guides/final-fantasy-6-world-of-ruin
```

结构：

```
标题

正文

章节导航

相关游戏

相关推荐
```

---

# 平台页面

Route:

```
/platform/[slug]
```

示例：

```
/platform/gba
```

内容：

```
GBA游戏列表

热门攻略

模拟器教程
```

---

# 模拟器专区

Route:

```
/emulator
```

分类：

```
PS1模拟器

GBA模拟器

NDS模拟器

RetroArch教程
```

---

# 专题页面

Route:

```
/topics/[slug]
```

示例：

```
/topics/best-sfc-rpg
```

用途：

SEO流量入口。

---

# 8. 数据库设计

## games 游戏表

> **设计修订 v1.1**：移除 `platform_id`（改用 game_platforms 多对多）、`genre`（改用 game_genres 多对多）、`seo_title`/`seo_description`（统一用 seo_metadata 表）。详见 [02-database-schema.md](02-database-schema.md)。

字段：

```
id

name_cn

name_en

name_jp

slug

release_year

developer

publisher

region

description

story_summary

cover_url

banner_url

status

created_at

updated_at
```

---

## platforms 平台表

```
id

name

manufacturer

release_year

description
```

---

## guides 攻略表

> **设计修订 v1.1**：移除 `seo_title`/`seo_description`，统一用 seo_metadata 表。`type` 改名为 `guide_type`，详见 [02-database-schema.md](02-database-schema.md)。

```
id

game_id

title

slug

guide_type

summary

content

difficulty

is_featured

status

created_at

updated_at
```

type:

```
流程攻略

Boss攻略

秘籍

隐藏内容

收集攻略
```

---

## characters 角色表

```
id

game_id

name

description

join_method

skills
```

---

## items 道具表

```
id

game_id

name

type

effect

location
```

---

## cheats 秘籍表

```
id

game_id

platform

code

description
```

---

## emulator_guides 模拟器教程

```
id

platform_id

title

content

recommended_emulator

settings
```

---

# 9. AI内容生产系统（已移除）

> AI 内容生产改为使用本地 AI 工具（如 CC、trae）辅助，不再内置 AI 功能模块。

---

# 10. 爬虫系统（已移除）

> 内容抓取与整理改为使用本地 AI 工具辅助，不再内置爬虫系统。

---

# 11. 后台管理系统

Route:

```
/admin
```

功能：

## 游戏管理

```
新增游戏

编辑资料

上传封面
```

---

## 内容管理

```
攻略编辑

发布审核
```

---

## SEO管理

```
Title

Description

关键词

Sitemap
```

---

# 12. SEO方案

## URL规则

必须语义化。

正确：

```
/games/final-fantasy-6

/guides/final-fantasy-6-hidden-items
```

避免：

```
?id=123
```

---

## Meta模板

游戏：

```
{游戏名}攻略大全 - {平台}完整流程攻略
```

攻略：

```
{游戏名}{攻略关键词}详细说明
```

---

# 13. Sitemap

自动生成：

```
/sitemap.xml
```

包含：

```
游戏页面

攻略页面

平台页面

专题页面
```

---

# 14. 广告方案

主要：

Google AdSense

广告位置：

```
文章顶部

正文中间

页面底部
```

避免：

```
弹窗

强制跳转

大量广告
```

---

# 15. 开发阶段规划

# Phase 1 MVP

> **设计修订 v1.1**：本大阶段对应 [03-ai-coding-roadmap.md](03-ai-coding-roadmap.md) 的细粒度 Phase 0-5 + 8 + 11。

目标：

上线基础网站。

完成：

* Next.js项目
* Supabase数据库
* 首页
* 游戏列表
* 游戏详情页
* 攻略页面
* 后台编辑
* SEO 基础（Metadata + Sitemap + Schema）
* 部署上线

---

# Phase 2 内容系统

> 对应 roadmap Phase 6（AI 内容生产已移除，改用本地 AI 工具辅助）

增加：

* 批量导入
* SEO优化
* Sitemap

---

# Phase 3 自动化

> 对应 roadmap Phase 7（爬虫系统已移除，改用本地 AI 工具辅助）

增加：

* 内容更新流程

---

# Phase 4 商业化

> 对应 roadmap Phase 9-10

增加：

* 广告
* 联盟推荐
* 数据分析

---

# 16. AI Coding开发规则

每次开发遵循：

## 规则1

先分析，不直接修改。

Prompt:

```
请先分析当前项目结构。
不要修改代码。
告诉我实现方案和影响文件。
```

---

## 规则2

小功能迭代。

不要：

```
一次开发整个网站
```

应该：

```
完成游戏列表

↓

完成详情页

↓

完成攻略页
```

---

## 规则3

保持文档同步。

每次重大修改：

更新：

```
docs/project.md
```

---

# 17. MVP成功标准

> **设计修订 v1.1**：原"100 游戏 / 500 攻略"与 [06-mvp-content-list.md](06-mvp-content-list.md) §8 的"10 旗舰优先"冲突。现统一为分阶段目标。

MVP 分两步达成：

## 第一步：旗舰上线（首个可发布版本）

```
10个旗舰游戏页面

每游戏 ≥ 5 篇攻略（共 50+ 篇）

5个核心平台分类（FC/SFC/GBA/PS1/PSP-NDS）

完整SEO（Metadata + Sitemap + Schema）

后台CMS可用
```

> 10 个旗舰游戏清单见 [06-mvp-content-list.md](06-mvp-content-list.md) §9

## 第二步：MVP 完整版

```
100个游戏页面

500个攻略页面

10个平台分类

完整SEO

广告接口
```

> 第一步是 MVP 上线的最低标准，第二步是 Phase 1 大阶段的完整目标。

---

# 18. 长期目标

最终形成：

```
中文最大的经典游戏攻略数据库

+

模拟器知识库
```

---

END
