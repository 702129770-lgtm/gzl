# PPT 制作助手

这是一个可对外展示的静态单页网页，用来模拟 PPT 制作服务的完整用户流程：资料提交、风格选择、样稿确认、成稿预览和导出下载。

## 线上地址

- GitHub Pages: [https://702129770-lgtm.github.io/gzl/](https://702129770-lgtm.github.io/gzl/)

## 本地运行

```bash
python3 -m http.server 4173
```

然后打开 [http://localhost:4173](http://localhost:4173)。

## 使用范围

- 仅提供桌面网页版，建议使用 1280px 及以上宽度访问
- 当前版本为公开流程预览，不会真实上传用户文件
- 导出按钮会生成用于确认流程的文本预览文件

## 当前功能

- 从首页介绍进入资料提交页
- 填写项目名称、使用场景、目标观众、页数和资料链接
- 自动跳转到风格选择页
- 支持 3 个推荐风格和 1 个自定义风格
- 支持样稿确认、样稿修改、成稿预览和成稿修改
- 导出页提供 PPTX、PDF 和讲稿入口，并生成预览下载文件

## GitHub 上传确认

运行下面的安装脚本后，系统会注册一个后台同步任务，每 30 秒检查一次当前仓库。

```bash
./scripts/install-github-auto-sync.sh
```

如果检测到改动，后台任务只会记录“待上传”状态，不会自动推送。

查看待上传内容：

```bash
./scripts/show-github-upload-status.sh
```

确认后再上传到 GitHub：

```bash
./scripts/confirm-github-upload.sh
```

停止自动同步：

```bash
./scripts/uninstall-github-auto-sync.sh
```

## 对外发布

当前仓库已经接入 GitHub Pages 自动部署。

- 推送到 `main` 分支后，会自动触发 `.github/workflows/deploy-pages.yml`
- 部署完成后，线上地址会更新为当前仓库里的静态网页版本
- 如果需要手动重发，也可以在 GitHub Actions 里运行 `Deploy GitHub Pages`

## 主要文件

- [index.html](index.html)
- [css/style.css](css/style.css)
- [js/main.js](js/main.js)
