// https://www.toptal.com/react/rxjs-react-state-management
import {
	BehaviorSubject,
	combineLatest,
	distinctUntilChanged,
	map,
} from "rxjs";

export type Intervals = "90m" | "1d" | "1wk" | "1mo";

class WatchlistState {
	private _selectedSymbol$ = new BehaviorSubject<string | null>(null);
	private _selectedInterval$ = new BehaviorSubject<Intervals | null>(null);
	private _selectedWatchlist$ = new BehaviorSubject<string | null>(null);

	selectedSymbol$ = this._selectedSymbol$.pipe(distinctUntilChanged());
	selectedInterval$ = this._selectedInterval$.pipe(distinctUntilChanged());
	selectedWatchlist$ = this._selectedWatchlist$.pipe(distinctUntilChanged());

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

	updateWatchlist(value: string) {
		this._selectedWatchlist$.next(value);
	}
}

export default new WatchlistState();
