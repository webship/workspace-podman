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
bash core/scripts/plugins.sh --activate podman
bash core/scripts/plugins.sh --install podman
```

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
