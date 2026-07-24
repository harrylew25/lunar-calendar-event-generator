#!/usr/bin/env bun
/**
 * stop only: final health gate (`tsc` + `bun run test`) → followup_message.
 * Biome stays on afterFileEdit; mid-turn type hints stay on postToolUse.
 * `tsc` here is intentional (don't finish red) even if postToolUse already ran it.
 */
import {
	combinedOutput,
	emitJson,
	readStdinJson,
	runTests,
	runTypecheck,
	truncateOutput,
} from './lib.ts';

type StopInput = {
	status?: unknown;
	loop_count?: unknown;
};

const input = (await readStdinJson()) as StopInput;

if (input.status === 'aborted') {
	emitJson({});
	process.exit(0);
}

const tscResult = await runTypecheck();
const testResult = await runTests();

if (tscResult.exitCode === 0 && testResult.exitCode === 0) {
	emitJson({});
	process.exit(0);
}

const sections: string[] = [
	'Project health checks failed. Fix the issues below, then continue.',
];

if (tscResult.exitCode !== 0) {
	sections.push(
		'## TypeScript (`tsc --noEmit`)',
		truncateOutput(combinedOutput(tscResult)),
	);
}

if (testResult.exitCode !== 0) {
	sections.push(
		'## Tests (`bun run test`)',
		truncateOutput(combinedOutput(testResult)),
	);
}

emitJson({
	followup_message: sections.join('\n\n'),
});
process.exit(0);
