#!/usr/bin/env bun
/**
 * stop: don't finish red — run tsc + bun run test; follow up on failure (loop_limit in hooks.json).
 */
import {
	combinedOutput,
	emitJson,
	readStdinJson,
	runCommand,
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

const tscResult = await runCommand(['bunx', 'tsc', '--noEmit']);
const testResult = await runCommand(['bun', 'run', 'test']);

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
