export const assignIfPresent = <Target extends object, K extends keyof Target>(
	source: Partial<Target>,
	key: K,
	target: Target,
): void => {
	if (Object.hasOwn(source, key)) {
		target[key] = source[key] as Target[K];
	}
};
