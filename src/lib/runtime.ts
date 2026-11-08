/**
 * Podman, as a container runtime: a project with a compose file (podman compose) or a Containerfile
 * (built and run as one container named after the folder).
 */

import path from 'path';
import { detectByFiles } from '@webship.co/workspace-container';
import type { ContainerProject, ContainerRuntime } from '@webship.co/workspace-container';

const COMPOSE = ['compose.yaml', 'compose.yml', 'docker-compose.yml', 'docker-compose.yaml'];
const isCompose = (p: ContainerProject) => COMPOSE.includes(p.file);

export const podmanRuntime: ContainerRuntime = {
  id: 'podman',
  label: 'PODMAN',
  title: 'Podman',
  cli: 'podman',
  cliHint: 'https://podman.io/docs/installation',
  detect: (dir): ContainerProject | null => {
    const p = detectByFiles(dir, [...COMPOSE, 'Containerfile', 'Dockerfile']);
    return p ? { file: p.file, name: path.basename(dir) } : null;
  },
  state: async (p, dir, lib) => {
    const out = isCompose(p)
      ? await lib.run('podman', ['compose', '-f', p.file, 'ps'], dir, { timeoutMs: 20 * 1000 })
      : await lib.run('podman', ['ps', '--filter', `name=^${p.name}$`, '--format', '{{.Names}} {{.Status}}'], dir, { timeoutMs: 15 * 1000 });
    if (!out.ok) return 'unknown';
    return /\b(Up|running)\b/i.test(String(out.stdout)) ? 'up' : 'down';
  },
  verbs: {
    start: { label: 'Up', icon: 'play', kind: 'start', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} up -d` : `podman build -t ${p.name} -f ${p.file} . && (podman rm -f ${p.name} >/dev/null 2>&1; podman run -d --name ${p.name} ${p.name})`) },
    stop: { label: 'Down', icon: 'ban', kind: 'stop', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} down` : `podman rm -f ${p.name}`) },
    restart: { label: 'Restart', icon: 'refresh', kind: 'restart', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} restart` : `podman restart ${p.name}`) },
    status: { label: 'Status', icon: 'info', kind: 'status', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} ps` : `podman ps -a --filter name=${p.name}`) },
    logs: { label: 'Logs (follow)', icon: 'file-text', kind: 'logs', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} logs -f` : `podman logs -f ${p.name}`) },
    shell: { label: 'Shell', icon: 'terminal', kind: 'shell', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} exec $(podman compose -f ${p.file} config --services 2>/dev/null | head -1) sh` : `podman exec -it ${p.name} sh`) },
    build: { label: 'Build', icon: 'cog', kind: 'other', cmd: (p) => (isCompose(p) ? `podman compose -f ${p.file} build` : `podman build -t ${p.name} -f ${p.file} .`) },
    pods: { label: 'Pods', icon: 'grid', kind: 'other', cmd: () => 'podman pod ps' },
  },
  init: { label: 'Write a Containerfile skeleton here', cmd: () => `[ -e Containerfile ] || printf 'FROM docker.io/library/nginx:alpine\\nCOPY web/ /usr/share/nginx/html/\\n' > Containerfile`, help: 'An nginx image serving web/, to edit.' },
  menuNote: 'Rootless and daemonless: the verbs act where podman is run',
};
