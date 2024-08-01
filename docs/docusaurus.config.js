// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ketty Docs',
  tagline: 'documentation',
  favicon: 'img/ketty.ico',

  // Set the production url of your site here
  url: 'https://devdocs.ketty.community',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Coko Foundation', // Usually your GitHub org/user name.
  projectName: 'Ketty', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/Ketty social card.png',
      navbar: {
        title: 'Ketty',
        logo: {
          alt: 'Ketty - the single source book production software',
          src: 'img/ketty.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'userSidebar',
            position: 'left',
            label: 'User guide',
          },
          {
            type: 'docSidebar',
            sidebarId: 'developerSidebar',
            position: 'left',
            label: 'Developer guide',
          },
          {
            type: 'docSidebar',
            sidebarId: 'deploySidebar',
            position: 'left',
            label: 'Deploy',
          },
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Design',
          // },
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'User guide',
          // },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://gitlab.coko.foundation/ketty/ketty',
            label: 'Gitlab',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'User guide',
                to: '/docs/userGuide/Getting Started/intro',
              },
              {
                label: 'Developer guide',
                to: '/docs/developerGuide/Repositories & Setup',
              },
              {
                label: 'Deployment guide',
                to: '/docs/deploy/Deploy Ketty in production',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Website',
                href: 'https://ketty.community/',
              },
              {
                label: 'Forum',
                href: 'https://forum.ketty.community/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'Gitlab',
                href: 'https://gitlab.coko.foundation/ketty/ketty',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Coko Foundation. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
}

export default config
