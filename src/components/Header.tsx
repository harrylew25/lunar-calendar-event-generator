import { cn } from 'cn';
import type { ReactElement } from 'react';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import type { Locale } from '@/lib/i18n/locale';

const LANGUAGE_OPTIONS: { label: string; name: string; value: Locale }[] = [
	{ label: 'EN', name: 'English', value: 'en' },
	{ label: '简', name: '简体中文', value: 'zh-CN' },
	{ label: '繁', name: '繁體中文', value: 'zh-TW' },
];

const Header = (): ReactElement => {
	const { locale, setLocale } = useI18n();
	const t = useT();

	return (
		<header className="mx-auto grid w-full max-w-6xl gap-4 px-4 pt-10 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
			<div className="text-center sm:col-start-2">
				<h1 className="text-3xl font-bold tracking-tight">{t('pageTitle')}</h1>
				<p className="text-muted-foreground mt-2">{t('pageSubtitle')}</p>
			</div>
			<fieldset className="m-0 flex min-w-0 items-center justify-center border-0 p-0 text-sm sm:col-start-3 sm:justify-self-end">
				<legend className="sr-only">{t('language')}</legend>
				{LANGUAGE_OPTIONS.map((option, index) => {
					const selected = locale === option.value;
					return (
						<span key={option.value} className="flex items-center">
							{index > 0 ? (
								<span aria-hidden="true" className="text-muted-foreground px-2">
									|
								</span>
							) : null}
							<button
								type="button"
								aria-label={option.name}
								aria-pressed={selected}
								onClick={() => setLocale(option.value)}
								className={cn(
									'border-0 bg-transparent p-0 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									selected
										? 'text-foreground underline'
										: 'text-muted-foreground',
								)}>
								{option.label}
							</button>
						</span>
					);
				})}
			</fieldset>
		</header>
	);
};

export default Header;
