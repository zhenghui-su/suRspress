import * as path from 'path'
import { defineConfig } from 'rspress/config'
import { createTransformerDiff, pluginShiki } from '@rspress/plugin-shiki'
import alignImage from 'rspress-plugin-align-image'
import live2d from 'rspress-plugin-live2d'

export default defineConfig({
	root: path.join(__dirname, 'docs'),
	title: '漫漫前端',
	description: '晨晨的前端之路',
	icon: '/rspress-icon.png',
	logo: {
		light: '/rspress-light-logo.png',
		dark: '/rspress-dark-logo.png',
	},
	themeConfig: {
		socialLinks: [
			{
				icon: 'github',
				mode: 'link',
				content: 'https://github.com/zhenghui-su',
			},
		],
		footer: {
			message:
				'<a href="https://beian.miit.gov.cn/" target="_blank">© 蜀ICP备2023036139号-1</a>',
		},
		outlineTitle: '目录',
		editLink: {
			docRepoBaseUrl:
				'https://github.com/zhenghui-su/suRspress/tree/master/docs',
			text: '📝 在 GitHub 上编辑此页',
		},
		prevPageText: '上一篇',
		nextPageText: '下一篇',
		searchPlaceholderText: '搜索',
	},
	markdown: {
		highlightLanguages: [
			['js', 'javascript'],
			['ts', 'typescript'],
			['md', 'markdown'],
			['sh', 'shell'],
		],
		showLineNumbers: true,
	},
	plugins: [
		pluginShiki({
			langs: [
				'vue',
				'nginx',
				'lua',
				'javascript',
				'js',
				'json',
				'http',
				'tex',
				'sh',
				'bash',
				'markdown',
				'md',
				'yml',
				'yaml',
				'ts',
				'tsx',
				'css',
				'scss',
				'less',
				'html',
				'jsonc',
				'json5',
				'graphql',
				'handlebars',
				'rust',
				'php',
				'go',
				'java',
				'cpp',
				'c',
				'csharp',
				'dockerfile',
				'makefile',
				'ini',
				'toml',
				'ruby',
				'python',
				'rust',
				'swift',
				'kotlin',
				'scala',
				'typescript',
				'sass',
				'stylus',
			],
			transformers: [createTransformerDiff()],
		}),
		// @ts-ignore
		alignImage({
			justify: 'center',
		}),
		// @ts-ignore
		live2d({
			models: [
				{
					path: 'https://model.oml2d.com/Senko_Normals/senko.model3.json',
					position: [-10, 20],
				},
			],
		}),
	],
})
