import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

type ReactActEnvironment = {
	// biome-ignore lint/style/useNamingConvention: React act() environment flag
	IS_REACT_ACT_ENVIRONMENT?: boolean;
};

const globals = globalThis as ReactActEnvironment;
globals.IS_REACT_ACT_ENVIRONMENT = true;
