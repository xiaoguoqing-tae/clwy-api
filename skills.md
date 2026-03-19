# 角色

你是一位经验丰富的node.js后端开发工程师，精通mysql数据库设计，熟悉 sequelize ORM 框架，精通express框架

# 任务

写一个基于express框架的node.js后端接口，使用sequelize ORM 框架连接mysql数据库，docker部署，实现用户管理、文章管理、课程管理、分类管理、系统设置管理等功能。

# 数据库设计

## 用户表

- id: int(11) unsigned auto_increment primary key
- email: varchar(255) not null unique
- username: varchar(255) not null unique
- password: varchar(255) not null
- nickname: varchar(255) not null
- sex: int(11) not null
- role: int(11) not null
- avatar: varchar(255) not null
- createdAt: datetime not null
- updatedAt: datetime not null

## 文章表

- id: int(11) unsigned auto_increment primary key
- title: varchar(255) not null
- content: text not null
- createdAt: datetime not null
- updatedAt: datetime not null

## 课程表

- id: int(11) unsigned auto_increment primary key
- categoryId: int(11) unsigned not null
- userId: int(11) unsigned not null
- name: varchar(255) not null
- recommended: tinyint(1) not null
- introductory: tinyint(1) not null
- createdAt: datetime not null
- updatedAt: datetime not null

## 分类表

- id: int(11) unsigned auto_increment primary key
- name: varchar(255) not null
- rank: int(11) unsigned not null
- createdAt: datetime not null
- updatedAt: datetime not null

## 系统设置表

- id: int(11) unsigned auto_increment primary key
- name: varchar(255) not null
- icp: varchar(255) not null
- copyright: varchar(255) not null
- createdAt: datetime not null
- updatedAt: datetime not null

# docker安装mysql

1、新建一个文件，叫做docker-compose.yml
2、在文件中输入以下内容：

```yaml
services:
  mysql:
    image: mysql:8.3.0
    command: --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
    environment:
      - MYSQL_ROOT_PASSWORD=clwy1234
      - MYSQL_LOWER_CASE_TABLE_NAMES=0
    ports:
      - "3306:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
```

3、在终端输入以下内容：

```bash
docker-compose up -d
```

# Sequelize ORM 的使用

1、安装sequelize ORM

```bash
npm install sequelize sequelize-cli mysql2
```

2、初始化sequelize ORM

```bash
npx sequelize-cli init
```

# 数据库配置 config.json

```json
{
  "development": {
    "username": "root",
    "password": "clwy1234",
    "database": "clwy_api_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "clwy_api_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "clwy_api_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  }
}
```

# 新建模型

按表格新建对应模型，例：

```bash
sequelize model:generate --name Article --attributes title:string,content:text
```

# 迁移模型

```bash
sequelize db:migrate
```

# 种子文件

按表格新建对应种子文件，例：

```bash
sequelize db:seed:generate --name user
```

# 种子文件中新建模拟数据

# 运行种子文件

```bash
sequelize db:seed:run
```

# 修改模型（增加校验）

# 创建router路由文件并进行接口编写
