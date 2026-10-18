import { FESTIVALS, monthRules } from '@lunar-dates/constants';
import { SOLAR_TERMS } from '@lunar-dates/solar-term-seasons';
import type { MessageKey, Messages } from './en';
import { zhCnMessages } from './zh-CN';
import { messageOverrides, phraseOverrides } from './zh-tw-overrides';

const catalogPhrases = (): string[] => {
	const phrases = [
		'农历',
		...monthRules.map((rule) => rule.name),
		...FESTIVALS.map((festival) => festival.title),
		...SOLAR_TERMS.map((term) => term.title),
	];
	return [...new Set(phrases)];
};

const convertPhrase = (
	text: string,
	convert: (value: string) => string,
): string => phraseOverrides[text] ?? convert(text);

const buildZhTw = (
	convert: (value: string) => string,
): { messages: Messages; catalog: Record<string, string> } => {
	const messages = {} as Messages;
	for (const key of Object.keys(zhCnMessages) as MessageKey[]) {
		const source = zhCnMessages[key];
		messages[key] = messageOverrides[key] ?? convertPhrase(source, convert);
	}

	const catalog: Record<string, string> = {};
	for (const phrase of catalogPhrases()) {
		catalog[phrase] = convertPhrase(phrase, convert);
	}

	return { messages, catalog };
};

export { buildZhTw, catalogPhrases };
