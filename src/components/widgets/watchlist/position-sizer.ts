import state from "@state/watchlist-state";

const template = document.createElement("template");
template.innerHTML = `
<style>
.position-sizer {
	display: flex;
	flex-flow: column nowrap;
}

.position-sizer--field {
	display: flex;
}
</style>
<form class="position-sizer">
	<div class="position-sizer--field">
		<label for="portfolioValue">Portfolio Value</label>
		<input id="portfolioValue" class="input" type="text" name="portfolioValue" value="" autocomplete="off" />
	</div>
	<div class="position-sizer--field">
		<label for="entry">Entry</label>
		<input id="entry" class="input" type="text" name="entry" value="" autocomplete="off" />
	</div>
	<div class="position-sizer--field">
		<label for="stop">Stop</label>
		<input id="stop" class="input" type="text" name="stop" value="" autocomplete="off" />
	</div>
	<button class="position-sizer--button" type="button" id="calc">Calculate</button>
	<div class="position-sizer--field">
		<label for="shares">Shares</label>
		<input disabled id="shares" class="input"type="text" name="shares" value="" />
	</div>
</form>
`;

class PositionSizer extends HTMLElement {
	portfolioValueEl: HTMLInputElement | null = null;
	stopEl: HTMLInputElement | null = null;
	entryEl: HTMLInputElement | null = null;
	sharesEl: HTMLInputElement | null = null;
	calculateEl: HTMLButtonElement | null = null;

	handleCalculatePositionSize() {
		if (
			this.portfolioValueEl!.value &&
			this.stopEl!.value &&
			this.entryEl!.value
		) {
			const portfolioRisk = parseInt(this.portfolioValueEl!.value, 10) * 0.01;
			const perShareRisk = Math.abs(
				parseFloat(this.entryEl!.value) - parseFloat(this.stopEl!.value),
			);
			const shares = Math.floor(portfolioRisk / perShareRisk);
			this.sharesEl!.value = `${shares}`;
		}
	}

	render() {
		this.shadowRoot!.appendChild(template.content.cloneNode(true));
		this.portfolioValueEl = this.shadowRoot!.querySelector("#portfolioValue");
		this.stopEl = this.shadowRoot!.querySelector("#stop");
		this.entryEl = this.shadowRoot!.querySelector("#entry");
		this.sharesEl = this.shadowRoot!.querySelector("#shares");
		this.calculateEl = this.shadowRoot!.querySelector("#calc");

		this.calculateEl?.addEventListener(
			"click",
			this.handleCalculatePositionSize.bind(this),
		);
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
	}
}

customElements.define("position-sizer", PositionSizer);
