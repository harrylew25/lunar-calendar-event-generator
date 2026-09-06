import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
	extends: ['@commitlint/config-conventional'],
	parserPreset: {
		parserOpts: {
			headerPattern: /^(?:\[ENG-\d+\] )?(\w*)(?:\((.*)\))?!?: (.*)$/,
			headerCorrespondence: ['type', 'scope', 'subject'],
			noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
		},
	},
};

export default config;
