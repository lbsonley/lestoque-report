import state from "@state/watchlist-state";

const template = document.createElement("template");
template.innerHTML = `
<form>
	<label for="portfolioValue">Portfolio Value</label>
	<input id="portfolioValue" class="input" type="text" name="portfolioValue" value="" />
	<label for="ATR">ATR</label>
	<input disabled id="atr" class="input" type="text" name="atr" value="" />
	<label for="shares">Shares</label>
	<input disabled id="shares" class="input"type="text" name="shares" value="" />
</form>
`;

class PositionSizer extends HTMLElement {
	portfolioValueEl: HTMLInputElement | null = null;
	atrEl: HTMLInputElement | null = null;
	sharesEl: HTMLInputElement | null = null;
	atr: number | null = null;

	handlePortfolioValueInput(event: Event) {
		console.log(parseInt((event.target as HTMLInputElement).value, 10));
	}

	render() {
		this.shadowRoot!.appendChild(template.content.cloneNode(true));
		this.portfolioValueEl = this.shadowRoot!.querySelector("#portfolioValue");
		this.atrEl = this.shadowRoot!.querySelector("#atr");
		this.sharesEl = this.shadowRoot!.querySelector("#shares");
		console.log(this.portfolioValueEl, this.atrEl, this.sharesEl);

		this.portfolioValueEl!.addEventListener(
			"input",
			this.handlePortfolioValueInput,
		);
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();

		state.selectedSymbol$.subscribe((symbol) => {
			console.log(symbol);
			// todo fetch daily data for symbol
		});
	}
}

customElements.define("position-sizer", PositionSizer);
