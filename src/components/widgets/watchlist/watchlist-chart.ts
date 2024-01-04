import { useChart } from "@utils/chart";
import {
	mapPriceData,
	mapVolumeData,
	mapCandlestickSignals,
} from "@utils/map-data.ts";
import type { PriceData, StudyData } from "@utils/map-data.ts";

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
	start: string | null = null;
	end: string | null = null;
	updateCount = 0;
	debounceTimeout: number | null = null;

	static observedAttributes = ["symbol", "interval", "start", "end"];

	buildUrl() {
		const domain = this.isProd
			? "https://yf-api.vercel.app"
			: "http://localhost:8000";

		return `${domain}/api/history?symbol=${this.symbol}&interval=${this.interval}&start=${this.start}&end=${this.end}`;
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
		const { chart, candlestickSeries, volumeSeries } = this.chartInstance;

		this.updateCount += 1;
		console.log(this.updateCount);

		const url = this.buildUrl();

		const { history, candlestickSignals } = await this.fetchHistory(url);

		const priceData: PriceData = mapPriceData(history);
		const volumeData: StudyData = mapVolumeData(history);
		const candlestickMarkers = mapCandlestickSignals(candlestickSignals);

		chart.applyOptions({
			watermark: {
				text: `${this.symbol} | ${this.interval}`,
			},
		});

		candlestickSeries.setData(priceData);
		volumeSeries.setData(volumeData);
		chart.timeScale().fitContent();

		candlestickSeries.setMarkers(candlestickMarkers);
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
		this.chartInstance = useChart(
			this.chartWrapper as string | HTMLElement,
			this.symbol!,
		);
	}

	attributeChangedCallback(
		name: "symbol" | "interval" | "start" | "end",
		oldValue: string | null,
		newValue: string | null,
	) {
		if (oldValue === newValue) {
			return;
		}
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
