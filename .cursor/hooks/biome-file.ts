#!/usr/bin/env bun
/**
 * afterFileEdit / afterTabFileEdit: file-scoped Biome (lint + safe fixes + format + organize imports).
 * Fail open — never block the agent loop on Biome failures.
 */
import {
	emitJson,
	isRelevantSourceFile,
	readStdinJson,
	runCommand,
} from './lib.ts';

type AfterFileEditInput = {
	file_path?: unknown;
};

const input = (await readStdinJson()) as AfterFileEditInput;
const filePath = input.file_path;

if (typeof filePath !== 'string' || filePath.length === 0) {
	emitJson({});
	process.exit(0);
}

if (!isRelevantSourceFile(filePath)) {
	emitJson({});
	process.exit(0);
}

try {
	await runCommand([
		'bunx',
		'biome',
		'check',
		'--write',
		'--files-ignore-unknown=true',
		'--',
		filePath,
	]);
} catch {
	// Fail open: Biome errors must not break the agent loop.
}

emitJson({});
process.exit(0);
