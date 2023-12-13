import { createChart } from "lightweight-charts";

export const useChart = (
	wrapper: string | HTMLElement,
	symbol: string,
	interval: string,
) => {
	const chart = createChart(wrapper as string | HTMLElement, {
		autoSize: true,
		handleScale: false,
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
		upColor: "#26a69a",
		downColor: "#ef5350",
		borderVisible: false,
		wickUpColor: "#26a69a",
		wickDownColor: "#ef5350",
	});

	candlestickSeries.priceScale().applyOptions({
		scaleMargins: {
			top: 0.1, // highest point of the series will be 10% away from the top
			bottom: 0.2, // lowest point will be 20% away from the bottom
		},
	});

	const volumeSeries = chart.addHistogramSeries({
		color: "#26a69a",
		priceFormat: {
			type: "volume",
		},
		priceScaleId: "", // set as an overlay by setting a blank priceScaleId
	});

	volumeSeries.priceScale().applyOptions({
		scaleMargins: {
			top: 0.8, // highest point of the series will be 80% away from the top
			bottom: 0,
		},
	});

	return {
		chart,
		candlestickSeries,
		volumeSeries,
	};
};
