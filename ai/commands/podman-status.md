---
description: Say whether a Webship Workspace project is a Podman project and whether it is up, with the read-only commands the PODMAN menu runs. Nothing is started, stopped or removed.
argument-hint: '<project>'
---

# /podman-status

Say where this project stands on Podman: `$ARGUMENTS`

The argument is one word: the project, which is its folder name in a workspace folder. With no
project, stop and ask for one.

The workspace is container-based (DDEV by default); `podman` runs on the machine, in the project's
folder. This command only reads: these are the entries of the PODMAN menu of the Podman plugin
(`@webship.co/workspace-podman`) that change nothing. Never start, stop, restart, build or remove anything here.

## 1. Find the project and its file

```bash
ls -d ~/workspace/*/<project>
cd ~/workspace/<folder>/<project>
ls compose.yaml compose.yml docker-compose.yml docker-compose.yaml Containerfile Dockerfile 2>/dev/null
```

If none of those files is there, stop and say that it is not a Podman project: the PODMAN menu is
not on it either.

## 2. Is `podman` here

```bash
cd ~/workspace && bash core/scripts/plugins.sh --check podman
```

If it is missing, say so with the address it gives (https://podman.io/docs/installation), and stop.

## 3. Read

```bash
cd ~/workspace/<folder>/<project>
podman pod ps
# With a compose file (shown for `compose.yaml`)
podman compose -f compose.yaml ps
# With a `Containerfile` or a `Dockerfile` and no compose file (shown for `Containerfile`)
podman ps -a --filter name=<name>
```

## 4. Report

The file the project was recognised by, then what is running and what is not, in the words of
the answer. A list with no container is a result: the project is down.

For starting or stopping it, hand over to the agent `podman-operator`.
