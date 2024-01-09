import state from "@state/watchlist-state";

const styles = `
<style>
	.watchlist__list {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		border: none;
		padding: 0;
	}

	.watchlist__item {
		list-style: none;
	}

	.watchlist__label {
		display: flex;
		flex-flow: column nowrap;
		width: calc(100% - 48px);
		padding: 24px 16px;
		border-bottom: 1px solid #141c25;
	}

	input:checked + .watchlist__label {
		background-color: #141c2540;
	}

	.watchlist__symbol {
		margin: 0;
		font-size: 24px;

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

type NullableString = string | undefined | null;
class WatchlistList extends HTMLElement {
	symbolRadios: NodeList | null = null;

	static observedAttributes = ["securities"];

	buildLabel = (
		symbol: NullableString,
		name: NullableString,
		sector: NullableString,
		subIndustry: NullableString,
	) => {
		let label = `<h4 class="watchlist__symbol">${name} (${symbol})</h4>`;
		label = sector
			? label +
			  `
			<span class="watchlist__sector"> <strong>Sector:</strong>&nbsp;${sector} </span>
		`
			: label;
		label = subIndustry
			? label +
			  `
			<span class="watchlist__sector"> <strong>Sub-Industry:</strong>&nbsp;${subIndustry} </span>
		`
			: label;

		return label;
	};

	buildSidebarItems = (securities) => {
		return securities.reduce(
			(
				sidebarItems,
				{
					symbol,
					name,
					sector,
					subIndustry,
				}: {
					symbol: NullableString;
					name: NullableString;
					sector: NullableString;
					subIndustry: NullableString;
				},
			) => {
				sidebarItems += `
			<input
				class="visually-hidden"
				type="radio"
				id=${symbol}
				name="symbol"
				value=${symbol}
				data-watchlist="symbol"
			/>
			<label class="watchlist__label" for=${symbol}>
				${this.buildLabel(symbol, name, sector, subIndustry)}
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
		this.shadowRoot!.appendChild(template.content.cloneNode(true));

		// get references to the DOM Nodes
		this.symbolRadios = this.shadowRoot!.querySelectorAll(
			"[data-watchlist='symbol']",
		);

		// attach even listeners to the symbols list items
		if (this.symbolRadios.length) {
			Array.from(this.symbolRadios).forEach((radio, index) => {
				if (index === 0) {
					(radio as HTMLInputElement).checked = true;
					state.updateSymbol((radio as HTMLInputElement).value);
				}
				radio.addEventListener("change", this.handleSymbolChange);
			});
		}
	};

	handleSymbolChange = (event: Event) => {
		state.updateSymbol((event.target as HTMLInputElement).value);
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

customElements.define("watchlist-list", WatchlistList);
