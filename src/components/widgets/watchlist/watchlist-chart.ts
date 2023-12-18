import { useChart } from "@utils/chart";
import { mapPriceData, mapVolumeData } from "@utils/map-data.ts";
import type { PriceData, StudyData } from "@utils/map-data.ts";
import { formatDate } from "@utils/format";

const styles = `
<style>
	.candlestick-chart__wrapper {
		width: 100%;
		aspect-ratio: 16/9;
		overflow: hidden;
	}
</style>
`;
const template = document.createElement("template");

class WatchlistChart extends HTMLElement {
	chartWrapper: HTMLElement | null = null;
	chartInstance: any;
	isProd = import.meta.env.PROD;
	symbol: string | null = null;
	interval: string | null = null;
	weeks: string | null = null;
	updateCount = 0;
	debounceTimeout: number | null = null;

	static observedAttributes = ["symbol", "interval", "weeks"];

	buildUrl(dateString: string) {
		const domain = this.isProd
			? "https://yf-api.vercel.app"
			: "http://localhost:3000";

		return `${domain}/api/history?symbol=${this.symbol}&interval=${this.interval}&weeks=${this.weeks}&end=${dateString}`;
	}

	async fetchHistory(url: string) {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	}

	render() {
		template.innerHTML = `
			${styles}\n
			<div class="candlestick-chart__wrapper"></div>
		`;
		this.shadowRoot!.appendChild(template.content.cloneNode(true));
		this.chartWrapper = this.shadowRoot!.querySelector(
			".candlestick-chart__wrapper",
		);
	}

	async updateChart() {
		const date = new Date();
		const dateString = formatDate(date);

		const { chart, candlestickSeries, volumeSeries } = this.chartInstance;

		// let pline, r1line, r2line, s1line, s2line;
		this.updateCount += 1;
		console.log(this.updateCount);

		const url = this.buildUrl(dateString);

		const history = await this.fetchHistory(url);

		const priceData: PriceData = mapPriceData(history);
		const volumeData: StudyData = mapVolumeData(history);

		chart.applyOptions({
			watermark: {
				text: `${this.symbol} | ${this.interval}`,
			},
		});

		candlestickSeries.setData(priceData);
		volumeSeries.setData(volumeData);
		chart.timeScale().fitContent();

		// 	const { high, low, close } = priceData[priceData.length - 1];

		// 	const p = (high + low + close) / 3;
		// 	const r1 = p * 2 - low;
		// 	const r2 = p + high - low;
		// 	const s1 = p * 2 - high;
		// 	const s2 = p - high + low;

		// 	if (updateCount > 1) {
		// 		candlestickSeries.removePriceLine(pline);
		// 		candlestickSeries.removePriceLine(r1line);
		// 		candlestickSeries.removePriceLine(r2line);
		// 		candlestickSeries.removePriceLine(s1line);
		// 		candlestickSeries.removePriceLine(s2line);
		// 	}

		// 	const priceLineOptions = {
		// 		color: "#597ca4",
		// 		lineWidth: 1,
		// 		lineStyle: 2, // LineStyle.Dashed
		// 		axisLabelVisible: true,
		// 	};
		// 	pline = candlestickSeries.createPriceLine({
		// 		...priceLineOptions,
		// 		price: p,
		// 		title: "p",
		// 	});
		// 	r1line = candlestickSeries.createPriceLine({
		// 		...priceLineOptions,
		// 		price: r1,
		// 		title: "r1",
		// 	});
		// 	r2line = candlestickSeries.createPriceLine({
		// 		...priceLineOptions,
		// 		price: r2,
		// 		title: "r2",
		// 	});
		// 	s1line = candlestickSeries.createPriceLine({
		// 		...priceLineOptions,
		// 		price: s1,
		// 		title: "s1",
		// 	});
		// 	s2line = candlestickSeries.createPriceLine({
		// 		...priceLineOptions,
		// 		price: s2,
		// 		title: "s2",
		// 	});
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
		this.chartInstance = useChart(
			this.chartWrapper as string | HTMLElement,
			this.symbol,
		);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this[name] = newValue;

		if (this.debounceTimeout) {
			cancelAnimationFrame(this.debounceTimeout);
		}

		this.debounceTimeout = requestAnimationFrame(() => {
			this.updateChart();
		});
	}
}

customElements.define("watchlist-chart", WatchlistChart);
