import type { ModuleListenerInterface } from "@scodi/common";

export const listenerModules: ModuleListenerInterface[] = [
	{
		id: "listener1",
		name: "Scodi Listener1",
		service: {
			name: "Listener1",
		},
		notifyAnalysisDone: () => Promise.resolve(),
		verbose: false,
	},
];
