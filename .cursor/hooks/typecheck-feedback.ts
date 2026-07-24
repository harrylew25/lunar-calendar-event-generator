#!/usr/bin/env bun
/**
 * postToolUse (Write|StrReplace|EditNotebook): project tsc --noEmit feedback via additional_context.
 */
import {
	combinedOutput,
	emitJson,
	isRelevantSourceFile,
	readStdinJson,
	runCommand,
	truncateOutput,
} from './lib.ts';

type PostToolUseInput = {
	tool_input?: unknown;
};

function extractEditedPath(toolInput: unknown): string | undefined {
	if (typeof toolInput !== 'object' || toolInput === null) {
		return undefined;
	}
	const record = toolInput as Record<string, unknown>;
	if (typeof record.path === 'string') {
		return record.path;
	}
	if (typeof record.target_notebook === 'string') {
		return record.target_notebook;
	}
	return undefined;
}

const input = (await readStdinJson()) as PostToolUseInput;
const editedPath = extractEditedPath(input.tool_input);

if (
	typeof editedPath === 'string' &&
	editedPath.length > 0 &&
	!isRelevantSourceFile(editedPath)
) {
	emitJson({});
	process.exit(0);
}

const result = await runCommand(['bunx', 'tsc', '--noEmit']);

if (result.exitCode === 0) {
	emitJson({});
	process.exit(0);
}

const details = truncateOutput(combinedOutput(result));
emitJson({
	additional_context: [
		'TypeScript check failed after the edit (`tsc --noEmit`).',
		'Fix these type errors before continuing:',
		'',
		details,
	].join('\n'),
});
process.exit(0);
