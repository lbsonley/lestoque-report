import type { CandlestickData, Time } from "lightweight-charts";

export interface PriceDataRaw {
	[key: string]: {
		open: number;
		high: number;
		low: number;
		close: number;
	};
}

export interface PriceDataItem {
	time: Time;
	open: number;
	high: number;
	low: number;
	close: number;
}

export type PriceData = CandlestickData<Time>[];

export const mapPriceData: (data: PriceDataRaw) => PriceData = (data) =>
	Object.entries(data).map(([time, { open, high, low, close }]) => ({
		time: (parseInt(time) / 1000) as Time,
		open,
		high,
		low,
		close,
	}));
