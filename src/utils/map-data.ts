import type {
	CandlestickData,
	SeriesMarker,
	SeriesMarkerPosition,
	SeriesMarkerShape,
	UTCTimestamp,
} from "lightweight-charts";

export type PriceDataRaw = Array<{
	datetime: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	upper_trend: number;
	lower_trend: number;
}>;

export interface StudyDataItem {
	time: UTCTimestamp;
	value: number;
}

export type PivotType = "high" | "low";

export interface PivotData {
	datetime: string;
	value: number;
	type: PivotType;
}
export interface SupportResistanceData {
	start: UTCTimestamp;
	end: UTCTimestamp;
	value: number;
	type: PivotType;
}

export type CandlestickPatterns =
	| "darkcloudcover"
	| "doji"
	| "dojistar"
	| "engulfing"
	| "eveningdojistar"
	| "eveningstar"
	| "hammer"
	| "hangingman"
	| "morningdojistar"
	| "morningstar"
	| "piercing";

export type CandlestickSignalsData = {
	[key in CandlestickPatterns]: string[];
};

export type PriceData = CandlestickData<UTCTimestamp>[];
export type StudyData = StudyDataItem[];

const patternMap: {
	[key in CandlestickPatterns]: {
		abbr: string;
		position: SeriesMarkerPosition;
	};
} = {
	darkcloudcover: { abbr: "dcc", position: "aboveBar" },
	doji: { abbr: "d", position: "aboveBar" },
	dojistar: { abbr: "ds", position: "aboveBar" },
	engulfing: { abbr: "en", position: "aboveBar" },
	eveningdojistar: { abbr: "eds", position: "aboveBar" },
	eveningstar: { abbr: "es", position: "aboveBar" },
	hammer: { abbr: "hmr", position: "aboveBar" },
	hangingman: { abbr: "hm", position: "aboveBar" },
	morningdojistar: { abbr: "mds", position: "belowBar" },
	morningstar: { abbr: "ms", position: "belowBar" },
	piercing: { abbr: "p", position: "belowBar" },
};

export const mapPriceData: (data: PriceDataRaw) => PriceData = (data) =>
	data.map(({ datetime, open, high, low, close }) => ({
		time: (new Date(datetime).getTime() / 1000) as UTCTimestamp,
		open,
		high,
		low,
		close,
	}));

export const mapVolumeData: (data: PriceDataRaw) => StudyData = (data) =>
	data.map(({ datetime, volume }) => ({
		time: (new Date(datetime).getTime() / 1000) as UTCTimestamp,
		value: volume,
	}));

interface TrendlineData {
	upper: StudyData;
	lower: StudyData;
}
export const mapTrendlineData: (data: PriceDataRaw) => TrendlineData = (
	data,
) => {
	const upper = data.map(({ datetime, upper_trend }) => ({
		time: (new Date(datetime).getTime() / 1000) as UTCTimestamp,
		value: upper_trend,
	}));

	const lower = data.map(({ datetime, lower_trend }) => ({
		time: (new Date(datetime).getTime() / 1000) as UTCTimestamp,
		value: lower_trend,
	}));

	return { upper, lower };
};

export const mapCandlestickSignals: (
	data: CandlestickSignalsData,
) => SeriesMarker<UTCTimestamp>[] = (data) => {
	const markers = [];

	for (const [key, signals] of Object.entries(data)) {
		if (signals.length > 0) {
			for (const time of signals) {
				markers.push({
					time: (new Date(time).getTime() / 1000) as UTCTimestamp,
					position: patternMap[key as CandlestickPatterns].position,
					color: "#f68410",
					shape: "circle" as SeriesMarkerShape,
					text: patternMap[key as CandlestickPatterns].abbr,
				});
			}
		}
	}

	markers.sort((a, b) => a.time - b.time);

	return markers;
};

interface PivotDates {
	[key: number]: { type: PivotType };
}

export const mapPivotLines: (
	pivots: PivotData[],
	priceData: PriceData,
) => SupportResistanceData[] = (pivots, priceData) => {
	// create an map where pivot timestamps are properties
	// and contain the pivot type ("high" or "low")
	const pivotDates = pivots.reduce<PivotDates>((acc, { datetime, type }) => {
		const timestamp = new Date(datetime).getTime() / 1000;
		acc[timestamp] = { type: type };
		return acc;
	}, {});

	// array to hold the support resistance line configuration
	const pivotPriceData: SupportResistanceData[] = [];

	// loop through price data and get the timestamps from the price data
	// so that they match up when we graph the support/resistance lines later
	priceData.forEach((bar, index) => {
		// if the current priceData bar matches one of the pivot timestamps
		if (Object.keys(pivotDates).includes(bar.time.toString())) {
			// use the timestamp to get the pivot type from the pivotDates map
			const highLow = pivotDates[bar.time].type;

			// add it to the pivot price data array
			pivotPriceData.push({
				start: bar.time,
				// get the timestamp from 9 bars forward for the end of the S/R line
				end: priceData[index + 4].time,
				// get the "high" or "low" price depending on pivot type
				value: bar[highLow],
				// add the type explicitly in case we want to do something with it later
				type: highLow,
			});
			return true;
		}
	});

	return pivotPriceData;
};
