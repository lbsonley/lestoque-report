import type {
	CandlestickData,
	SeriesMarker,
	SeriesMarkerPosition,
	SeriesMarkerShape,
} from "lightweight-charts";

export type PriceDataRaw = Array<{
	datetime: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}>;

export interface StudyDataItem {
	time: number;
	value: number;
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

export type PriceData = CandlestickData<number>[];
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
		time: new Date(datetime).getTime() / 1000,
		open,
		high,
		low,
		close,
	}));

export const mapVolumeData: (data: PriceDataRaw) => StudyData = (data) =>
	data.map(({ datetime, open, close, volume }) => ({
		time: new Date(datetime).getTime() / 1000,
		value: volume,
		// color: close >= open ? "#26a69a" : "#ef5350",
	}));

export const mapCandlestickSignals: (
	data: CandlestickSignalsData,
) => SeriesMarker<number>[] = (data) => {
	const markers = [];

	for (const [key, signals] of Object.entries(data)) {
		if (signals.length > 0) {
			for (const time of signals) {
				markers.push({
					time: new Date(time).getTime() / 1000,
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
