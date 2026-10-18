import { afterEach, describe, expect, test } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import DateSelectionStep from '@/components/steps/DateSelectionStep';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { commitLocale } from '@/lib/i18n/locale';
import { useCalendarStore } from '@/store/calendar-store';

const renderChrome = (): void => {
	render(
		<I18nProvider>
			<Header />
			<DateSelectionStep />
		</I18nProvider>,
	);
};

const chooseLanguage = (name: string): void => {
	fireEvent.click(screen.getByRole('button', { name }));
};

describe('wizard chrome locale', () => {
	afterEach(() => {
		cleanup();
		commitLocale('en');
		document.documentElement.lang = 'en';
		useCalendarStore.setState({
			step: 'select',
			cart: [],
			expandedEvents: null,
		});
	});

	test('language options switch headers, labels, and placeholders', () => {
		commitLocale('en');
		renderChrome();

		expect(
			screen.getByRole('heading', {
				level: 1,
				name: 'Lunar Calendar Event Generator',
			}),
		).toBeTruthy();
		expect(
			screen.getByText(
				'Build custom lunar recurrence rules and export them as an ICS calendar.',
			),
		).toBeTruthy();

		expect(screen.getByRole('button', { name: 'English' }).textContent).toBe(
			'EN',
		);
		expect(screen.getByRole('button', { name: '简体中文' }).textContent).toBe(
			'简',
		);
		expect(screen.getByRole('button', { name: '繁體中文' }).textContent).toBe(
			'繁',
		);
		chooseLanguage('简体中文');

		expect(document.documentElement.lang).toBe('zh-CN');
		expect(document.title).toBe('农历事件生成器');
		expect(
			screen.getByRole('heading', { level: 1, name: '农历事件生成器' }),
		).toBeTruthy();
		expect(
			screen.getByText('编写农历重复规则，并导出为 ICS 日历。'),
		).toBeTruthy();
		expect(
			screen.getByRole('heading', { level: 2, name: '选择日期' }),
		).toBeTruthy();
		expect(
			screen.getByText('把农历重复规则加入购物车，确认后再生成日历。'),
		).toBeTruthy();
		expect(screen.getByLabelText('事件标题')).toBeTruthy();
		expect(screen.getByPlaceholderText('例如：正月十五提醒')).toBeTruthy();
		expect(screen.getByText('农历月')).toBeTruthy();

		chooseLanguage('繁體中文');

		expect(document.documentElement.lang).toBe('zh-TW');
		expect(document.title).toBe('農曆事件生成器');
		expect(
			screen.getByRole('heading', { level: 1, name: '農曆事件生成器' }),
		).toBeTruthy();
		expect(
			screen.getByText('編寫農曆重複規則，並導出為 ICS 日曆。'),
		).toBeTruthy();
		expect(
			screen.getByRole('heading', { level: 2, name: '選擇日期' }),
		).toBeTruthy();
		expect(
			screen.getByText('把農曆重複規則加入購物車，確認後再生成日曆。'),
		).toBeTruthy();
		expect(screen.getByLabelText('事件標題')).toBeTruthy();
		expect(screen.getByPlaceholderText('例如：正月十五提醒')).toBeTruthy();
		expect(screen.getByText('農曆月')).toBeTruthy();
	});
});
