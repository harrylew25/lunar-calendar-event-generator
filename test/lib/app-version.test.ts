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

const withBuildEnv = (
	env: { runNumber?: string; commit?: string },
	run: () => void,
): void => {
	const previousRun = process.env.GITHUB_RUN_NUMBER;
	const previousCommit = process.env.RENDER_GIT_COMMIT;

	if (env.runNumber === undefined) {
		delete process.env.GITHUB_RUN_NUMBER;
	} else {
		process.env.GITHUB_RUN_NUMBER = env.runNumber;
	}
	if (env.commit === undefined) {
		delete process.env.RENDER_GIT_COMMIT;
	} else {
		process.env.RENDER_GIT_COMMIT = env.commit;
	}

	try {
		run();
	} finally {
		if (previousRun === undefined) {
			delete process.env.GITHUB_RUN_NUMBER;
		} else {
			process.env.GITHUB_RUN_NUMBER = previousRun;
		}
		if (previousCommit === undefined) {
			delete process.env.RENDER_GIT_COMMIT;
		} else {
			process.env.RENDER_GIT_COMMIT = previousCommit;
		}
	}
};

describe('currentAppVersion', () => {
	const now = new Date('2026-10-02T04:00:00.000Z');

	test('uses dev when the run number and commit are missing', () => {
		withBuildEnv({}, () => {
			expect(currentAppVersion(now)).toBe('26.40.dev');
		});
	});

	test('copies a numeric run number through unpadded', () => {
		expect(currentAppVersion(now, '1847')).toBe('26.40.1847');
	});

	test('uses the first 7 characters of the Render commit when the run number is missing', () => {
		withBuildEnv({ commit: 'abcdef1234567890' }, () => {
			expect(currentAppVersion(now)).toBe('26.40.abcdef1');
		});
	});

	test('prefers the GitHub run number over the Render commit', () => {
		expect(currentAppVersion(now, '1847', 'abcdef1234567890')).toBe(
			'26.40.1847',
		);
	});
});
