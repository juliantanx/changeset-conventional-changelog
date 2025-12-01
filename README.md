# Changeset Conventional Changelog

这个仓库提供了使用 [Changeset](https://github.com/changesets/changesets) 结合自定义配置生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的变更日志的解决方案。

## 功能特性

- 自动从 Git 提交历史中提取符合 Conventional Commits 规范的提交
- 将提交按类型分组（Features、Bug Fixes、Chores、Documentation 等）
- 生成带有提交作者、哈希链接的格式化变更日志
- 支持版本对比链接生成
- 自定义的 changelog 生成逻辑

## 项目结构

```
├── .changeset/
│   ├── README.md           # Changeset 使用说明
│   ├── changelog.cjs       # 自定义 changelog 生成逻辑
│   └── config.json         # Changeset 配置
├── .gitignore
└── README.md              # 项目说明文档
```

## 配置说明

### Changeset 配置 (`config.json`)

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": ["./changelog.cjs", {}],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "packages": ["packages/*"]
}
```

主要配置项说明：
- `changelog`: 指定使用自定义的 changelog 生成器
- `baseBranch`: 设置基础分支为 main
- `packages`: 定义要管理的包路径

### 自定义 Changelog 生成器 (`changelog.cjs`)

自定义的 changelog 生成器实现了以下核心功能：

1. **获取 Git 标签信息**：自动获取最新的两个标签用于版本对比
2. **提交筛选**：仅提取符合 Conventional Commits 格式的提交
3. **提交分组**：将提交按类型（feat、fix、chore、docs 等）分类
4. **格式化输出**：生成带有提交链接和作者信息的 Markdown 格式

## 安装与使用

### 安装依赖

```bash
npm install --save-dev @changesets/cli
```

### 初始化

如果还没有初始化 Changeset：

```bash
npx changeset init
```

### 使用自定义 Changelog 配置

1. 将本仓库的 `.changeset/changelog.cjs` 和 `.changeset/config.json` 复制到你的项目中
2. 根据你的项目需要修改 `changelog.cjs` 中的 `repoUrl` 变量为你的仓库地址

### 常用命令

#### 添加变更集

```bash
npx changeset
```

#### 版本化并更新变更日志

```bash
npx changeset version
```

#### 发布版本

```bash
npx changeset publish
```

## Conventional Commits 格式

本项目遵循 Conventional Commits 规范，提交消息格式如下：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

支持的提交类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `chore`: 构建过程或辅助工具变动
- `docs`: 文档更新
- `refactor`: 代码重构，不引入新功能或修复 bug
- `perf`: 性能优化
- `test`: 测试相关

## 示例变更日志

使用此配置生成的变更日志示例：

```markdown
## [1.2.0](https://github.com/example/repo/compare/v1.1.0...v1.2.0) (2023-07-15)

### Features
- feat: 添加用户认证功能 ([a1b2c3d](https://github.com/example/repo/commit/a1b2c3d)) - 张三
- feat(api): 新增数据查询接口 ([d4e5f6g](https://github.com/example/repo/commit/d4e5f6g)) - 李四

### Bug Fixes
- fix: 修复登录页面的样式问题 ([g7h8i9j](https://github.com/example/repo/commit/g7h8i9j)) - 王五

### Documentation
- docs: 更新 API 文档 ([j0k1l2m](https://github.com/example/repo/commit/j0k1l2m)) - 赵六

### Dependencies
- package-name
```

## 注意事项

1. 请确保修改 `changelog.cjs` 中的 `repoUrl` 变量为你的实际仓库地址
2. 项目使用的 Git 仓库需要正确配置，以便能够获取标签和提交历史
3. 提交消息请严格遵循 Conventional Commits 规范，以确保变更日志正确生成

## License

MIT