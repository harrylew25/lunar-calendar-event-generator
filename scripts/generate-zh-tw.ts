import { writeFileSync } from 'node:fs';
import { Converter } from 'opencc-js';
import { buildZhTw } from '../src/lib/i18n/build-zh-tw';

const convert = Converter({ from: 'cn', to: 'tw' });
const { messages, catalog } = buildZhTw(convert);

const file = `import type { Messages } from './en';

const zhTwMessages = ${JSON.stringify(messages, null, '\t')} as const satisfies Messages;

const zhTwCatalog: Record<string, string> = Object.fromEntries([
${Object.entries(catalog)
	.map(
		([key, value]) => `\t[${JSON.stringify(key)}, ${JSON.stringify(value)}],`,
	)
	.join('\n')}
]);

export { zhTwCatalog, zhTwMessages };
`;

writeFileSync(new URL('../src/lib/i18n/zh-TW.ts', import.meta.url), file);
