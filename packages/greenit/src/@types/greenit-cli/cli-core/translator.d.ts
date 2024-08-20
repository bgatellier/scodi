declare module "greenit-cli/cli-core/translator.js" {
	class Translator {
		getCatalog(): void;
		setLocale(locale: string): void;

		translateRule(rule: string): string;

		translate(key: string): string;

		translateWithArgs(key: string, ...args: unknown[]): string;
	}

	export const translator = new Translator();
}
