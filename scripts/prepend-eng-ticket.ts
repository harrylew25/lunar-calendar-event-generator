const SKIP_SOURCES = new Set(['merge', 'squash']);

export const isProtectedBranch = (branch: string): boolean => {
	return (
		branch === 'develop' ||
		branch === 'staging' ||
		branch === 'release' ||
		branch.startsWith('release/')
	);
};

export const extractEngTicket = (branch: string): string | undefined => {
	const match = /eng-(\d+)/i.exec(branch);
	const number = match?.[1];
	if (number === undefined) {
		return undefined;
	}
	return `ENG-${number}`;
};

export const prependEngTicket = (message: string, ticket: string): string => {
	const prefix = `[${ticket}] `;
	const lines = message.split('\n');
	const firstIdx = lines.findIndex(
		(line) => line.trim() !== '' && !line.startsWith('#'),
	);

	if (firstIdx === -1) {
		return `${prefix}\n${message}`;
	}

	const first = lines[firstIdx];
	if (first === undefined || /^\[[A-Z]+-\d+\] /.test(first)) {
		return message;
	}

	lines[firstIdx] = `${prefix}${first}`;
	return lines.join('\n');
};

const currentBranch = (): string => {
	const result = Bun.spawnSync({
		cmd: ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
		stdout: 'pipe',
		stderr: 'pipe',
	});
	return result.stdout.toString().trim();
};

const messageFile = process.argv[2];
const source = process.argv[3];

if (
	messageFile === undefined ||
	(source !== undefined && SKIP_SOURCES.has(source))
) {
	process.exit(0);
}

const branch = currentBranch();
if (branch === 'HEAD' || isProtectedBranch(branch)) {
	process.exit(0);
}

const ticket = extractEngTicket(branch);
if (ticket === undefined) {
	process.exit(0);
}

const file = Bun.file(messageFile);
const message = await file.text();
const next = prependEngTicket(message, ticket);
if (next !== message) {
	await Bun.write(messageFile, next);
}
