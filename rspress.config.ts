import * as path from 'path';
import { defineConfig } from 'rspress/config';
import { createTransformerDiff, pluginShiki } from '@rspress/plugin-shiki';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: '漫漫前端',
  description: '晨晨的前端之路',
  icon: "/rspress-icon.png",
  logo: {
    light: "/rspress-light-logo.png",
    dark: "/rspress-dark-logo.png",
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/zhenghui-su' },
    ],
  },
  markdown: {
    highlightLanguages: [
      'ejs', 'go', 'nginx', 'lua', ['js', 'javascript'], 'json', 'http', 'bash',
      ['ts', 'typescript'], 'tsx', 'css', 'scss', 'sass', 'less', ['md', 'markdown'],
      'cpp', 'c', 'makefile', 'yaml'
    ],
    showLineNumbers: true,
  },
  plugins: [pluginShiki({
    langs: [
      'vue', 'nginx', 'lua', 'javascript', 'js', 'json', 'http', 'tex', 'sh', 'bash', 'markdown', 'md', 'yml', 'yaml',
      'ts', 'tsx', 'css', 'scss', 'less', 'html', 'jsonc', 'json5', 'graphql', 'handlebars', 'rust', 'php', 'go', 'java',
      'cpp', 'c', 'csharp', 'dockerfile', 'makefile', 'ini', 'toml', 'ruby', 'python', 'rust', 'swift', 'kotlin', 'scala',
      'typescript', 'sass', 'stylus'],
    transformers: [
      createTransformerDiff(),
    ],
  })],
});
