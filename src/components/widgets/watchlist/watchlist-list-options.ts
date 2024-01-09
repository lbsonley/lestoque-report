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
				
			</select>
		</fieldset>
	</form>
`;

class WatchlistListOptions extends HTMLElement {
	watchlistEl: HTMLSelectElement | null = null;
	watchlistItems: string[] | null = null;

	buildWatchlistOptions() {
		const watchlistOptionsMarkup = this.watchlistItems?.reduce((acc, item) => {
			acc += `<option value="${item}" label="${item}" />\n`;
			return acc;
		}, "");

		this.watchlistEl!.innerHTML = watchlistOptionsMarkup!;
	}

	handleWatchlistChange(event: Event) {
		state.updateWatchlist((event.target as HTMLInputElement).value);
	}

	async render() {
		this.shadowRoot?.appendChild(template.content.cloneNode(true));
		this.watchlistEl = this.shadowRoot!.querySelector("#watchlist");

		const request = await fetch("http://localhost:8000/api/watchlist-names");
		const response = await request.json();
		this.watchlistItems = response;
		this.buildWatchlistOptions();

		this.watchlistEl!.addEventListener("change", this.handleWatchlistChange);

		state.updateWatchlist(this.watchlistEl!.value);
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
	}
}

customElements.define("watchlist-list-options", WatchlistListOptions);
