import { round } from "@utils/format";

const template = document.createElement("template");
template.innerHTML = `
<style>
.position-sizer {
	display: flex;
	flex-flow: column nowrap;
}

.position-sizer--field {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
<form class="position-sizer" id="position-sizer-form">
<input id="symbol" class="input" type="hidden" name="symbol" value="" autocomplete="off" />
	<div class="position-sizer--field">
		<label for="direction">Direction</label>
		<select id="direction" class="input" name="direction">
			<option label="Long" value="long" />
			<option label="Short" value="short" />
		</select>
	</div>
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
		<input id="shares" class="input"type="text" name="shares" value="" />
	</div>
	<div class="position-sizer--field">
		<label for="ratio">Risk/Reward</label>
		<input id="ratio" class="input"type="text" name="ratio" value="" />
	</div>
	<div class="position-sizer--field">
		<label for="risk">$Risk</label>
		<input id="risk" class="input"type="text" name="risk" value="" />
	</div>
	<button class="position-sizer--button" type="submit" id="save">Save</button>
</form>
`;

class PositionSizer extends HTMLElement {
	symbolEl: HTMLInputElement | null = null;
	directionEl: HTMLSelectElement | null = null;
	portfolioValueEl: HTMLInputElement | null = null;
	targetEl: HTMLInputElement | null = null;
	stopEl: HTMLInputElement | null = null;
	entryEl: HTMLInputElement | null = null;
	sharesEl: HTMLInputElement | null = null;
	ratioEl: HTMLInputElement | null = null;
	riskEl: HTMLInputElement | null = null;
	calculateEl: HTMLButtonElement | null = null;
	formEl: HTMLFormElement | null = null;

	static observedAttributes = ["symbol"];

	handleCalculateRiskReward() {
		const risk = Math.abs(
			parseFloat(this.entryEl!.value) - parseFloat(this.stopEl!.value),
		);
		const reward = Math.abs(
			parseFloat(this.targetEl!.value) - parseFloat(this.entryEl!.value),
		);
		const riskReward = round(reward / risk);
		this.ratioEl!.value = `${riskReward}`;
	}

	handleCalculatePositionSize() {
		const portfolioRisk =
			parseInt(this.portfolioValueEl!.value, 10) * 0.01 - 10;
		const perShareRisk = Math.abs(
			parseFloat(this.entryEl!.value) - parseFloat(this.stopEl!.value),
		);
		const shares = Math.floor(portfolioRisk / perShareRisk);
		this.sharesEl!.value = `${shares}`;
		this.riskEl!.value = `${portfolioRisk}`;
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

	async handleSave(event) {
		event.preventDefault();

		const formData = new FormData(this.formEl!);

		const data = Object.fromEntries(formData);

		await fetch(
			`http://localhost:8000/api/trade?symbol=${this.getAttribute("symbol")}`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);
	}

	render() {
		this.shadowRoot!.appendChild(template.content.cloneNode(true));
		this.symbolEl = this.shadowRoot!.querySelector("#symbol");
		this.portfolioValueEl = this.shadowRoot!.querySelector("#portfolioValue");
		this.directionEl = this.shadowRoot!.querySelector("#direction");
		this.targetEl = this.shadowRoot!.querySelector("#target");
		this.stopEl = this.shadowRoot!.querySelector("#stop");
		this.entryEl = this.shadowRoot!.querySelector("#entry");
		this.sharesEl = this.shadowRoot!.querySelector("#shares");
		this.ratioEl = this.shadowRoot!.querySelector("#ratio");
		this.riskEl = this.shadowRoot!.querySelector("#risk");
		this.calculateEl = this.shadowRoot!.querySelector("#calc");
		this.formEl = this.shadowRoot!.querySelector("#position-sizer-form");

		this.calculateEl?.addEventListener(
			"click",
			this.handleCalculate.bind(this),
		);

		this.formEl?.addEventListener("submit", this.handleSave.bind(this));
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.render();
	}

	async attributeChangedCallback(
		name: "symbol",
		oldValue: string,
		newValue: string,
	) {
		this.symbolEl!.value = newValue;

		if (newValue !== oldValue) {
			const request = await fetch(
				`http://localhost:8000/api/trade?symbol=${newValue}`,
				{
					method: "GET",
					headers: {
						"Access-Control-Allow-Origin": "*",
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				},
			);

			const response = await request.json();

			this.directionEl!.value = response.direction || "long";
			this.portfolioValueEl!.value = response.portfolioValue || "";
			this.entryEl!.value = response.entry || "";
			this.stopEl!.value = response.stop || "";
			this.targetEl!.value = response.target || "";
			this.sharesEl!.value = response.shares || "";
			this.ratioEl!.value = response.ratio || "";
			this.riskEl!.value = response.risk || "";
		}
	}
}

customElements.define("position-sizer", PositionSizer);
