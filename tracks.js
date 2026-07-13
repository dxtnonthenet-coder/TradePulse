/* ReplayEdge Tracks — multi-market curriculum registry.
   Loads after academy.js. Reuses the market-neutral core tiers (structure,
   liquidity, smart money, psychology) across tracks, with niche-specific
   foundations, playbooks, and graduation per market. */

/* ---------- clone helpers ---------- */

function cloneLessonForTrack(lesson, prefix) {
  return { ...lesson, id: `${prefix}-${lesson.id}` };
}

function cloneTierForTrack(tier, prefix, overrides = {}) {
  return {
    ...tier,
    id: `${prefix}-${tier.id}`,
    lessons: tier.lessons.map((lesson) => cloneLessonForTrack(lesson, prefix)),
    ...overrides
  };
}

function futuresTierById(id) {
  return FUTURES_TIERS.find((tier) => tier.id === id);
}

function buildNicheTrack(prefix, foundationsTier, nichePlaybooks, gradLesson) {
  const strategiesBase = futuresTierById("strategies");
  const provingBase = futuresTierById("proving-ground");
  const sharedPlaybooks = ["sr-bounce", "trend-pullback", "sweep-reversal"]
    .map((id) => cloneLessonForTrack(strategiesBase.lessons.find((lesson) => lesson.id === id), prefix));
  const sharedProving = ["backtesting", "metrics", "trade-management"]
    .map((id) => cloneLessonForTrack(provingBase.lessons.find((lesson) => lesson.id === id), prefix));
  return [
    foundationsTier,
    cloneTierForTrack(futuresTierById("structure"), prefix),
    cloneTierForTrack(futuresTierById("liquidity"), prefix),
    cloneTierForTrack(futuresTierById("smart-money"), prefix),
    { id: `${prefix}-strategies`, title: "Strategy Arsenal", icon: "swords", tagline: "Core playbooks plus setups built for this market.", lessons: [...sharedPlaybooks, ...nichePlaybooks] },
    cloneTierForTrack(futuresTierById("psychology"), prefix),
    { id: `${prefix}-proving-ground`, title: "The Proving Ground", icon: "flask-conical", tagline: "Backtest, measure, and graduate to the live floor.", lessons: [...sharedProving, gradLesson] }
  ];
}

/* ============================================================
   FOREX
============================================================ */

const FOREX_FOUNDATIONS = {
  id: "fx-foundations",
  title: "FX Foundations",
  icon: "globe",
  tagline: "Pairs, pips, lots, and the 24-hour clock.",
  lessons: [
    {
      id: "fx-pairs-pips",
      title: "Pairs, Pips & Lots",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "You trade one currency against another", body: "EUR/USD rising means euros are gaining on dollars. The first currency is the base, the second the quote — the price is how much quote buys one base.", points: ["Majors: EUR/USD, GBP/USD, USD/JPY — tightest spreads", "Minors and crosses: no USD, wider spreads", "Exotics: thin, expensive, avoid while learning"] },
        { heading: "Pips are your unit of distance", body: "A pip is the 4th decimal (0.0001) on most pairs — 2nd decimal on JPY pairs. Every stop, target, and spread is measured in pips, so pip math must be automatic.", points: ["EUR/USD 1.0850 → 1.0860 = 10 pips", "Standard lot: ~$10/pip · Mini: ~$1 · Micro: ~$0.10", "Position size = risk $ ÷ (stop pips × pip value)"] },
        { heading: "Lots are your size dial", body: "Unlike futures contracts, FX size is nearly continuous — micro lots let a $500 account risk 1% properly. There is no excuse for oversizing in forex; the instrument gives you precision." }
      ],
      quiz: [
        { question: "Your risk is $50 and your stop is 25 pips. With $1/pip mini lots, how many lots?", options: ["0.5", "2", "5", "10"], answer: 1, explain: "$50 ÷ (25 pips × $1) = 2 mini lots. Size always comes from the stop." },
        { question: "A pip on EUR/USD is…", options: ["0.01", "0.0001", "1.0", "0.00001"], answer: 1, explain: "The 4th decimal on non-JPY pairs. The 5th decimal is a pipette — a tenth of a pip." }
      ]
    },
    {
      id: "fx-sessions",
      title: "The 24-Hour Clock",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "FX never closes — but it does sleep", body: "The market rotates Sydney → Tokyo → London → New York. Volume and volatility concentrate where the big banks are awake, and each session has a personality you can plan around.", points: ["Asia: quiet ranges, builds the levels", "London (3–6 AM ET): the day's first real move", "London/NY overlap (8–11 AM ET): peak volume of the entire day"] },
        { heading: "The overlap is your killzone", body: "When London and New York are both open, the majors move with the most force and the cleanest follow-through. Most professional FX day traders work 3–4 hours around this window and stop." },
        { heading: "Session behavior repeats", body: "Asia sets a range → London sweeps one side of it → New York continues or reverses London. This daily rhythm is the FX equivalent of the futures open — and the backbone of every session playbook you'll learn." }
      ],
      quiz: [
        { question: "The highest-volume window in FX is…", options: ["Sydney open", "Tokyo lunch", "The London/New York overlap", "Friday close"], answer: 2, explain: "Both major banking centers online at once — 8 to 11 AM ET is the day's power window." },
        { question: "A common daily rhythm is…", options: ["Asia trends, London sleeps", "Asia ranges → London sweeps the range → NY drives the real move", "All sessions behave identically", "News only matters in Asia"], answer: 1, explain: "The Asia range becomes London's liquidity, and New York resolves the day's direction." }
      ]
    },
    {
      id: "fx-leverage-spreads",
      title: "Leverage, Margin & Spreads",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "Leverage is a loan, not a gift", body: "Brokers offer 30:1 to 500:1. Leverage changes nothing about correct risk — you still size from the stop at 1% — it only changes how spectacularly the undisciplined blow up.", points: ["Margin: collateral the broker locks for a position", "Margin call/stop-out: broker force-closes you", "If leverage decides your size, you're already wrong"] },
        { heading: "The spread is your entry fee", body: "You buy at the ask, sell at the bid. On EUR/USD the spread might be 0.5–1 pip; on exotics, 10+. A 5-pip scalp against a 1-pip spread hands 20% of the move to the broker before you start." },
        { heading: "Broker quality is part of your edge", body: "Regulated broker, tight raw spreads, fast execution, no dealing-desk games. In FX the counterparty is often your broker — choose one whose incentives align with your survival.", points: ["Prefer regulated ECN/raw-spread brokers", "Watch spread widening around news", "Slippage on stops is real — plan for it"] }
      ],
      quiz: [
        { question: "Correct position sizing with 500:1 leverage available is…", options: ["Use all of it", "Identical to sizing without leverage — risk % from the stop", "Half of it", "Leverage replaces stops"], answer: 1, explain: "Leverage is capacity, not a target. Risk math never changes." },
        { question: "Why do spreads matter more for scalpers?", options: ["They don't", "The spread is a fixed cost, so it's a larger share of small targets", "Spreads only exist on exotics", "Scalpers trade without spreads"], answer: 1, explain: "A 1-pip cost on a 5-pip target is 20% of the trade. On a 50-pip target it's 2%." }
      ]
    },
    {
      id: "fx-drivers",
      title: "What Moves Currencies",
      minutes: 4,
      xp: 50,
      slides: [
        { heading: "Currencies price economies", body: "Interest rates are the gravity of FX: money flows toward higher yield. Central bank decisions, CPI, and employment data reprice pairs in seconds — the calendar is not optional.", points: ["Rate expectations move pairs before the actual hike", "CPI, NFP, FOMC/ECB days = volatility events", "DXY (dollar index) is the tide under every USD pair"] },
        { heading: "Risk-on, risk-off", body: "In fear, money runs to safe havens — USD, JPY, CHF. In greed, it chases yield — AUD, NZD, emerging currencies. Knowing today's regime tells you which side of a pair has the wind." },
        { heading: "You still trade the chart", body: "Fundamentals set the tide; structure and liquidity time the entry. The FX edge is combining the macro lean with the same sweep-and-displacement mechanics you're learning in the core tiers." }
      ],
      quiz: [
        { question: "The primary long-term driver of currency pairs is…", options: ["Chart patterns", "Interest rate differentials and expectations", "Twitter sentiment", "Lot sizes"], answer: 1, explain: "Capital flows toward yield. Rate expectations are the tide everything else rides." },
        { question: "In a risk-off panic, money typically flows into…", options: ["AUD and NZD", "USD, JPY, and CHF", "Exotic pairs", "Meme stocks"], answer: 1, explain: "Safe havens absorb fear flows — that's why USD/JPY and the DXY react to global stress." }
      ]
    }
  ]
};

const FOREX_PLAYBOOKS = [
  {
    id: "fx-london-sweep",
    title: "Playbook: London Sweep of Asia",
    minutes: 5,
    xp: 80,
    slides: [
      { heading: "The setup", body: "Asia builds a tight range overnight. London opens and runs one side of it — sweeping the stops — then displaces back through the range with force. That false break is the day's manipulation; the reversal is your trade.", points: ["Mark the Asia high/low before London opens", "Sweep: wick through, close back inside", "Displacement back through the range midpoint confirms"] },
      { heading: "Execution", body: "After the sweep and structure shift, enter on the retrace into the displacement FVG. Stop beyond the sweep wick. First target the opposite side of the Asia range; runner toward the session's untouched liquidity.", points: ["Entry: FVG retrace after the shift", "Stop: past the sweep extreme", "Target: opposite Asia extreme, then daily levels"] },
      { heading: "When to skip", body: "Skip when Asia trended instead of ranging (no clean pool), when a red-folder news event lands within the hour, and when London breaks out with acceptance — multiple closes beyond the range means real expansion, not a sweep." }
    ],
    quiz: [
      { question: "The London sweep setup needs Asia to have…", options: ["Trended strongly", "Built a definable range with liquidity at both ends", "Gapped", "Closed early"], answer: 1, explain: "The range creates the stop pools London hunts. No range, no pool, no play." },
      { question: "London closes multiple candles beyond the Asia high. That's…", options: ["Still a sweep — fade it", "Acceptance — real expansion, don't fight it", "Impossible", "A broker error"], answer: 1, explain: "Sweeps reject fast. Acceptance beyond the level is a breakout, and fading it is donating." }
    ]
  },
  {
    id: "fx-dxy-confluence",
    title: "Playbook: DXY Confluence",
    minutes: 4,
    xp: 80,
    slides: [
      { heading: "The setup", body: "Every USD pair is half dollar. When your EUR/USD long lines up with DXY hitting resistance and showing its own bearish shift, two independent charts agree — that's SMT-style confluence at the macro level.", points: ["DXY at a key level = every USD pair at a decision", "EUR/USD and DXY move inversely", "Disagreement between them flags false moves"] },
      { heading: "Execution", body: "Build the usual entry on your pair — sweep, shift, retrace — but only take it when DXY is at opposing structure and confirming the other way. Same stops, same targets; the DXY filter just deletes half your losers." },
      { heading: "The divergence tell", body: "EUR/USD makes a new low but DXY fails to make a new high: someone is lying, and it's usually the pair being engineered through stops. Divergence at a sweep is one of the highest-conviction reversal signals in FX." }
    ],
    quiz: [
      { question: "EUR/USD sweeps a low while DXY fails to make a corresponding high. This suggests…", options: ["Nothing", "The sweep is likely engineered — reversal odds increase", "EUR is crashing", "Buy DXY"], answer: 1, explain: "Inversely correlated instruments disagreeing at extremes exposes the false move." },
      { question: "The DXY filter improves your pair trades by…", options: ["Increasing size", "Deleting trades where the dollar tide opposes your idea", "Replacing stops", "Predicting news"], answer: 1, explain: "It's a confluence layer: trade only when the macro tide and your chart agree." }
    ]
  }
];

const FOREX_GRAD = {
  id: "fx-graduation",
  title: "Graduation: The FX Floor",
  minutes: 3,
  xp: 100,
  slides: [
    { heading: "Your FX readiness checklist", body: "Pip math automatic. Session rhythm internalized. One playbook backtested 50+ times. Spread and slippage budgeted into every plan. That is what 'ready' means — not a feeling, a checklist.", points: ["Trade the overlap, skip the dead hours", "News calendar checked before every session", "Micro lots until the data says otherwise"] },
    { heading: "Funded FX is a discipline exam", body: "FX prop evaluations mirror futures ones: daily loss limits and trailing drawdown. Pass math beats hero math — 0.5% average days for a month, not one heroic NFP gamble." },
    { heading: "Prove it in the Arcade", body: "Run your playbooks in the games with your FX lens: session sweeps in Stop Hunt, spread discipline in Risk Mines, the full evaluation in Prop Run. Same instincts, your market." }
  ],
  quiz: [
    { question: "Before trading live FX you should have…", options: ["A feeling", "One playbook with a 50+ trade backtest and automatic pip math", "500:1 leverage", "A signal group"], answer: 1, explain: "Measured edge plus mechanical execution — everything else is hope." },
    { question: "The professional FX schedule is…", options: ["All 24 hours", "The 3–4 hours around London and the NY overlap", "Weekends", "Only Asia"], answer: 1, explain: "Edge concentrates where volume concentrates. More screen hours ≠ more profit." }
  ]
};

/* ============================================================
   STOCKS
============================================================ */

const STOCKS_FOUNDATIONS = {
  id: "st-foundations",
  title: "Equity Foundations",
  icon: "building-2",
  tagline: "Float, gaps, catalysts, and the opening auction.",
  lessons: [
    {
      id: "st-shares-float",
      title: "Shares, Float & Why Stocks Move",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "Supply is the story", body: "Float is the number of shares actually tradeable. A 5M-float stock with a hot catalyst moves 100% in a morning; a 5B-float giant grinds 1%. Day traders hunt where limited supply meets urgent demand.", points: ["Low float + catalyst = explosive range", "Market cap tells size; float tells volatility", "Institutional ownership dampens intraday swings"] },
        { heading: "Relative volume is the pulse", body: "A stock trading 10x its normal volume has attention today — and attention is what creates range. RVOL above 2–3 with a catalyst is the day trader's first scan filter.", points: ["RVOL = today's volume ÷ average volume", "Volume without a catalyst fades by 10 AM", "No volume = no trade, whatever the chart says"] },
        { heading: "You need 'in play' stocks", body: "Trading a random quiet stock is fighting for scraps. Every morning the market crowns a handful of stocks 'in play' — earnings, news, sympathy moves. Your job is a watchlist, not a marriage." }
      ],
      quiz: [
        { question: "Which profile moves most violently intraday?", options: ["High float, no news", "Low float with a fresh catalyst and high RVOL", "A dividend aristocrat", "An index ETF"], answer: 1, explain: "Scarce supply plus urgent demand is the recipe for range — and for risk." },
        { question: "RVOL of 5 means…", options: ["The stock is down 5%", "Trading 5x its average volume — real attention today", "5 million shares", "Buy immediately"], answer: 1, explain: "Relative volume flags where the crowd is — attention creates the range you need." }
      ]
    },
    {
      id: "st-hours-gaps",
      title: "Market Hours, Gaps & the Open",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "The session has chapters", body: "Premarket (4–9:30 ET) is thin and sets levels. The open (9:30–10:30) is the day's most violent, opportunity-rich hour. Lunch chops. The close (3–4) brings volume back for the final auction.", points: ["Premarket high/low become key intraday levels", "First 5 minutes: spreads wide, amateurs get filled badly", "Lunch (11:30–2): pros step away"] },
        { heading: "Gaps are unfinished business", body: "Earnings or news reprice a stock overnight — the gap. Day one question: does the gap hold and continue (gap-and-go) or fill back (fade)? Volume in the first 15 minutes usually votes.", points: ["Gap up + heavy early buying = continuation odds", "Gap up on weak volume = fade candidate", "Yesterday's close is the gravity for fades"] },
        { heading: "The PDT rule shapes small accounts", body: "Under $25k in a US margin account, you get 3 day trades per 5 days. It forces selectivity — which, honestly, is a feature. Cash accounts and futures/FX are the common workarounds." }
      ],
      quiz: [
        { question: "The most opportunity-dense window of the stock day is…", options: ["Lunch", "The first hour after the open", "3 AM premarket", "After hours"], answer: 1, explain: "The opening hour resolves the overnight auction with maximum volume and range." },
        { question: "A gap up on weak early volume most often…", options: ["Continues all day", "Fades back toward yesterday's close", "Halts", "Squeezes"], answer: 1, explain: "No participation means no fuel — gravity pulls price back to fill the gap." }
      ]
    },
    {
      id: "st-level2-vwap",
      title: "Level 2, Tape & VWAP",
      minutes: 4,
      xp: 50,
      slides: [
        { heading: "Level 2 shows the queue", body: "The order book displays bids and asks stacked at each price. Walls appear and vanish, big prints hit the tape — it's the same liquidity story as futures DOM, wearing a stock costume.", points: ["Thick bid = buyers defending (until it's spoofed)", "Tape speed shift = urgency arriving", "Halts: volatile stocks pause on circuit breakers"] },
        { heading: "VWAP is the day's fair price", body: "Volume-weighted average price is where the average dollar traded today. Institutions benchmark against it: above VWAP buyers are in control, below it sellers are. It's the most-watched intraday line in equities.", points: ["Above VWAP: dips to it get bought in strong stocks", "Below VWAP: rallies to it get sold", "VWAP reclaim after a flush = classic momentum tell"] },
        { heading: "Extension snaps back", body: "Price stretched far from VWAP is rubber-band tension — parabolic moves revert to the average. Chasing the 4th green candle 8% above VWAP is how beginners fund the pros' afternoons." }
      ],
      quiz: [
        { question: "A strong stock pulling back to VWAP on declining volume is often…", options: ["A short signal", "A dip-buy location — the average dollar defends it", "Random", "A halt"], answer: 1, explain: "In-control buyers treat VWAP as fair value; corrective pullbacks to it attract them." },
        { question: "Price 8% extended above VWAP mid-morning is…", options: ["A fresh long entry", "Rubber-band tension — chasing there has terrible risk/reward", "Guaranteed to squeeze", "Time to double"], answer: 1, explain: "Extension mean-reverts. Entries belong at value, not at maximum stretch." }
      ]
    },
    {
      id: "st-catalysts",
      title: "Catalysts & Earnings",
      minutes: 4,
      xp: 50,
      slides: [
        { heading: "News is the fuel", body: "Earnings beats, FDA decisions, contracts, upgrades — a catalyst gives a stock a reason to trend instead of chop. Rank your watchlist by catalyst strength, not by how pretty the chart is.", points: ["Fresh news beats stale news", "Sector sympathy: leaders drag the whole group", "Know the earnings date of anything you hold intraday"] },
        { heading: "Earnings season mechanics", body: "The move happens on the reaction, not the report. A great quarter that gaps up and sells off is telling you positioning was ahead of it. Day one direction after earnings sets a bias that often runs for days." },
        { heading: "Halts and hazards", body: "Volatile catalysts trigger circuit-breaker halts — price can reopen far from where it paused, through your stop. Small size on halt-risk names isn't cowardice; it's the only correct math.", points: ["LULD halts pause trading ~5 minutes", "Reopens gap — stops don't protect through a halt", "Size down when halt risk is real"] }
      ],
      quiz: [
        { question: "The highest-quality day-trading watchlist is ranked by…", options: ["Alphabet", "Catalyst strength plus relative volume", "Price under $5", "Chart prettiness"], answer: 1, explain: "News plus participation creates trend. Everything else is chop." },
        { question: "A stock halts on volatility. Your stop order…", options: ["Executes at your price during the halt", "Cannot protect you — it may fill far away on the reopen", "Cancels", "Doubles"], answer: 1, explain: "Halts reopen wherever the auction says — size, not stops, manages halt risk." }
      ]
    }
  ]
};

const STOCKS_PLAYBOOKS = [
  {
    id: "st-orb",
    title: "Playbook: Opening Range Breakout",
    minutes: 5,
    xp: 80,
    slides: [
      { heading: "The setup", body: "On an in-play stock, mark the high and low of the first 5–15 minutes. That opening range is the morning's battlefield; the break of it with volume is the day's first real vote.", points: ["Only on catalyst + RVOL names", "Wider range = respect it more", "Premarket levels stack confluence"] },
      { heading: "Execution", body: "Enter the break-and-hold of the range high (or low, short). Stop below the range midpoint or the low of the breakout candle. First target 1R, then the next premarket level; trail the rest along VWAP.", points: ["Break → hold → go; instant snap-backs are traps", "Stop: breakout candle low / range mid", "Runner management: VWAP trail"] },
      { heading: "When to skip", body: "Skip when the range is tiny chop (no conviction either side), when RVOL is fading by 9:45, and when the break happens INTO a major HTF level ten cents away — breakouts into brick walls pay the wall, not you." }
    ],
    quiz: [
      { question: "The ORB works best on…", options: ["Any random ticker", "Catalyst stocks with high relative volume", "Index funds", "Friday afternoons"], answer: 1, explain: "The breakout needs fuel — attention and participation — to follow through." },
      { question: "Price breaks the range high and instantly snaps back inside. You…", options: ["Chase it anyway", "Treat it as a failed break — often the fade signal", "Add size", "Remove your stop"], answer: 1, explain: "Failed breakouts trap the chasers; the better trade is frequently the other way." }
    ]
  },
  {
    id: "st-vwap-reclaim",
    title: "Playbook: VWAP Reclaim",
    minutes: 4,
    xp: 80,
    slides: [
      { heading: "The setup", body: "A strong stock flushes below VWAP, sweeping the obvious stops, then reclaims it with a decisive candle. The flush was the liquidity grab; the reclaim is the confirmation — equities' version of sweep-and-shift.", points: ["Context: stock must be a leader, not a laggard", "Flush: fast, stop-running move below VWAP", "Reclaim: full-bodied close back above"] },
      { heading: "Execution", body: "Enter the reclaim close or the first micro-pullback to VWAP after it. Stop below the flush low. Targets: high of day, then measured extensions. Skip if the reclaim candle is weak or volume is absent.", points: ["Entry: reclaim close / retest of VWAP", "Stop: under the flush low", "Target: HOD first, always"] },
      { heading: "Why it works", body: "Every dip-buyer's stop lives just below VWAP. The flush pays them out to institutions reloading — then price returns to trend. You're not predicting; you're joining the reload with proof in hand." }
    ],
    quiz: [
      { question: "The VWAP reclaim entry comes…", options: ["During the flush", "After a decisive close back above VWAP", "At the high of day", "Premarket"], answer: 1, explain: "The flush is bait. The reclaim is evidence. Trade evidence." },
      { question: "Your stop on a VWAP reclaim belongs…", options: ["At VWAP exactly", "Below the flush low", "10% away", "Nowhere"], answer: 1, explain: "If price returns under the flush low, the reload thesis is dead — exit cheap." }
    ]
  }
];

const STOCKS_GRAD = {
  id: "st-graduation",
  title: "Graduation: The Equity Floor",
  minutes: 3,
  xp: 100,
  slides: [
    { heading: "Your equity readiness checklist", body: "A repeatable morning scan. One opening-hour playbook backtested 50+. Halt risk sized correctly. PDT plan settled. The market opens at 9:30 whether you're ready or not — be ready on paper first.", points: ["Scan: catalyst + RVOL + float", "Trade the first 90 minutes, journal, done", "Respect earnings dates like landmines"] },
    { heading: "Small account, sharp edge", body: "Limited day trades force A+ selectivity — treat the constraint as free discipline. One quality ORB beats three boredom trades you weren't allowed to take anyway." },
    { heading: "Prove it in the Arcade", body: "Zone Sniper for level precision, Trap or Trade for chase-control, Prop Run for the full risk exam. Graduate here before the market grades you with real money." }
  ],
  quiz: [
    { question: "The equity day trader's core daily edge window is…", options: ["All day", "The opening 60–90 minutes on in-play names", "Lunch", "After hours"], answer: 1, explain: "Volume, range, and resolution concentrate at the open. Selectivity does the rest." },
    { question: "The PDT limitation is best treated as…", options: ["A reason to overtrade a cash account", "Forced selectivity — only A+ setups get a slot", "A reason to quit", "Illegal"], answer: 1, explain: "Three shots per week makes you a sniper. That's not a bug." }
  ]
};

/* ============================================================
   OPTIONS
============================================================ */

const OPTIONS_FOUNDATIONS = {
  id: "op-foundations",
  title: "Options Foundations",
  icon: "layers",
  tagline: "Contracts, greeks, IV, and defined risk.",
  lessons: [
    {
      id: "op-contracts",
      title: "Calls & Puts: The Contract",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "Options are rights, not shares", body: "A call is the right to buy 100 shares at the strike by expiration; a put, the right to sell. You pay a premium for that right — and the premium is the entire game.", points: ["Strike: your agreed price", "Expiration: the deadline", "1 contract = 100 shares of exposure"] },
        { heading: "Moneyness sets behavior", body: "In-the-money options move nearly like stock; out-of-the-money ones are cheap lottery tickets that usually expire worthless. Most beginner losses come from buying far-OTM hope.", points: ["ITM: intrinsic value, higher delta", "ATM: maximum time value, the battleground", "OTM: pure time value, decays to zero"] },
        { heading: "Buyers risk premium, sellers risk more", body: "As a buyer your worst case is losing what you paid — defined risk by construction. Sellers collect premium but can carry large or unlimited risk. Learn as a buyer of defined risk first." }
      ],
      quiz: [
        { question: "Buying a call gives you…", options: ["Shares immediately", "The right to buy 100 shares at the strike before expiry", "A dividend", "Unlimited risk"], answer: 1, explain: "Rights, not obligations — your maximum loss is the premium paid." },
        { question: "Far out-of-the-money options are…", options: ["Free money", "Mostly time value that usually decays to zero", "Safer than ITM", "The professional default"], answer: 1, explain: "They're priced like lottery tickets because they usually are lottery tickets." }
      ]
    },
    {
      id: "op-greeks",
      title: "The Greeks That Matter",
      minutes: 5,
      xp: 50,
      slides: [
        { heading: "Delta and theta run your P&L", body: "Delta: how much the option moves per $1 of stock — and roughly the market's odds it expires ITM. Theta: what you pay per day for holding. Every long option is a race between delta gains and theta rent.", points: ["0.50 delta ≈ ATM, moves 50¢ per $1", "Theta accelerates violently in the final week", "Day traders prefer 0.4–0.7 delta for balance"] },
        { heading: "Gamma is the turbo", body: "Gamma grows delta as the stock moves your way — it's why 0DTE options explode from 0.30 to 0.90 delta on a strong move. Gamma cuts both ways: against you, your delta bleeds off just as fast." },
        { heading: "Vega prices the fear", body: "Vega is sensitivity to implied volatility. Buy options when IV is calm, and know that IV spikes inflate premiums whether or not the stock moves. Vega is why 'I was right and still lost' happens.", points: ["Long options: helped by rising IV", "IV rank tells you if options are cheap or rich", "High vega + falling IV = silent bleed"] }
      ],
      quiz: [
        { question: "A 0.50-delta call on a stock that rises $2 gains roughly…", options: ["$0.50", "$1.00 (then more as gamma raises delta)", "$2.00 exactly", "Nothing"], answer: 1, explain: "Delta approximates the move — and gamma grows delta as the move continues." },
        { question: "Theta hurts most when…", options: ["Expiration is far away", "You hold short-dated options through sideways chop", "IV rises", "The stock trends"], answer: 1, explain: "Near expiry, time value evaporates fastest — chop plus theta is a slow bleed-out." }
      ]
    },
    {
      id: "op-iv-crush",
      title: "Pricing & IV Crush",
      minutes: 4,
      xp: 50,
      slides: [
        { heading: "Premium = intrinsic + extrinsic", body: "Intrinsic is real, locked-in value (how far ITM). Extrinsic is time plus implied volatility — the market's bet on future movement. Day traders live almost entirely in extrinsic value.", points: ["ITM $5 call on a $105 stock: $5 intrinsic", "Everything above that: time + IV", "Extrinsic melts; intrinsic doesn't"] },
        { heading: "IV crush: the earnings trap", body: "Before earnings, IV inflates premiums for the expected move. The instant results drop, that uncertainty dies and IV collapses — a stock can move 5% your way while your option loses money. The move was priced in.", points: ["Expected move ≈ ATM straddle price", "Post-event IV collapse = crush", "Buying calls right before earnings = paying peak fear"] },
        { heading: "Check IV before every trade", body: "IV rank compares today's IV to the past year. High rank: options are expensive — favor spreads that sell some premium. Low rank: options are cheap — long calls/puts get better odds. Price the ticket before boarding." }
      ],
      quiz: [
        { question: "A stock beats earnings and rises 4%, yet your call loses value. The likely cause is…", options: ["Broker theft", "IV crush — the volatility premium collapsed post-event", "Theta only", "Delta reversed"], answer: 1, explain: "You paid for the expected move in inflated IV. The event's passing deflated it." },
        { question: "With very high IV rank, smarter structures usually…", options: ["Buy far OTM calls", "Use spreads that also sell expensive premium", "Avoid options rules", "Double size"], answer: 1, explain: "When premium is rich, be a partial seller of it — spreads cut the vega bill." }
      ]
    },
    {
      id: "op-spreads",
      title: "Spreads & Defined Risk",
      minutes: 4,
      xp: 50,
      slides: [
        { heading: "Verticals: the trader's scalpel", body: "Buy one option, sell a further-out one, same expiry. The sold leg pays for part of yours, caps theta and vega damage, and defines max loss and max gain on entry. Predictability is the point.", points: ["Debit spread: pay net premium, directional", "Credit spread: collect premium, bet on 'not past this line'", "Max loss known before entry — always"] },
        { heading: "Why day traders love defined risk", body: "A debit spread turns 'I need a huge move' into 'I need price to reach one level.' Cheaper, calmer, and immune to the IV and theta ambushes that wreck naked long options in chop." },
        { heading: "Structure follows thesis", body: "Strong directional conviction with cheap IV: long call/put. Direction with expensive IV: debit spread. 'It won't break this level': credit spread. The chart gives the thesis; the greeks choose the vehicle." }
      ],
      quiz: [
        { question: "A debit vertical spread's maximum loss is…", options: ["Unlimited", "The net premium paid — known at entry", "The stock price", "Margin call"], answer: 1, explain: "Both legs cap each other. You know the worst case before you click." },
        { question: "IV is extremely rich but you're bullish. The better structure is usually…", options: ["Far OTM naked call", "A debit call spread — the short leg sells expensive premium back", "No trade exists", "Triple size"], answer: 1, explain: "The sold leg offsets the inflated vega/theta you'd otherwise overpay." }
      ]
    }
  ]
};

const OPTIONS_PLAYBOOKS = [
  {
    id: "op-0dte-discipline",
    title: "Playbook: 0DTE With Rules",
    minutes: 5,
    xp: 80,
    slides: [
      { heading: "The setup", body: "Same-day index options (SPX/SPY/QQQ) around your killzone levels. Gamma makes winners explosive and theta makes hesitation fatal — 0DTE amplifies whatever process you bring. Bring rules or don't come.", points: ["Trade only your A+ chart setup — sweep, shift, retrace", "0.4+ delta or a tight debit spread", "Hard time stop: dead trades die at 15 minutes"] },
      { heading: "Execution", body: "Enter on your confirmed level with a defined premium risk (this replaces the stop distance). Partial at +50% premium; runner to the chart target. Losses capped at the premium you chose — never 'one more strike' after a loss.", points: ["Risk = premium, sized to 1% rule", "Partial +50%, trail the rest", "Two losses = done with 0DTE for the day"] },
      { heading: "When to skip", body: "Skip lunch chop — theta eats you alive while nothing moves. Skip post-FOMC first minutes. Skip any day you can't define the level; 0DTE without a level is a casino ticket with extra steps." }
    ],
    quiz: [
      { question: "In 0DTE trading, your position risk is defined by…", options: ["Stop distance in points only", "The premium you commit — sized by the same 1% rule", "Leverage", "Feelings"], answer: 1, explain: "The premium is the max loss. Size it exactly like any other 1% risk." },
      { question: "Holding a 0DTE option through sideways lunch chop mostly…", options: ["Builds character", "Burns theta while giving nothing — the time stop exists for this", "Increases delta", "Is fine"], answer: 1, explain: "0DTE theta is a blowtorch. No movement = guaranteed bleed. Dead trades die fast." }
    ]
  },
  {
    id: "op-debit-trend",
    title: "Playbook: Debit Spread Trend Rider",
    minutes: 4,
    xp: 80,
    slides: [
      { heading: "The setup", body: "A clean daily trend, a corrective pullback into your zone, and rich IV that makes naked calls expensive. Structure: buy the 0.6-delta option, sell the strike at your chart target — the market pays you to cap where you'd exit anyway.", points: ["Trend + pullback + zone: the classic entry", "Short leg AT your target strike", "Net debit = defined risk"] },
      { heading: "Execution", body: "Enter the spread on the LTF shift at your zone. Risk the debit (1% rule). Exit at 60–80% of max spread value — the last 20% takes the longest and carries pin risk into expiry.", points: ["Exit at 60–80% of max value", "No holding through earnings", "Roll or close by the final week"] },
      { heading: "Why it fits day-to-swing trading", body: "The spread mutes theta and IV, so you can hold the move for days without the daily decay panic. You traded the chart; the structure just made time your tenant instead of your landlord." }
    ],
    quiz: [
      { question: "Where does the short leg of the debit spread belong?", options: ["Random strike", "At your chart target — you sell the level you'd exit at anyway", "Deep ITM", "Same strike as the long"], answer: 1, explain: "Capping gains at your own target costs nothing and cuts the premium bill." },
      { question: "Best practice is to close debit spreads at…", options: ["Exactly max value at expiry", "60–80% of max value — the last slice is slow and risky", "10%", "Never"], answer: 1, explain: "The final stretch to max value fights time and pin risk for pennies." }
    ]
  }
];

const OPTIONS_GRAD = {
  id: "op-graduation",
  title: "Graduation: The Options Floor",
  minutes: 3,
  xp: 100,
  slides: [
    { heading: "Your options readiness checklist", body: "You read delta/theta/vega before every trade. You check IV rank like a pilot checks fuel. Every position has defined risk sized by the 1% rule. The chart picks direction; the greeks pick the vehicle.", points: ["No naked short options. Ever. At this stage.", "No holding long premium through earnings", "Structure chosen from IV, not habit"] },
    { heading: "Options amplify process", body: "Leverage plus decay means options punish sloppy process faster than shares — and reward clean process better. Your edge is still the same chart skills from the core tiers; options are the amplifier, not the edge." },
    { heading: "Prove it in the Arcade", body: "Trap or Trade for entry discipline, Risk Mines for the greeks of behavior, Prop Run for the full exam. When your sim says consistent, the live floor is just paperwork." }
  ],
  quiz: [
    { question: "The correct order of operations is…", options: ["Pick an option, find a reason", "Chart thesis first, then choose the structure the greeks favor", "Buy OTM calls always", "Follow flow alerts"], answer: 1, explain: "Direction comes from the chart. The vehicle comes from delta, theta, and IV." },
    { question: "Options mainly amplify…", options: ["Luck", "Whatever process you bring — good or bad", "News", "Volume"], answer: 1, explain: "Leverage and decay accelerate outcomes. Clean process compounds; sloppy process detonates." }
  ]
};

/* ============================================================
   CRYPTO
============================================================ */

const CRYPTO_FOUNDATIONS = {
  id: "cr-foundations",
  title: "Crypto Foundations",
  icon: "bitcoin",
  tagline: "Spot, perps, funding, and a market that never sleeps.",
  lessons: [
    {
      id: "cr-market-basics",
      title: "Coins, Exchanges & Custody",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "Spot vs derivatives", body: "Spot means owning the coin. Perpetual futures ('perps') are the day trader's arena — leveraged contracts that never expire, tracking spot via a funding mechanism. Most crypto day volume is perps.", points: ["Spot: own it, no liquidation risk", "Perps: leverage, funding, liquidations", "BTC and ETH: the liquid majors; alts get thin fast"] },
        { heading: "Exchanges are your counterparty", body: "Crypto has no central exchange — liquidity fragments across venues, prices desync in fast moves, and exchange risk is real. Trade the deepest books and treat custody seriously.", points: ["Depth matters: thin books = brutal slippage", "Not your keys, not your coins (for holdings)", "Keep trading capital and savings separate"] },
        { heading: "Volatility is the product", body: "Bitcoin moves in a day what indexes move in a month; alts move in an hour what BTC moves in a day. That's opportunity AND the reason position sizing rules matter twice as much here." }
      ],
      quiz: [
        { question: "Perpetual futures are…", options: ["Coins you own", "Leveraged contracts that never expire, tethered to spot by funding", "Bank products", "NFTs"], answer: 1, explain: "Perps are the crypto day-trading vehicle — leverage plus a funding mechanism instead of expiry." },
        { question: "Trading illiquid alt perps mainly adds…", options: ["Edge", "Slippage, spread cost, and liquidation-cascade violence", "Safety", "Dividends"], answer: 1, explain: "Thin books turn normal moves into whipsaws. Learn on the majors." }
      ]
    },
    {
      id: "cr-24-7",
      title: "The Market That Never Closes",
      minutes: 4,
      xp: 40,
      slides: [
        { heading: "24/7 changes the rhythm", body: "No open, no close — but human money still sleeps. Crypto volume tracks the same sessions: Asia, Europe, US. The US session and its overlap with Europe carry the most conviction; weekends are thin and sweep-prone.", points: ["Weekend moves on low volume often retrace Monday", "Daily candle close (00:00 UTC) is a real reference", "CME futures gaps on BTC act like magnets"] },
        { heading: "Bitcoin is the tide", body: "BTC dominance measures Bitcoin's share of the market. Most alts are leveraged expressions of BTC direction — when BTC dumps, everything dumps harder. Trading an alt against BTC's trend is swimming upstream.", points: ["Check BTC's structure before any alt trade", "Alt season: BTC ranges while money rotates outward", "Correlation ≈ 1 in crashes"] },
        { heading: "You set the schedule", body: "The market never closing is a psychological trap — there is always another candle. Professionals trade defined windows and shut it off. The 24/7 chart doesn't need you; your process does." }
      ],
      quiz: [
        { question: "A violent weekend pump on thin volume most often…", options: ["Starts a new bull market", "Gets swept back when real volume returns Monday", "Is guaranteed to continue", "Means nothing"], answer: 1, explain: "Low-liquidity moves are built from stop hunts, not conviction. Weekday volume votes last." },
        { question: "Before trading any altcoin, first check…", options: ["Its logo", "Bitcoin's structure and direction — the tide under every alt", "Twitter", "The weather"], answer: 1, explain: "Alts are high-beta BTC. Fighting the tide is the most common alt-trader death." }
      ]
    },
    {
      id: "cr-perps-liquidations",
      title: "Perps, Funding & Liquidations",
      minutes: 5,
      xp: 50,
      slides: [
        { heading: "Funding is the crowd meter", body: "Every 8 hours, longs pay shorts (or vice versa) to keep perps pinned to spot. Heavily positive funding means longs are crowded and paying for the privilege — historically a contrarian warning.", points: ["Positive funding: longs pay — crowd is long", "Extreme funding + resistance = squeeze fuel", "Funding is public: it's positioning data for free"] },
        { heading: "Liquidation cascades", body: "Leverage means forced exits: when price hits a trader's liquidation level, the exchange market-closes them, pushing price into the NEXT cluster of liquidations. That chain reaction is the crypto stop hunt on steroids.", points: ["Liq clusters sit beyond obvious highs/lows", "Cascades overshoot, then snap back violently", "Liquidation maps = crypto's liquidity pools"] },
        { heading: "Leverage discipline", body: "Exchanges offer 100x; professionals use 2–5x with real stops. Your liquidation price should be irrelevant — the stop exits long before it. If liquidation is your stop, you're not trading, you're donating.", points: ["Size from the stop, same as every market", "Liq price far beyond your invalidation", "Cross vs isolated margin: know the difference"] }
      ],
      quiz: [
        { question: "Extremely positive funding at a resistance level suggests…", options: ["Guaranteed breakout", "A crowded long trade — squeeze-down fuel is loaded", "Nothing", "Buy more"], answer: 1, explain: "When everyone is long and paying for it, their liquidations become the market's next meal." },
        { question: "Your liquidation price should be…", options: ["Your stop loss", "Far beyond your stop — it should never realistically be touched", "Close to entry for excitement", "Unknown"], answer: 1, explain: "The stop manages the trade. If liquidation is doing the exiting, sizing was wrong from the start." }
      ]
    },
    {
      id: "cr-narratives",
      title: "Cycles, Narratives & On-Chain",
      minutes: 4,
      xp: 50,
      slides: [
        { heading: "Crypto trades in narratives", body: "Halving cycles, ETF flows, 'alt season', sector rotations — narratives concentrate flows the way earnings do in stocks. The narrative tells you WHERE attention is; your chart skills tell you WHEN to strike.", points: ["Money rotates: BTC → ETH → large alts → small alts", "Old narratives die fast; exit liquidity is real", "News pumps into resistance = distribution risk"] },
        { heading: "On-chain and flow data", body: "Public blockchains leak information: exchange inflows (potential selling), stablecoin reserves (dry powder), whale wallets. You don't need to be an analyst — just know these tides exist and check the big ones." },
        { heading: "Survive the cycle", body: "Crypto's drawdowns are 70–90% in bear phases. The day trader's advantage: flat every night if you choose, small risk per trade, no bag-holding. Trade the volatility; don't marry the asset." }
      ],
      quiz: [
        { question: "A coin pumps 40% on news straight into major HTF resistance. The professional read is…", options: ["FOMO in immediately", "Potential distribution — late buyers become exit liquidity at the level", "Resistance doesn't matter in crypto", "Mortgage the house"], answer: 1, explain: "News-driven spikes into supply are where early money hands bags to late money." },
        { question: "The day trader's edge over the cycle is…", options: ["Holding through -80%", "Small defined risk per trade and the option to be flat anytime", "Maximum leverage", "Never selling"], answer: 1, explain: "You harvest volatility without marrying direction. Flat is a position — especially here." }
      ]
    }
  ]
};

const CRYPTO_PLAYBOOKS = [
  {
    id: "cr-cascade-reversal",
    title: "Playbook: Liquidation Cascade Reversal",
    minutes: 5,
    xp: 80,
    slides: [
      { heading: "The setup", body: "Price cascades through a liquidation cluster — a violent wick as forced sellers puke into thin books — then aggression instantly flips. It's the sweep-reversal from your core tiers, magnified by leverage mechanics.", points: ["Locate the obvious liq cluster beyond a key low", "Cascade candle: huge range, huge volume, fast", "The tell: immediate, aggressive reclaim of the level"] },
      { heading: "Execution", body: "Never catch the falling knife mid-cascade. Wait for the reclaim close and structure shift, enter the retrace, stop under the cascade wick. First target the origin of the cascade; runner to the opposing pool.", points: ["Entry: after the reclaim, on the retrace", "Stop: below the wick extreme", "Targets: cascade origin → opposite liquidity"] },
      { heading: "When to skip", body: "Skip when price ACCEPTS below the cluster (grinds instead of snapping back) — that's genuine breakdown. Skip cascades during systemic news (exchange failures, regulatory bombs). Structure failure plus real news = knife, not spring." }
    ],
    quiz: [
      { question: "The cascade-reversal entry trigger is…", options: ["Mid-cascade, catching the knife", "The aggressive reclaim and structure shift after the wick", "Before the cascade", "Never"], answer: 1, explain: "The reclaim proves forced selling exhausted into absorbing buyers. Proof first, entry second." },
      { question: "Price grinds and holds below the liquidation cluster instead of snapping back. That's…", options: ["Still a long", "Acceptance — real breakdown, stand aside or think short", "Impossible", "Bullish"], answer: 1, explain: "Springs snap fast. Grinding acceptance below means the market genuinely repriced." }
    ]
  },
  {
    id: "cr-btc-filter",
    title: "Playbook: BTC Tide Filter",
    minutes: 4,
    xp: 80,
    slides: [
      { heading: "The setup", body: "Every alt trade gets a two-chart check: the alt's own setup AND Bitcoin's current structure. Long alt + BTC breaking down = vetoed. Long alt + BTC reclaiming a level = green light with the tide.", points: ["BTC at HTF support + your alt at its own zone = A+", "BTC mid-breakdown vetoes all alt longs", "ETH/BTC ratio hints where rotation flows"] },
      { heading: "Execution", body: "Standard entry mechanics on the alt (sweep, shift, retrace) but sized by correlation: full risk when BTC agrees, half risk when BTC is neutral, zero when it opposes. The filter is a position-sizing dial, not just a veto.", points: ["BTC aligned: normal 1% risk", "BTC neutral: half risk", "BTC opposed: no trade"] },
      { heading: "Why it works", body: "In stress, alt correlation to BTC approaches 1 — your alt's beautiful setup means nothing against a BTC dump. This filter is the crypto version of DXY confluence: two charts agreeing beats one chart hoping." }
    ],
    quiz: [
      { question: "Your alt long looks perfect but BTC just lost a major level with force. You…", options: ["Take it anyway — the alt chart is what matters", "Veto or heavily reduce — BTC's tide overrides alt structure", "Double it", "Switch to 100x"], answer: 1, explain: "Correlation spikes in stress. The tide drowns individual setups." },
      { question: "The BTC filter acts as…", options: ["A random rule", "A sizing dial: full risk aligned, half neutral, zero opposed", "A replacement for stops", "A signal service"], answer: 1, explain: "It scales your exposure to how much of the market is rowing with you." }
    ]
  }
];

const CRYPTO_GRAD = {
  id: "cr-graduation",
  title: "Graduation: The Crypto Floor",
  minutes: 3,
  xp: 100,
  slides: [
    { heading: "Your crypto readiness checklist", body: "Majors only until consistent. 2–5x leverage with the stop doing the exiting, never the liquidation engine. Funding and BTC structure checked before every trade. Defined trading windows in a market that never closes.", points: ["Liq price irrelevant by construction", "Weekend thin-book traps respected", "Narrative awareness, chart execution"] },
    { heading: "Volatility is the tuition and the salary", body: "Crypto pays faster and punishes faster than any market you'll trade. Everything from the core tiers — liquidity, sweeps, psychology, sizing — applies here at double intensity. That's exactly why disciplined traders love it." },
    { heading: "Prove it in the Arcade", body: "Stop Hunt is literally the cascade game. Candle Rush at crypto speed. Prop Run with your rules. Show consistency in the sim — then the live floor is a formality, not a leap of faith." }
  ],
  quiz: [
    { question: "Professional crypto leverage practice is…", options: ["100x, it's offered", "2–5x with stops exiting long before liquidation is possible", "No stops needed", "All-in spot alts"], answer: 1, explain: "Leverage capacity isn't a target. Survival math is identical in every market — crypto just grades faster." },
    { question: "Before any alt trade, the two-chart check is…", options: ["Alt + your horoscope", "The alt's setup + Bitcoin's structure and direction", "Two timeframes of the alt only", "Funding + weather"], answer: 1, explain: "BTC is the tide. Alt setups only cash when the tide allows it." }
  ]
};

/* ============================================================
   ORDERFLOW — advanced futures stage (NEW)
============================================================ */

const ORDERFLOW_TIERS = [
  {
    id: "of-ladder",
    title: "Stage 1 · The Ladder",
    icon: "list-ordered",
    tagline: "The DOM, the tape, and the games players play there.",
    lessons: [
      {
        id: "of-dom-basics",
        title: "Reading the DOM",
        minutes: 5,
        xp: 90,
        slides: [
          { heading: "The order book, unmasked", body: "The Depth of Market shows resting limit orders stacked at each price — bids below, offers above. Candles show what happened; the DOM shows who is waiting. This is the layer beneath every chart you've studied.", points: ["Bids: resting buy limits below price", "Offers: resting sell limits above", "Market orders consume this liquidity — that IS price movement"] },
          { heading: "Resting vs aggressive", body: "Limit orders are patient — they provide liquidity. Market orders are urgent — they take it. Price moves when aggression on one side eats through the resting orders faster than they refill. Every tick is this battle resolving.", points: ["Passive: sets the menu", "Aggressive: pays the bill", "Refill speed reveals real intent"] },
          { heading: "Size talks — sometimes", body: "A huge bid stack looks like support, but size on the DOM is a statement of intent that can be cancelled in a millisecond. What matters is what happens when price TESTS it: does it hold, refill, or vanish?" }
        ],
        quiz: [
          { question: "Price moves up when…", options: ["The chart is green", "Aggressive market buys consume the offers faster than they refill", "Bids get bigger", "Volume drops"], answer: 1, explain: "Movement is liquidity consumption. Buyers eating the offer stack is the up-move itself." },
          { question: "A massive resting bid on the DOM is…", options: ["Guaranteed support", "A claim of intent — meaningful only if it holds when tested", "Always fake", "A buy signal"], answer: 1, explain: "Resting size can vanish instantly. Its behavior under fire is the information." }
        ]
      },
      {
        id: "of-tape-reading",
        title: "The Tape: Prints & Speed",
        minutes: 4,
        xp: 90,
        slides: [
          { heading: "Time & sales is the truth feed", body: "The tape prints every executed trade: price, size, aggressor side. Charts summarize; the tape narrates. Speed bursts and size clusters tell you urgency arrived before the candle finishes forming.", points: ["Big prints at the offer: aggressive buying", "Tape acceleration = urgency", "Silence after a push = the move is done fueling"] },
          { heading: "Size tells, speed confirms", body: "One 200-lot print is a participant with conviction. A machine-gun burst of 10-lots in one direction is an algorithm working an order. Both matter more than fifty 1-lot prints from the crowd." },
          { heading: "Icebergs: hidden size", body: "Big players hide orders by showing only slivers — the DOM shows 20 but the level absorbs 500 without breaking. Reloading absorption at one price is the footprint of an iceberg, and it marks serious intent.", points: ["Small shown size, huge executed volume", "Level refuses to break despite heavy fire", "Icebergs anchor reversals and defenses"] }
        ],
        quiz: [
          { question: "A price level shows 20 contracts on the DOM but absorbs 400 without breaking. That's likely…", options: ["A glitch", "An iceberg — hidden institutional size defending the level", "Retail bids", "Nothing"], answer: 1, explain: "Executed volume dwarfing displayed size is hidden-order behavior. Someone big lives there." },
          { question: "The most informative tape activity is…", options: ["Many 1-lot prints", "Large prints and directional speed bursts", "Slow drips", "After-hours quiet"], answer: 1, explain: "Size and urgency reveal institutional participation — the flow worth following." }
        ]
      },
      {
        id: "of-spoofing",
        title: "Spoofs, Walls & Games",
        minutes: 4,
        xp: 90,
        slides: [
          { heading: "The DOM lies on purpose", body: "Spoofing: flashing large orders you never intend to fill, to scare price toward your real interest. Illegal, still everywhere in spirit. Rule: displayed liquidity is theater until executed volume confirms it.", points: ["Walls that vanish when approached = spoof behavior", "Real defense executes; fake defense evaporates", "Judge by fills, not by flashes"] },
          { heading: "Pulling and stacking", body: "Watch HOW the book changes: bids pulling as price falls means buyers stepping aside — accelerating the drop. Offers stacking above a rally is a wall being built ahead of price. Book dynamics foreshadow the next candles.", points: ["Pulling liquidity: the floor evaporates", "Stacking: a wall being pre-built", "Both are read in motion, not snapshots"] },
          { heading: "Your defense: confirmation", body: "You will not out-spoof the spoofers. Your edge is patience: let the level prove itself with executed absorption or a failed test, then act. Orderflow is a confirmation layer on your levels — not a crystal ball." }
        ],
        quiz: [
          { question: "A huge offer wall vanishes just as price reaches it. This was likely…", options: ["Real supply that filled", "A spoof — theater meant to influence, never to fill", "Support", "An iceberg"], answer: 1, explain: "Genuine intent takes fills. Vanishing walls were bait for the reaction." },
          { question: "The reliable way to judge DOM liquidity is…", options: ["Displayed size alone", "What actually executes when the level is tested", "Twitter", "Color intensity"], answer: 1, explain: "Fills are facts; displayed size is a claim. Trade on facts." }
        ]
      }
    ]
  },
  {
    id: "of-footprint",
    title: "Stage 2 · Footprint & Delta",
    icon: "grid-3x3",
    tagline: "See the volume inside every candle.",
    lessons: [
      {
        id: "of-footprint-charts",
        title: "Footprint Charts",
        minutes: 5,
        xp: 90,
        slides: [
          { heading: "X-ray vision for candles", body: "A footprint chart splits each candle into price levels, showing volume that traded at the bid vs at the ask on every level. The same red candle can hide aggressive selling — or heavy buying getting absorbed. Now you can tell.", points: ["Ask-side volume: aggressive buying", "Bid-side volume: aggressive selling", "The candle's story, level by level"] },
          { heading: "The key locations", body: "Footprints matter most AT your levels — the zones, sweeps, and FVGs from the core tiers. Reading every bar everywhere is noise; reading the battle at a pre-marked level is signal.", points: ["High-volume node at a zone = the fight happened there", "Low volume through a level = no defense existed", "Volume point of control inside the candle"] },
          { heading: "Finishing the auction", body: "A candle high where buying volume just stops — no fight at the top — is an unfinished feel; heavy two-sided volume at the extreme means the auction completed. Extremes with completed auctions hold; incomplete ones get revisited." }
        ],
        quiz: [
          { question: "A footprint shows heavy ask-side volume but price doesn't rise. That means…", options: ["Buyers are winning", "Aggressive buys are being absorbed by passive sellers — bearish tell", "Data error", "Breakout imminent"], answer: 1, explain: "Someone is selling everything the aggressors buy without giving ground. Absorption." },
          { question: "Footprint analysis is most valuable…", options: ["On every bar all day", "At your pre-marked levels, confirming or denying the reaction", "Only on Mondays", "Instead of levels"], answer: 1, explain: "Orderflow is the confirmation microscope — pointed only where your map says to look." }
        ]
      },
      {
        id: "of-delta",
        title: "Delta & Cumulative Delta",
        minutes: 5,
        xp: 90,
        slides: [
          { heading: "Delta: the aggression score", body: "Delta = buy volume at ask minus sell volume at bid, per candle. Positive delta: buyers were the aggressors. It's the single number summarizing who was throwing punches.", points: ["+500 delta: buyers dominated the aggression", "Delta extremes mark climax activity", "Delta ≠ direction — absorption breaks that link"] },
          { heading: "Cumulative delta (CVD)", body: "CVD runs the total across the session — the running score of aggression. Its divergences from price are the payload: price makes a new low but CVD doesn't = sellers are losing steam into the low.", points: ["Price new low + CVD higher low = seller exhaustion", "Price new high + CVD lower high = buyer exhaustion", "Divergence AT a level, not in space"] },
          { heading: "The absorption divergence", body: "The deadliest signal: huge negative delta while price refuses to fall. Aggressive sellers are emptying magazines into a passive buyer who won't budge. When the selling exhausts, the snap-back is violent — you've seen this in Stop Hunt." }
        ],
        quiz: [
          { question: "Price sweeps to a new low but cumulative delta makes a higher low. This suggests…", options: ["More downside guaranteed", "Seller aggression is fading into the low — reversal conditions", "Nothing", "Buy the high"], answer: 1, explain: "The push lacks committed aggression. Divergence at a swept level is the classic reversal setup." },
          { question: "Huge negative delta while price holds flat means…", options: ["Sellers are winning", "Passive buyers are absorbing everything — a bullish absorption tell", "The market is closed", "Delta is broken"], answer: 1, explain: "All that selling bought no ground. Someone enormous is on the other side." }
        ]
      },
      {
        id: "of-imbalances",
        title: "Imbalances & Unfinished Auctions",
        minutes: 4,
        xp: 90,
        slides: [
          { heading: "Diagonal imbalances", body: "Compare ask volume at one price to bid volume one tick below. A 3:1 ratio flags an imbalance — one side won that micro-battle decisively. Stacked imbalances (3+ in a row) mark institutional urgency.", points: ["3:1 diagonal ratio = imbalance", "Stacked imbalances = a player forcing through", "They act as support/resistance on revisits"] },
          { heading: "Unfinished business", body: "An auction that ends with heavy volume still trading at the extreme didn't finish its business — price tends to return to complete it. These 'unfinished auctions' are magnets, like the FVGs you already trade.", points: ["Completed extreme: volume tapers to nothing", "Unfinished: volume still thick at the high/low", "Magnets for later sessions"] },
          { heading: "Stacking with your map", body: "Imbalance zones + your FVGs + sweep levels all describing the same price = conviction. Orderflow doesn't replace your framework — it's the highest-resolution confirmation layer it can have." }
        ],
        quiz: [
          { question: "Three stacked buying imbalances through a level indicate…", options: ["Retail enthusiasm", "Institutional urgency forcing through — the zone becomes future support", "A spoof", "Nothing"], answer: 1, explain: "Consistent 3:1 aggression across consecutive levels is size with a mission." },
          { question: "An auction extreme with volume still heavy at the very high tends to…", options: ["Never trade again", "Get revisited — the auction left business unfinished", "Reverse forever", "Halt"], answer: 1, explain: "Markets complete their auctions. Unfinished extremes are magnets, like gaps." }
        ]
      }
    ]
  },
  {
    id: "of-profile",
    title: "Stage 3 · Volume Profile",
    icon: "bar-chart-horizontal",
    tagline: "Where the volume lives: POC, value, and the thin air between.",
    lessons: [
      {
        id: "of-poc-value",
        title: "POC & Value Area",
        minutes: 5,
        xp: 90,
        slides: [
          { heading: "The profile turns volume sideways", body: "Volume profile histograms volume BY PRICE, not by time. The Point of Control (POC) is the single price with the most volume — the session's fairest price. The Value Area holds ~70% of volume around it.", points: ["POC: the market's gravity", "Value Area High/Low: the accepted range", "Price outside value is an argument in progress"] },
          { heading: "Acceptance vs rejection", body: "Price entering old value tends to rotate across it to the other side; price rejecting value's edge signals imbalance. The eternal question at every level: is the market ACCEPTING these prices (building volume) or rejecting them (wicking away)?" },
          { heading: "POCs as magnets and walls", body: "Untested ('naked') POCs from prior sessions pull price back like unfinished auctions. Session POC also acts as the intraday bus stop — mean-reversion trades home to it again and again." }
        ],
        quiz: [
          { question: "The Point of Control is…", options: ["The day's high", "The price where the most volume traded — the session's fairest price", "The open", "A stop loss"], answer: 1, explain: "Maximum volume = maximum agreement. That price is the session's gravity." },
          { question: "Price pokes above the Value Area High and instantly wicks back in. That's…", options: ["Acceptance", "Rejection — the market refused those prices", "A breakout", "POC migration"], answer: 1, explain: "No time, no volume, no acceptance. Rejection at value's edge fuels rotation back through." }
        ]
      },
      {
        id: "of-hvn-lvn",
        title: "HVNs, LVNs & Naked POCs",
        minutes: 4,
        xp: 90,
        slides: [
          { heading: "Thick zones and thin air", body: "High Volume Nodes are prices where the market spent time and size — they act like mud, slowing price. Low Volume Nodes are rejected prices — thin air price teleports through. The profile is a terrain map.", points: ["HVN: congestion, support/resistance", "LVN: vacuum — fast traversal", "Targets on the far side of LVNs get hit fast"] },
          { heading: "Trading the terrain", body: "Enter at HVN edges, target through LVNs to the next HVN. Stops hide inside HVNs (hard to chop through), never in LVNs (price flies through thin air and takes your stop with it)." },
          { heading: "Naked POCs", body: "A prior session's POC that price never revisited stays 'naked' — a standing magnet. Sessions later, price still homes in to test it. Mark them; they're free targets the market itself drew.", points: ["Untested prior POCs = magnets", "Confluence: naked POC + your FVG = strong target", "Once tested, the magnet is spent"] }
        ],
        quiz: [
          { question: "Price entering a Low Volume Node usually…", options: ["Stalls for hours", "Moves through it fast — thin air offers no friction", "Reverses", "Halts"], answer: 1, explain: "LVNs are prices the market rejected. Nothing lives there to slow the traversal." },
          { question: "The worst place to hide a stop is…", options: ["Inside a thick HVN", "In an LVN — price flies through thin zones and collects it", "Beyond structure", "Past the sweep wick"], answer: 1, explain: "Thin air gets traversed in one candle. Stops need congestion between them and price." }
        ]
      }
    ]
  },
  {
    id: "of-execution",
    title: "Stage 4 · Executing With Flow",
    icon: "crosshair",
    tagline: "Absorption, exhaustion, and the full confirmation stack.",
    lessons: [
      {
        id: "of-absorption-exhaustion",
        title: "Absorption vs Exhaustion",
        minutes: 5,
        xp: 100,
        slides: [
          { heading: "The two endings of every push", body: "Absorption: aggressors fire everything into a passive wall that doesn't move — the level wins. Exhaustion: aggression simply dries up, volume tapering as the push runs out of participants. Both end moves; they read differently.", points: ["Absorption: high volume, no progress, delta vs price divergence", "Exhaustion: volume shrinking into the extreme", "Both = reversal conditions at your levels"] },
          { heading: "Reading the reversal recipe", body: "The full stop-hunt anatomy in flow terms: sweep into the pool → absorption of the aggressive stops → delta divergence → first pullback holds. That sequence is what you've been trading blind; now you can watch it happen.", points: ["Sweep = liquidity delivery", "Absorption = the big player taking it", "Divergence + hold = your trigger"] },
          { heading: "Continuation reads the opposite", body: "Initiative flow: stacked imbalances, strong delta WITH price progress, pullbacks on shrinking volume. When aggression keeps paying, join it on the pullback — don't fade a market that's still eating." }
        ],
        quiz: [
          { question: "Heavy selling volume slams into a level; price doesn't drop and delta diverges. This is…", options: ["Exhaustion", "Absorption — passive size is taking everything the sellers have", "Continuation", "Noise"], answer: 1, explain: "Maximum effort, zero result. The wall wins, and the snap-back usually follows." },
          { question: "You should NOT fade a move showing…", options: ["Shrinking volume into the extreme", "Stacked imbalances and delta confirming each new push", "Absorption", "Divergence"], answer: 1, explain: "That's initiative flow still paying its aggressors. Join pullbacks; don't stand in front." }
        ]
      },
      {
        id: "of-confirmation-stack",
        title: "The Confirmation Stack",
        minutes: 5,
        xp: 100,
        slides: [
          { heading: "Map first, microscope second", body: "Orderflow without levels is noise-surfing. The professional sequence: HTF map (zones, pools, FVGs) → price arrives → flow microscope ON → absorption/divergence/imbalance verdict → execute. The map earns the right to look.", points: ["Level + sweep: context", "Flow verdict: confirmation", "No level = no flow trade, however pretty"] },
          { heading: "The full entry checklist", body: "1) Pre-marked level. 2) Liquidity event (sweep/cascade). 3) Flow confirmation (absorption or divergence). 4) Structure shift. 5) Entry on retrace, stop beyond the flow event's extreme. Five checks, every time, no exceptions.", points: ["Flow moves your entry from 'probable' to 'witnessed'", "Stops beyond the absorption extreme are honored stops", "Skipping checks = trading hope again"] },
          { heading: "Graduation: the complete trader", body: "You now read the market at every resolution: macro narrative → structure → liquidity → candle → flow. That stack is what institutional traders mean by 'reading the tape'. Prove it in Flow Reader — then the live floor." }
        ],
        quiz: [
          { question: "The correct role of orderflow in your system is…", options: ["Replacing levels entirely", "The final confirmation layer at levels your map already chose", "A standalone signal generator", "Decoration"], answer: 1, explain: "Map first, microscope second. Flow confirms the where your framework provides." },
          { question: "Your stop after an absorption-confirmed entry belongs…", options: ["At breakeven instantly", "Beyond the absorption extreme — if that breaks, the wall lost", "Inside the level", "Nowhere"], answer: 1, explain: "The absorption extreme is the thesis line. Beyond it, the passive player folded — exit." }
        ]
      }
    ]
  }
];


/* ============================================================
   STAGE 2 SPECIALIZATIONS — advanced curriculum per market
============================================================ */

const FX_SPEC_TIERS = [
  {
    id: "fx-inst-lens", title: "Stage A · The Interbank Lens", icon: "landmark", tagline: "How the banks actually trade currency.",
    lessons: [
      { id: "fx-inst-flows", title: "Interbank Flows & The Fix", minutes: 5, xp: 110, slides: [
        { heading: "The market behind the market", body: "Retail sees a chart; banks see order flow. Corporate hedges, sovereign flows, and option barriers create predictable pressure at known prices — and the 4 PM London Fix concentrates it into one violent window.", points: ["The Fix: month-end rebalancing spikes", "Option barriers: defended like fortresses", "Round numbers cluster real business"] },
        { heading: "Barriers and defended levels", body: "When a bank sells a knock-out option at 1.1000, it has millions of reasons to defend that price. The repeated, unnatural rejections you see at big figures are often barrier defense — mechanical, not mystical." },
        { heading: "Trading around the flow windows", body: "Month-end, quarter-end, and the daily fixes are flow events, not analysis events. Either stand aside or trade the aftermath — the reversal once the flow completes is one of FX's most repeatable patterns." }
      ], quiz: [
        { question: "Price rejects 1.2000 five times with unnatural precision. The likely cause is…", options: ["Coincidence", "Option barrier defense — a bank protecting a strike", "Retail support", "A trendline"], answer: 1, explain: "Big-figure strikes get defended with real money. The precision is the tell." },
        { question: "The London Fix matters because…", options: ["It's lunch", "Month-end rebalancing flows concentrate into one window, moving pairs mechanically", "Spreads are zero", "Banks close"], answer: 1, explain: "Fix flows are forced business, not opinion — and their completion often reverses the move." }
      ]},
      { id: "fx-inst-cot", title: "Positioning: COT & Sentiment", minutes: 5, xp: 110, slides: [
        { heading: "Know who's already in", body: "The CFTC's weekly COT report shows what funds and commercials actually hold. When speculators hit record longs, who's left to buy? Positioning extremes are contrarian fuel gauges.", points: ["Commercials hedge; specs chase", "Record positioning = crowded exit door", "Turns happen when extremes unwind"] },
        { heading: "Retail sentiment inversion", body: "Broker sentiment data shows retail traders' aggregate position — famously fighting trends. When 80% of retail is long a falling pair, their stops below are the liquidity institutions harvest." },
        { heading: "Positioning + level = trade", body: "Positioning is context, never a trigger. Crowded longs INTO a weekly supply zone with a structure shift — that's the full stack. Positioning tells you the fuel; your chart skills time the spark." }
      ], quiz: [
        { question: "Speculative longs hit an all-time record while price stalls at resistance. This suggests…", options: ["Buy more", "The trade is crowded — unwind risk is high and fuel for reversal is loaded", "Nothing", "Shorts are trapped"], answer: 1, explain: "When everyone who wants in is in, the marginal flow turns seller." },
        { question: "Retail sentiment showing 80% long in a downtrend means…", options: ["The bottom is in", "Their stops below price are the liquidity pool being farmed", "Buy with them", "Data error"], answer: 1, explain: "Crowded retail positioning marks where the stops — and the next harvest — sit." }
      ]},
      { id: "fx-inst-carry", title: "Carry & Rate Differentials", minutes: 5, xp: 110, slides: [
        { heading: "The interest rate engine", body: "Hold a currency yielding 5% funded by one yielding 0.5% and you earn the difference daily — the carry trade. Trillions position around it, which is why rate EXPECTATIONS move pairs before actual hikes.", points: ["Carry = yield differential, paid daily via swap", "Expectations reprice instantly on data", "Central bank tone > the decision itself"] },
        { heading: "Carry unwinds are violent", body: "Carry works until fear arrives — then everyone exits the same trade at once. JPY-funded carry unwinding is why yen pairs crash faster than they climb. Know when you're in a crowded carry pair." },
        { heading: "Trading the differential", body: "Day traders don't earn meaningful carry, but they surf its flows: a hawkish surprise re-prices the whole curve, and the pair trends for days. Post-decision drift is a genuine, documented edge — trade the follow-through, not the spike." }
      ], quiz: [
        { question: "Why do pairs move before a rate hike actually happens?", options: ["Leaks", "Markets price expectations — the repricing IS the move", "They don't", "Spreads"], answer: 1, explain: "By decision day the hike is priced; the surprise vs expectation moves price." },
        { question: "Carry trades unwind violently because…", options: ["Rates change daily", "Everyone crowds the same funding trade and exits together in risk-off", "Brokers force it", "Carry is illegal"], answer: 1, explain: "Crowded positioning + fear = stampede through a narrow exit. Yen crosses show it best." }
      ]}
    ]
  },
  {
    id: "fx-inst-models", title: "Stage B · Weekly Session Models", icon: "calendar-range", tagline: "The week has a shape. Trade the shape.",
    lessons: [
      { id: "fx-inst-amd", title: "AMD: The Weekly Cycle", minutes: 5, xp: 110, slides: [
        { heading: "Accumulate, Manipulate, Distribute", body: "Zoom out and weeks show the same anatomy as sessions: Monday builds the range (accumulation), Tuesday–Wednesday runs a false move (manipulation), and the true weekly expansion follows (distribution).", points: ["Monday: range building — mark its extremes", "Tue/Wed: the weekly Judas swing window", "Weekly high/low forms Tue–Wed most often"] },
        { heading: "The weekly Judas swing", body: "Statistically, the week's high or low tends to form by mid-week. A Tuesday spike through Monday's range that fails is often the week's manipulation — and the origin of the real move the other way." },
        { heading: "Framing every day inside the week", body: "Before each session ask: where are we in the weekly cycle? A London sweep means something different on manipulation-Wednesday than on distribution-Friday. The weekly map ranks your daily setups." }
      ], quiz: [
        { question: "The weekly high or low most often forms…", options: ["Friday close", "Tuesday–Wednesday, after the manipulation phase", "Sunday open", "Randomly"], answer: 1, explain: "Mid-week false moves set the weekly extreme, then distribution runs the true direction." },
        { question: "Monday's range primarily serves as…", options: ["The week's trend", "The accumulation zone whose extremes become the week's first liquidity", "Noise to skip", "A gap"], answer: 1, explain: "Monday builds the pool that Tuesday/Wednesday's manipulation hunts." }
      ]},
      { id: "fx-inst-weekly-profile", title: "Weekly Profiles & HTF Draws", minutes: 5, xp: 110, slides: [
        { heading: "Name the week's profile", body: "Classic templates: expansion week (trend from Monday), consolidation week, and reversal week (sweep the prior week's extreme, then flip). Naming the developing profile early tells you which daily setups to trust.", points: ["Prior week's high/low = the first draws", "Expansion: trade continuation all week", "Reversal: prior-week sweep is the signal"] },
        { heading: "The draw on liquidity, weekly scale", body: "Every week price gravitates toward one magnet: an old weekly high, an untested weekly FVG, a naked weekly level. Identify THE draw on Sunday and you have a bias filter for five days of trading." },
        { heading: "Confluence across timeframes", body: "The A+ week: weekly draw above, daily structure bullish, and your session model firing long. When all three clocks agree, size with confidence; when they argue, trade small or watch." }
      ], quiz: [
        { question: "Price sweeps last week's low on Tuesday and displaces back above it. The likely weekly profile is…", options: ["Consolidation", "Reversal week — the sweep was the weekly manipulation", "Expansion down", "Unknowable"], answer: 1, explain: "Prior-week extreme swept + reclaim = the reversal template, with the true move opposite the sweep." },
        { question: "Identifying the week's single 'draw on liquidity' gives you…", options: ["Exact entries", "A directional filter that ranks every daily setup for the week", "Guaranteed wins", "Nothing"], answer: 1, explain: "The magnet doesn't time trades — it tells you which direction deserves your risk." }
      ]},
      { id: "fx-inst-news-models", title: "Post-News Playbooks", minutes: 5, xp: 110, slides: [
        { heading: "Never trade the spike — trade what it leaves", body: "The CPI/NFP candle itself is a coin flip through spread-widened chaos. The edge lives AFTER: the spike sweeps a pool, fills institutional orders, and the post-news structure reveals the real repricing.", points: ["First 2–5 minutes: untouchable", "Spike high/low = fresh liquidity pool", "The retrace after displacement = your entry"] },
        { heading: "The three post-news models", body: "1) Spike-and-reverse: news runs stops into a HTF level, then reprices opposite. 2) Spike-and-continue: displacement with acceptance — join the retrace. 3) Spike-and-chop: no acceptance either way — walk away.", points: ["Reversal: sweep into HTF zone + reclaim", "Continuation: acceptance beyond the level", "Chop: no follow-through = no trade"] },
        { heading: "The 15-minute rule", body: "Let the first 15 minutes complete. The candle that closes then tells you which model is in play — acceptance, rejection, or indecision. Patience here converts news from a slot machine into a setup." }
      ], quiz: [
        { question: "The highest-edge moment around red-folder news is…", options: ["The release second", "After the spike completes — trading the structure the news left behind", "10 minutes before", "Never"], answer: 1, explain: "The spike is chaos; the post-spike structure shows where real orders were filled." },
        { question: "News spikes through a level but price closes back inside within 15 minutes. Which model?", options: ["Continuation", "Spike-and-reverse — the news ran the pool and rejected", "Chop", "Breakout"], answer: 1, explain: "Rejection after a news sweep is the reversal template at maximum velocity." }
      ]}
    ]
  }
];

const ST_SPEC_TIERS = [
  {
    id: "st-adv-internals", title: "Stage A · Market Internals", icon: "gauge", tagline: "Read the whole market, not one ticker.",
    lessons: [
      { id: "st-adv-tick", title: "TICK, ADD & Breadth", minutes: 5, xp: 110, slides: [
        { heading: "The market's vital signs", body: "$TICK shows NYSE stocks upticking minus downticking right now; $ADD shows advancers minus decliners on the day. They reveal whether YOUR trade is swimming with or against the whole ocean.", points: ["TICK ±1000: extreme, often exhaustion", "ADD trending one way all day = trend day", "Internals diverging from price = warning"] },
        { heading: "Trend day vs range day, decided early", body: "ADD pinned above +1500 with TICK holding positive = trend day: buy pullbacks, skip fades. Internals oscillating around zero = range day: fade the edges. This one read reshapes every intraday decision." },
        { heading: "Divergence at extremes", body: "New index high while TICK prints a weaker extreme and ADD flattens — fewer soldiers behind the general. Internals divergence is the equity version of delta divergence, and it precedes afternoon reversals." }
      ], quiz: [
        { question: "ADD is pinned at +2000 all morning. The correct mode is…", options: ["Fade every rally", "Trend day: buy pullbacks and stop fading", "Go home", "Short internals"], answer: 1, explain: "One-sided breadth means the whole market is the trade — fading it is donating." },
        { question: "Price makes a new high while TICK extremes weaken and breadth flattens. That signals…", options: ["Stronger uptrend", "Participation is thinning — reversal risk is rising", "Nothing", "Buy more"], answer: 1, explain: "Fewer stocks powering the move = the equity market's exhaustion divergence." }
      ]},
      { id: "st-adv-rotation", title: "Sector Rotation & Relative Strength", minutes: 5, xp: 110, slides: [
        { heading: "Money doesn't leave, it rotates", body: "Intraday, capital flows between sectors — tech leading while energy bleeds, defensives catching bids when risk sours. The stocks worth trading long are in the sector currently receiving flow.", points: ["Compare sector ETFs vs SPY intraday", "Leaders lead in rallies AND selloffs first", "Trade strength in strong sectors, weakness in weak"] },
        { heading: "Relative strength: the sniper filter", body: "A stock holding green while SPY dumps is showing institutional sponsorship. When the market turns back up, those RS leaders explode first. RS against the index is the cleanest single filter for longs." },
        { heading: "The RS playbook", body: "Market pulls back → your candidate refuses to make a lower low → market stabilizes → the candidate breaks its high first. You're not predicting the market; you're riding sponsorship that already showed its hand." }
      ], quiz: [
        { question: "SPY drops 1% but your watchlist stock holds flat near highs. This shows…", options: ["It's broken", "Relative strength — someone is absorbing supply despite the tape", "Low volume", "Nothing"], answer: 1, explain: "Refusing to fall with the market = institutional bid. First to rip when pressure lifts." },
        { question: "The best long candidates live in…", options: ["Any red sector", "The sector currently receiving rotation flow, showing RS vs the index", "The cheapest stocks", "Yesterday's losers"], answer: 1, explain: "Flow concentrates. Trade with the rotation, not against it." }
      ]},
      { id: "st-adv-auction", title: "Auction Theory: Balance & Excess", minutes: 5, xp: 110, slides: [
        { heading: "Markets breathe in two modes", body: "Balance: price rotates around accepted value, both sides trading comfortably. Imbalance: one side is wrong, and price moves directionally seeking new value. Every strategy is a bet on which mode persists.", points: ["Balance → fade the edges", "Imbalance → join the exploration", "Transitions are where fortunes change hands"] },
        { heading: "Excess: the auction's punctuation", body: "A long tail at an extreme — price probed, got violently rejected — is 'excess' and marks a completed auction end. No excess at a high (a poor high) means the auction is unfinished and price often returns.", points: ["Tail/wick = excess = solid extreme", "Poor high/low = unfinished = magnet", "Same logic as your unfinished-auction orderflow lesson"] },
        { heading: "Value migration", body: "Watch where acceptance builds: value migrating higher all day confirms the trend regardless of any single candle. Price can spike anywhere; VALUE moving is the market actually changing its mind." }
      ], quiz: [
        { question: "A 'poor high' with no excess tail tends to…", options: ["Hold forever", "Get revisited — the auction up there never finished its business", "Reverse the trend", "Mean nothing"], answer: 1, explain: "Unfinished auctions are magnets. Completion demands a return trip." },
        { question: "Price spikes up but value (acceptance) stays unchanged below. The honest read is…", options: ["Breakout confirmed", "An unaccepted probe — until value migrates, the market hasn't changed its mind", "Crash coming", "Buy the spike"], answer: 1, explain: "Spikes are questions; acceptance is the answer. Trade the answer." }
      ]}
    ]
  },
  {
    id: "st-adv-tape", title: "Stage B · Advanced Tape", icon: "scroll-text", tagline: "Squeezes, halts, and the prints that matter.",
    lessons: [
      { id: "st-adv-tape-reading", title: "Equity Tape: Blocks & Sweeps", minutes: 5, xp: 110, slides: [
        { heading: "Prints with intent", body: "A 500k-share block at the ask is an institution paying up NOW. Option sweeps hitting multiple exchanges simultaneously are urgency in its purest form. Learn to separate signal prints from HFT noise.", points: ["Blocks at ask = urgent accumulation", "Sweeps: speed-prioritized, multi-venue", "Repeated same-size prints = an algo working"] },
        { heading: "Dark pools and delayed truth", body: "Huge trades print away from lit exchanges and appear late on the tape. A massive dark print above current price often marks where real business happened — future support built in the shadows." },
        { heading: "Tape at YOUR levels", body: "Like footprint reading in futures: tape matters at pre-marked levels. Aggressive prints absorbing at your support = the defense showing up. Tape everywhere is noise; tape at the level is confirmation." }
      ], quiz: [
        { question: "Repeated 10k prints at the ask every few seconds most likely indicate…", options: ["Retail buying", "An institutional algo methodically accumulating", "Nothing", "A glitch"], answer: 1, explain: "Uniform, rhythmic size is machine execution slicing a parent order." },
        { question: "Tape reading creates edge primarily…", options: ["All day on every stock", "At your pre-marked levels, confirming or denying the expected reaction", "In premarket only", "Never"], answer: 1, explain: "Same rule as every confirmation tool: the map chooses where the microscope points." }
      ]},
      { id: "st-adv-squeeze", title: "Short Squeeze Anatomy", minutes: 5, xp: 110, slides: [
        { heading: "The mechanics of forced buying", body: "High short interest + rising borrow cost + a catalyst = trapped shorts. Every uptick increases their pain until buying-to-cover becomes involuntary — a liquidation cascade pointed UP.", points: ["SI% of float: the trapped crowd's size", "Cost to borrow rising = pressure building", "Low float turns pressure into violence"] },
        { heading: "The squeeze sequence", body: "Ignition (catalyst gap) → first covering pop → failed breakdown that traps late shorts → the vertical phase as margin calls chain. Each 'obvious shorting spot' that fails adds fuel.", points: ["Failed breakdowns = squeeze fuel", "Halts amplify panic on reopen", "The vertical phase is distribution, not entry"] },
        { heading: "Trading it without dying", body: "Long the failed breakdowns with structure stops, never short the first vertical day, and remember the exit: squeezes retrace as fast as they rose. You're renting momentum, not marrying a story." }
      ], quiz: [
        { question: "Squeeze fuel accumulates when…", options: ["Price falls quietly", "Obvious breakdown spots keep failing, trapping each new wave of shorts", "Volume dies", "SI is zero"], answer: 1, explain: "Every failed breakdown converts fresh shorts into future forced buyers." },
        { question: "The professional rule on day-one verticals is…", options: ["Short immediately — it's too high", "Never short the first vertical day; forced buying doesn't care about valuation", "Mortgage the house long", "Halts mean safety"], answer: 1, explain: "'Too high' isn't a setup. Wait for structure; the reversion trade comes later." }
      ]},
      { id: "st-adv-halts", title: "Halts & Reopening Auctions", minutes: 5, xp: 110, slides: [
        { heading: "LULD: the circuit breakers", body: "Stocks pause ~5 minutes when they move too fast through limit bands. During the halt, orders stack into a reopening auction — and the reopen prints WHEREVER that auction clears, gapping through stops without mercy.", points: ["Halts pause; they don't protect", "Reopen = auction, can gap violently", "Consecutive halts = maximum danger"] },
        { heading: "Reading the reopen", body: "The imbalance direction into the reopen telegraphs the next leg: reopen higher on heavy volume that HOLDS = continuation; reopen that instantly fades = the exhaustion print. The first 30 seconds after reopen is the tell." },
        { heading: "Sizing for halt regimes", body: "On halt-prone runners, position size IS your risk management — stops don't exist through a halt. Trade quarter size, expect 10–20% gaps, and never carry full size into an imminent band." }
      ], quiz: [
        { question: "Your stop during a trading halt…", options: ["Executes at your price", "Cannot fill — the reopen auction prints wherever it clears, possibly far through it", "Improves", "Cancels the halt"], answer: 1, explain: "Only size protects you through halts. The auction owes your stop nothing." },
        { question: "A stock reopens from a halt higher on huge volume and holds the level. That suggests…", options: ["Instant fade", "Real demand survived the auction — continuation odds favor the move", "Nothing", "Another halt is illegal"], answer: 1, explain: "Auctions that clear higher AND hold show the imbalance was genuine." }
      ]}
    ]
  }
];

const OP_SPEC_TIERS = [
  {
    id: "op-adv-dealers", title: "Stage A · Dealer Positioning", icon: "scale", tagline: "The hedging flows that steer the index.",
    lessons: [
      { id: "op-adv-gex", title: "Gamma Exposure (GEX)", minutes: 5, xp: 110, slides: [
        { heading: "Dealers must hedge — that's the edge", body: "Market makers take the other side of option flow, then hedge with stock. Their aggregate gamma position determines HOW they hedge: with the market or against it. That mechanical flow shapes entire regimes.", points: ["Long gamma dealers: sell rips, buy dips → pinned, quiet tape", "Short gamma dealers: buy rips, sell dips → amplified moves", "The gamma flip level divides the regimes"] },
        { heading: "Reading the regime", body: "Positive GEX days: mean-reversion strategies shine, breakouts die at walls. Negative GEX days: trends extend violently, fading is suicide. Same chart pattern, opposite correct play — regime first, setup second." },
        { heading: "Walls and magnets", body: "Massive gamma at a strike creates a 'wall' — dealers' hedging defends it. Into expiry, the biggest strikes act as magnets (pinning). Your Gamma Sweep game is literally this mechanic." }
      ], quiz: [
        { question: "In a negative gamma regime, dealer hedging…", options: ["Dampens moves", "Amplifies moves — they buy strength and sell weakness, chasing", "Stops", "Only affects VIX"], answer: 1, explain: "Short-gamma hedging chases price, pouring gasoline on every move." },
        { question: "The same breakout pattern should be traded differently based on…", options: ["Your mood", "The gamma regime — positive GEX kills breakouts at walls, negative GEX extends them", "The day of week", "Nothing"], answer: 1, explain: "Regime decides whether mean-reversion or momentum gets paid." }
      ]},
      { id: "op-adv-pinning", title: "Pinning, Charm & Vanna", minutes: 5, xp: 110, slides: [
        { heading: "Expiry gravity", body: "As expiration approaches, hedging flows concentrate around big open-interest strikes — price gets 'pinned'. Max-pain behavior isn't conspiracy; it's thousands of deltas being re-hedged into a shrinking time window.", points: ["Big OI strikes = Friday magnets", "Pinning strongest in calm, positive-gamma tape", "Breaks FROM pins are violent (hedges unwind)"] },
        { heading: "Charm: delta decay", body: "Charm is delta bleeding as time passes. Into expiry, dealers' hedges must unwind on a schedule — creating persistent, flow-driven drifts (the famous expiry-week morning drifts) that have nothing to do with news." },
        { heading: "Vanna: the vol-price link", body: "Vanna links IV changes to hedging: when IV falls, dealers often must BUY back hedges — fueling the 'vol crush rally'. Post-event IV collapse + vanna flows = the market floating up on nothing. Now you know what powers it." }
      ], quiz: [
        { question: "The market drifts up steadily after a fear event as IV collapses. A major mechanical driver is…", options: ["Good news", "Vanna/charm flows — falling IV forces dealers to buy back hedges", "Retail buying", "Luck"], answer: 1, explain: "Vol-down = mechanical dealer buying. The rally needs no narrative." },
        { question: "Price hovering at a huge-OI strike into Friday close is likely…", options: ["Random", "Pinning — expiry hedging flows gravitating price to the strike", "A breakout signal", "Manipulation by retail"], answer: 1, explain: "Concentrated hedging around big strikes acts like gravity into expiration." }
      ]},
      { id: "op-adv-skew", title: "Skew & Term Structure", minutes: 5, xp: 110, slides: [
        { heading: "The surface tells on the crowd", body: "Puts trade richer than calls (skew) because crashes are feared more than rallies. When skew steepens sharply, someone big is paying up for protection — the surface leaks institutional anxiety before headlines do.", points: ["Steepening skew = protection bid", "Flattening skew = complacency", "Call skew spikes = speculative frenzy (squeezy)"] },
        { heading: "Term structure: fear's calendar", body: "Normally longer-dated IV > short-dated (contango). Inversion — front-month IV exploding above back months — means the market fears NOW. Event humps in the curve show you exactly which date the market is bracing for.", points: ["Inversion = acute, immediate fear", "Event humps price binary dates", "Normalization after events = the crush"] },
        { heading: "Using the surface as a trader", body: "Before structuring anything: where's IV rank, how steep is skew, what does the curve look like? The surface tells you which structure the market is overpaying for — sell what's rich, buy what's cheap, direction second." }
      ], quiz: [
        { question: "Front-month IV explodes above longer-dated IV. This inversion signals…", options: ["Calm", "Acute near-term fear — the market is bracing for something now", "A bull market", "Nothing"], answer: 1, explain: "Inverted term structure = panic priced into the immediate window." },
        { question: "Sharply steepening put skew usually means…", options: ["Calls are cheap", "Institutions are paying up for downside protection — anxiety before headlines", "Rally guaranteed", "Skew is broken"], answer: 1, explain: "The protection bid shows in the surface before it shows in the news." }
      ]}
    ]
  },
  {
    id: "op-adv-structures", title: "Stage B · Advanced Structures", icon: "component", tagline: "Precision instruments for specific theses.",
    lessons: [
      { id: "op-adv-flies", title: "Butterflies & Pin Plays", minutes: 5, xp: 110, slides: [
        { heading: "The precision bet", body: "A butterfly (buy 1, sell 2, buy 1 across strikes) costs pennies and pays multiples IF price finishes near the middle strike. It's the structure for 'I know WHERE it's going' — your pinning knowledge weaponized.", points: ["Max profit AT the short strike at expiry", "Tiny debit, capped risk, huge ratio", "Cheap because precision is hard — unless you read pins"] },
        { heading: "The expiry fly playbook", body: "Friday morning: identify the dominant gamma strike, buy the fly centered there for a small debit, let pinning gravity work the afternoon. 5–10x payoffs on correct pins make 60% losers irrelevant.", points: ["Center on the biggest OI/gamma strike", "Enter after the morning settles", "Risk only what the debit costs"] },
        { heading: "Flies as targets", body: "Beyond pins: any thesis with a specific target ('this sweep drives us to 450 by Friday') converts into a fly centered at the target — paying far more than a spread if you're precisely right. Precision thesis → precision structure." }
      ], quiz: [
        { question: "A butterfly reaches maximum profit when…", options: ["Price moves as far as possible", "Price finishes at the middle (short) strike at expiration", "IV explodes", "Immediately"], answer: 1, explain: "Flies pay for precision: the closer to the body at expiry, the bigger the payout." },
        { question: "Why can expiry-day flies be so cheap relative to payoff?", options: ["Brokers subsidize them", "Finishing exactly at a strike is rare — unless pinning mechanics make it less rare than priced", "They're risk-free", "Low volume"], answer: 1, explain: "The market prices random precision; pin readers aren't betting on random." }
      ]},
      { id: "op-adv-calendars", title: "Calendars & Term Trades", minutes: 5, xp: 110, slides: [
        { heading: "Selling time to buy time", body: "A calendar sells the near expiry and buys the far one at the same strike. You're short fast decay and long slow decay — profiting when the front bleeds off while the back holds. It's a trade on the SHAPE of time.", points: ["Short front theta, long back vega", "Wins in quiet, range-bound tape", "The anti-0DTE: patience as a position"] },
        { heading: "Event calendars", body: "When an event hump inflates a specific expiry, sell that expiry and own the one behind it. The event passes, the hump collapses, the back month barely moves — you harvested the fear premium itself." },
        { heading: "When calendars break", body: "The enemy is a violent move away from your strike — both legs lose their relationship. Calendars are for 'nothing happens' or 'the event premium is overpriced' theses, never for breakout hunting." }
      ], quiz: [
        { question: "A calendar spread profits most when…", options: ["Price trends violently", "Price stays near the strike while the front expiry decays faster than the back", "IV goes to zero everywhere", "Immediately"], answer: 1, explain: "You're farming the decay differential — quiet, pinned tape pays the rent." },
        { question: "An 'event calendar' harvests…", options: ["Direction", "The inflated fear premium in the event expiry, which collapses once the event passes", "Dividends", "Commissions"], answer: 1, explain: "Sell the hump, own the calm behind it, let the binary premium evaporate." }
      ]},
      { id: "op-adv-earnings", title: "Earnings Structures Done Right", minutes: 5, xp: 110, slides: [
        { heading: "The expected move is the exam", body: "The ATM straddle price into earnings ≈ the market's expected move. Every earnings structure is a bet against that number: will the stock move MORE or LESS than priced? Direction is secondary to that question.", points: ["Straddle price = the bar to beat", "History: does this name usually beat its implied move?", "IV crush is guaranteed; direction isn't"] },
        { heading: "Structures for each thesis", body: "'Bigger move than priced': long strangle — needs a HUGE beat to survive crush. 'Smaller move': iron condor sells the inflated premium — the statistically favored side. 'Direction + crush protection': the debit spread you already know.", points: ["Condors monetize overpriced fear", "Strangles need outliers, not just beats", "Spreads mute the crush for directional bets"] },
        { heading: "The professional's earnings rule", body: "Size these at half risk: earnings are true binaries where analysis caps at probability, never certainty. The season's edge comes from harvesting systematically overpriced expected moves across many names — a portfolio of small condors, not one hero strangle." }
      ], quiz: [
        { question: "The market-implied earnings move is best read from…", options: ["The news", "The at-the-money straddle price in the earnings expiry", "Last quarter", "Volume"], answer: 1, explain: "The straddle IS the priced expectation — every structure bets for or against it." },
        { question: "Stocks historically moving less than their implied earnings move statistically favor…", options: ["Long strangles", "Premium-selling structures like iron condors", "Naked calls", "No trade ever"], answer: 1, explain: "Systematically overpriced fear is harvested by defined-risk selling, sized small, across many names." }
      ]}
    ]
  }
];

const CR_SPEC_TIERS = [
  {
    id: "cr-adv-onchain", title: "Stage A · On-Chain Intelligence", icon: "database", tagline: "The blockchain leaks — learn to read the leaks.",
    lessons: [
      { id: "cr-adv-flows", title: "Exchange Flows & Stablecoin Dry Powder", minutes: 5, xp: 110, slides: [
        { heading: "Coins moving tell intentions", body: "Large inflows TO exchanges historically precede selling (coins staged for sale); large outflows to cold storage signal conviction holding. Stablecoin balances on exchanges are the dry powder waiting to buy.", points: ["Exchange inflows = potential sell pressure", "Outflows = supply leaving the market", "Rising stablecoin reserves = loaded buy-side fuel"] },
        { heading: "Whale watching, honestly", body: "Single whale transfers make headlines but mislead — internal wallet shuffles look identical to sales. Edge lives in AGGREGATE flows and sustained trends, not one transaction screenshot from Twitter.", points: ["Aggregate > anecdote", "Sustained trend > single spike", "Old-coin movement (dormancy) = smart-money tell"] },
        { heading: "On-chain as regime, chart as trigger", body: "On-chain data is slow and regime-level: accumulation or distribution over weeks. It ranks WHICH side deserves your risk; your liquidity and structure skills still time every entry. Same rule as every context layer." }
      ], quiz: [
        { question: "Sustained heavy inflows of BTC to exchanges typically signal…", options: ["Bullish accumulation", "Coins being staged for sale — distribution pressure building", "Nothing", "A fork"], answer: 1, explain: "You move coins to an exchange to sell them. Aggregate inflows front-run supply." },
        { question: "Growing stablecoin reserves on exchanges represent…", options: ["Selling pressure", "Dry powder — capital positioned and waiting to buy", "Dead money", "Fees"], answer: 1, explain: "Stables on-exchange are one click from becoming bids." }
      ]},
      { id: "cr-adv-positioning", title: "OI, Funding & Liquidation Maps", minutes: 5, xp: 110, slides: [
        { heading: "The leverage dashboard", body: "Open interest shows how much leverage exists; funding shows which side pays for it; liquidation maps estimate WHERE forced exits cluster. Together they draw a map of future forced flows — the crypto edge in one dashboard.", points: ["OI rising + price flat = pressure loading", "Funding extreme = crowded side identified", "Liq clusters = the market's next targets"] },
        { heading: "The OI-price matrix", body: "Price up + OI up: new longs driving (trend fuel). Price up + OI down: shorts covering (weaker rally). Price down + OI up: new shorts pressing. Price down + OI down: longs capitulating (closer to the end). Four cells, instant context.", points: ["Fresh positioning trends; unwinds exhaust", "OI flush = leverage reset = cleaner market", "Your Funding Flip game drills exactly this"] },
        { heading: "Hunting with the map", body: "The full crypto stack: liq cluster above + crowded shorts paying negative funding + your level = the squeeze setup with named victims. You're not predicting price; you're predicting FORCED BEHAVIOR — far more reliable." }
      ], quiz: [
        { question: "Price rises while open interest falls. The rally is powered by…", options: ["New aggressive longs", "Short covering — an unwind, typically weaker than fresh positioning", "Spot only", "Nothing"], answer: 1, explain: "Closing shorts lift price but exhaust themselves; no new commitment behind the move." },
        { question: "A liquidation cluster sitting above equal highs is best read as…", options: ["Resistance forever", "A forced-buying fuel depot the market will likely visit", "Irrelevant", "A bug"], answer: 1, explain: "Liq maps mark where involuntary orders wait — magnets with mechanical certainty." }
      ]},
      { id: "cr-adv-cvd", title: "Spot vs Perp CVD", minutes: 5, xp: 110, slides: [
        { heading: "Two tapes, one truth", body: "Split cumulative delta by venue: SPOT CVD shows real-money accumulation; PERP CVD shows leveraged speculation. Rallies led by spot buying are institutionally real; rallies led purely by perps are leverage begging to be flushed.", points: ["Spot-led = durable", "Perp-led = fragile, squeeze-prone", "Divergence between them = the tell"] },
        { heading: "The classic divergences", body: "Price up, spot CVD flat, perp CVD vertical: leverage-only pump — fade candidate at resistance. Price flat/down while spot CVD climbs: quiet real accumulation under the surface — the strongest bullish tell in crypto.", points: ["Perp froth into resistance = trap", "Spot absorption during dumps = smart money", "Check both before every swing decision"] },
        { heading: "Completing your crypto stack", body: "You now read crypto at every layer: on-chain regime → positioning map → venue CVD → structure and liquidity → execution. That is a professional desk's full checklist — and almost nobody retail runs it." }
      ], quiz: [
        { question: "Price pumps with vertical perp CVD but flat spot CVD. This rally is…", options: ["Institutionally backed", "Leverage-only — fragile and prone to a liquidation flush", "Guaranteed to continue", "Spot-driven"], answer: 1, explain: "No real money behind it — just leverage stacking its own liquidations overhead." },
        { question: "The strongest quiet-accumulation signal is…", options: ["Perps pumping", "Spot CVD climbing while price stays flat or dips — real coins being absorbed", "High funding", "Twitter threads"], answer: 1, explain: "Someone taking delivery without moving price is someone who plans to hold." }
      ]}
    ]
  },
  {
    id: "cr-adv-micro", title: "Stage B · Cross-Venue Microstructure", icon: "network", tagline: "Basis, books, and the machinery between exchanges.",
    lessons: [
      { id: "cr-adv-basis", title: "Basis & The Futures Curve", minutes: 5, xp: 110, slides: [
        { heading: "The price of leverage over time", body: "Futures trading above spot (contango) means longs pay a premium for leverage — annualize it and you get the basis. Extreme basis = extreme greed; negative basis (backwardation) = capitulation-grade fear.", points: ["Fat basis = crowded, expensive longs", "Negative basis historically marks bottoms", "Basis compression unwinds violently"] },
        { heading: "The carry trade in crypto", body: "Institutions harvest fat basis risk-free: long spot, short the future, pocket the spread. That flow itself compresses basis — and when it unwinds during stress, it accelerates crashes. Structural flows you can now anticipate." },
        { heading: "CME vs offshore", body: "CME futures (institutions, closes on weekends → the famous gaps) versus offshore perps (24/7 leverage casino) often disagree. CME leading = institutional conviction; offshore leading = retail leverage. Whose money is moving matters." }
      ], quiz: [
        { question: "Deeply negative basis (futures below spot) has historically coincided with…", options: ["Market tops", "Capitulation lows — fear so extreme leverage longs are gone", "Sideways chop", "Nothing"], answer: 1, explain: "When nobody will pay for upside leverage, the sellers are usually exhausted." },
        { question: "An annualized basis of 25% signals…", options: ["Cheap leverage", "Extreme greed — longs paying enormous premiums, a crowded-market warning", "Normal conditions", "Backwardation"], answer: 1, explain: "Fat basis = expensive euphoria. Carry traders feast, and unwinds hurt." }
      ]},
      { id: "cr-adv-depth", title: "Depth, Spoofing & Thin Books", minutes: 5, xp: 110, slides: [
        { heading: "Liquidity is a mirage that matters", body: "Crypto books are thin and fragmented: the same $10M sell moves BTC 0.1% at noon and 2% on Sunday at 3 AM. Depth charts show the walls — but crypto spoofing is rampant and unpunished, so walls are claims, not facts.", points: ["Depth varies 10x by hour and venue", "Walls that flee on approach = spoofs", "Executed volume is the only truth (your Flow lessons)"] },
        { heading: "Thin-book weaponization", body: "Whales deliberately push price during thin hours — a few million dollars at 4 AM Sunday prints a candle that triggers cascades and paints charts. Recognize engineered thin-book moves: they reverse when depth returns.", points: ["Weekend/overnight moves: discount them", "Return of depth = the honest re-vote", "Same lesson as FX session liquidity"] },
        { heading: "Venue arbitrage awareness", body: "Prices desync across exchanges in fast moves; arb bots close the gaps in seconds. For you: use the deepest venue's chart as truth, expect wicks elsewhere, and never set stops based on a thin exchange's prints." }
      ], quiz: [
        { question: "A massive bid wall vanishes as price approaches it. That wall was…", options: ["Filled instantly", "A spoof — a claim designed to influence, never to buy", "Real support", "A glitch"], answer: 1, explain: "Intent is proven by fills. Fleeing walls were theater — crypto's oldest trick." },
        { question: "A violent 3 AM Sunday candle on minimal volume should be…", options: ["Traded immediately", "Heavily discounted — thin-book engineering usually re-votes when depth returns", "Trusted fully", "Reported"], answer: 1, explain: "Moves need participation to be honest. Ghost-hour prints get corrected." }
      ]},
      { id: "cr-adv-cycles", title: "Macro Cycles & Distribution", minutes: 5, xp: 110, slides: [
        { heading: "The four-season market", body: "Crypto historically moves in multi-year cycles: accumulation (boredom), markup (disbelief→euphoria), distribution (smart money exits into strength), markdown (the -80%). Each season rewards a different trader — and punishes last season's hero.", points: ["Accumulation: range strategies, patience", "Markup: trend-following feasts", "Distribution: euphoria + deteriorating internals"] },
        { heading: "Reading the season", body: "Distribution's fingerprints: parabolic price with spot CVD flattening, exchange inflows rising, basis at extremes, alt-season froth while BTC stalls. No single signal calls tops — the CLUSTER does.", points: ["Cluster of extremes > any one signal", "Your entire toolkit converges here", "Cycle awareness sizes your aggression"] },
        { heading: "The complete crypto trader", body: "Season awareness (years) → positioning map (weeks) → venue flows (days) → structure and liquidity (hours) → execution (minutes). Five clocks, one decision. This is the summit of the crypto track — everything below feeds it." }
      ], quiz: [
        { question: "Parabolic price + flattening spot CVD + rising exchange inflows + extreme basis is the fingerprint of…", options: ["Accumulation", "Distribution — smart money exiting into euphoric strength", "A bear market bottom", "Nothing"], answer: 1, explain: "No single top signal exists; the cluster of extremes is the call." },
        { question: "Cycle awareness primarily changes your…", options: ["Entry candles", "Aggression and sizing — which season's strategies deserve full risk", "Exchange choice", "Nothing"], answer: 1, explain: "Seasons don't time entries; they tell you how hard to press and which playbook rules." }
      ]}
    ]
  }
];

/* ============================================================
   TRACK REGISTRY + MANAGEMENT
============================================================ */

const TRACKS = {
  futures: { id: "futures", label: "Futures", icon: "candlestick-chart", symbol: "NQ / ES", tagline: "Leverage, liquidity, and the CME session game.", tiers: FUTURES_TIERS, advanced: ORDERFLOW_TIERS,
    advancedMeta: { title: "Orderflow Trading", sub: "The institutional layer: DOM, footprint, delta, and volume profile." } },
  forex: { id: "forex", label: "Forex", icon: "globe", symbol: "EUR/USD", tagline: "Pairs, pips, and the 24-hour session rhythm.", tiers: buildNicheTrack("fx", FOREX_FOUNDATIONS, FOREX_PLAYBOOKS, FOREX_GRAD), advanced: FX_SPEC_TIERS,
    advancedMeta: { title: "Institutional FX", sub: "Interbank flows, positioning data, and the weekly session models." } },
  stocks: { id: "stocks", label: "Stocks", icon: "building-2", symbol: "AAPL / TSLA", tagline: "Catalysts, gaps, and the opening auction.", tiers: buildNicheTrack("st", STOCKS_FOUNDATIONS, STOCKS_PLAYBOOKS, STOCKS_GRAD), advanced: ST_SPEC_TIERS,
    advancedMeta: { title: "Auction & Tape Mastery", sub: "Market internals, squeeze anatomy, and the prints that matter." } },
  options: { id: "options", label: "Options", icon: "layers", symbol: "SPX 0DTE", tagline: "Greeks, IV, and defined-risk structures.", tiers: buildNicheTrack("op", OPTIONS_FOUNDATIONS, OPTIONS_PLAYBOOKS, OPTIONS_GRAD), advanced: OP_SPEC_TIERS,
    advancedMeta: { title: "The Greeks Desk", sub: "Dealer positioning, the volatility surface, and precision structures." } },
  crypto: { id: "crypto", label: "Crypto", icon: "bitcoin", symbol: "BTC / ETH", tagline: "Perps, funding, and a market that never sleeps.", tiers: buildNicheTrack("cr", CRYPTO_FOUNDATIONS, CRYPTO_PLAYBOOKS, CRYPTO_GRAD), advanced: CR_SPEC_TIERS,
    advancedMeta: { title: "On-Chain & Microstructure", sub: "Exchange flows, positioning maps, basis, and cross-venue truth." } }
};

function trackBaseComplete(track) {
  return track.tiers.every((tier) => tier.lessons.every((lesson) => academyLessonPassed(lesson.id)));
}

function advancedTierUnlockedFor(track, index) {
  if (!track.advanced || !trackBaseComplete(track)) return false;
  if (index === 0) return true;
  const previous = track.advanced[index - 1];
  const done = previous.lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
  return done >= Math.ceil(previous.lessons.length * 0.7);
}

function advancedStats(track) {
  const lessons = (track.advanced || []).flatMap((tier) => tier.lessons);
  const done = lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
  return { total: lessons.length, done };
}

function currentTrackId() {
  const saved = progress().academyTrack;
  return TRACKS[saved] ? saved : "futures";
}

function currentTrack() {
  return TRACKS[currentTrackId()];
}

function setTrack(trackId, options = {}) {
  if (!TRACKS[trackId]) return;
  const p = progress();
  p.academyTrack = trackId;
  saveProgress();
  academyTiers = TRACKS[trackId].tiers;
  if (!options.silent) showToast(`Track switched: ${TRACKS[trackId].label}. Your progress in every track is saved.`, "success");
  if (typeof renderAcademy === "function") renderAcademy();
  if (typeof renderHomeAcademyPath === "function") renderHomeAcademyPath();
  if (typeof renderHomeArcadeRail === "function") renderHomeArcadeRail();
  if (typeof renderArcade === "function" && state.currentView === "arcade") renderArcade();
  trackEvent("track_switched", { trackId });
}

function trackProgressPercent(track) {
  const lessons = track.tiers.flatMap((tier) => tier.lessons);
  const done = lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
  return lessons.length ? Math.round((done / lessons.length) * 100) : 0;
}

/* futures aliases (achievements + Flow Reader gate use these) */
function orderflowUnlocked() {
  return trackBaseComplete(TRACKS.futures);
}

function orderflowTierUnlocked(index) {
  return advancedTierUnlockedFor(TRACKS.futures, index);
}

function orderflowStats() {
  return advancedStats(TRACKS.futures);
}

/* ---------- overrides so lessons resolve across all tracks ---------- */

function findAcademyLesson(lessonId) {
  const pools = [
    ...Object.values(TRACKS).map((track) => track.tiers),
    ...Object.values(TRACKS).map((track) => track.advanced).filter(Boolean)
  ];
  for (const tiers of pools) {
    for (const tier of tiers) {
      const lesson = tier.lessons.find((item) => item.id === lessonId);
      if (lesson) return { tier, lesson };
    }
  }
  return null;
}

const ADVANCED_TIER_GAMES = { "of-": "flowreader", "fx-inst": "pairmatrix", "st-adv": "gapjudge", "op-adv": "greekgauntlet", "cr-adv": "fundingflip" };

function academyTierGame(tierId) {
  if (typeof arcadeGames === "undefined") return null;
  for (const [prefix, gameId] of Object.entries(ADVANCED_TIER_GAMES)) {
    if (tierId.startsWith(prefix)) return arcadeGames.find((game) => game.id === gameId) || null;
  }
  const tierIndex = academyTiers.findIndex((tier) => tier.id === tierId);
  return arcadeGames.find((game) => game.tier === tierIndex) || null;
}

/* ---------- track switcher UI ---------- */

function trackBarMarkup() {
  const active = currentTrackId();
  return `
    <div class="track-bar">
      ${Object.values(TRACKS).map((track) => `
        <button class="track-chip ${track.id === active ? "active" : ""}" type="button" data-track-pick="${track.id}">
          <i data-lucide="${track.icon}"></i>
          <span>${track.label}</span>
          <b>${trackProgressPercent(track)}%</b>
        </button>
      `).join("")}
    </div>
  `;
}

function orderflowSectionMarkup() {
  const track = currentTrack();
  if (!track.advanced || !track.advancedMeta) return "";
  const unlocked = trackBaseComplete(track);
  const stats = advancedStats(track);
  const meta = track.advancedMeta;
  const tiersMarkup = track.advanced.map((tier, index) => {
    const tierUnlocked = advancedTierUnlockedFor(track, index);
    const done = tier.lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
    const lessons = tier.lessons.map((lesson) => {
      const passed = academyLessonPassed(lesson.id);
      const status = !tierUnlocked ? "locked" : passed ? "done" : "ready";
      return `
        <button class="academy-lesson ${status}" type="button" data-academy-lesson="${lesson.id}" ${status === "locked" ? "disabled" : ""}>
          <span class="academy-lesson-status"><i data-lucide="${status === "locked" ? "lock" : status === "done" ? "check" : "play"}"></i></span>
          <span class="academy-lesson-body"><strong>${lesson.title}</strong><small>${lesson.minutes} min · ${lesson.slides.length} slides · quiz</small></span>
          <span class="academy-lesson-xp">${passed ? "Earned" : `+${lesson.xp} XP`}</span>
        </button>
      `;
    }).join("");
    return `
      <article class="academy-tier of-tier ${tierUnlocked ? "unlocked" : "locked"}">
        <header class="academy-tier-head">
          <span class="academy-tier-icon of"><i data-lucide="${tier.icon}"></i></span>
          <div class="academy-tier-title">
            <span class="academy-tier-step">${meta.title}</span>
            <h3>${tier.title}</h3>
            <p>${tier.tagline}</p>
          </div>
          <div class="academy-tier-progress"><strong>${done}/${tier.lessons.length}</strong></div>
        </header>
        <div class="academy-tier-lessons">${lessons}</div>
      </article>
    `;
  }).join("");

  return `
    <div class="orderflow-stage ${unlocked ? "" : "locked"}">
      <div class="orderflow-head">
        <div>
          <p class="arcade-kicker">// STAGE 2 <span class="of-new-tag">NEW</span></p>
          <h2>${meta.title}</h2>
          <p class="arcade-sub">${unlocked
            ? `${meta.sub} ${stats.done}/${stats.total} lessons.`
            : `${meta.sub} Complete every base ${track.label} Academy lesson to unlock Stage 2.`}</p>
        </div>
        ${unlocked ? "" : `<div class="orderflow-lock"><i data-lucide="lock"></i><span>Graduate the base ${track.label} Academy first</span></div>`}
      </div>
      ${unlocked ? tiersMarkup : ""}
    </div>
    ${typeof masterySectionMarkup === "function" ? masterySectionMarkup() : ""}
  `;
}

function bindTrackControls(root) {
  root.querySelectorAll("[data-track-pick]").forEach((button) => {
    button.addEventListener("click", () => setTrack(button.dataset.trackPick));
  });
}


/* ---------- market pickers (hero + onboarding) ---------- */

function renderMarketPickers() {
  const active = currentTrackId();
  const hero = document.getElementById("hero-markets");
  if (hero) {
    hero.innerHTML = Object.values(TRACKS).map((track) => `
      <button class="market-chip ${track.id === active ? "active" : ""}" type="button" data-market-pick="${track.id}">
        <i data-lucide="${track.icon}"></i><span>${track.label}</span><small>${track.symbol}</small>
      </button>
    `).join("");
  }
  const onboard = document.getElementById("onboard-tracks");
  if (onboard) {
    onboard.innerHTML = Object.values(TRACKS).map((track) => `
      <button class="onboard-track" type="button" data-market-pick="${track.id}">
        <span class="onboard-track-icon"><i data-lucide="${track.icon}"></i></span>
        <strong>${track.label}</strong>
        <span class="onboard-track-tag">${track.tagline}</span>
      </button>
    `).join("");
  }
  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener("click", (event) => {
  const pick = event.target.closest("[data-market-pick]");
  if (!pick) return;
  // capture origin BEFORE renderMarketPickers() detaches the clicked node
  const fromOnboard = !!pick.closest("#onboard-tracks");
  const fromHero = !!pick.closest("#hero-markets");
  setTrack(pick.dataset.marketPick);
  renderMarketPickers();
  const modal = document.getElementById("onboarding-modal");
  if (fromOnboard && modal) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    localStorage.setItem("tradePulseOnboardingSeen", "true");
    const goFirstLesson = () => {
      const next = academyNextLesson();
      if (next) openAcademyLesson(next.lesson.id);
      else navigateTo("academy");
    };
    // Feature tour plays once, then drops the user into their first lesson
    if (typeof maybeStartFeatureTour === "function") maybeStartFeatureTour(goFirstLesson);
    else goFirstLesson();
  } else if (fromHero) {
    navigateTo("academy");
  }
});

/* ---------- init ---------- */

(() => {
  academyTiers = currentTrack().tiers;
  renderMarketPickers();
})();
