import type { CandlestickData, Time } from "lightweight-charts";

export interface PriceDataRaw {
	[key: string]: {
		open: number;
		high: number;
		low: number;
		close: number;
		volume: number;
	};
}

export interface PriceDataItem {
	time: Time;
	open: number;
	high: number;
	low: number;
	close: number;
}
export interface VolumeDataItem {
	time: Time;
	value: number;
}

export type PriceData = CandlestickData<Time>[];
export type VolumeData = VolumeDataItem[];

export const mapPriceData: (data: PriceDataRaw) => PriceData = (data) =>
	Object.entries(data).map(([time, { open, high, low, close }]) => ({
		time: (parseInt(time) / 1000) as Time,
		open,
		high,
		low,
		close,
	}));

export const mapVolumeData: (data: PriceDataRaw) => VolumeData = (data) =>
	Object.entries(data).map(([time, { open, close, volume }]) => ({
		time: (parseInt(time) / 1000) as Time,
		value: volume,
		color: close >= open ? "#26a69a" : "#ef5350",
	}));
