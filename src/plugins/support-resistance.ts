import type { BitmapCoordinatesRenderingScope } from "fancy-canvas";
import { CanvasRenderingTarget2D } from "fancy-canvas";
import type {
	AutoscaleInfo,
	Coordinate,
	IChartApi,
	ISeriesApi,
	ISeriesPrimitive,
	ISeriesPrimitivePaneRenderer,
	ISeriesPrimitivePaneView,
	Logical,
	SeriesOptionsMap,
	SeriesType,
	Time,
} from "lightweight-charts";

class SupportResistancePaneRenderer implements ISeriesPrimitivePaneRenderer {
	_p1: ViewPoint;
	_p2: ViewPoint;
	_text1: string;
	_text2: string;
	_options: SupportResistanceOptions;

	constructor(
		p1: ViewPoint,
		p2: ViewPoint,
		text1: string,
		text2: string,
		options: SupportResistanceOptions,
	) {
		this._p1 = p1;
		this._p2 = p2;
		this._text1 = text1;
		this._text2 = text2;
		this._options = options;
	}

	draw(target: CanvasRenderingTarget2D) {
		target.useBitmapCoordinateSpace((scope) => {
			if (
				this._p1.x === null ||
				this._p1.y === null ||
				this._p2.x === null ||
				this._p2.y === null
			)
				return;
			const ctx = scope.context;
			const x1Scaled = Math.round(this._p1.x * scope.horizontalPixelRatio);
			const y1Scaled = Math.round(this._p1.y * scope.verticalPixelRatio);
			const x2Scaled = Math.round(this._p2.x * scope.horizontalPixelRatio);
			const y2Scaled = Math.round(this._p2.y * scope.verticalPixelRatio);
			ctx.lineWidth = this._options.width;
			ctx.strokeStyle = this._options.lineColor;
			ctx.beginPath();
			ctx.moveTo(x1Scaled, y1Scaled);
			ctx.lineTo(x2Scaled, y2Scaled);
			ctx.stroke();
			this._drawTextLabel(scope, this._text1, x1Scaled, y1Scaled, true);
		});
	}

	_drawTextLabel(
		scope: BitmapCoordinatesRenderingScope,
		text: string,
		x: number,
		y: number,
		left: boolean,
	) {
		scope.context.font = "24px Arial";
		scope.context.beginPath();
		const offset = 5 * scope.horizontalPixelRatio;
		const textWidth = scope.context.measureText(text);
		const leftAdjustment = left ? textWidth.width + offset * 4 : 0;
		scope.context.fillStyle = this._options.labelBackgroundColor;
		scope.context.roundRect(
			x + offset - leftAdjustment,
			y - 24,
			textWidth.width + offset * 2,
			24 + offset,
			5,
		);
		scope.context.fill();
		scope.context.beginPath();
		scope.context.fillStyle = this._options.labelTextColor;
		scope.context.fillText(text, x + offset * 2 - leftAdjustment, y);
	}
}

interface ViewPoint {
	x: Coordinate | null;
	y: Coordinate | null;
}

class SupportResistancePaneView implements ISeriesPrimitivePaneView {
	_source: SupportResistance;
	_p1: ViewPoint = { x: null, y: null };
	_p2: ViewPoint = { x: null, y: null };

	constructor(source: SupportResistance) {
		this._source = source;
	}

	update() {
		const series = this._source._series;
		const y1 = series.priceToCoordinate(this._source._p1.price);
		const y2 = series.priceToCoordinate(this._source._p2.price);
		const timeScale = this._source._chart.timeScale();
		const x1 = timeScale.timeToCoordinate(this._source._p1.time);
		const x2 = timeScale.timeToCoordinate(this._source._p2.time);
		this._p1 = { x: x1, y: y1 };
		this._p2 = { x: x2, y: y2 };
	}

	renderer() {
		return new SupportResistancePaneRenderer(
			this._p1,
			this._p2,
			"" + this._source._p1.price.toFixed(1),
			"" + this._source._p2.price.toFixed(1),
			this._source._options,
		);
	}
}

interface Point {
	time: Time;
	price: number;
}

export interface SupportResistanceOptions {
	lineColor: string;
	width: number;
	showLabels: boolean;
	labelBackgroundColor: string;
	labelTextColor: string;
}

const defaultOptions: SupportResistanceOptions = {
	lineColor: "rgb(0, 0, 0)",
	width: 3,
	showLabels: true,
	labelBackgroundColor: "rgba(255, 255, 255, 0.85)",
	labelTextColor: "rgb(0, 0, 0)",
};

export class SupportResistance implements ISeriesPrimitive<Time> {
	_chart: IChartApi;
	_series: ISeriesApi<keyof SeriesOptionsMap>;
	_p1: Point;
	_p2: Point;
	_paneViews: SupportResistancePaneView[];
	_options: SupportResistanceOptions;
	_minPrice: number;
	_maxPrice: number;

	constructor(
		chart: IChartApi,
		series: ISeriesApi<SeriesType>,
		p1: Point,
		p2: Point,
		options?: Partial<SupportResistanceOptions>,
	) {
		this._chart = chart;
		this._series = series;
		this._p1 = p1;
		this._p2 = p2;
		this._minPrice = Math.min(this._p1.price, this._p2.price);
		this._maxPrice = Math.max(this._p1.price, this._p2.price);
		this._options = {
			...defaultOptions,
			...options,
		};
		this._paneViews = [new SupportResistancePaneView(this)];
	}

	autoscaleInfo(
		startTimePoint: Logical,
		endTimePoint: Logical,
	): AutoscaleInfo | null {
		const p1Index = this._pointIndex(this._p1);
		const p2Index = this._pointIndex(this._p2);
		if (p1Index === null || p2Index === null) return null;
		if (endTimePoint < p1Index || startTimePoint > p2Index) return null;
		return {
			priceRange: {
				minValue: this._minPrice,
				maxValue: this._maxPrice,
			},
		};
	}

	updateAllViews() {
		this._paneViews.forEach((pw) => pw.update());
	}

	paneViews() {
		return this._paneViews;
	}

	_pointIndex(p: Point): number | null {
		const coordinate = this._chart.timeScale().timeToCoordinate(p.time);
		if (coordinate === null) return null;
		const index = this._chart.timeScale().coordinateToLogical(coordinate);
		return index;
	}
}
