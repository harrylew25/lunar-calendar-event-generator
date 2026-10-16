import { enMessages, type MessageKey } from './en';
import type { Locale } from './locale';
import { zhCnMessages } from './zh-CN';
import { zhTwMessages } from './zh-TW';

const catalogs = {
	en: enMessages,
	'zh-CN': zhCnMessages,
	'zh-TW': zhTwMessages,
} as const;

const translate = (
	locale: Locale,
	key: MessageKey,
	vars?: Record<string, string | number>,
): string => {
	let text: string = catalogs[locale][key];
	if (!vars) {
		return text;
	}
	for (const [name, value] of Object.entries(vars)) {
		text = text.replaceAll(`{${name}}`, String(value));
	}
	return text;
};

export { translate };
