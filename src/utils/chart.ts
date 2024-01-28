import { CrosshairMode, LineStyle, createChart } from "lightweight-charts";

export const useChart = (wrapper: string | HTMLElement, symbol: string) => {
	const chart = createChart(wrapper as string | HTMLElement, {
		autoSize: true,
		crosshair: { mode: CrosshairMode.Normal },
		handleScale: true,
		handleScroll: false,
		timeScale: {
			rightOffset: 3,
			timeVisible: true,
		},
	});

	chart.applyOptions({
		watermark: {
			visible: true,
			fontSize: 192,
			fontStyle: "bold",
			horzAlign: "center",
			vertAlign: "center",
			color: "rgba(89, 124, 164, 0.2)",
			text: `${symbol}`,
		},
	});

	const candlestickSeries = chart.addCandlestickSeries({
		upColor: "#fff",
		downColor: "#000",
		// upColor: "#26a69a",
		// downColor: "#ef5350",
		borderVisible: true,
		borderColor: "#000",
		wickUpColor: "#000",
		wickDownColor: "#000",
		priceLineColor: "#000",
		// wickUpColor: "#26a69a",
		// wickDownColor: "#ef5350",
	});

	candlestickSeries.priceScale().applyOptions({
		scaleMargins: {
			top: 0.1, // highest point of the series will be 10% away from the top
			bottom: 0.2, // lowest point will be 20% away from the bottom
		},
	});

	const lowerTrendSeries = chart.addLineSeries({
		color: "#556D73",
		lineWidth: 1,
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		priceLineVisible: false,
	});

	lowerTrendSeries.priceScale().applyOptions({
		scaleMargins: {
			top: 0.02, // highest point of the series will be 5% away from the top
			bottom: 0.1, // lowest point will be 10% away from the bottom
		},
	});

	const upperTrendSeries = chart.addLineSeries({
		color: "#556D73",
		lineWidth: 1,
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		priceLineVisible: false,
	});

	upperTrendSeries.priceScale().applyOptions({
		scaleMargins: {
			top: 0.02, // highest point of the series will be 5% away from the top
			bottom: 0.1, // lowest point will be 10% away from the bottom
		},
	});

	const volumeSeries = chart.addHistogramSeries({
		color: "#000",
		// color: "#26a69a",
		priceFormat: {
			type: "volume",
		},
		priceScaleId: "", // set as an overlay by setting a blank priceScaleId
	});

	volumeSeries.priceScale().applyOptions({
		scaleMargins: {
			top: 0.9, // highest point of the series will be 90% away from the top
			bottom: 0,
		},
	});

	return {
		chart,
		candlestickSeries,
		lowerTrendSeries,
		upperTrendSeries,
		volumeSeries,
	};
};
