export const MAX_HOOK_OUTPUT_BYTES = 8 * 1024;

const RELEVANT_EXTENSIONS: ReadonlySet<string> = new Set([
	'.ts',
	'.tsx',
	'.js',
	'.jsx',
	'.mts',
	'.cts',
]);

export type CommandResult = {
	exitCode: number;
	stdout: string;
	stderr: string;
};

export function isRelevantSourceFile(filePath: string): boolean {
	const lower = filePath.toLowerCase();
	const dot = lower.lastIndexOf('.');
	if (dot < 0) {
		return false;
	}
	return RELEVANT_EXTENSIONS.has(lower.slice(dot));
}

export async function readStdinJson(): Promise<unknown> {
	const text = await Bun.stdin.text();
	if (text.trim() === '') {
		return {};
	}
	return JSON.parse(text) as unknown;
}

export function truncateOutput(
	text: string,
	maxBytes: number = MAX_HOOK_OUTPUT_BYTES,
): string {
	const bytes = new TextEncoder().encode(text);
	if (bytes.length <= maxBytes) {
		return text;
	}
	const sliced = bytes.slice(0, maxBytes);
	return `${new TextDecoder().decode(sliced)}\n…(truncated)`;
}

export function emitJson(value: Record<string, unknown>): void {
	process.stdout.write(`${JSON.stringify(value)}\n`);
}

export async function runCommand(
	cmd: string[],
	options?: { cwd?: string },
): Promise<CommandResult> {
	const proc = Bun.spawn(cmd, {
		cwd: options?.cwd,
		stdout: 'pipe',
		stderr: 'pipe',
	});
	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
		proc.exited,
	]);
	return { exitCode, stdout, stderr };
}

export function combinedOutput(result: CommandResult): string {
	return [result.stdout, result.stderr]
		.filter((part: string) => {
			return part.length > 0;
		})
		.join('\n');
}

/** Shared by postToolUse (mid-turn feedback) and stop (final gate). */
export async function runTypecheck(): Promise<CommandResult> {
	return runCommand(['bunx', 'tsc', '--noEmit']);
}

/** Stop-gate only — not run on every edit. */
export async function runTests(): Promise<CommandResult> {
	return runCommand(['bun', 'run', 'test']);
}
