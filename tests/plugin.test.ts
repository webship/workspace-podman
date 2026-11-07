import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { register, podmanRuntime } from '../src/index';

const PKG = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');

function fakeApi(root: string, stdout = '') {
  const calls: any = { rowMenus: {}, actions: {}, fragments: [], setups: [], css: [], typeActions: [], ran: [] };
  const api: any = {
    name: 'podman', config: {}, settings: { file: 'plugin.podman.settings.yml', read: () => ({}), set() {}, setList() {} },
    lib: {
      esc: (s: unknown) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)),
      ROOT: root, workspaceDir: (ws: string) => path.join(root, ws), listProjects: (dir: string) => fs.readdirSync(dir),
      screenAction: (send: any, o: any) => { calls.screen = o; send('started'); }, NAME_RE: /^[a-zA-Z0-9_-]+$/,
      run: async (cmd: string, args: string[]) => { calls.ran.push([cmd, ...args].join(' ')); return { ok: true, code: 0, stdout, stderr: '' }; },
    },
    addRowMenu: (slot: string, spec: any, fn: any) => { calls.rowMenus[slot] = { spec, fn }; },
    addAction: (name: string, fn: any) => { calls.actions[name] = fn; },
    addFragment: (fn: any) => calls.fragments.push(fn), addFolderSetup: (s: any) => calls.setups.push(s),
    addCss: (f: string) => calls.css.push(f), addTypeAction: (a: string, t: string[]) => calls.typeActions.push([a, t]),
  };
  return { api, calls };
}

function tree() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'podman-'));
  fs.mkdirSync(path.join(root, 'dev', 'site1'), { recursive: true });
  fs.mkdirSync(path.join(root, 'dev', 'plain'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dev', 'site1', 'Containerfile'), 'FROM docker.io/library/nginx\n');
  return root;
}

test('the package requires nothing outside itself, and the manifest names files that ship', () => {
  for (const f of ['src/index.ts', 'src/lib/runtime.ts']) assert.doesNotMatch(fs.readFileSync(path.join(PKG, f), 'utf8'), /from ['"]\.\.\/\.\./, `${f} reaches outside the package`);
  const m = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).workspacePlugin;
  assert.strictEqual(m.name, 'podman');
  for (const f of [m.scripts.hostInstall, ...((m.ddev && m.ddev.compose) || []), ...(m.features || [])]) assert.ok(fs.existsSync(path.join(PKG, f)), `${f} is in the package`);
});

test('the runtime recognises its project file and names the verbs', () => {
  const root = tree();
  const p = podmanRuntime.detect(path.join(root, 'dev', 'site1'));
  assert.ok(p, 'site1 is a Podman project');
  assert.strictEqual(p.file, 'Containerfile');
  assert.strictEqual(p.name, 'site1');
  assert.strictEqual(podmanRuntime.detect(path.join(root, 'dev', 'plain')), null);
  assert.strictEqual(podmanRuntime.cli, 'podman');
  for (const k of ['start', 'stop', 'status', 'logs']) assert.ok(podmanRuntime.verbs[k], `a ${k} verb`);
  assert.match(podmanRuntime.verbs.start.cmd(p, 'site1'), /podman/);
});

test('the state reads the CLI\'s answer', async () => {
  const root = tree();
  const up = await podmanRuntime.state(podmanRuntime.detect(path.join(root, 'dev', 'site1')), path.join(root, 'dev', 'site1'), fakeApi(root, 'abc123 site1 Up 3 minutes').api.lib);
  assert.strictEqual(up, 'up');
  const down = await podmanRuntime.state(podmanRuntime.detect(path.join(root, 'dev', 'site1')), path.join(root, 'dev', 'site1'), fakeApi(root, '').api.lib);
  assert.strictEqual(down, 'down');
});

test('register() puts the PODMAN menu on the project and runs a verb in a terminal there', async () => {
  const root = tree();
  const { api, calls } = fakeApi(root);
  register(api);
  assert.deepStrictEqual(calls.rowMenus.podman.spec, { label: 'PODMAN', row: 0 });
  const ctx = (project: string) => ({ key: 'dev', project, dir: path.join(root, 'dev'), meta: {}, allowed: new Set(['podman']), vals: () => "hx-vals='{}'" });
  assert.match(calls.rowMenus.podman.fn(ctx('site1')), /PODMAN/);
  assert.strictEqual(calls.rowMenus.podman.fn(ctx('plain')), null);
  let out = '';
  await calls.actions['verb-start']({ form: { projectName: 'site1' }, send: (h: string) => { out = h; }, workspace: 'dev' });
  assert.strictEqual(out, 'started');
  assert.match(calls.screen.cmdLine, /podman/);
  assert.strictEqual(calls.screen.projectDir, path.join(root, 'dev', 'site1'));
});
