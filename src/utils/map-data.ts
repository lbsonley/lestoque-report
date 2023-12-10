import type { CandlestickData, Time } from "lightweight-charts";

export type PriceDataRaw = Array<{
	datetime: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	atr: number;
}>;

export interface PriceDataItem {
	time: Time;
	open: number;
	high: number;
	low: number;
	close: number;
}

export interface StudyDataItem {
	time: Time;
	value: number;
}

export type PriceData = CandlestickData<Time>[];
export type StudyData = StudyDataItem[];

export const mapPriceData: (data: PriceDataRaw) => PriceData = (data) =>
	data.map(({ datetime, open, high, low, close }) => ({
		time: (parseInt(datetime) / 1000) as Time,
		open,
		high,
		low,
		close,
	}));

export const mapVolumeData: (data: PriceDataRaw) => StudyData = (data) =>
	data.map(({ datetime, open, close, volume }) => ({
		time: (parseInt(datetime) / 1000) as Time,
		value: volume,
		color: close >= open ? "#26a69a" : "#ef5350",
	}));

export const mapAtrData: (data: PriceDataRaw) => StudyData = (data) =>
	data.map(({ datetime, atr }) => ({
		time: (parseInt(datetime) / 1000) as Time,
		value: atr,
	}));
