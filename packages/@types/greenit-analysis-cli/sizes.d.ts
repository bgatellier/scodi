type Devices =
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

declare const devices: Record<Devices, Properties>;

export type { Devices };
export default devices;
