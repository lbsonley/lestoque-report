import state from "@state/watchlist-state";

const template = document.createElement("template");
template.innerHTML = `
	<style>
		.chart-options__fieldset {
			border: none;
			padding: 0;
		}
	</style>
	<form>
		<fieldset class="chart-options__fieldset">
			<label for="interval">Interval</label>
			<select id="interval" name="interval">
				<option value="90m" label="90m" />
				<option value="1d" label="Daily" selected />
				<option value="1wk" label="Weekly" />
				<option value="1mo" label="Monthly" />
			</select>
		</fieldset>
	</form>
`;

class WatchlistChartOptions extends HTMLElement {
	intervalEl: HTMLSelectElement | null = null;

	handleIntervalChange(event: Event) {
		state.updateInterval((event.target as HTMLInputElement).value);
	}

	render() {
		this.shadowRoot?.appendChild(template.content.cloneNode(true));

		this.intervalEl = this.shadowRoot!.querySelector("#interval");

		this.intervalEl!.addEventListener("change", this.handleIntervalChange);

		state.updateInterval(this.intervalEl!.value);
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
	}
}

customElements.define("watchlist-chart-options", WatchlistChartOptions);
