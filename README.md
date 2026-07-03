# PPT Brief Builder

这是一个静态单页网页，用来按步骤填写信息、选择风格，并生成最终输出内容。

## 本地运行

```bash
python3 -m http.server 4173
```

然后打开 [http://localhost:4173](http://localhost:4173)。

## 当前功能

- 4 步向导式填写
- 风格选项选择
- 最终输出内容生成
- 复制输出内容
- 自动保存最近一次填写状态

## GitHub 自动同步

运行下面的启动脚本后，会在当前用户会话里常驻一个后台同步进程，每 30 秒检查一次当前仓库。

```bash
./scripts/install-github-auto-sync.sh
```

如果检测到改动，脚本会自动执行提交并推送到当前分支。

停止自动同步：

```bash
./scripts/uninstall-github-auto-sync.sh
```

## 主要文件

- [index.html](/Users/luqiling/Documents/gzl/index.html)
- [css/style.css](/Users/luqiling/Documents/gzl/css/style.css)
- [js/main.js](/Users/luqiling/Documents/gzl/js/main.js)
