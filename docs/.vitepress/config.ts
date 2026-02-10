import type { Plugin as VitePlugin } from 'vitepress';
import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const repoRoot = resolve(__dirname, '../..');

function serveIconAssets(): VitePlugin {
  return {
    name: 'serve-icon-assets',
    configureServer(server): void {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/assets/')) return next();

        const filePath = resolve(repoRoot, url.slice(1));
        if (existsSync(filePath)) {
          res.setHeader('Content-Type', 'image/svg+xml');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(readFileSync(filePath, 'utf-8'));
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  title: 'Cisco Icons',
  description: 'Phosphor Icons + Cisco branded icons for every framework',
  base: '/',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo.svg',
        media: '(prefers-color-scheme: light)'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo-dark.svg',
        media: '(prefers-color-scheme: dark)'
      }
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Ubuntu+Mono:wght@400;700&display=swap'
      }
    ]
  ],

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg'
    },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Icons', link: '/icons/gallery' },
      {
        text: 'Frameworks',
        items: [
          { text: 'React', link: '/frameworks/react' },
          { text: 'Svelte', link: '/frameworks/svelte' },
          { text: 'Vanilla JS', link: '/frameworks/vanilla' }
        ]
      },
      {
        text: 'GitHub',
        items: [
          { text: 'Core', link: 'https://github.com/jorcleme/cisco-icons-core' },
          { text: 'React', link: 'https://github.com/jorcleme/cisco-icons-react' },
          { text: 'Svelte', link: 'https://github.com/jorcleme/cisco-icons-svelte' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Usage', link: '/guide/usage' }
          ]
        }
      ],
      '/frameworks/': [
        {
          text: 'Frameworks',
          items: [
            { text: 'React', link: '/frameworks/react' },
            { text: 'Svelte', link: '/frameworks/svelte' },
            { text: 'Vanilla JS', link: '/frameworks/vanilla' }
          ]
        }
      ],
      '/icons/': [
        {
          text: 'Icons',
          items: [{ text: 'Gallery', link: '/icons/gallery' }]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/jorcleme/cisco-icons-core' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2026 Cisco Icons by (<a href="https://github.com/jorcleme" target="_blank" rel="noopener noreferrer">Jordan Clemens</a>)'
    },

    search: {
      provider: 'local'
    }
  },

  vite: {
    plugins: [serveIconAssets()],
    resolve: {
      alias: {
        '@data': resolve(repoRoot, 'src')
      }
    },
    server: {
      fs: {
        allow: [repoRoot]
      }
    }
  }
});
