import {
	createContext,
	type ReactElement,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useCalendarStore } from '@/store/calendar-store';
import type { MessageKey } from './en';
import { commitLocale, getLocale, type Locale } from './locale';
import { translate } from './translate';

type I18nValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nValue>({
	locale: 'en',
	setLocale: () => undefined,
});

const applyDocumentLocale = (locale: Locale): void => {
	document.documentElement.lang = locale;
	document.title = translate(locale, 'pageTitle');
};

const I18nProvider = ({ children }: { children: ReactNode }): ReactElement => {
	const [locale, setLocaleState] = useState(getLocale);

	const setLocale = (next: Locale): void => {
		commitLocale(next);
		setLocaleState(next);
		applyDocumentLocale(next);
		useCalendarStore.getState().reexpand();
	};

	useEffect(() => {
		applyDocumentLocale(locale);
	}, [locale]);

	return (
		<I18nContext.Provider value={{ locale, setLocale }}>
			{children}
		</I18nContext.Provider>
	);
};

const useI18n = (): I18nValue => useContext(I18nContext);

const useT = () => {
	const { locale } = useI18n();
	return (key: MessageKey, vars?: Record<string, string | number>): string =>
		translate(locale, key, vars);
};

export { I18nProvider, useI18n, useT };
