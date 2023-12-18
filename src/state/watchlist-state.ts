// https://www.toptal.com/react/rxjs-react-state-management
import {
	BehaviorSubject,
	combineLatest,
	distinctUntilChanged,
	map,
} from "rxjs";

class WatchlistState {
	private _selectedSymbol$ = new BehaviorSubject("");
	private _selectedInterval$ = new BehaviorSubject("");
	private _selectedWeeks$ = new BehaviorSubject("");

	selectedSymbol$ = this._selectedSymbol$.pipe(distinctUntilChanged());
	selectedInterval$ = this._selectedInterval$.pipe(distinctUntilChanged());
	selectedWeeks$ = this._selectedWeeks$.pipe(distinctUntilChanged());

	chartOptions$ = combineLatest([
		this.selectedSymbol$,
		this.selectedInterval$,
	]).pipe(map(([symbol, interval]) => ({ symbol, interval })));

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
