import state from "@state/watchlist-state";

const styles = `
<style>
	.watchlist__list {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
	}

	.watchlist__item {
		list-style: none;
	}

	.watchlist__symbol {
		display: flex;
		flex-flow: column nowrap;
		width: 100%;
		padding: 24px 16px;
		border: 1px solid #141c25;
	}

	.watchlist__symbol span {
		pointer-events: none;
	}

	.visually-hidden {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		pointer-events: none;
		clip-path: circle(0);
	}
</style>
`;
const template = document.createElement("template");

class WatchlistSidebar extends HTMLElement {
	symbolRadios: NodeList | null = null;

	static observedAttributes = ["securities"];

	buildSidebarItems = (securities) => {
		return securities.reduce(
			(sidebarItems, { symbol, name, sector, subIndustry }) => {
				sidebarItems += `
			<input
				type="radio"
				id=${symbol}
				name="symbol"
				value=${symbol}
				data-watchlist="symbol"
			/>
			<label for=${symbol}>
				<span>
					${name} (${symbol})
				</span>
				<span>
					${sector} - ${subIndustry}
				</span>
			</label>
			`;

				return sidebarItems;
			},
			"",
		);
	};

	render = (securities) => {
		// remove any event listeners attached to the previous symbol list
		if (this.symbolRadios?.length) {
			for (const radio of Array.from(this.symbolRadios)) {
				radio.removeEventListener("change", this.handleSymbolChange);
			}
		}

		// clear the inner HTML
		this.shadowRoot.innerHTML = "";

		if (securities === null) {
			template.innerHTML = `<h2>Loading...</h2>`;
		} else if (securities.length > 0) {
			template.innerHTML = `
				${styles}\n
				<form class="watchlist__pane">
					<fieldset class="watchlist__list">
						<legend class="visually-hidden">Symbol List</legend>
						${this.buildSidebarItems(securities)}
					</fieldset>
				</form>
			`;
		}

		// append the new symbol list to the DOM
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		// get references to the DOM Nodes
		this.symbolRadios = this.shadowRoot.querySelectorAll(
			"[data-watchlist='symbol']",
		);

		// attach even listeners to the symbols list items
		if (this.symbolRadios.length) {
			for (const radio of Array.from(this.symbolRadios)) {
				radio.addEventListener("change", this.handleSymbolChange);
			}
		}
	};

	updateRadios = (symbol) => {
		for (const radio of this.symbolRadios) {
			radio.checked = radio.value === symbol;
		}
	};

	handleSymbolChange = (event: Event | string) => {
		if (event.target && event.target instanceof HTMLElement) {
			const url = new URL(location);
			url.searchParams.set("symbol", event.target.value);
			history.pushState({}, "", url);
			state.updateSymbol(event.target.value);
		} else {
			this.updateRadios(event);
			state.updateSymbol(event);
		}
	};

	connectedCallback() {
		this.attachShadow({ mode: "open" });
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.render(JSON.parse(newValue));
	}

	disconnectedCallback() {
		for (const button of Array.from(this.symbolRadios!)) {
			button.removeEventListener("change", this.handleSymbolChange);
		}
	}
}

customElements.define("watchlist-sidebar", WatchlistSidebar);
