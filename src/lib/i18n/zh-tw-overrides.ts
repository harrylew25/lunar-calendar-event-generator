import type { MessageKey } from './en';

const phraseOverrides: Record<string, string> = Object.fromEntries([
	['惊蛰', '驚蟄'],
	['谷雨', '穀雨'],
	['中元节/盂兰盛会', '中元節／盂蘭盆會'],
]);

const messageOverrides: Partial<Record<MessageKey, string>> = {};

export { messageOverrides, phraseOverrides };
