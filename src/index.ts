/**
 * Podman for Webship Workspace.
 *
 * The PODMAN menu on every project folder that carries a compose file or a Containerfile: the runtime's verbs as terminal
 * sessions in the project, the up/down caption, the site link, and "Write a Containerfile skeleton here" when a new folder
 * is made. All of it is the container family's surface (@webship/workspace-container); this
 * package is the Podman runtime plus its host install.
 */

import type { PluginApi } from '@webship/workspace-plugin-api';
import { registerContainer } from '@webship/workspace-container';

import { podmanRuntime } from './lib/runtime';

export { podmanRuntime };

export function register(api: PluginApi): void {
  registerContainer(api, podmanRuntime);
}
