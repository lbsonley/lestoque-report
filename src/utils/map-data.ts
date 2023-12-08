import type { CandlestickData, Time } from "lightweight-charts";

export interface PriceDataRaw {
	[key: string]: {
		open: number;
		high: number;
		low: number;
		close: number;
		volume: number;
		atr: number;
		atr_pct: number;
		sell_stop_loss: number;
		buy_stop_loss: number;
	};
}

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
	Object.entries(data).map(([time, { open, high, low, close }]) => ({
		time: (parseInt(time) / 1000) as Time,
		open,
		high,
		low,
		close,
	}));

export const mapVolumeData: (data: PriceDataRaw) => StudyData = (data) =>
	Object.entries(data).map(([time, { open, close, volume }]) => ({
		time: (parseInt(time) / 1000) as Time,
		value: volume,
		color: close >= open ? "#26a69a" : "#ef5350",
	}));

export const mapAtrData: (data: PriceDataRaw) => StudyData = (data) =>
	Object.entries(data).map(([time, { atr }]) => ({
		time: (parseInt(time) / 1000) as Time,
		value: atr,
	}));

export const mapAtrPctData: (data: PriceDataRaw) => StudyData = (data) =>
	Object.entries(data).map(([time, { atr_pct }]) => ({
		time: (parseInt(time) / 1000) as Time,
		value: atr_pct,
	}));

export const mapSellStopLossData: (data: PriceDataRaw) => StudyData = (data) =>
	Object.entries(data).map(([time, { sell_stop_loss }]) => ({
		time: (parseInt(time) / 1000) as Time,
		value: sell_stop_loss,
	}));

export const mapBuyStopLossData: (data: PriceDataRaw) => StudyData = (data) =>
	Object.entries(data).map(([time, { buy_stop_loss }]) => ({
		time: (parseInt(time) / 1000) as Time,
		value: buy_stop_loss,
	}));
