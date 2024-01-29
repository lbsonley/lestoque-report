import state from "@state/watchlist-state";

const template = document.createElement("template");
template.innerHTML = `
	<style>
		.list-options__fieldset {
			border: none;
			padding: 0;
		}
	</style>
	<form>
		<fieldset class="list-options__fieldset">
			<label for="watchlist">Watchlist</label>
			<select id="watchlist" name="watchlist">
				<option value="outperformers" label="Outperformers" />\n
				<option value="etfs" label="Index and Sector ETFs" />\n
				<option value="holdings" label="Holdings" selected />\n
			</select>
		</fieldset>
	</form>
`;

class WatchlistListOptions extends HTMLElement {
	watchlistEl: HTMLSelectElement | null = null;
	watchlistItems: string[] | null = null;

	handleWatchlistChange(event: Event) {
		state.updateWatchlist((event.target as HTMLInputElement).value);
	}

	async render() {
		this.shadowRoot?.appendChild(template.content.cloneNode(true));
		this.watchlistEl = this.shadowRoot!.querySelector("#watchlist");

		this.watchlistEl!.addEventListener("change", this.handleWatchlistChange);

		state.updateWatchlist(this.watchlistEl!.value);
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
	}
}

customElements.define("watchlist-list-options", WatchlistListOptions);
