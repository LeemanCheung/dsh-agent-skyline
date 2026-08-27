# Publish `dsh-agent-skyline` to GitHub

The delivery Git bundle contains the complete `main` branch, the v1.0.0 source commit, and the annotated `v1.0.0` tag. The commands below create the public repository, push the branch and tag, enable the interactive demo, add discovery metadata, and publish the first release.

## From the Git bundle

```bash
git clone dsh-agent-skyline-v1.0.0.bundle dsh-agent-skyline
cd dsh-agent-skyline

gh repo create LeemanCheung/dsh-agent-skyline \
  --public \
  --source=. \
  --remote=origin \
  --push \
  --description "Turn every DeepSeek Harness Agent session into a private, animated, shareable developer city."

git push origin v1.0.0
```

## Repository metadata and interactive demo

```bash
gh repo edit LeemanCheung/dsh-agent-skyline \
  --homepage "https://leemancheung.github.io/dsh-agent-skyline/" \
  --add-topic dsh-plugin \
  --add-topic deepseek-harness \
  --add-topic agent \
  --add-topic generative-art \
  --add-topic developer-tools \
  --add-topic visualization \
  --add-topic local-first \
  --add-topic privacy \
  --add-topic gamification

# Create the Pages site with a custom GitHub Actions workflow.
gh api -X POST repos/LeemanCheung/dsh-agent-skyline/pages -f build_type=workflow
```

The committed `.github/workflows/pages.yml` validates the package and deploys `demo/`. If the Pages site already exists, set **Settings → Pages → Build and deployment → GitHub Actions** instead of rerunning the POST command.

Upload `docs/social-preview.png` as the repository Social Preview in **Settings → General → Social preview**.

## Release v1.0.0

```bash
gh release create v1.0.0 \
  docs/preview.png \
  docs/construction.gif \
  docs/social-preview.png \
  --title "v1.0.0 — Your Agent session is now a city" \
  --notes-file docs/release-notes-v1.0.0.md
```

## Final installation verification

```bash
dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.0.0"
dsh --profile web --dump-config > /dev/null && echo "bundle composed"
npx @deepseek-ai/dsh web
```

Open **Settings → Plugins**, confirm `dsh-agent-skyline` is active, then open a Session and select **Agent Skyline** in the conversation header. Verify Session / Today / Last 7 days / All history, construction replay, PNG, SVG, caption copying, and the English/Chinese locale.
