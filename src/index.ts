/**
 * Podman for Webship Workspace.
 *
 * The PODMAN menu on every project folder that carries a compose file or a Containerfile: the runtime's verbs as terminal
 * sessions in the project, the up/down caption, the site link, and "Write a Containerfile skeleton here" when a new folder
 * is made. All of it is the container family's surface (@webship.co/workspace-container); this
 * package is the Podman runtime plus its host install.
 */

import type { PluginApi } from '@webship.co/workspace-plugin-api';
import { registerContainer } from '@webship.co/workspace-container';

import { podmanRuntime } from './lib/runtime';

export { podmanRuntime };

/** The AI items the installer places: agents in ai-agents/, skills in ai-skills/, commands in ai-commands/, prompts in ai-prompts/. */
export const AGENTS: string[] = ['podman-operator'];
export const SKILLS: string[] = ['podman-menu'];
export const AI_COMMANDS: string[] = ['podman-status'];
export const PROMPTS: string[] = ['podman-up-and-check'];

export function register(api: PluginApi): void {
  registerContainer(api, podmanRuntime);
}
