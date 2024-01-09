import { round } from "@utils/format";

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
	<div class="position-sizer--field">
		<label for="target">Target</label>
		<input id="target" class="input" type="text" name="target" value="" autocomplete="off" />
	</div>
	<button class="position-sizer--button" type="button" id="calc">Calculate</button>
	<div class="position-sizer--field">
		<label for="shares">Shares</label>
		<input disabled id="shares" class="input"type="text" name="shares" value="" />
	</div>
	<div class="position-sizer--field">
		<label for="risk-reward">Risk/Reward</label>
		<input disabled id="risk-reward" class="input"type="text" name="risk-reward" value="" />
	</div>
</form>
`;

class PositionSizer extends HTMLElement {
	portfolioValueEl: HTMLInputElement | null = null;
	targetEl: HTMLInputElement | null = null;
	stopEl: HTMLInputElement | null = null;
	entryEl: HTMLInputElement | null = null;
	sharesEl: HTMLInputElement | null = null;
	riskRewardEl: HTMLInputElement | null = null;
	calculateEl: HTMLButtonElement | null = null;

	handleCalculateRiskReward() {
		const risk = Math.abs(
			parseFloat(this.entryEl!.value) - parseFloat(this.stopEl!.value),
		);
		const reward = Math.abs(
			parseFloat(this.targetEl!.value) - parseFloat(this.entryEl!.value),
		);
		const riskReward = round(reward / risk);
		this.riskRewardEl!.value = `${riskReward}`;
	}

	handleCalculatePositionSize() {
		const portfolioRisk = parseInt(this.portfolioValueEl!.value, 10) * 0.01;
		const perShareRisk = Math.abs(
			parseFloat(this.entryEl!.value) - parseFloat(this.stopEl!.value),
		);
		const shares = Math.floor(portfolioRisk / perShareRisk);
		this.sharesEl!.value = `${shares}`;
	}

	handleCalculate() {
		if (
			this.portfolioValueEl!.value &&
			this.stopEl!.value &&
			this.targetEl!.value &&
			this.entryEl!.value
		) {
			this.handleCalculatePositionSize();
			this.handleCalculateRiskReward();
		}
	}

	render() {
		this.shadowRoot!.appendChild(template.content.cloneNode(true));
		this.portfolioValueEl = this.shadowRoot!.querySelector("#portfolioValue");
		this.targetEl = this.shadowRoot!.querySelector("#target");
		this.stopEl = this.shadowRoot!.querySelector("#stop");
		this.entryEl = this.shadowRoot!.querySelector("#entry");
		this.sharesEl = this.shadowRoot!.querySelector("#shares");
		this.riskRewardEl = this.shadowRoot!.querySelector("#risk-reward");
		this.calculateEl = this.shadowRoot!.querySelector("#calc");

		this.calculateEl?.addEventListener(
			"click",
			this.handleCalculate.bind(this),
		);
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
	}
}

customElements.define("position-sizer", PositionSizer);
