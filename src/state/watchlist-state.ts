// https://www.toptal.com/react/rxjs-react-state-management
import { BehaviorSubject, distinctUntilChanged } from "rxjs";

class WatchlistState {
	private _selectedSymbol$ = new BehaviorSubject("");
	private _selectedInterval$ = new BehaviorSubject("");
	private _selectedWeeks$ = new BehaviorSubject("");

	selectedSymbol$ = this._selectedSymbol$.pipe(distinctUntilChanged());
	selectedInterval$ = this._selectedInterval$.pipe(distinctUntilChanged());
	selectedWeeks$ = this._selectedWeeks$.pipe(distinctUntilChanged());

	updateSymbol(value: string) {
		this._selectedSymbol$.next(value);
	}
	updateInterval(value: string) {
		this._selectedInterval$.next(value);
	}
	updateWeeks(value: string) {
		this._selectedWeeks$.next(value);
	}
}

export default new WatchlistState();
