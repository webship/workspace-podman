#!/usr/bin/env bash
## The host side of the Podman plugin: the CLI on this machine. Run by core/scripts/plugins.sh
## --install podman, and by core/scripts/install.sh for every installed plugin that ships one.
## Idempotent: whatever is already there is reported, not redone; nothing is installed unasked.
set -u
BIN='';
for candidate in "$(command -v podman 2>/dev/null)" "${HOME}/.local/bin/podman" ; do
  [ -n "${candidate}" ] && [ -x "${candidate}" ] && { BIN="${candidate}"; break; }
done
if [ -n "${BIN}" ] ; then
  printf '  ✓ %-16s %s\n' "podman" "${BIN}" ;
else
  printf '  ✗ %-16s %s\n' "podman" "missing — the PODMAN menu's verbs need it (podman.io/docs/installation)" ;
fi
