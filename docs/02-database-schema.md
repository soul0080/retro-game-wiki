# Retro Game Wiki 数据库设计文档

版本：v1.0

数据库：

PostgreSQL (Supabase)

设计目标：

建立一个可长期扩展的经典游戏知识数据库。

核心思想：

游戏是中心实体。

所有内容围绕：

游戏(Game)

↓

攻略(Guide)

↓

资料(Entity)

展开。

---

# 1. 数据关系总览

```
Platform
    |
    |
Game
    |
    |------------------
    |        |        |
 Guide  Character   Item
    |
    |
 Section


Game
 |
 |------ Cheat

Game
 |
 |------ Emulator Guide


Game
 |
 |------ Media


Game
 |
 |------ SEO Metadata

```

---

# 2. 数据库命名规范

表名：

使用复数英文。

例如：

正确：

```
games

guides

platforms
```

字段：

snake_case

例如：

```
release_year

created_at
```

主键：

统一：

```
id UUID
```

时间：

统一：

```
created_at

updated_at
```

---

# 3. platforms 平台表

用途：

存储游戏平台。

例如：

FC

SFC

GBA

PS1

PSP

## Schema

```sql
platforms

id

name

slug

manufacturer

release_year

description

logo_url

created_at

updated_at
```

字段说明：

| 字段           | 说明    |
| ------------ | ----- |
| name         | 中文名称  |
| slug         | URL名称 |
| manufacturer | 厂商    |
| release_year | 发行年份  |
| description  | 介绍    |
| logo_url     | 图片    |

示例：

```json
{
"name":"超级任天堂",
"slug":"sfc",
"manufacturer":"Nintendo",
"release_year":1990
}
```

---

# 4. games 游戏主表

核心表。

一个游戏对应：

多个攻略

多个角色

多个道具

多个秘籍

## Schema

```sql
games


id

name_cn

name_en

name_jp

slug


platform_id


genre


release_year


developer


publisher


region


description


story_summary


cover_url


banner_url


status


seo_title


seo_description


created_at

updated_at

```

---

## 示例

```json
{
"name_cn":"最终幻想6",

"name_en":"Final Fantasy VI",

"slug":"final-fantasy-6",

"release_year":1994,

"genre":"RPG"
}
```

---

# 5. game_platforms 游戏与平台关系

原因：

一个游戏可能：

SFC

PS1

GBA

都有版本。

不要使用：

game.platform_id

改为：

多对多。

## Schema

```sql
game_platforms


id

game_id

platform_id

release_date

region

version_note
```

例如：

最终幻想6：

```
SFC

PS

GBA

```

---

# 6. genres 游戏类型表

## Schema

```sql
genres


id

name

slug

description
```

例如：

```
RPG

ACT

SLG

ADV
```

---

# 7. game_genres

多对多。

```sql
game_genres


id

game_id

genre_id
```

---

# 8. guides 攻略表

核心SEO内容。

## Schema

```sql
guides


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


seo_title


seo_description


created_at


updated_at
```

---

guide_type:

```
main_story

boss

sidequest

item

secret

character

ending

```

---

content：

建议：

Markdown格式。

例如：

```markdown
# 世界崩坏后攻略


## 第一阶段

内容...


## Boss打法

内容...
```

---

# 9. guide_sections 攻略章节表

用于大型攻略。

例如：

最终幻想6完整攻略：

100个章节。

## Schema

```sql
guide_sections


id

guide_id

title

order_number

content
```

---

# 10. characters 角色表

## Schema

```sql
characters


id


game_id


name


nickname


description


join_method


skills


image_url


```

---

# 11. bosses Boss表

## Schema

```sql
bosses


id


game_id


name


description


hp


weakness


strategy


drops


image_url

```

---

# 12. items 道具表

## Schema

```sql
items


id


game_id


name


type


description


effect


location


rarity


image_url

```

type:

```
weapon

armor

magic

item

accessory
```

---

# 13. cheats 秘籍表

## Schema

```sql
cheats


id


game_id


platform_id


title


code


description

```

例如：

金手指：

```
999金币

无敌模式

```

---

# 14. emulator_guides 模拟器教程表

## Schema

```sql
emulator_guides


id


platform_id


title


software


content


recommended_setting


created_at

```

例如：

```
GBA模拟器设置教程
```

---

# 15. media 图片资源表

统一管理图片。

## Schema

```sql
media


id


entity_type


entity_id


url


alt_text


type


created_at

```

entity_type:

```
game

character

item

boss
```

---

# 16. news 新闻表

新闻独立。

不进入Wiki。

## Schema

```sql
news


id


title


slug


source


source_url


summary


content


cover_url


related_game_id


published_at


created_at

```

---

# 17. tags 标签系统

用于专题。

## tags

```sql
tags


id

name

slug
```

例如：

```
经典RPG

童年游戏

冷门神作
```

---

# game_tags

```sql
game_tags


id

game_id

tag_id
```

---

# 18. SEO 表

统一SEO管理。

## seo_metadata

```sql
seo_metadata


id


entity_type


entity_id


title


description


keywords


canonical_url

```

支持：

游戏

攻略

专题。

---

# 19. admin 管理

因为单用户。

不需要复杂权限。

## admin_settings

```sql
admin_settings


id


key


value

```

保存：

网站名称

广告代码

统计代码

---

# 20. AI生成记录

非常重要。

记录AI生产内容。

## ai_generations

```sql
ai_generations


id


entity_type


entity_id


prompt


model


output


status


created_at

```

用途：

查看：

AI生成历史。

方便重新生成。

---

# 21. 内容状态设计

所有内容统一：

```
draft

review

published

archived
```

流程：

```
AI生成

↓

draft

↓

人工检查

↓

published

```

---

# 22. 搜索设计

第一阶段：

PostgreSQL。

增加字段：

games:

```
search_vector
```

guides:

```
search_vector
```

使用：

PostgreSQL Full Text Search。

---

# 23. 初始数据量规划

MVP:

```
游戏平台:
20


游戏:
100


攻略:
500


角色:
1000


道具:
3000

```

设计可以支持：

```
游戏:
10000+

页面:
百万级
```

---

# 24. 数据扩展方向

未来增加：

## builds

角色Build。

## maps

地图。

## quests

任务系统。

## achievements

成就。

## walkthrough_steps

流程步骤。

## user_comments

用户评论。

---

# 数据库设计原则总结

1. Game 是核心实体。

2. 内容全部结构化。

3. 攻略使用 Markdown。

4. AI生成必须记录。

5. SEO字段每个实体都有。

6. 不为当前需求过度设计。

7. 保证未来扩展。

END
