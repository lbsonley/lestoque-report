import argparse
import warnings
from pathlib import Path
import string
import datetime as dt
import numpy as np
import pandas as pd
import yfinance as yf

# ignore warnings about writing to copy when using xs
warnings.filterwarnings("ignore")


def get_sp500_return(end, wk52):
    sp500 = yf.download(tickers=["SPY"], start=wk52, end=end)

    sp500.index.names = ["date"]
    sp500.columns = sp500.columns.str.lower()

    sp500_52wk = (
        sp500.iloc[-1]["close"] - sp500.iloc[0]["close"]
    ) / sp500.iloc[0]["close"]

    return sp500_52wk


def get_outperformers(end, wk52, sp500_52wk):
    constituents = pd.read_html(
        "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    )[0]

    constituents.index = constituents["Symbol"]
    constituents = constituents[
        ["Security", "GICS Sector", "GICS Sub-Industry"]
    ]
    constituents.index = constituents.index.str.replace(".", "-")

    df_weekly = yf.download(
        tickers=constituents.index.to_list(),
        interval="1wk",
        end=end,
        start=wk52,
    ).stack()

    df_weekly.index.names = ["date", "symbol"]
    df_weekly.columns = df_weekly.columns.str.lower()

    constituents["52 Week ∆"] = " "

    for symbol in constituents.index.to_list():
        start_price = df_weekly.xs(key=symbol, level="symbol").iloc[0]["close"]
        end_price = df_weekly.xs(key=symbol, level="symbol").iloc[-1]["close"]
        constituents.at[symbol, "52 Week ∆"] = (
            end_price - start_price
        ) / start_price

    # constituents.sort_values(by="52 Week ∆", ascending=False)

    outperformers = constituents[constituents["52 Week ∆"] > sp500_52wk]

    outperformers = outperformers.sort_values(by="52 Week ∆", ascending=False)

    return {"outperformers": outperformers, "df_weekly": df_weekly}


def compute_swing_pivots(df):
    # get list of closes
    closes = df["close"].values

    # init an empty array to hold the higher highs
    highs = np.empty(len(closes))

    # init a variable to keep track of the higher highs
    hh = 0

    # init a variable to keep track of how many days since making a new higher high
    days_since_high = 0

    # loop the closes
    for i, close in enumerate(closes):
        if close > hh:
            days_since_high = 0
            hh = close
            highs[i] = np.nan
            # print("new high", i, close, hh)
        elif close <= hh:
            if days_since_high > 3:
                highs[i] = hh
            else:
                highs[i] = np.nan
            days_since_high += 1
            # print("pullback", i, close, hh, days_since_high)

    df["swing_high"] = highs

    return df


def get_outperformers_near_resistance(outperformers, df_weekly):
    outperformer_symbols_at_resistance = []

    for symbol in outperformers.index.to_list():
        symbol_df = df_weekly.xs(key=symbol, level="symbol")
        symbol_df = compute_swing_pivots(symbol_df)
        last_close = symbol_df.iloc[-1]["close"]
        last_swing_high = symbol_df.loc[
            symbol_df["swing_high"].last_valid_index()
        ]["swing_high"]
        lower_limit = 0.97 * last_swing_high
        upper_limit = 1.03 * last_swing_high
        if lower_limit <= last_close and last_close <= upper_limit:
            outperformer_symbols_at_resistance.append(symbol)

    outperformers_at_resistance = outperformers[
        outperformers.index.isin(outperformer_symbols_at_resistance)
    ]

    return outperformers_at_resistance


def make_charts(symbols, date):
    chart_string = ""
    for symbol in symbols:
        chart_string += (
            f'<CandlestickTabs symbol="{symbol}" endDate="{date}"/>\n\n'
        )

    return chart_string


def make_page(date, symbols):
    publish_date = date.strftime("%Y-%m-%d")
    path_date = date.strftime("%y-%m-%d")

    charts = make_charts(symbols, publish_date)

    Path(f"src/content/reports/{publish_date}").mkdir(
        parents=True, exist_ok=True
    )

    with open("lib/templates/report.mdx.txt") as t:
        template = string.Template(t.read())

    final_output = template.substitute(publish_date=publish_date, charts=charts)

    with open(
        f"src/content/reports/{publish_date}/outperformers.mdx", "w"
    ) as output:
        output.write(final_output)


# get cli arguments
ap = argparse.ArgumentParser()

ap.add_argument(
    "-d", "--date", required=True, help="date must be formatted like YYYY-MM-DD"
)
args = vars(ap.parse_args())
split_args = args["date"].split("-")
end = dt.date(
    year=int(split_args[0]), month=int(split_args[1]), day=int(split_args[2])
)

wk52 = end - dt.timedelta(weeks=52)

sp500_52wk = get_sp500_return(end=end, wk52=wk52)
constituents = get_outperformers(end=end, wk52=wk52, sp500_52wk=sp500_52wk)
watchlist = get_outperformers_near_resistance(
    outperformers=constituents["outperformers"],
    df_weekly=constituents["df_weekly"],
)

make_page(date=end, symbols=watchlist.index.to_list())
