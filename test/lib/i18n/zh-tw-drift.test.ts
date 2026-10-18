import { describe, expect, test } from 'bun:test';
import { Converter } from 'opencc-js';
import { buildZhTw } from '@/lib/i18n/build-zh-tw';
import { localeFromLanguage } from '@/lib/i18n/locale';
import { zhTwCatalog, zhTwMessages } from '@/lib/i18n/zh-TW';

describe('Traditional Chinese generation', () => {
	test('the committed catalog matches OpenCC plus the override map', () => {
		const convert = Converter({ from: 'cn', to: 'tw' });
		expect(buildZhTw(convert)).toEqual({
			messages: zhTwMessages,
			catalog: zhTwCatalog,
		});
		expect(zhTwCatalog['惊蛰']).toBe('驚蟄');
		expect(zhTwCatalog['谷雨']).toBe('穀雨');
		expect(zhTwCatalog['中元节/盂兰盛会']).toBe('中元節／盂蘭盆會');
		expect(zhTwCatalog['九皇爷诞']).toBe('九皇爺誕');
		expect(zhTwCatalog['天公诞']).toBe('天公誕');
	});
});

describe('localeFromLanguage', () => {
	test('maps Chinese tags and falls back to English', () => {
		expect(localeFromLanguage('zh')).toBe('zh-CN');
		expect(localeFromLanguage('zh-CN')).toBe('zh-CN');
		expect(localeFromLanguage('zh-SG')).toBe('zh-CN');
		expect(localeFromLanguage('zh-Hans-CN')).toBe('zh-CN');
		expect(localeFromLanguage('zh-TW')).toBe('zh-TW');
		expect(localeFromLanguage('zh-HK')).toBe('zh-TW');
		expect(localeFromLanguage('zh-Hant')).toBe('zh-TW');
		expect(localeFromLanguage('zh-MO')).toBe('zh-TW');
		expect(localeFromLanguage('en-MY')).toBe('en');
		expect(localeFromLanguage('ms')).toBe('en');
	});
});
