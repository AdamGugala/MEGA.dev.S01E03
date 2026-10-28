import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

const base = process.env.BASE_PATH ?? '';

// The exported Markdown uses /kb links. Prefix those at build time without
// rewriting the desk's historical pages or accepted decision record.
function kbLinks() {
  return function visit(node) {
    if (node.type === 'link' && node.url.startsWith('/kb')) {
      node.url = `${base}${node.url}`;
    }
    node.children?.forEach(visit);
  };
}

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: mdsvex({
        layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) },
        remarkPlugins: [kbLinks],
      }),
      adapter: adapter(),
      paths: { base, relative: false },
    }),
  ],
});
