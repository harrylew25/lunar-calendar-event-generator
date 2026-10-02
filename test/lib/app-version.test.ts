import { describe, expect, test } from 'bun:test';
import { currentAppVersion, formatAppVersion } from '@lib/app-version.ts';

describe('formatAppVersion', () => {
	test('uses the Kuala Lumpur Monday when UTC is still the previous Sunday', () => {
		const mondayJustAfterMidnightKl = new Date('2026-10-04T16:30:00.000Z');

		expect(formatAppVersion(mondayJustAfterMidnightKl, 'dev')).toBe(
			'26.41.dev',
		);
	});

	test('formats 1 Jan 2027 in Kuala Lumpur as ISO week 53 of 2026', () => {
		const newYearsDayKl = new Date('2026-12-31T16:00:00.000Z');

		expect(formatAppVersion(newYearsDayKl, '12')).toBe('26.53.12');
	});

	test('zero-pads a single-digit ISO week', () => {
		const weekOneKl = new Date('2027-01-03T16:30:00.000Z');

		expect(formatAppVersion(weekOneKl, '3')).toBe('27.01.3');
	});
});

describe('currentAppVersion', () => {
	test('uses dev when the run number is missing', () => {
		const now = new Date('2026-10-02T04:00:00.000Z');
		const previous = process.env.GITHUB_RUN_NUMBER;
		delete process.env.GITHUB_RUN_NUMBER;

		try {
			expect(currentAppVersion(now)).toBe('26.40.dev');
		} finally {
			if (previous === undefined) {
				delete process.env.GITHUB_RUN_NUMBER;
			} else {
				process.env.GITHUB_RUN_NUMBER = previous;
			}
		}
	});

	test('copies a numeric run number through unpadded', () => {
		const now = new Date('2026-10-02T04:00:00.000Z');

		expect(currentAppVersion(now, '1847')).toBe('26.40.1847');
	});
});
