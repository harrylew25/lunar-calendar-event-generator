import { afterEach, describe, expect, spyOn, test } from 'bun:test';
import { cleanup, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { toast } from 'sonner';
import { reportCartChange } from '@/lib/wizard/cart-toast';

describe('cart toast', () => {
	let success: ReturnType<typeof spyOn>;

	afterEach(() => {
		cleanup();
		success.mockRestore();
	});

	test('keeps a short event title on one line and leaves the lunar date unclamped', () => {
		success = spyOn(toast, 'success').mockReturnValue(1);
		reportCartChange({
			action: 'added',
			title: 'Ancestor day',
			lunarDate: '正月初一',
		});

		const options = success.mock.calls[0]?.[1] as {
			description: ReactElement;
			descriptionClassName: string;
		};
		const { container } = render(options.description);
		const [title, date] = container.querySelectorAll('span');

		expect(title?.textContent).toBe('Ancestor day');
		expect(title?.className).toContain('truncate');
		expect(date?.textContent).toBe('正月初一');
		expect(date?.className.includes('truncate')).toBe(false);
		expect(options.descriptionClassName).toBe('min-w-0');
	});
});
