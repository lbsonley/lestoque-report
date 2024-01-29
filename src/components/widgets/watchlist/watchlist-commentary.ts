const template = document.createElement("template");
template.innerHTML = `
<style>
.watchlist-commentary {
	display: flex;
	flex-flow: column nowrap;
	max-height: 100%;
	overflow: hidden scroll;
}

.watchlist-commentary--field {
	display: flex;
	flex-flow: column nowrap;
}
</style>
<form class="watchlist-commentary" id="watchlist-commentary-form">
<input id="symbol" class="input" type="hidden" name="symbol" value="" autocomplete="off" />
<input id="dt" class="input" type="hidden" name="dt" value="" autocomplete="off" />
	<div class="watchlist-commentary--field">
		<label for="monthly">Monthly</label>
		<textarea id="monthly" class="input" name="monthly" value="" autocomplete="off" rows=10></textarea>
	</div>
	<div class="watchlist-commentary--field">
		<label for="weekly">Weekly</label>
		<textarea id="weekly" class="input" name="weekly" value="" autocomplete="off" rows=10></textarea>
	</div>
	<div class="watchlist-commentary--field">
		<label for="daily">Daily</label>
		<textarea id="daily" class="input" name="daily" value="" autocomplete="off" rows=10></textarea>
	</div>
	<div class="watchlist-commentary--field">
		<label for="ninetyMin">90m</label>
		<textarea id="ninetyMin" class="input" name="ninetyMin" value="" autocomplete="off" rows=10></textarea>
	</div>
	<button class="watchlist-commentary--button" type="submit" id="save">Save</button>
</form>
`;

class WatchlistCommentary extends HTMLElement {
	symbolEl: HTMLInputElement | null = null;
	datetimeEl: HTMLInputElement | null = null;
	monthlyEl: HTMLInputElement | null = null;
	weeklyEl: HTMLInputElement | null = null;
	dailyEl: HTMLInputElement | null = null;
	ninetyMinEl: HTMLInputElement | null = null;
	formEl: HTMLFormElement | null = null;

	static observedAttributes = ["symbol"];

	async handleSave(event) {
		event.preventDefault();

		const formData = new FormData(this.formEl!);

		await fetch(
			`http://localhost:8000/api/commentary?symbol=${this.getAttribute(
				"symbol",
			)}`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(Object.fromEntries(formData)),
			},
		);
	}

	render() {
		this.shadowRoot!.appendChild(template.content.cloneNode(true));
		this.symbolEl = this.shadowRoot!.querySelector("#symbol");
		this.datetimeEl = this.shadowRoot!.querySelector("#dt");
		this.monthlyEl = this.shadowRoot!.querySelector("#monthly");
		this.weeklyEl = this.shadowRoot!.querySelector("#weekly");
		this.dailyEl = this.shadowRoot!.querySelector("#daily");
		this.ninetyMinEl = this.shadowRoot!.querySelector("#ninetyMin");
		this.formEl = this.shadowRoot!.querySelector("#watchlist-commentary-form");

		const date = new Date().getTime();
		this.datetimeEl?.setAttribute("value", `${date}`);

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
				`http://localhost:8000/api/commentary?symbol=${newValue}`,
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

			this.monthlyEl!.value = response.monthly || "";
			this.weeklyEl!.value = response.weekly || "";
			this.dailyEl!.value = response.daily || "";
			this.ninetyMinEl!.value = response.ninetyMin || "";
		}
	}
}

customElements.define("watchlist-commentary", WatchlistCommentary);
