type Locale = 'en' | 'zh-CN' | 'zh-TW';

const LOCALE_STORAGE_KEY = 'locale';

const isLocale = (value: string): value is Locale =>
	value === 'en' || value === 'zh-CN' || value === 'zh-TW';

const SIMPLIFIED_PREFIXES = ['zh-cn', 'zh-sg', 'zh-hans'];
const TRADITIONAL_PREFIXES = ['zh-tw', 'zh-hk', 'zh-mo', 'zh-hant'];

const hasPrefix = (tag: string, prefixes: string[]): boolean =>
	prefixes.some((prefix) => tag.startsWith(prefix));

const localeFromLanguage = (language: string): Locale => {
	const tag = language.toLowerCase().replaceAll('_', '-');
	if (tag === 'zh' || hasPrefix(tag, SIMPLIFIED_PREFIXES)) {
		return 'zh-CN';
	}
	if (hasPrefix(tag, TRADITIONAL_PREFIXES)) {
		return 'zh-TW';
	}
	return 'en';
};

const readSavedLocale = (): Locale | null => {
	try {
		const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
		return saved && isLocale(saved) ? saved : null;
	} catch {
		return null;
	}
};

const resolveInitialLocale = (): Locale => {
	const saved = readSavedLocale();
	if (saved) {
		return saved;
	}
	const language = typeof navigator === 'undefined' ? 'en' : navigator.language;
	return localeFromLanguage(language);
};

let currentLocale = resolveInitialLocale();

const getLocale = (): Locale => currentLocale;

const commitLocale = (locale: Locale): void => {
	currentLocale = locale;
	try {
		localStorage.setItem(LOCALE_STORAGE_KEY, locale);
	} catch {
		// Storage can be unavailable. The in-memory locale still applies.
	}
};

export type { Locale };
export {
	commitLocale,
	getLocale,
	LOCALE_STORAGE_KEY,
	localeFromLanguage,
	resolveInitialLocale,
};
