# chlog

> Generate a clean [Keep a Changelog](https://keepachangelog.com)-style `CHANGELOG.md` straight from your conventional commits and git tags. **Zero dependencies. Zero AI.**

Stop hand-maintaining a changelog. If you write
[Conventional Commits](https://www.conventionalcommits.org)
(`feat:`, `fix:`, `feat(scope)!:` …), `chlog` reads your git history, groups
commits by type, splits them by version using your tags, links every entry back
to its commit, and writes the file.

```markdown
## [Unreleased]

### Features

- **cli:** add --json output ([`5889725`](https://github.com/you/repo/commit/5889725…))

### Bug Fixes

- crash on empty repository ([`a272d4d`](https://github.com/you/repo/commit/a272d4d…))
```

## Install

```bash
npm install -g chlog-cli
# or once:
npx chlog-cli --write
```

## Usage

```bash
chlog [path] [options]
```

| Option | Description |
| --- | --- |
| `--write` | Write `CHANGELOG.md` in the target directory |
| `--unreleased` | Only the commits since your latest tag (next release notes) |
| `--hide-other` | Drop commits that don't follow the conventional format |
| `--json` | Structured JSON (feed your own templates / release tooling) |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

### Examples

```bash
chlog --write              # (re)generate the whole CHANGELOG.md
chlog --unreleased         # preview the next release's notes
chlog --json | jq '.[0]'   # programmatic access to the latest section
```

## What it understands

- **Types** → headings: `feat` → Features, `fix` → Bug Fixes, plus `perf`,
  `refactor`, `docs`, `build`, `ci`, `test`, `style`, `chore`, `revert`.
- **Scopes** → `fix(api): …` renders as **api:** ….
- **Breaking changes** → `feat!:` or `feat(x)!:` are collected under a
  prominent **⚠ BREAKING CHANGES** section.
- **Tags** → each annotated/lightweight tag starts a new version section, dated
  from the tag.
- **Commit links** → auto-detected from your `origin` remote (GitHub/GitLab/etc).

Non-conventional commits aren't lost — they land under **Other** (or hide them
with `--hide-other`).

## Development

```bash
git clone https://github.com/bobfromarcher/chlog
cd chlog
node test/test.js
```

CI runs the suite on Node 18/20/22 across Linux, macOS and Windows.

## License

MIT © bobfromarcher
