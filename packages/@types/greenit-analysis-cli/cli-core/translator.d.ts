class Translator {
	getCatalog(): void;
	setLocale(locale: string): void;
	translateRule(rule: string): string;
	translate(key: string): string;
	translateWithArgs(key: string, ...args: unknown[]): string;
}

declare const translator: typeof Translator;

export { translator };
