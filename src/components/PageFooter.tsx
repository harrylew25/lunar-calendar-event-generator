import { currentAppVersion } from '@lib/app-version.ts' with { type: 'macro' };
import type { ReactElement } from 'react';

const appVersion = currentAppVersion();

const PageFooter = (): ReactElement => {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="text-muted-foreground border-border mt-auto border-t px-4 py-6 text-center text-xs">
			© {currentYear === 2026 ? '2026' : `2026-${currentYear}`} Harry Lew
			<br />
			Version <code>{appVersion}</code>
		</footer>
	);
};

export default PageFooter;
