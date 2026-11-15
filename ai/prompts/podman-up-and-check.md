Start a Podman project of the workspace and say whether it came up, with the commands of the PODMAN menu.

```
claude --permission-mode bypassPermissions """
Start the Podman project <project> and tell me whether it came up
# ~/workspace/<folder>/<project> · container-based (DDEV by default) · podman runs on the machine, in the project's folder
# only the commands below; nothing that removes containers or data; if a command fails, show why and stop

1. cd ~/workspace/<folder>/<project> ; ls compose.yaml compose.yml docker-compose.yml docker-compose.yaml Containerfile Dockerfile 2>/dev/null
   stop if none of those files is there: it is not a Podman project
2. cd ~/workspace ; bash core/scripts/plugins.sh --check podman ; cd ~/workspace/<folder>/<project>
   stop if podman is missing, and tell me where to get it
3. start it:
   With a compose file (shown for `compose.yaml`): podman compose -f compose.yaml up -d
   With a `Containerfile` or a `Dockerfile` and no compose file (shown for `Containerfile`): podman build -t <name> -f Containerfile . && (podman rm -f <name> >/dev/null 2>&1; podman run -d --name <name> <name>)
4. read its state:
   With a compose file (shown for `compose.yaml`): podman compose -f compose.yaml ps
   With a `Containerfile` or a `Dockerfile` and no compose file (shown for `Containerfile`): podman ps -a --filter name=<name>

Tell me what is running and what is not.
If it did not come up, show me the lines that say why. Do not try other flags, and remove nothing.
"""
```

The text between the triple quotes is plain: it can be given to another AI command-line assistant as it is.
