// https://www.toptal.com/react/rxjs-react-state-management
import {
	BehaviorSubject,
	combineLatest,
	distinctUntilChanged,
	map,
} from "rxjs";

export type Intervals = "90m" | "1d" | "1wk" | "1mo";
export type Weeks = "2" | "13" | "52" | "260";

class WatchlistState {
	private _selectedSymbol$ = new BehaviorSubject<string | null>(null);
	private _selectedInterval$ = new BehaviorSubject<Intervals | null>(null);
	private _selectedWeeks$ = new BehaviorSubject<Weeks | null>(null);

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
	updateInterval(value: Intervals) {
		this._selectedInterval$.next(value);
	}
	updateWeeks(value: Weeks) {
		this._selectedWeeks$.next(value);
	}
}

export default new WatchlistState();
