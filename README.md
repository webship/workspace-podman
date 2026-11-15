# @webship.co/workspace-podman

Podman for the [Webship Workspace](https://github.com/webship/workspace) dashboard: the **PODMAN**
menu on every project folder that carries a compose file or a Containerfile, with the runtime's verbs as terminal sessions in
the project, the up/down caption and the site link, and "Write a Containerfile skeleton here" when a new folder is made.
A runtime of [`@webship.co/workspace-container`](https://github.com/webship/workspace-container).

A project is a Podman project when it carries a compose file (`compose.yaml`, `docker-compose.yml` and variants: run through `podman compose`) or a `Containerfile`/`Dockerfile` (built and run as one container named after the folder). Podman is rootless and daemonless; the dashboard container needs the podman CLI and the host's socket or a remote connection to act on the host's containers.

## Use it

```bash
cd ~/workspace
bash core/scripts/plugins.sh --require github:webship/workspace-podman
bash core/scripts/plugins.sh --activate podman --with-needs
bash core/scripts/plugins.sh --install podman
```

## The items it carries

The workspace is container-based (DDEV by default). Each item lands in the folder of its kind, when
that folder is an active workspace folder, is listed there like any other item, and is installed
into Claude Code from there:

| What | Lands in | What it is for |
| --- | --- | --- |
| The agent `podman-operator` | `ai-agents/` | Says whether a Podman project is up, starts, stops and restarts it with the commands of the PODMAN menu, and never runs the destroying one on its own |
| The skill `podman-menu` | `ai-skills/` | Which folder is a Podman project, every entry of the PODMAN menu and its `podman` command, the caption, the site link, the New folder option |
| The command `/podman-status` | `ai-commands/` | `/podman-status <project>`: whether it is a Podman project and whether it is up. Read-only |
| The prompt `podman-up-and-check` | `ai-prompts/` | The launch command of a session that starts a Podman project and says whether it came up |

The plugin places no `cmd-*.sh`: every entry of the menu is one `podman` command in the project's folder, and a wrapper would add nothing to it. The item bodies are plain Markdown any AI command-line assistant can follow; Claude Code is the default shape (frontmatter, the launch command of the prompt).

How the items are laid out and checked: [docs/plugin-items-pattern.md](docs/plugin-items-pattern.md).

## What it needs

On the machine this plugin needs `podman` (https://podman.io/docs/installation), and its manifest says so (`needs.commands`). The workspace reports it and never installs it:

```bash
bash core/scripts/plugins.sh --check podman      # found, with its version, or missing, with how to install it
webship-workspace doctor                        # the same for the core and every plugin
```

It also needs the AI folders its items are placed in (`needs`): `ai-agents`, `ai-skills`, `ai-commands` and `ai-prompts`. `--require` says so, `--activate` and `--install` stop until the workspace has them, and `--with-needs` adds what is missing first. A kind whose folder is not an active workspace folder is skipped, and the install says so. It needs no sites folder: its menu is on the project rows of whatever folders the workspace has.

## The verbs

| Verb | Command |
| --- | --- |
| Up | `podman compose up -d` (compose file) or `podman build -t <folder> -f Containerfile . && podman run -d --name <folder> <folder>` (Containerfile) |
| Down | `podman compose down` or `podman rm -f <folder>` |
| Restart | `podman compose restart` or `podman restart <folder>` |
| Status | `podman ps -a --filter name=<folder>` (and `podman compose ps`) |
| Logs | `podman logs -f <folder>` / `podman compose logs -f` |
| Shell | `podman exec -it <folder> sh` / `podman compose exec <service> sh` |
| Build | `podman build -t <folder> .` |
| Pods | `podman pod ps` |

Every verb opens a terminal session in the project folder, so what the CLI prints is what you see,
and a verb that asks a question can be answered.

The `workspacePlugin` block in `package.json` is the manifest the installer reads.

## What the package holds of them

| Path | What it is |
| --- | --- |
| `ai/agents/podman-operator.md` | The agent `podman-operator` |
| `ai/skills/podman-menu/` | The skill `podman-menu` |
| `ai/commands/podman-status.md` | The command `/podman-status` |
| `ai/prompts/podman-up-and-check.md` | The prompt `podman-up-and-check` |
| `tests/items.test.ts` | The shape of every item, and that it names nothing the plugin does not have |
