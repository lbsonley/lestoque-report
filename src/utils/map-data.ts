import type {
	CandlestickData,
	Time,
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

export type CandlestickPatterns =
	| "belthold"
	| "counterattack"
	| "darkcloudcover"
	| "doji"
	| "dojistar"
	| "engulfing"
	| "eveningdojistar"
	| "eveningstar"
	| "hammer"
	| "hangingman"
	| "harami"
	| "haramicross"
	| "invertedhammer"
	| "morningdojistar"
	| "morningstar"
	| "piercing"
	| "shootingstar"
	| "takuri";

export type CandlestickSignalsData = {
	[key in CandlestickPatterns]: Time[];
};

export type PriceData = CandlestickData<Time>[];
export type StudyData = StudyDataItem[];

const patternMap: {
	[key in CandlestickPatterns]: {
		abbr: string;
		position: SeriesMarkerPosition;
	};
} = {
	belthold: { abbr: "bh", position: "inBar" },
	counterattack: { abbr: "ca", position: "inBar" },
	darkcloudcover: { abbr: "dcc", position: "belowBar" },
	doji: { abbr: "d", position: "inBar" },
	dojistar: { abbr: "ds", position: "inBar" },
	engulfing: { abbr: "en", position: "inBar" },
	eveningdojistar: { abbr: "eds", position: "aboveBar" },
	eveningstar: { abbr: "es", position: "aboveBar" },
	hammer: { abbr: "hmr", position: "inBar" },
	hangingman: { abbr: "hm", position: "aboveBar" },
	harami: { abbr: "hrm", position: "inBar" },
	haramicross: { abbr: "hrmc", position: "inBar" },
	invertedhammer: { abbr: "ihmr", position: "inBar" },
	morningdojistar: { abbr: "mds", position: "belowBar" },
	morningstar: { abbr: "ms", position: "belowBar" },
	piercing: { abbr: "p", position: "aboveBar" },
	shootingstar: { abbr: "ss", position: "aboveBar" },
	takuri: { abbr: "t", position: "aboveBar" },
};

export const mapPriceData: (data: PriceDataRaw) => PriceData = (data) =>
	data.map(({ datetime, open, high, low, close }) => ({
		time: datetime as Time,
		open,
		high,
		low,
		close,
	}));

export const mapVolumeData: (data: PriceDataRaw) => StudyData = (data) =>
	data.map(({ datetime, open, close, volume }) => ({
		time: datetime,
		value: volume,
		// color: close >= open ? "#26a69a" : "#ef5350",
	}));

export const mapAtrData: (data: PriceDataRaw) => StudyData = (data) =>
	data.map(({ datetime, atr }) => ({
		time: datetime,
		value: atr,
	}));

export const mapCandlestickSignals: (
	data: CandlestickSignalsData,
) => SeriesMarker<Time>[] = (data) => {
	const markers = [];

	for (const [key, signals] of Object.entries(data)) {
		if (signals.length > 0) {
			for (const time of signals) {
				markers.push({
					time: time,
					position: "aboveBar" as SeriesMarkerPosition,
					color: "#f68410",
					shape: "circle" as SeriesMarkerShape,
					text: patternMap[key as CandlestickPatterns].abbr,
				});
			}
		}
	}

	markers.sort((a, b) => (a.time as number) - (b.time as number));

	return markers;
};
