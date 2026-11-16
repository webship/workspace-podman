---
name: podman-menu
description: Run a project of a Webship Workspace on Podman through the Podman plugin (`@webship.co/workspace-podman`) — which folder is a Podman project, every entry of the PODMAN menu and the `podman` command behind it, the up or down caption, the site link, the option the New folder form offers, and how to check that `podman` is on the machine. Use when asked "is this a Podman project", "what does the PODMAN menu do", "start this project", "why is there no PODMAN menu on this project", "the caption says ?", or when a project of the workspace that carries a compose file or a Containerfile.
argument-hint: '<project>'
---

# podman-menu

Podman for a project of a Webship Workspace (`~/workspace`, container-based, DDEV by default). It
comes with the Podman plugin (`@webship.co/workspace-podman`), a runtime of the container family
(`@webship.co/workspace-container`), like the agent `podman-operator`, the command `/podman-status` and
the prompt `podman-up-and-check`.

The workspace builds its own sites on DDEV. This plugin is for a project that runs on Podman
instead: it gives that project a menu of its own, beside the others.

## Which project gets the menu

A project is a Podman project when its folder carries a compose file (`compose.yaml`, `compose.yml`, `docker-compose.yml`, `docker-compose.yaml`: it is run through `podman compose`), or else a `Containerfile` or a `Dockerfile` (it is built and run as one container). The first one found, in that order, decides. `<name>` below is the folder's name: the image and the container are named after it.

```bash
cd ~/workspace/<folder>/<project>
ls compose.yaml compose.yml docker-compose.yml docker-compose.yaml Containerfile Dockerfile 2>/dev/null
```

## The PODMAN menu

On top the menu shows the name of the project and the file it was recognised by. Every
other entry opens a terminal session in the project's folder and runs one command there, so what
`podman` prints is what is seen, and a question it asks can be answered.

With a compose file (shown for `compose.yaml`):

| Menu entry | The command, in the project's folder |
| --- | --- |
| **Up** | `podman compose -f compose.yaml up -d` |
| **Down** | `podman compose -f compose.yaml down` |
| **Restart** | `podman compose -f compose.yaml restart` |
| **Status** | `podman compose -f compose.yaml ps` |
| **Logs (follow)** | `podman compose -f compose.yaml logs -f` |
| **Shell** | `podman compose -f compose.yaml exec $(podman compose -f compose.yaml config --services 2>/dev/null \| head -1) sh` |
| **Build** | `podman compose -f compose.yaml build` |
| **Pods** | `podman pod ps` |

With a `Containerfile` or a `Dockerfile` and no compose file (shown for `Containerfile`):

| Menu entry | The command, in the project's folder |
| --- | --- |
| **Up** | `podman build -t <name> -f Containerfile . && (podman rm -f <name> >/dev/null 2>&1; podman run -d --name <name> <name>)` |
| **Down** | `podman rm -f <name>` |
| **Restart** | `podman restart <name>` |
| **Status** | `podman ps -a --filter name=<name>` |
| **Logs (follow)** | `podman logs -f <name>` |
| **Shell** | `podman exec -it <name> sh` |
| **Build** | `podman build -t <name> -f Containerfile .` |
| **Pods** | `podman pod ps` |

The menu ends with the note "Rootless and daemonless: the verbs act where podman is run".

### The caption beside the menu

| Caption | What it means |
| --- | --- |
| `up` | `podman compose -f <the file> ps`, or `podman ps` filtered on the name, shows it Up |
| `down` | It answered, and nothing of the project is running |
| `?` | `podman` could not answer: it is not installed where the dashboard runs, or it failed |

### A new folder

The New folder form offers **Write a Containerfile skeleton here**: it writes a `Containerfile` with an nginx image that serves `web/`, to edit, unless the folder already has one.

## Turn it on, and check it

```bash
cd ~/workspace
bash core/scripts/plugins.sh --require @webship.co/workspace-podman
bash core/scripts/plugins.sh --activate podman --with-needs     # adds the AI folders its items land in
bash core/scripts/plugins.sh --install podman
bash core/scripts/plugins.sh --check podman                     # podman: found, with its version, or missing
```

The plugin has no settings file. `podman` is installed outside the workspace: https://podman.io/docs/installation

## Traps

- **A project with a compose file gets this menu and the Docker Compose one**, when both plugins are turned on: the same file, two runtimes. Use one.
- **Without a compose file, Up builds the image and replaces the container**: it removes a container of that name before it runs the new one, and Down removes it. What the container held outside a volume is gone.
- **Podman is rootless and daemonless**: the verbs act where `podman` is run. The dashboard runs in a container, so it needs the podman command and a connection to the machine's podman to act on the machine's containers.
- **The menu has no site link**: the plugin reads no port from the files.
- **A verb answers "podman is not installed"**: the terminal session of the menu checks for `podman`
  first, and says where to get it.
- **A project on DDEV** keeps the workspace's own menus; this one is not drawn for it unless it
  also carries a compose file or a Containerfile.

## The book

For any automated functional testing in this work (a Gherkin feature, a step definition, choosing a
step, a test run and its failures), read the book *Automated Functional Testing Recipes* first.

- **Where.** Use the first that exists: `.claude/automated-functional-testing-recipes/` in the project,
  `~/.claude/automated-functional-testing-recipes/` (installed by webship/webship-js-ai-agent,
  webship/webship-js-skills or webship/ai-agents), or
  https://github.com/webship/webship-js-ai-agent/tree/2.0.x/automated-functional-testing-recipes
- **How.** Its `README.md` first, then the chapter that matches the task (one file per chapter,
  named by its subject), not the single complete file.
- **Which wins.** The installed webship-js package and the step pack are the source of truth for
  step phrasing. When they differ from the book, follow them and say so.
