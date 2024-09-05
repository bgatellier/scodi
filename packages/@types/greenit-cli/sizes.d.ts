type SizeNames =
	| "desktop"
	| "galaxyS9"
	| "galaxyS20"
	| "iPhone8"
	| "iPhone8Plus"
	| "iPhoneX"
	| "iPad";

type Properties = {
	width: number;
	height: number;
	isMobile: boolean;
};

declare const sizes: Record<SizeNames, Properties>;

export type { SizeNames };
export default sizes;
