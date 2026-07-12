/* ReplayEdge Academy — structured curriculum + skill tree.
   Loads after app.js and uses its globals (progress, saveProgress, updateProgressUi,
   showToast, trackEvent, startMode, navigateTo, awardBadgeOnce, state). */

const ACADEMY_TIER_UNLOCK_RATIO = 0.7;

const FUTURES_TIERS = [
  {
    id: "foundations",
    title: "Foundations",
    icon: "book-open",
    tagline: "Markets, candles, and risk — the rules of the game.",
    lessons: [
      {
        id: "what-is-trading",
        title: "What Is Trading?",
        minutes: 3,
        xp: 40,
        slides: [
          {
            heading: "Trading is buying and selling risk",
            body: "A trade is a bet that a price will move in your favor before it moves against you by more than you can afford. Stocks, forex, crypto, and futures are just different arenas for the same game.",
            points: [
              "Stocks: ownership slices of companies",
              "Forex: one currency versus another",
              "Crypto: digital assets, open 24/7",
              "Futures: contracts on an asset's future price"
            ]
          },
          {
            heading: "Why day traders love futures",
            body: "Futures trade nearly 23 hours a day, use transparent central exchanges, and offer built-in leverage with clear tick values. You always know exactly what one point of movement is worth.",
            points: [
              "Deep liquidity on ES, NQ, CL, GC",
              "No pattern day trader rule",
              "Defined tick size and tick value",
              "Same rules for everyone — no broker games"
            ]
          },
          {
            heading: "You are not investing",
            body: "Day trading is a performance skill, like poker or competitive sport. Your edge comes from reading other participants, managing risk, and staying disciplined — not from long-term company growth."
          }
        ],
        quiz: [
          {
            question: "What is a futures contract?",
            options: [
              "A loan from your broker",
              "An agreement on an asset's future price",
              "A share of company ownership",
              "A type of cryptocurrency"
            ],
            answer: 1,
            explain: "Futures are standardized contracts to buy or sell an asset at a future date — day traders trade the price of that contract."
          },
          {
            question: "Day trading edge mostly comes from…",
            options: [
              "Predicting the news",
              "Company fundamentals",
              "Risk management and reading other traders",
              "Buying and holding"
            ],
            answer: 2,
            explain: "Short-term price moves are driven by positioning and liquidity, so risk control and reading behavior beat fundamentals."
          }
        ]
      },
      {
        id: "how-markets-move",
        title: "How Markets Actually Move",
        minutes: 4,
        xp: 40,
        slides: [
          {
            heading: "Every price is an auction",
            body: "Price moves because buyers and sellers disagree. When buyers are aggressive, they lift offers and price rises until sellers overwhelm them. There is no chart magic — only orders getting filled.",
            points: [
              "Bid: highest price buyers will pay",
              "Ask: lowest price sellers will accept",
              "Spread: the gap between them",
              "Liquidity: how many orders rest at each price"
            ]
          },
          {
            heading: "Sessions set the rhythm",
            body: "The trading day has personality. Asia is usually quiet and range-bound. London brings the first real volume. New York — especially the open — brings the biggest moves and the most opportunity.",
            points: [
              "Asia: builds ranges, sets reference levels",
              "London: first expansion, often sets the day's high or low",
              "New York open: highest volume and volatility",
              "Knowing the session tells you what behavior to expect"
            ]
          },
          {
            heading: "Liquidity is the fuel",
            body: "Big players can't fill large orders without other traders on the opposite side. Price gravitates toward places where orders cluster — recent highs, lows, and obvious levels. Remember this; it becomes central later."
          }
        ],
        quiz: [
          {
            question: "Price goes up when…",
            options: [
              "The chart forms a pattern",
              "Aggressive buyers consume the available offers",
              "Volume goes down",
              "The spread widens"
            ],
            answer: 1,
            explain: "Price is an auction — it rises when buyers aggressively lift the offers faster than sellers replace them."
          },
          {
            question: "Which session usually has the most volume and volatility for US futures?",
            options: ["Asia", "London lunch", "New York open", "Weekend"],
            answer: 2,
            explain: "The New York open concentrates economic news, institutional flow, and the highest participation."
          }
        ]
      },
      {
        id: "order-types",
        title: "Order Types & the Spread",
        minutes: 3,
        xp: 40,
        slides: [
          {
            heading: "Three orders run everything",
            body: "Market orders take liquidity now at the best available price. Limit orders rest at your chosen price and wait. Stop orders trigger a market order when price touches a level — used for entries and, critically, for stop losses.",
            points: [
              "Market: instant fill, you pay the spread",
              "Limit: your price or better, but may never fill",
              "Stop: becomes a market order when touched"
            ]
          },
          {
            heading: "Stops are how you survive",
            body: "A stop loss is a resting order that closes your trade automatically at your maximum acceptable loss. Trading without one is how accounts die. Every trade you ever take should have its stop decided before entry."
          },
          {
            heading: "The spread is a cost",
            body: "Crossing the spread with market orders costs you a tick or more per round trip. On fast entries that's fine; on slow setups, limit orders save real money over hundreds of trades."
          }
        ],
        quiz: [
          {
            question: "Which order guarantees your price but not a fill?",
            options: ["Market order", "Limit order", "Stop order", "None of them"],
            answer: 1,
            explain: "Limit orders only fill at your price or better — the trade-off is price may never come to you."
          },
          {
            question: "When should your stop loss be decided?",
            options: [
              "After the trade goes against you",
              "Before you enter the trade",
              "Only on losing days",
              "Stops are optional for pros"
            ],
            answer: 1,
            explain: "The stop defines your risk. If you don't know it before entry, you can't size the position — you're gambling."
          }
        ]
      },
      {
        id: "candlesticks",
        title: "Reading Candlesticks",
        minutes: 4,
        xp: 50,
        slides: [
          {
            heading: "Four numbers per candle",
            body: "Every candle compresses a battle into open, high, low, and close. The body shows who won; the wicks show who tried and failed.",
            points: [
              "Body: distance between open and close",
              "Upper wick: buyers pushed up, sellers rejected it",
              "Lower wick: sellers pushed down, buyers rejected it",
              "Close location is the single most telling number"
            ]
          },
          {
            heading: "Wicks are rejection stories",
            body: "A long lower wick at a key level says sellers tried to break it and got absorbed. A tiny body with huge wicks says indecision. Candles only matter in context — the same candle means different things at different locations."
          },
          {
            heading: "Timeframes are zoom levels",
            body: "A 1-minute chart shows the fight punch by punch; a 4-hour chart shows the war. Scalpers live on 1–5m, day traders read 5–15m with 1h–4h context. Higher timeframe levels always outrank lower ones.",
            points: [
              "1m–5m: execution and timing",
              "15m–1h: intraday structure",
              "4h–daily: the levels that actually matter"
            ]
          }
        ],
        quiz: [
          {
            question: "A long lower wick at support most likely means…",
            options: [
              "Sellers are in full control",
              "Buyers absorbed the sell attempt and rejected lower prices",
              "The market is closed",
              "Volume is fake"
            ],
            answer: 1,
            explain: "The wick shows price traded lower and was pushed back up — sellers tried, buyers won."
          },
          {
            question: "Which timeframe's levels carry the most weight?",
            options: ["1-minute", "5-minute", "The higher timeframe (4h/daily)", "They're all equal"],
            answer: 2,
            explain: "Higher timeframe levels represent more volume and more participants — lower timeframes move around them."
          }
        ]
      },
      {
        id: "risk-before-reward",
        title: "Risk Before Reward",
        minutes: 5,
        xp: 60,
        slides: [
          {
            heading: "Position sizing is the whole job",
            body: "Professionals decide the dollar risk first, then work backwards to contract size. Risk 1% of a $10,000 account = $100. If your stop is 20 ticks on MES ($1.25/tick), that's $25 per contract — so 4 contracts, never more.",
            points: [
              "1. Fix your risk per trade (e.g. 1%)",
              "2. Measure your stop distance in ticks",
              "3. Contracts = risk ÷ (stop ticks × tick value)"
            ]
          },
          {
            heading: "R:R makes losing okay",
            body: "If you risk 1 to make 2 (1:2 R:R), you can lose 60% of your trades and still profit. Win rate means nothing without R:R — a 90% win rate loses money if each loss wipes ten wins.",
            points: [
              "1R = the amount you risked",
              "At 1:2 R:R, 40% win rate breaks even",
              "Never take setups below 1:1.5"
            ]
          },
          {
            heading: "Compounding vs gambling",
            body: "Gamblers bet big to get rich fast and eventually hit zero. Traders risk small, survive the losing streaks that always come, and let math compound. Ten straight losses at 1% risk = down 9.6%. At 10% risk = down 65%. Survival is the strategy."
          }
        ],
        quiz: [
          {
            question: "Your account is $10,000, you risk 1%, and your stop is worth $50 per contract. How many contracts?",
            options: ["1", "2", "4", "10"],
            answer: 1,
            explain: "$100 risk ÷ $50 per contract = 2 contracts. Size always comes from the stop, never from confidence."
          },
          {
            question: "With a 1:2 risk-to-reward, what win rate breaks even?",
            options: ["66%", "50%", "40%", "25%"],
            answer: 2,
            explain: "Winning 2R and losing 1R means about 1 win covers 2 losses — roughly a 33–40% win rate breaks even with costs."
          }
        ]
      }
    ]
  },
  {
    id: "structure",
    title: "Structure & Technicals",
    icon: "trending-up",
    tagline: "Levels, trends, and patterns — read the map.",
    lessons: [
      {
        id: "support-resistance",
        title: "Support & Resistance",
        minutes: 4,
        xp: 50,
        slides: [
          {
            heading: "Levels are memory",
            body: "Support and resistance mark prices where the auction previously found heavy interest. Traders remember them, orders cluster around them, and price reacts when it returns.",
            points: [
              "Support: where buying repeatedly stopped declines",
              "Resistance: where selling repeatedly stopped rallies",
              "The more touches and the higher the timeframe, the more it matters"
            ]
          },
          {
            heading: "Zones, not lines",
            body: "Price is messy. Treat levels as zones a few ticks wide, drawn from wicks and bodies together. Expecting to-the-tick precision gets you stopped out by noise."
          },
          {
            heading: "The flip is the tell",
            body: "When support breaks and price returns to test it from below, old buyers sell to escape and new sellers pile in — support becomes resistance. This 'flip zone' retest is one of the highest-quality locations in trading."
          }
        ],
        quiz: [
          {
            question: "Broken support that price retests from below usually becomes…",
            options: ["Stronger support", "Resistance", "Irrelevant", "A gap"],
            answer: 1,
            explain: "Trapped buyers sell into the retest and breakout sellers defend it — the level flips roles."
          },
          {
            question: "Why should levels be drawn as zones?",
            options: [
              "It looks better",
              "Price reacts in areas, not at exact ticks",
              "Zones guarantee fills",
              "Brokers require it"
            ],
            answer: 1,
            explain: "Orders cluster around a price area — demanding tick-perfect touches means missing valid reactions."
          }
        ]
      },
      {
        id: "trends",
        title: "Trends, Swings & Structure",
        minutes: 4,
        xp: 50,
        slides: [
          {
            heading: "Trends are staircases",
            body: "An uptrend is a series of higher highs and higher lows. A downtrend is lower lows and lower highs. A range is neither — price ping-pongs between two zones. Identify which one you're in before anything else.",
            points: [
              "Uptrend: HH + HL → look for longs on pullbacks",
              "Downtrend: LL + LH → look for shorts on rallies",
              "Range: fade the edges or wait for the break"
            ]
          },
          {
            heading: "Break of Structure (BOS)",
            body: "When price takes out the most recent swing high in an uptrend, that's a BOS — the trend confirmed continuation. BOS in your direction is fuel; BOS against you is a warning."
          },
          {
            heading: "Trendlines are guides, not walls",
            body: "A trendline connecting swing lows visualizes the trend's rhythm. Use it to frame pullbacks — but structure (the actual swing points) always outranks a diagonal line."
          }
        ],
        quiz: [
          {
            question: "An uptrend is defined by…",
            options: [
              "Green candles",
              "Higher highs and higher lows",
              "Rising volume",
              "A rising moving average"
            ],
            answer: 1,
            explain: "Structure defines trend: each swing high and swing low above the last one."
          },
          {
            question: "In an uptrend, price breaking above the last swing high is called…",
            options: ["A fakeout", "A break of structure (BOS)", "A reversal", "A gap fill"],
            answer: 1,
            explain: "BOS confirms the trend just extended — the auction accepted higher prices."
          }
        ]
      },
      {
        id: "chart-patterns",
        title: "Chart Patterns Without the Myths",
        minutes: 4,
        xp: 50,
        slides: [
          {
            heading: "Patterns are structure wearing costumes",
            body: "A double top is just a failed attempt to make a higher high. A head & shoulders is a trend losing its staircase. Learn the structure underneath and you'll never need to memorize 50 pattern names.",
            points: [
              "Double top/bottom: rejection of the same level twice",
              "Head & shoulders: HH → failure to make another HH → LL",
              "Triangles/flags: compression before expansion"
            ]
          },
          {
            heading: "Flags: the trend catching its breath",
            body: "After a strong impulse, price drifts sideways or slightly against the move on falling volume. That's a flag — a pause, not a reversal. The break in the impulse direction is the classic continuation entry."
          },
          {
            heading: "Patterns fail — and that's tradeable",
            body: "Everyone sees the same textbook patterns, which is exactly why obvious ones get faked out. A failed pattern traps traders, and trapped traders fuel strong moves the other way. The failure is often the better trade."
          }
        ],
        quiz: [
          {
            question: "A bull flag is best described as…",
            options: [
              "A reversal signal",
              "A pause after an impulse before continuation",
              "A type of candlestick",
              "A guaranteed long entry"
            ],
            answer: 1,
            explain: "Flags are consolidation against a strong move — the market resting before continuing."
          },
          {
            question: "Why do obvious textbook patterns often fail?",
            options: [
              "Charts are random",
              "Everyone sees them, so the crowd's entries become liquidity for bigger players",
              "Patterns only work on stocks",
              "Volume is always wrong"
            ],
            answer: 1,
            explain: "When the crowd piles into the same obvious trade, their stops become the target."
          }
        ]
      },
      {
        id: "indicators",
        title: "Indicators: Tools, Not Signals",
        minutes: 4,
        xp: 50,
        slides: [
          {
            heading: "Indicators repackage price",
            body: "Every indicator is math on past candles. They can summarize context quickly, but none of them know the future. Use them to frame, never to trigger.",
            points: [
              "EMA/SMA: smoothed trend direction and dynamic pullback zones",
              "RSI: how stretched the recent move is",
              "MACD: momentum shifting between bulls and bears",
              "Volume: how much conviction backed the move"
            ]
          },
          {
            heading: "The one setting trap",
            body: "There is no magic RSI level or perfect EMA period. An 'oversold' RSI in a strong downtrend just gets more oversold. Indicators only mean something relative to structure and location."
          },
          {
            heading: "Volume is the honest one",
            body: "Volume can't be smoothed away — it shows real participation. A breakout on weak volume is suspect; a rejection on heavy volume is a statement. If you keep only one indicator, keep volume."
          }
        ],
        quiz: [
          {
            question: "An 'oversold' RSI in a strong downtrend means…",
            options: [
              "Buy immediately",
              "Nothing by itself — trends can stay oversold for a long time",
              "The trend must reverse today",
              "Volume is increasing"
            ],
            answer: 1,
            explain: "Indicators describe the past move; they don't obligate the market to reverse."
          },
          {
            question: "A breakout on very low volume is…",
            options: [
              "More trustworthy",
              "Suspect — few participants backed the move",
              "Always a short",
              "Impossible"
            ],
            answer: 1,
            explain: "Real breakouts attract participation. Low volume suggests the move may not hold."
          }
        ]
      }
    ]
  },
  {
    id: "liquidity",
    title: "Liquidity & Why Price Moves",
    icon: "droplets",
    tagline: "Stop hunts, pools, and zones — the WHY behind moves.",
    lessons: [
      {
        id: "bos-choch",
        title: "BOS vs CHoCH",
        minutes: 4,
        xp: 60,
        slides: [
          {
            heading: "Two signals, one language",
            body: "A Break of Structure (BOS) continues the current trend — price takes out a swing in the trend's direction. A Change of Character (CHoCH) is the first break against the trend — the earliest hint the trend may be done.",
            points: [
              "BOS = continuation confirmation",
              "CHoCH = first crack in the trend",
              "CHoCH alone is a warning, not an entry"
            ]
          },
          {
            heading: "Internal vs external structure",
            body: "External structure is the major swing highs and lows — the moves that matter. Internal structure is the smaller wiggles inside a swing. A CHoCH on internal structure is noise; on external structure, it's news.",
            points: [
              "External: the big swings a 15m–1h trader respects",
              "Internal: the 1m noise inside those swings",
              "Always know which one you're reading"
            ]
          },
          {
            heading: "The sequence that reverses trends",
            body: "Real reversals usually follow a script: liquidity grab beyond the old extreme → CHoCH → pullback → BOS in the new direction. Wait for the script; the first CHoCH alone traps early birds."
          }
        ],
        quiz: [
          {
            question: "A CHoCH is…",
            options: [
              "A continuation signal",
              "The first structural break against the current trend",
              "A candlestick pattern",
              "A type of order"
            ],
            answer: 1,
            explain: "Change of Character marks the first time the trend's staircase breaks — a potential shift."
          },
          {
            question: "A CHoCH on internal (minor) structure is…",
            options: [
              "A guaranteed reversal",
              "Usually noise — external structure carries the weight",
              "Stronger than external",
              "A reason to double position size"
            ],
            answer: 1,
            explain: "Minor wiggles break constantly. Only breaks of the meaningful external swings change the story."
          }
        ]
      },
      {
        id: "liquidity-pools",
        title: "Liquidity Pools & Stop Hunts",
        minutes: 5,
        xp: 60,
        slides: [
          {
            heading: "Stops are fuel",
            body: "Every obvious swing high has buy stops resting above it (from shorts covering and breakout buyers). Every obvious low has sell stops below. These clusters are liquidity pools — pre-loaded orders big players need to fill their positions.",
            points: [
              "Above old highs: buy stops + breakout entries",
              "Below old lows: sell stops + breakdown entries",
              "Equal highs/lows: double the stops, double the magnet"
            ]
          },
          {
            heading: "The stop hunt, step by step",
            body: "Price spikes through the obvious level, triggers the stops, fills the big player's opposite-side order, then reverses. Retail calls it manipulation; institutions call it filling size. Either way, it's mechanical and repeatable."
          },
          {
            heading: "Trade toward liquidity, not from it",
            body: "Ask of every chart: where is the nearest pool of stops? Price is drawn to liquidity like water downhill. The sweep of a pool is often the END of a move — entering breakouts right into a pool is how you become the liquidity."
          }
        ],
        quiz: [
          {
            question: "Where do buy stops cluster?",
            options: [
              "Below old lows",
              "Above old highs and equal highs",
              "At the daily open",
              "They're spread evenly"
            ],
            answer: 1,
            explain: "Shorts place protective buy stops above highs, and breakout traders buy there too — a pool of buy orders."
          },
          {
            question: "Price sweeps below an obvious low, then sharply reverses upward. What most likely happened?",
            options: [
              "A random move",
              "Sell stops were triggered to fill large buy orders",
              "The exchange made an error",
              "Support got stronger"
            ],
            answer: 1,
            explain: "Classic stop hunt: the pool of sell stops below the low provided the liquidity for big buyers."
          }
        ]
      },
      {
        id: "supply-demand",
        title: "Supply & Demand Zones",
        minutes: 4,
        xp: 60,
        slides: [
          {
            heading: "Zones are where the imbalance began",
            body: "A demand zone is the last consolidation before an explosive move up — evidence big buyers were active there and may have unfilled orders left. Supply zones are the mirror image before drops.",
            points: [
              "Find the explosive move first",
              "The base it launched from is the zone",
              "The stronger the departure, the better the zone"
            ]
          },
          {
            heading: "Fresh beats mitigated",
            body: "A fresh zone has never been retested — the resting orders are likely intact. Once price returns and reacts (mitigation), most of those orders are used up. First touch is the high-probability touch; third touches usually break.",
            points: [
              "Fresh: untested, strongest reaction odds",
              "Mitigated: already tapped, weakened",
              "Repeated tests erode a zone"
            ]
          },
          {
            heading: "Imbalance marks the trail",
            body: "When price moves so fast it leaves single-direction candles with gaps between wicks, it left an imbalance — orders that never got filled. Price often returns to 'rebalance' these areas before continuing. They double as entry refinement targets."
          }
        ],
        quiz: [
          {
            question: "The best demand zones are found…",
            options: [
              "At round numbers",
              "At the base of an explosive move up, untested",
              "Wherever RSI is oversold",
              "On the 1-second chart"
            ],
            answer: 1,
            explain: "Explosive departures prove institutional buying; a fresh, untested base likely still holds their orders."
          },
          {
            question: "Why does a zone weaken after each retest?",
            options: [
              "Time decay",
              "The resting orders get consumed with each touch",
              "Volume disappears",
              "It doesn't weaken"
            ],
            answer: 1,
            explain: "Each visit fills more of the remaining orders — eventually there's nothing left to defend the level."
          }
        ]
      },
      {
        id: "killzones",
        title: "Killzones & Daily Bias",
        minutes: 4,
        xp: 60,
        slides: [
          {
            heading: "When matters as much as where",
            body: "Most of the day is chop. The tradeable moves cluster in killzones — windows when institutional volume arrives. Trading outside them means fighting noise for scraps.",
            points: [
              "London open: ~2:00–5:00 AM ET",
              "New York AM: ~8:30–11:00 AM ET",
              "NY lunch: usually dead — protect your capital",
              "NY PM: ~1:30–4:00 PM ET, position squaring"
            ]
          },
          {
            heading: "Session highs and lows are reference points",
            body: "The Asia range high/low and London high/low become the day's first liquidity pools. New York frequently opens by running one side of the overnight range before the real move begins."
          },
          {
            heading: "Daily bias: one question",
            body: "Before the session, ask: is price more likely to reach the liquidity above or below? Look at the higher-timeframe trend, yesterday's high/low, and which pools are nearest. One directional idea per day beats fifty impulses.",
            points: [
              "HTF trend direction",
              "Untouched liquidity above vs below",
              "News calendar (CPI, FOMC can invalidate everything)"
            ]
          }
        ],
        quiz: [
          {
            question: "Why do killzones matter?",
            options: [
              "Charts look better then",
              "Institutional volume arrives in those windows, creating real moves",
              "Spreads are wider",
              "They don't — all hours are equal"
            ],
            answer: 1,
            explain: "Moves need volume. The London and NY opens concentrate the participation that creates clean trends."
          },
          {
            question: "A daily bias is…",
            options: [
              "A guaranteed prediction",
              "A directional lean based on HTF structure and nearby liquidity",
              "Whatever Twitter says",
              "Yesterday's close"
            ],
            answer: 1,
            explain: "Bias is a hypothesis about which liquidity pool price seeks today — a lean, not a certainty."
          }
        ]
      }
    ]
  },
  {
    id: "smart-money",
    title: "Smart Money Concepts",
    icon: "landmark",
    tagline: "Order blocks, FVGs, and the institutional playbook.",
    lessons: [
      {
        id: "order-blocks",
        title: "Order Blocks",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The footprint before the move",
            body: "A bullish order block is typically the last down candle before a strong impulsive move up — the price area where institutions accumulated before displacing price. When price returns there, they often defend it.",
            points: [
              "Bullish OB: last down candle before the up impulse",
              "Bearish OB: last up candle before the down impulse",
              "Validity requires displacement — a forceful, structure-breaking departure"
            ]
          },
          {
            heading: "Not every candle is an order block",
            body: "The move away must be aggressive and break structure. A weak drift away means nothing. Best order blocks also sit at sensible locations: after a liquidity sweep, at HTF zones, in premium/discount."
          },
          {
            heading: "Trading the return",
            body: "Entry is on the retest of the block, ideally its open or midpoint, with the stop beyond the block's far side. If price slices through the whole block with force, the idea is invalid — get out, don't argue."
          }
        ],
        quiz: [
          {
            question: "A bullish order block is usually…",
            options: [
              "The biggest green candle",
              "The last down candle before a displacement up",
              "Any candle at support",
              "A gap"
            ],
            answer: 1,
            explain: "That final down candle is where buy orders absorbed the last selling before price was driven up."
          },
          {
            question: "What validates an order block?",
            options: [
              "Its color",
              "Displacement — the move away breaks structure with force",
              "High RSI",
              "It's on the 1m chart"
            ],
            answer: 1,
            explain: "Without a forceful, structure-breaking departure, there's no evidence institutions were there."
          }
        ]
      },
      {
        id: "fair-value-gaps",
        title: "Fair Value Gaps",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The gap in the middle",
            body: "A Fair Value Gap is a three-candle pattern where the middle candle moves so fast that candle 1's wick and candle 3's wick don't overlap. That untraded window is the FVG — price skipped it, leaving orders unfilled.",
            points: [
              "Bullish FVG: gap below current price after an up impulse",
              "Bearish FVG: gap above after a down impulse",
              "The gap acts like a magnet and a reaction zone"
            ]
          },
          {
            heading: "Why price comes back",
            body: "Efficient markets like to trade both sides. Fast moves leave one-sided fills, and algorithms routinely revisit these inefficiencies. Price returning INTO a bullish FVG and bouncing is a continuation entry; slicing cleanly through it is a warning."
          },
          {
            heading: "Quality filters",
            body: "FVGs created by displacement during killzones, aligned with HTF bias, and sitting near order blocks are A-grade. Random tiny gaps in overnight chop are noise. Confluence turns a gap into a trade.",
            points: [
              "Created with displacement",
              "Aligned with your bias",
              "Stacked with OB or sweep = strongest"
            ]
          }
        ],
        quiz: [
          {
            question: "An FVG exists when…",
            options: [
              "Volume spikes",
              "Wicks of candle 1 and candle 3 don't overlap around a fast middle candle",
              "Price gaps overnight",
              "Two dojis form"
            ],
            answer: 1,
            explain: "The non-overlap is the untraded window — price literally skipped those prices."
          },
          {
            question: "Price returns into a bullish FVG and holds. This is best read as…",
            options: [
              "A reversal short",
              "A continuation long opportunity",
              "Noise to ignore",
              "A reason to exit longs"
            ],
            answer: 1,
            explain: "Rebalancing the gap and holding shows buyers defending — the original move likely continues."
          }
        ]
      },
      {
        id: "sweeps-mss",
        title: "Sweeps & Market Structure Shifts",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The sweep is the setup",
            body: "A liquidity sweep takes out an obvious high or low, fills institutional orders, and reverses. The sweep alone isn't the entry — it's the precondition. The confirmation is what happens next.",
            points: [
              "Sweep = wick through the level, close back inside",
              "Failure to hold beyond the level is the tell",
              "Speed of the rejection shows conviction"
            ]
          },
          {
            heading: "MSS: the confirmation",
            body: "After the sweep, watch for a Market Structure Shift — price displacing through the opposing short-term structure. Sweep of the low + displacement up through the last lower-high = the smart money reversal script in one sentence."
          },
          {
            heading: "SMT divergence: the cheat code",
            body: "When correlated markets disagree — ES makes a new low but NQ doesn't — one of them is showing a false move. This 'SMT divergence' at a sweep adds serious weight to the reversal case."
          }
        ],
        quiz: [
          {
            question: "The correct sequence for a sweep reversal entry is…",
            options: [
              "Enter the moment the low breaks",
              "Sweep → market structure shift with displacement → entry",
              "Wait for the news",
              "Enter after 10 green candles"
            ],
            answer: 1,
            explain: "The sweep sets the stage; the MSS confirms the big players actually reversed the market."
          },
          {
            question: "ES sweeps its low but NQ holds above its own low. This is…",
            options: [
              "Meaningless",
              "SMT divergence — evidence the sweep may be a false move",
              "A reason to short both",
              "An exchange glitch"
            ],
            answer: 1,
            explain: "Correlated markets disagreeing at a key level suggests engineered liquidity, not genuine weakness."
          }
        ]
      },
      {
        id: "premium-discount",
        title: "Premium, Discount & PD Arrays",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "Buy cheap, sell expensive — literally",
            body: "Take any meaningful swing (a dealing range) and mark its midpoint (equilibrium). Above the midpoint is premium — expensive. Below is discount — cheap. Institutions accumulate longs in discount and distribute in premium.",
            points: [
              "Longs are best sourced below equilibrium",
              "Shorts are best sourced above it",
              "Buying in premium = paying retail prices"
            ]
          },
          {
            heading: "PD arrays: your shopping list",
            body: "Within the discount half of a range, rank the tools you know: order blocks, FVGs, old lows. That ordered list of zones is a PD array — where you'll do business if price gets there. It turns 'I feel like buying' into 'I buy at these prices or not at all.'"
          },
          {
            heading: "Fibonacci as a range ruler",
            body: "The fib tool just measures the range: 0.5 is equilibrium, 0.62–0.79 is the deep-discount pocket where sweep-plus-OB entries often cluster. It's a ruler for premium/discount, not magic ratios."
          }
        ],
        quiz: [
          {
            question: "In a dealing range, longs are highest quality when entered…",
            options: [
              "Above the midpoint (premium)",
              "Below the midpoint (discount)",
              "Exactly at the high",
              "Anywhere with confirmation"
            ],
            answer: 1,
            explain: "Buying in discount means positive expectancy on location alone — you bought below fair value."
          },
          {
            question: "A PD array is…",
            options: [
              "An indicator",
              "A ranked list of your zones (OBs, FVGs) within premium/discount",
              "A type of chart",
              "A broker feature"
            ],
            answer: 1,
            explain: "It's your pre-planned shopping list of levels — decided before price arrives, not during."
          }
        ]
      },
      {
        id: "narrative",
        title: "Narrative & Top-Down Analysis",
        minutes: 5,
        xp: 80,
        slides: [
          {
            heading: "Every trade needs a story",
            body: "Narrative answers: where is price coming from, where is it going, and why? 'Price swept the weekly low, showed a daily CHoCH, and NY should drive it to the untouched high above' is a narrative. 'It bounced off the EMA' is not.",
            points: [
              "From: what liquidity was just taken?",
              "To: what draw on liquidity is next?",
              "Why: whose orders power the move?"
            ]
          },
          {
            heading: "Top-down, every day",
            body: "Start on the daily: trend, key levels, nearest pools. Drop to 1h/4h: the dealing range, premium/discount. Then 5–15m: structure shifts and zones. Execute on 1–5m. Each timeframe must agree with the one above it — or you stand aside.",
            points: [
              "Daily → bias",
              "1h/4h → range and zones",
              "5m–15m → confirmation",
              "1m → entry timing only"
            ]
          },
          {
            heading: "Manipulation vs distribution",
            body: "Sessions often follow: manipulation (a false move that sweeps liquidity against the real direction) then distribution (the true move). The morning drive down that reverses into an all-day rally wasn't random — it was the setup. Learn to ask: was that move the manipulation or the distribution?"
          }
        ],
        quiz: [
          {
            question: "A complete trade narrative includes…",
            options: [
              "An indicator crossing",
              "Where price came from, its next liquidity target, and why",
              "A gut feeling plus confirmation candle",
              "The last 3 candle colors"
            ],
            answer: 1,
            explain: "Without origin, destination, and reason, you're reacting to noise instead of trading a story."
          },
          {
            question: "The morning session spikes down, sweeps the overnight low, then rallies all day. The spike down was likely…",
            options: [
              "Distribution",
              "The manipulation phase before the real move",
              "A crash",
              "Retail buying"
            ],
            answer: 1,
            explain: "Judas swing: engineer selling to fill institutional buys, then run price to the true target."
          }
        ]
      }
    ]
  },
  {
    id: "strategies",
    title: "Strategy Arsenal",
    icon: "swords",
    tagline: "Complete playbooks — entry, stop, target, and when to skip.",
    lessons: [
      {
        id: "sr-bounce",
        title: "Playbook: S&R Bounce",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The setup",
            body: "Price approaches a well-tested higher-timeframe level in line with the prevailing range. You want a clear zone, a slowing approach, and a rejection signal on the touch.",
            points: [
              "Level: 1h/4h zone with 2+ prior reactions",
              "Approach: momentum fading into the level",
              "Trigger: rejection wick or engulfing candle at the zone"
            ]
          },
          {
            heading: "Execution",
            body: "Enter on the rejection close or the retest of it. Stop goes beyond the zone's far edge plus a few ticks of noise room. First target is the middle of the range; full target the opposite side. Skip it if R:R is under 1:1.5.",
            points: [
              "Stop: past the zone, never inside it",
              "Target 1: range midpoint (take partials)",
              "Target 2: opposite side of the range"
            ]
          },
          {
            heading: "When to skip",
            body: "Skip fresh untested levels in strong trends — trend beats level. Skip the 4th+ test of the same zone. Skip right before major news. The bounce is a range strategy; in a breakout day it becomes the donation strategy."
          }
        ],
        quiz: [
          {
            question: "Where does the stop belong on an S&R bounce?",
            options: [
              "Inside the zone",
              "Beyond the far edge of the zone with noise room",
              "At breakeven immediately",
              "No stop needed at strong levels"
            ],
            answer: 1,
            explain: "Inside the zone you get wicked out by normal noise; beyond it, only a genuine break stops you."
          },
          {
            question: "When should you skip the bounce setup?",
            options: [
              "On the 2nd test of a zone",
              "On heavily retested zones or during strong one-way trend days",
              "During the NY open",
              "When R:R exceeds 1:2"
            ],
            answer: 1,
            explain: "Worn-out zones break, and trend days plow through levels — the bounce needs a two-sided market."
          }
        ]
      },
      {
        id: "trend-pullback",
        title: "Playbook: Trend Pullback",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The setup",
            body: "The trend is confirmed (BOS in your direction), and price pulls back to a sensible zone — the last demand, an FVG, or the 0.5–0.62 of the impulse. You're joining strength at a discount, not chasing it.",
            points: [
              "Trend: clear HH/HL (or LL/LH) with a recent BOS",
              "Pullback: corrective, overlapping candles — not impulsive",
              "Zone: demand/OB/FVG within the discount of the impulse"
            ]
          },
          {
            heading: "Execution",
            body: "Wait for the pullback to reach your zone, then for a lower-timeframe structure shift back in the trend direction. Stop below the pullback low. Target the old high first, then the next liquidity above.",
            points: [
              "Trigger: LTF CHoCH back with the trend at your zone",
              "Stop: beyond the pullback swing",
              "Target: prior high → next pool"
            ]
          },
          {
            heading: "The impulsive pullback warning",
            body: "If the 'pullback' moves as fast as the trend leg itself, it may be a reversal, not a pullback. Corrective = slow, overlapping, shallow. Impulsive against the trend = stand aside and reassess."
          }
        ],
        quiz: [
          {
            question: "The safest trend pullback entries happen…",
            options: [
              "At the trend high",
              "At a zone within the impulse's discount, after a LTF shift back with the trend",
              "Immediately when price turns red",
              "After 3 days"
            ],
            answer: 1,
            explain: "Location (discount zone) plus confirmation (structure shifting back) stacks the odds."
          },
          {
            question: "A pullback that's as fast and impulsive as the trend leg suggests…",
            options: [
              "A stronger trend",
              "Possible reversal — corrective pullbacks are slow and overlapping",
              "Time to double size",
              "Nothing"
            ],
            answer: 1,
            explain: "Character matters: real pullbacks are lazy. Aggression against the trend means new sellers/buyers arrived."
          }
        ]
      },
      {
        id: "breakout",
        title: "Playbook: Breakout & Session Breakout",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The setup",
            body: "Price compresses into a tightening range against a level — energy loading. The session breakout variant uses the opening range: mark the first 15–30 minutes of New York, then trade the break of it.",
            points: [
              "Compression: shrinking candles, coiling range",
              "Level: range edge everyone can see",
              "Context: killzone timing multiplies follow-through odds"
            ]
          },
          {
            heading: "Execution",
            body: "The amateur buys the first break. The professional waits for break → hold above the level → retest that holds. Stop below the retest low or back inside the range. Target the next liquidity pool at minimum 1:2.",
            points: [
              "Trigger: break, acceptance, successful retest",
              "Stop: back inside the range = idea dead",
              "Target: next session high/low or untouched pool"
            ]
          },
          {
            heading: "The fakeout tax",
            body: "Most obvious breakouts fail because they're sweeps in disguise — remember your liquidity lessons. If the break instantly snaps back inside the range, flip your thinking: that's a failed breakout, and the better trade is usually the other way."
          }
        ],
        quiz: [
          {
            question: "The professional breakout entry is…",
            options: [
              "Market order the instant the level breaks",
              "Break → acceptance above → retest that holds",
              "A limit order inside the range",
              "After the move is 50 points gone"
            ],
            answer: 1,
            explain: "Acceptance and retest filter out the stop-hunt fakeouts that kill instant breakout buyers."
          },
          {
            question: "A breakout that immediately snaps back inside the range is…",
            options: [
              "A buying opportunity",
              "A failed breakout — often a sweep, and a signal for the opposite direction",
              "Normal, hold the position",
              "A data error"
            ],
            answer: 1,
            explain: "That's the classic fakeout: liquidity taken above the range, then the real move goes the other way."
          }
        ]
      },
      {
        id: "sweep-reversal",
        title: "Playbook: Liquidity Sweep Reversal",
        minutes: 5,
        xp: 80,
        slides: [
          {
            heading: "The setup",
            body: "Price runs an obvious pool — equal lows, session low, yesterday's low — during a killzone, and fails to accept below it. This is the highest-conviction reversal context there is, because you know exactly whose orders just got filled.",
            points: [
              "Pool: equal lows/highs or session extremes",
              "Sweep: wick through, close back inside",
              "Timing: killzones make it institutional, not random"
            ]
          },
          {
            heading: "Execution",
            body: "After the sweep, demand displacement: an aggressive structure shift the other way. Enter on the retrace into the FVG or order block that displacement created. Stop beyond the sweep extreme. First target equilibrium; final target the opposite pool.",
            points: [
              "Trigger: sweep → MSS with displacement → retrace entry",
              "Stop: beyond the sweep wick",
              "Target: range midpoint, then opposing liquidity"
            ]
          },
          {
            heading: "When to skip",
            body: "Skip sweeps that accept beyond the level (multiple closes past it — that's a real break). Skip sweeps against a raging HTF trend. And skip counter-trend sweeps right before news; the second sweep of the day is often the real one."
          }
        ],
        quiz: [
          {
            question: "After a sweep of the lows, your entry confirmation is…",
            options: [
              "The sweep wick itself",
              "Displacement up through structure, then entry on the retrace into the new FVG/OB",
              "An RSI cross",
              "Waiting for the next day"
            ],
            answer: 1,
            explain: "The sweep is context; displacement proves the reversal; the retrace gives you the price."
          },
          {
            question: "Price sweeps a low but then closes several candles below it. You should…",
            options: [
              "Buy anyway — sweeps always reverse",
              "Treat it as acceptance — a genuine break, not a sweep",
              "Double your size",
              "Remove your stop"
            ],
            answer: 1,
            explain: "Sweeps reject; breaks accept. Multiple closes beyond the level means the market genuinely repriced."
          }
        ]
      },
      {
        id: "silver-bullet",
        title: "Playbook: ICT Silver Bullet",
        minutes: 5,
        xp: 80,
        slides: [
          {
            heading: "The setup",
            body: "The Silver Bullet is a time-based FVG play: in the 10:00–11:00 AM ET window (after the open's manipulation), look for a displacement move that creates an FVG in the direction of the daily bias.",
            points: [
              "Window: 10–11 AM ET (also 3–4 AM, 2–3 PM)",
              "Requirement: a liquidity sweep before the window helps",
              "Signal: displacement + fresh FVG aligned with bias"
            ]
          },
          {
            heading: "Execution",
            body: "Enter inside the FVG on the retrace. Stop beyond the swing that created the displacement. Target the nearest untouched liquidity — the strategy is designed for short, clean 1:2+ moves, not home runs.",
            points: [
              "Entry: limit order in the FVG",
              "Stop: beyond the displacement swing",
              "Target: nearest pool, take profits mechanically"
            ]
          },
          {
            heading: "Why it works",
            body: "The window sits after the open has swept overnight liquidity and the real direction is unfolding. You're not predicting — you're joining the confirmed move at its first pullback, at a time algorithms are active. No bias, no sweep, no displacement = no trade."
          }
        ],
        quiz: [
          {
            question: "The core Silver Bullet window is…",
            options: ["9:30–10:00 AM ET", "10:00–11:00 AM ET", "Noon–1 PM ET", "Anytime"],
            answer: 1,
            explain: "The 10–11 AM window follows the open's manipulation, when the day's true direction often unfolds."
          },
          {
            question: "The Silver Bullet entry happens…",
            options: [
              "At market on the displacement candle",
              "On the retrace into the FVG the displacement created",
              "At yesterday's close",
              "After the window ends"
            ],
            answer: 1,
            explain: "You let the displacement prove direction, then buy/sell the gap it left behind."
          }
        ]
      },
      {
        id: "confluence-model",
        title: "Playbook: FVG + Order Block Confluence",
        minutes: 5,
        xp: 80,
        slides: [
          {
            heading: "Stacking evidence",
            body: "The strongest entries occur where multiple tools point at the same price: an order block with an FVG inside it, sitting in the discount of the range, right after a liquidity sweep. Each layer removes a way to be wrong.",
            points: [
              "Layer 1: HTF bias agrees",
              "Layer 2: sweep of liquidity",
              "Layer 3: OB + FVG overlapping in discount",
              "Layer 4: killzone timing"
            ]
          },
          {
            heading: "Execution",
            body: "Set a limit at the FVG within the block (the 'unicorn' zone when a breaker block and FVG overlap). Stop beyond the block. Because the zone is precise, stops are small and R:R is naturally 1:3 or better.",
            points: [
              "Entry: limit in the overlap zone",
              "Stop: tight, beyond the block",
              "Target: opposing liquidity — let the R:R pay for patience"
            ]
          },
          {
            heading: "Fewer, better trades",
            body: "Four-layer confluence appears maybe once or twice a session. That's the point. One A+ setup at 1:3 beats eight impulsive trades at coin-flip odds — this playbook is as much a filter as it is a strategy."
          }
        ],
        quiz: [
          {
            question: "Confluence means…",
            options: [
              "Using more indicators",
              "Multiple independent tools pointing to the same price and direction",
              "Trading more often",
              "Following more traders"
            ],
            answer: 1,
            explain: "Each independent layer of evidence that agrees shrinks the ways the trade can be wrong."
          },
          {
            question: "Why do confluence entries offer better R:R?",
            options: [
              "Bigger targets exist",
              "Precise zones allow tight stops while targets stay the same",
              "Brokers reward them",
              "They don't"
            ],
            answer: 1,
            explain: "When the entry zone is a few ticks instead of a whole area, risk shrinks while reward doesn't."
          }
        ]
      }
    ]
  },
  {
    id: "psychology",
    title: "Psychology & Risk Systems",
    icon: "brain",
    tagline: "The hidden skill tree — where most traders actually fail.",
    lessons: [
      {
        id: "revenge-trading",
        title: "The Revenge Trading Trap",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "Your brain after a loss",
            body: "A loss triggers the same circuitry as physical pain. The urge to 'make it back' immediately is a chemical event, not a strategy. The next trade after a loss is statistically your most dangerous trade of the day.",
            points: [
              "Losses feel ~2x as intense as equivalent wins",
              "Urgency is the tell — real setups are never urgent",
              "The market doesn't know you lost and doesn't owe you"
            ]
          },
          {
            heading: "The spiral, mechanically",
            body: "Loss → urgency → lowered standards → bigger size → bigger loss → repeat. Every blown account follows this loop. Notice the loop's entry point: it's not the loss, it's the urgency after it."
          },
          {
            heading: "The circuit breaker",
            body: "Pre-commit to rules a calm you writes for a tilted you: after 2 consecutive losses, mandatory 15-minute break. After hitting daily max loss, platform closed, no exceptions. The rule only works if it's automatic — decided before, not during.",
            points: [
              "2 losses = walk away for 15 minutes",
              "Daily max loss = done for the day, always",
              "Journal the urge instead of trading it"
            ]
          }
        ],
        quiz: [
          {
            question: "The most dangerous trade of the day is usually…",
            options: [
              "The first one",
              "The one taken immediately after a loss",
              "The last one",
              "A planned A+ setup"
            ],
            answer: 1,
            explain: "Post-loss urgency lowers your standards exactly when you need them highest."
          },
          {
            question: "Circuit-breaker rules work because…",
            options: [
              "They increase win rate",
              "They're decided in advance, removing in-the-moment negotiation with a tilted brain",
              "Brokers enforce them",
              "They don't work"
            ],
            answer: 1,
            explain: "You can't out-discipline tilt in real time. Automatic pre-commitments don't ask how you feel."
          }
        ]
      },
      {
        id: "overtrading",
        title: "Overtrading & The Power of Flat",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "Boredom is expensive",
            body: "Most intraday losses come from trades that had no setup — taken because the market was open and you were watching. Screens create pressure to act; professionals measure themselves by the quality of trades, not the count.",
            points: [
              "No setup = no trade, no matter how long you've waited",
              "2–3 quality setups per session is plenty",
              "Flat is a position — often the best one"
            ]
          },
          {
            heading: "The checklist as a bouncer",
            body: "Write your setup's requirements as a literal checklist: bias, location, sweep, confirmation, R:R. Any item missing, the trade doesn't get in. This converts discipline from willpower (limited) into procedure (unlimited)."
          },
          {
            heading: "Track skipped trades",
            body: "Keep a 'no-trade log' of setups you skipped and why. Two things happen: you discover most impulses would have lost, and skipping starts to feel like winning — because it is. Patience improves when it's measured."
          }
        ],
        quiz: [
          {
            question: "The main cause of overtrading is…",
            options: [
              "Too much capital",
              "Screen-watching pressure to act without a setup",
              "Low commissions",
              "Fast internet"
            ],
            answer: 1,
            explain: "Watching every tick creates an urge to participate. No setup means no trade — the checklist decides."
          },
          {
            question: "Why log the trades you DIDN'T take?",
            options: [
              "For taxes",
              "It proves most impulses lose and makes patience a measurable win",
              "Brokers require it",
              "To share on social media"
            ],
            answer: 1,
            explain: "Measuring discipline rewires it from a sacrifice into a scoreboard you can win."
          }
        ]
      },
      {
        id: "risk-systems",
        title: "Fixed Risk & Daily Drawdown",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "Fixed % risk: the survival engine",
            body: "Risking a fixed 0.5–1% per trade means position size adjusts automatically as your account changes. Losing streaks shrink your bets; winning streaks grow them. The math bends toward survival.",
            points: [
              "10 straight losses at 1% = −9.6% (annoying)",
              "10 straight losses at 5% = −40% (needs +67% to recover)",
              "Recovery math is brutal: −50% needs +100%"
            ]
          },
          {
            heading: "The daily stop",
            body: "A max daily drawdown (2–3% or 2–3 losses) caps how much one bad day — or one bad mental state — can take. The best traders' edge isn't bigger wins; it's smaller worst days."
          },
          {
            heading: "Scaling and stacking",
            body: "Scaling in (adding as the trade confirms) and scaling out (taking partials at targets) smooth your equity curve. Risk stacking — multiple correlated positions at once — does the opposite: three ES/NQ/YM longs is one triple-sized trade wearing a disguise.",
            points: [
              "Partials at 1R reduce psychological pressure",
              "Correlated positions = one big bet, count them that way",
              "Never add to losers — that's martingale, not scaling"
            ]
          }
        ],
        quiz: [
          {
            question: "After a 50% drawdown, what gain gets you back to breakeven?",
            options: ["50%", "75%", "100%", "150%"],
            answer: 2,
            explain: "From half your capital, you must double what's left. That asymmetry is why small risk per trade wins."
          },
          {
            question: "Long ES, NQ, and YM at the same time is effectively…",
            options: [
              "Diversification",
              "One large correlated bet — risk should be counted combined",
              "Three independent trades",
              "A hedge"
            ],
            answer: 1,
            explain: "The index futures move together; three 1% risks on them is closer to one 3% risk."
          }
        ]
      },
      {
        id: "prop-rules",
        title: "Prop Firm Rules & Funded Discipline",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "The rules are the game",
            body: "Prop firms give you their capital in exchange for obedience to risk rules: a max drawdown (often trailing), a daily loss limit, and consistency requirements. Traders rarely fail evaluations from bad analysis — they fail from rule breaches.",
            points: [
              "Trailing drawdown follows your equity peak up",
              "Daily loss limit breach = instant failure",
              "Some firms cap how much one day can contribute"
            ]
          },
          {
            heading: "Trailing drawdown changes everything",
            body: "If the drawdown trails your open equity high, a winner that retraces can still bust you. Practical consequence: take partials, protect open profit, and know exactly where your trailing floor sits before every entry."
          },
          {
            heading: "Pass math, not hero math",
            body: "An 8% target with a 4% daily limit means you need small consistent days — roughly 1% a day for two weeks — not one home-run day that risks the account. Trade the evaluation like the boring job it is; save the excitement for never."
          }
        ],
        quiz: [
          {
            question: "Most prop evaluation failures come from…",
            options: [
              "Bad chart analysis",
              "Breaching risk rules like daily loss limits",
              "Slow platforms",
              "Wrong indicators"
            ],
            answer: 1,
            explain: "Firms design the rules to filter discipline. The analysis bar is lower than the discipline bar."
          },
          {
            question: "A trailing max drawdown means…",
            options: [
              "It only counts closed trades",
              "The loss floor rises with your equity peak — open profit can raise it",
              "You can't lose",
              "It resets daily"
            ],
            answer: 1,
            explain: "Letting a big winner round-trip can still breach — protect open profit under trailing rules."
          }
        ]
      },
      {
        id: "journaling",
        title: "Journaling: The Feedback Loop",
        minutes: 4,
        xp: 70,
        slides: [
          {
            heading: "You can't fix what you don't record",
            body: "A journal turns trading from repeated gambling into deliberate practice. Each entry needs the setup, the plan, what you actually did, and — crucially — your mental state. Screenshots before and after beat a thousand words.",
            points: [
              "Setup + planned entry/stop/target",
              "What actually happened vs the plan",
              "Emotional state (1–10 tilt score)",
              "Grade the PROCESS, not the profit"
            ]
          },
          {
            heading: "Good trades lose, bad trades win",
            body: "A perfect setup, perfectly executed, that hits its stop is a GOOD trade. An impulsive gamble that made money is a BAD trade that got paid — and it's training you to blow up later. Judge every trade by process; the money follows the process."
          },
          {
            heading: "The weekly review",
            body: "Once a week, read the journal and ask: which setup made the money? Which mistake cost the most? What one rule would have saved me? Most traders discover 80% of losses come from one repeated mistake. Find yours; that's your fastest edge.",
            points: [
              "Sort trades by setup type — kill the losers",
              "Find your one expensive recurring mistake",
              "Set one rule for next week, not five"
            ]
          }
        ],
        quiz: [
          {
            question: "A perfect setup executed to plan that hits its stop loss is…",
            options: [
              "A bad trade",
              "A good trade — process was right, variance happened",
              "A reason to change strategy",
              "Revenge trade material"
            ],
            answer: 1,
            explain: "You control process, not outcomes. Good process + enough repetitions = profit."
          },
          {
            question: "The weekly review's main job is to find…",
            options: [
              "Your best win to celebrate",
              "The one recurring mistake causing most of your losses",
              "New indicators",
              "More setups to trade"
            ],
            answer: 1,
            explain: "Most losses concentrate in one repeated behavior. Removing it beats adding anything new."
          }
        ]
      }
    ]
  },
  {
    id: "proving-ground",
    title: "The Proving Ground",
    icon: "flask-conical",
    tagline: "Backtest, measure, and prove your edge in simulation.",
    lessons: [
      {
        id: "backtesting",
        title: "Backtesting That Actually Counts",
        minutes: 4,
        xp: 80,
        slides: [
          {
            heading: "One setup, many reps",
            body: "Real backtesting means picking ONE setup, defining its rules exactly, and replaying it across 50–100 historical instances — bar by bar, without seeing the future. Scrolling charts and cherry-picking wins is not backtesting; it's confirmation bias with extra steps.",
            points: [
              "Written rules first: entry, stop, target, skip conditions",
              "Bar-by-bar replay — no peeking ahead",
              "Log every instance, including the ugly ones"
            ]
          },
          {
            heading: "Forward testing: the bridge",
            body: "After backtesting, trade the setup in live simulation for 20–30 trades. Forward testing adds what backtests can't: real-time uncertainty, hesitation, and your own psychology. Only after both do you risk money."
          },
          {
            heading: "Sample size or it didn't happen",
            body: "Ten trades tell you nothing — a coin flips 7 heads out of 10 all the time. You need 50+ instances before win rate and R:R numbers mean anything. Patience here saves accounts later."
          }
        ],
        quiz: [
          {
            question: "Valid backtesting requires…",
            options: [
              "Scrolling charts looking for wins",
              "Written rules replayed bar-by-bar across 50+ instances without seeing ahead",
              "A paid indicator",
              "One great week"
            ],
            answer: 1,
            explain: "Hidden future + fixed rules + large sample = data. Anything else is storytelling."
          },
          {
            question: "Why forward test after backtesting?",
            options: [
              "To double-check the math",
              "It adds real-time uncertainty and your psychology — things backtests can't capture",
              "Regulators require it",
              "It's not needed"
            ],
            answer: 1,
            explain: "Executing with the future unknown is a different skill from recognizing patterns in hindsight."
          }
        ]
      },
      {
        id: "metrics",
        title: "Metrics That Matter",
        minutes: 4,
        xp: 80,
        slides: [
          {
            heading: "Expectancy: the only score",
            body: "Expectancy = (win rate × average win) − (loss rate × average loss). It tells you what each trade is worth on average. A 40% win rate with 1:3 R:R has positive expectancy; a 70% win rate with 1:0.3 goes broke.",
            points: [
              "Expectancy > 0 with 50+ trades = real edge",
              "Measure results in R multiples, not dollars",
              "Win rate alone is a vanity metric"
            ]
          },
          {
            heading: "The supporting cast",
            body: "Max drawdown shows your worst stretch — can you survive it financially and emotionally? Profit factor (gross wins ÷ gross losses) above 1.5 is solid. Average R per trade tracks whether you're letting winners run or strangling them.",
            points: [
              "Max drawdown: your survival test",
              "Profit factor: > 1.5 is healthy",
              "Consistency: how much of profit came from one lucky day?"
            ]
          },
          {
            heading: "Measure by setup",
            body: "Aggregate stats hide the truth. Break metrics down by setup type, session, and day of week. You'll typically find one setup and one time window produce nearly all your profit — do more of that, delete the rest."
          }
        ],
        quiz: [
          {
            question: "A trader wins 70% of trades but averages 1:0.3 R:R. Long-term they…",
            options: [
              "Get rich — 70% is great",
              "Lose — each loss wipes about three wins",
              "Break exactly even",
              "Can't be determined"
            ],
            answer: 1,
            explain: "0.7 × 0.3R − 0.3 × 1R = −0.09R per trade. Negative expectancy compounds down, not up."
          },
          {
            question: "Why break metrics down by setup and session?",
            options: [
              "It looks professional",
              "Aggregates hide that most profit usually comes from one setup and window",
              "Brokers ask for it",
              "To increase trade count"
            ],
            answer: 1,
            explain: "Finding where your edge concentrates lets you cut everything that dilutes it."
          }
        ]
      },
      {
        id: "trade-management",
        title: "Trade Management & Execution",
        minutes: 4,
        xp: 80,
        slides: [
          {
            heading: "The trade after entry",
            body: "Entries get all the attention, but management decides the P&L. Have pre-planned rules for partials, breakeven moves, and exits — decided before entry, executed without debate.",
            points: [
              "Partial at 1R: pays for the risk, calms the mind",
              "Breakeven stop only after structure confirms (not instantly)",
              "Full exit if the reason for the trade disappears"
            ]
          },
          {
            heading: "The breakeven trap",
            body: "Moving your stop to breakeven too early turns winning trades into scratches — normal retracement wicks you out before the move. Move it only when a new structural level forms between entry and price. Give trades room to breathe or don't take them."
          },
          {
            heading: "When NOT to trade",
            body: "The final execution skill is recognizing no-trade conditions: 10 minutes before red-folder news, lunch chop, after your daily loss limit, when you can't define the setup in one sentence, and when you're tilted. Every skipped bad trade compounds like a win.",
            points: [
              "Pre-news and lunch chop: stand down",
              "Can't state the setup in one sentence? Skip",
              "Tilted, tired, or distracted? The market's open tomorrow"
            ]
          }
        ],
        quiz: [
          {
            question: "Moving your stop to breakeven immediately after entry usually…",
            options: [
              "Guarantees profit",
              "Turns winners into scratches — normal retracements stop you out",
              "Is required by brokers",
              "Improves R:R"
            ],
            answer: 1,
            explain: "Price breathes. Protect the trade only after structure gives you a real level to hide behind."
          },
          {
            question: "Which is a valid reason to take a trade?",
            options: [
              "You've been flat for 2 hours",
              "The setup meets every item on your checklist",
              "You're down on the day and need it back",
              "Someone on social media called it"
            ],
            answer: 1,
            explain: "Boredom, revenge, and other people's conviction are the three most expensive entry signals in trading."
          }
        ]
      },
      {
        id: "graduation",
        title: "Graduation: Prove It in the Arena",
        minutes: 3,
        xp: 100,
        slides: [
          {
            heading: "Knowledge → skill → proof",
            body: "You've covered the full stack: market mechanics, structure, liquidity, smart money, complete playbooks, psychology, and measurement. None of it counts until it's proven under pressure — that's what the games are for.",
            points: [
              "Daily Challenge: build the everyday habit",
              "Replay & Trade Mode: run your playbooks blind",
              "Prop Firm Escape & Boss Fight: survive the rules",
              "Ranked: perform under pressure"
            ]
          },
          {
            heading: "Your training program",
            body: "A simple weekly cadence: Daily Challenge every day, 10 Replay reads, 5 full Trade Mode executions, 1 Review Queue session to clear mistakes, and a weekly look at your profile stats — treating accuracy by pattern as your journal.",
            points: [
              "Streaks build the habit",
              "Review Queue is your mistake journal",
              "Profile analytics = your metrics dashboard"
            ]
          },
          {
            heading: "The standard",
            body: "Aim for 70%+ accuracy on your best pattern across 50+ attempts before ever considering real capital — and even then, sim a prop evaluation first. The traders who last are the ones who demanded proof from themselves before the market demanded it of them."
          }
        ],
        quiz: [
          {
            question: "Before risking real capital, you should have…",
            options: [
              "A good feeling",
              "70%+ accuracy on your best setup across a 50+ attempt sample",
              "One profitable week",
              "A bigger monitor"
            ],
            answer: 1,
            explain: "A large-sample, measured edge in simulation is the minimum bar — the market charges tuition otherwise."
          },
          {
            question: "The Review Queue is effectively your…",
            options: [
              "Punishment",
              "Mistake journal — targeted reps on exactly what you got wrong",
              "Leaderboard",
              "Payment history"
            ],
            answer: 1,
            explain: "Re-drilling your specific misses is the highest-ROI practice that exists."
          }
        ]
      }
    ]
  }
];

let academyTiers = FUTURES_TIERS;

/* ---------- progress ---------- */

function academyData() {
  const p = progress();
  if (!p.academy || typeof p.academy !== "object") p.academy = {};
  if (!p.academy.lessons || typeof p.academy.lessons !== "object") p.academy.lessons = {};
  return p.academy;
}

function academyLessonPassed(lessonId) {
  return Boolean(academyData().lessons[lessonId]?.passedAt);
}

function academyTierStats(tier) {
  const total = tier.lessons.length;
  const done = tier.lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
  return { total, done, needed: Math.ceil(total * ACADEMY_TIER_UNLOCK_RATIO) };
}

function academyTierUnlocked(tierIndex) {
  if (tierIndex <= 0) return true;
  const previous = academyTiers[tierIndex - 1];
  const stats = academyTierStats(previous);
  return stats.done >= stats.needed;
}

function academyOverallStats() {
  const lessons = academyTiers.flatMap((tier) => tier.lessons);
  const done = lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
  return { total: lessons.length, done };
}

function academyNextLesson() {
  for (let i = 0; i < academyTiers.length; i += 1) {
    if (!academyTierUnlocked(i)) continue;
    const lesson = academyTiers[i].lessons.find((item) => !academyLessonPassed(item.id));
    if (lesson) return { tier: academyTiers[i], lesson };
  }
  return null;
}

function academyTierGame(tierId) {
  if (typeof arcadeGames === "undefined") return null;
  const tierIndex = academyTiers.findIndex((tier) => tier.id === tierId);
  return arcadeGames.find((game) => game.tier === tierIndex) || null;
}

function findAcademyLesson(lessonId) {
  for (const tier of academyTiers) {
    const lesson = tier.lessons.find((item) => item.id === lessonId);
    if (lesson) return { tier, lesson };
  }
  return null;
}

/* ---------- rendering ---------- */

function renderAcademy() {
  const root = document.getElementById("academy-root");
  if (!root) return;

  const overall = academyOverallStats();
  const overallPercent = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;
  const next = academyNextLesson();

  const tiersMarkup = academyTiers.map((tier, index) => {
    const unlocked = academyTierUnlocked(index);
    const stats = academyTierStats(tier);
    const complete = stats.done >= stats.total;
    const firstOpenIndex = tier.lessons.findIndex((lesson) => !academyLessonPassed(lesson.id));
    const doneCount = tier.lessons.filter((lesson) => academyLessonPassed(lesson.id)).length;
    const trailPercent = tier.lessons.length ? Math.round((doneCount / tier.lessons.length) * 100) : 0;
    const lessonsMarkup = `
      <div class="trail" style="--trailp:${trailPercent}%">
        ${tier.lessons.map((lesson, lessonIndex) => {
          const passed = academyLessonPassed(lesson.id);
          const isCurrent = unlocked && lessonIndex === firstOpenIndex;
          const status = !unlocked ? "locked" : passed ? "done" : isCurrent ? "current" : "ready";
          const side = lessonIndex % 2 === 0 ? "left" : "right";
          return `
            <div class="trail-step ${side} ${status}">
              <button class="trail-node" type="button" data-academy-lesson="${lesson.id}" ${status === "locked" ? "disabled" : ""} aria-label="${lesson.title}">
                <i data-lucide="${status === "locked" ? "lock" : passed ? "check" : "candlestick-chart"}"></i>
                ${isCurrent ? `<span class="trail-flag">START</span>` : ""}
              </button>
              <span class="trail-info">
                <strong>${lesson.title}</strong>
                <small>${lesson.minutes} min · quiz · ${passed ? "✓ earned" : `+${lesson.xp} XP`}</small>
              </span>
            </div>
          `;
        }).join("")}
      </div>
    `;

    const lockNote = unlocked
      ? ""
      : `<p class="academy-tier-locknote"><i data-lucide="lock"></i> Pass ${academyTierStats(academyTiers[index - 1]).needed} lessons in ${academyTiers[index - 1].title} to unlock.</p>`;

    return `
      <article class="academy-tier ${unlocked ? "unlocked" : "locked"} ${complete ? "complete" : ""}">
        <header class="academy-tier-head">
          <span class="academy-tier-icon"><i data-lucide="${tier.icon}"></i></span>
          <div class="academy-tier-title">
            <span class="academy-tier-step">Tier ${index + 1}</span>
            <h3>${tier.title}</h3>
            <p>${tier.tagline}</p>
          </div>
          <div class="academy-tier-progress">
            <strong>${stats.done}/${stats.total}</strong>
            <div class="academy-tier-bar"><i style="width:${stats.total ? Math.round((stats.done / stats.total) * 100) : 0}%"></i></div>
          </div>
        </header>
        ${lockNote}
        <div class="academy-tier-lessons">${lessonsMarkup}</div>
      </article>
    `;
  }).join("");

  const trackLabel = typeof currentTrack === "function" ? currentTrack().label : "Trading";
  const trackTagline = typeof currentTrack === "function" ? currentTrack().tagline : "";
  root.innerHTML = `
    ${typeof trackBarMarkup === "function" ? trackBarMarkup() : ""}
    <div class="academy-summary">
      <div class="academy-summary-copy">
        <h2>${trackLabel} Academy</h2>
        <p>${trackTagline} Seven tiers from foundations to smart money — pass lessons to earn XP, unlock the next tier, then prove each concept in the games.</p>
      </div>
      <div class="academy-summary-progress">
        <strong>${overall.done}/${overall.total} lessons</strong>
        <div class="academy-summary-bar"><i style="width:${overallPercent}%"></i></div>
        ${next ? `<button class="academy-continue" type="button" data-academy-lesson="${next.lesson.id}"><i data-lucide="play"></i> ${overall.done ? "Continue" : "Start"}: ${next.lesson.title}</button>` : `<span class="academy-complete-note">Academy complete — go dominate the arena.</span>`}
      </div>
    </div>
    <div class="academy-tiers">${tiersMarkup}</div>
    ${typeof orderflowSectionMarkup === "function" ? orderflowSectionMarkup() : ""}
  `;

  root.querySelectorAll("[data-academy-lesson]").forEach((button) => {
    button.addEventListener("click", () => openAcademyLesson(button.dataset.academyLesson));
  });
  if (typeof bindTrackControls === "function") bindTrackControls(root);

  if (window.lucide) window.lucide.createIcons();
}

/* ---------- home academy path (main event) ---------- */

function renderHomeAcademyPath() {
  const root = document.getElementById("home-academy-path");
  if (!root) return;
  const overall = academyOverallStats();
  const next = academyNextLesson();
  const overallPercent = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;

  const nodes = academyTiers.map((tier, index) => {
    const unlocked = academyTierUnlocked(index);
    const stats = academyTierStats(tier);
    const complete = stats.done >= stats.total;
    const current = unlocked && !complete && (!next || next.tier.id === tier.id || stats.done > 0);
    const status = complete ? "complete" : !unlocked ? "locked" : current && next && next.tier.id === tier.id ? "current" : "open";
    return `
      <button class="path-node ${status}" type="button" data-path-tier="${tier.id}" ${unlocked ? "" : "disabled"}>
        <span class="path-node-ring">
          <i data-lucide="${complete ? "check" : unlocked ? tier.icon : "lock"}"></i>
        </span>
        <span class="path-node-label">
          <b>Tier ${index + 1}</b>
          <strong>${tier.title}</strong>
          <small>${stats.done}/${stats.total}</small>
        </span>
      </button>
      ${index < academyTiers.length - 1 ? `<span class="path-connector ${complete ? "lit" : ""}"></span>` : ""}
    `;
  }).join("");

  root.innerHTML = `
    <div class="home-block-head">
      <div>
        <p class="arcade-kicker">// THE ACADEMY ${typeof currentTrack === "function" ? `· ${currentTrack().label.toUpperCase()} TRACK` : ""}</p>
        <h2>Climb the skill tree.</h2>
      </div>
      <div class="home-academy-meter">
        <span>${overall.done}/${overall.total} lessons · ${overallPercent}%</span>
        <div><i style="width:${overallPercent}%"></i></div>
      </div>
    </div>
    ${typeof trackBarMarkup === "function" ? trackBarMarkup() : ""}
    <div class="academy-path">${nodes}</div>
    ${next ? `
      <button class="academy-continue big" type="button" id="home-academy-continue">
        <i data-lucide="play"></i>
        <span>${overall.done ? "Continue" : "Start"}: <b>${next.lesson.title}</b> · +${next.lesson.xp} XP</span>
      </button>` : `<p class="academy-complete-note">Academy complete — the arcade is your proving ground now.</p>`}
  `;

  if (typeof bindTrackControls === "function") bindTrackControls(root);
  root.querySelectorAll("[data-path-tier]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("academy");
    });
  });
  root.querySelector("#home-academy-continue")?.addEventListener("click", () => {
    if (next) openAcademyLesson(next.lesson.id);
  });
  if (window.lucide) window.lucide.createIcons();
  if (typeof homeMotion === "function") homeMotion();
}

/* ---------- quiz variation: shuffled options + retry question bank ---------- */

function shuffleQuiz(quiz) {
  return quiz.map((item) => {
    const order = item.options.map((_, index) => index).sort(() => Math.random() - 0.5);
    return {
      ...item,
      options: order.map((index) => item.options[index]),
      answer: order.indexOf(item.answer)
    };
  });
}

const QUIZ_BANK = {
  foundations: [
    { question: "Your account is $5,000, you risk 1%, and your stop costs $25 per contract. Position size?", options: ["1 contract", "2 contracts", "5 contracts", "10 contracts"], answer: 1, explain: "$50 risk ÷ $25 per contract = 2. Size always derives from the stop." },
    { question: "At 1:3 risk-to-reward, roughly what win rate breaks even?", options: ["50%", "40%", "25%", "75%"], answer: 2, explain: "Winning 3R per win means one win covers three losses — about 25% breaks even." },
    { question: "A stop order does what when price touches its level?", options: ["Cancels", "Becomes a market order and executes", "Waits for a better price", "Converts to a limit order"], answer: 1, explain: "Stops trigger into market orders — that's why they guarantee an exit, not a price." }
  ],
  structure: [
    { question: "A downtrend is defined by…", options: ["Red candles", "Lower lows and lower highs", "Falling volume", "A declining moving average"], answer: 1, explain: "Structure defines trend: each swing low and swing high below the last." },
    { question: "Resistance most convincingly becomes support after…", options: ["One touch", "Price accepting above it and retesting it from the top side", "A news event", "Three days pass"], answer: 1, explain: "Acceptance plus a held retest completes the flip — the level changed teams." },
    { question: "An obvious textbook pattern fails. The professional read is…", options: ["Patterns are useless", "Trapped traders now fuel a move the other way", "Wait for the same pattern again", "Double down on the original idea"], answer: 1, explain: "Failed patterns trap the crowd — their exits power the opposite move." }
  ],
  liquidity: [
    { question: "Below equal lows you should expect…", options: ["Nothing special", "A pool of sell stops that price may hunt", "Guaranteed support", "Low volume"], answer: 1, explain: "Equal lows stack stops — a liquidity pool and a magnet." },
    { question: "A CHoCH (change of character) is…", options: ["A continuation signal", "The first structural break against the current trend", "A candlestick pattern", "A volume spike"], answer: 1, explain: "The first break of the trend's staircase — the earliest warning of a shift." },
    { question: "Price wicks below a low and closes back above it. Price breaks a low and closes below for 3 candles. The difference?", options: ["None", "First is a sweep (rejection), second is acceptance (real break)", "Both are sweeps", "Both are breaks"], answer: 1, explain: "Sweeps reject instantly; multiple closes beyond a level mean genuine repricing." }
  ],
  "smart-money": [
    { question: "A bearish order block is typically…", options: ["The biggest red candle", "The last up candle before a displacement down", "Any candle at resistance", "A gap"], answer: 1, explain: "That final up candle is where sell orders absorbed the last buying before the drop." },
    { question: "A Fair Value Gap requires…", options: ["High volume", "Candle 1 and candle 3 wicks that never overlap around a fast middle candle", "A news release", "Two dojis"], answer: 1, explain: "The non-overlap IS the gap — prices the market skipped and tends to revisit." },
    { question: "In a dealing range, the highest-quality longs come from…", options: ["Above equilibrium", "Below equilibrium, in the discount", "The exact high", "Anywhere with volume"], answer: 1, explain: "Buy below fair value, sell above it — location is its own edge." }
  ],
  strategies: [
    { question: "The professional breakout sequence is…", options: ["Buy the first break instantly", "Break → acceptance beyond the level → successful retest", "Wait a full day", "Fade every breakout"], answer: 1, explain: "Acceptance and retest filter the stop-hunt fakeouts that kill instant entries." },
    { question: "After a liquidity sweep, the entry confirmation is…", options: ["The sweep wick itself", "Displacement through structure, then the retrace into the new zone", "An indicator cross", "Volume alone"], answer: 1, explain: "Sweep is context; displacement is proof; the retrace is your price." },
    { question: "The real purpose of stacking confluence is…", options: ["More indicators", "Fewer, higher-quality trades with tighter stops", "Trading more often", "Impressing others"], answer: 1, explain: "Each agreeing layer removes a way to be wrong — and precision shrinks the stop." }
  ],
  psychology: [
    { question: "After two consecutive losses, the professional move is…", options: ["Double size to recover", "A mandatory break before re-qualifying any setup", "Switch markets", "Remove the stop"], answer: 1, explain: "The circuit breaker exists because your judgment is provably worst right then." },
    { question: "A trade that followed the plan perfectly but lost money is…", options: ["A bad trade", "A good trade — process was right, variance happened", "Proof the strategy failed", "A reason to revenge trade"], answer: 1, explain: "You control process, not outcomes. Good process repeated is the whole game." },
    { question: "Most overtrading is caused by…", options: ["Too much capital", "Boredom and screen-watching pressure, not setups", "Fast internet", "Low commissions"], answer: 1, explain: "No setup = no trade. The checklist decides, not the urge to participate." }
  ],
  proving: [
    { question: "Before trusting a strategy's stats you need roughly…", options: ["5 trades", "10 trades", "50+ trades", "2 trades"], answer: 2, explain: "Small samples lie — a coin flips 7/10 heads all the time. 50+ makes the numbers mean something." },
    { question: "Expectancy tells you…", options: ["Your win rate", "The average value of each trade you take", "Your biggest win", "Market direction"], answer: 1, explain: "(Win% × avg win) − (Loss% × avg loss): the only score that matters long-run." },
    { question: "The fastest way to find your real edge is to…", options: ["Trade more", "Break results down by setup, session, and day", "Add indicators", "Copy someone"], answer: 1, explain: "Aggregates hide truth — most profit usually comes from one setup in one window." }
  ],
  orderflow: [
    { question: "Huge volume hits a level but price doesn't move. That's…", options: ["Exhaustion", "Absorption — passive size is eating the aggression", "A data error", "Breakout fuel"], answer: 1, explain: "Maximum effort with zero progress means a wall is winning. Snap-backs follow." },
    { question: "Stacked buying imbalances through consecutive levels signal…", options: ["Retail FOMO", "Institutional initiative — urgency forcing through", "A spoof", "Nothing"], answer: 1, explain: "Consistent 3:1 aggression across levels is size with a mission — continuation flow." },
    { question: "A prior session's untested POC tends to act as…", options: ["Nothing", "A magnet price returns to test", "Permanent resistance", "A halt level"], answer: 1, explain: "Naked POCs are unfinished business — the market comes back to complete the auction." }
  ],
  advanced: [
    { question: "The same chart pattern should be traded differently depending on…", options: ["Your mood", "The regime — dealer gamma, internals, funding, or positioning context", "The day of week", "Nothing, patterns are patterns"], answer: 1, explain: "Context decides whether momentum or mean-reversion gets paid. Regime first, setup second." },
    { question: "Record-crowded positioning at a key level usually means…", options: ["Follow the crowd", "Unwind fuel is loaded — contrarian risk is elevated", "Nothing", "Volume is fake"], answer: 1, explain: "When everyone who wants in is in, the marginal flow flips the other way." },
    { question: "The correct role of advanced data (flow, GEX, on-chain) is…", options: ["Replacing your levels", "A confirmation layer at levels your framework already chose", "A standalone signal", "Decoration"], answer: 1, explain: "Map first, microscope second — every advanced tool obeys the same rule." }
  ],
  "fx-foundations": [
    { question: "One pip on EUR/USD is…", options: ["0.01", "0.0001", "1.0", "0.00001"], answer: 1, explain: "Fourth decimal on non-JPY pairs. The fifth is a pipette." },
    { question: "The most powerful FX window is…", options: ["Sydney open", "The London/New York overlap", "Friday close", "Weekend"], answer: 1, explain: "Both major banking centers online at once — peak volume and follow-through." }
  ],
  "st-foundations": [
    { question: "RVOL of 6 means the stock is…", options: ["Down 6%", "Trading 6× its normal volume — genuinely in play", "Worth $6", "Halted"], answer: 1, explain: "Relative volume flags where the crowd's attention — and the day's range — lives." },
    { question: "A gap up on weak premarket volume most often…", options: ["Runs all day", "Fades back toward yesterday's close", "Halts", "Squeezes"], answer: 1, explain: "No participation, no fuel — gravity pulls unloved gaps back to prior value." }
  ],
  "op-foundations": [
    { question: "Holding short-dated options through sideways chop mostly…", options: ["Builds gamma", "Burns theta while giving nothing back", "Raises IV", "Is free"], answer: 1, explain: "Time decay accelerates near expiry — chop plus theta is a slow guaranteed bleed." },
    { question: "Your call loses value even though the stock rose after earnings. The cause is…", options: ["Broker error", "IV crush — the volatility premium collapsed", "Delta flipped", "Dividends"], answer: 1, explain: "You paid for the expected move; the event's passing deflated that premium." }
  ],
  "cr-foundations": [
    { question: "Heavily positive funding means…", options: ["Shorts are crowded", "Longs are crowded and paying to stay in", "The market is closed", "Fees are zero"], answer: 1, explain: "Positive funding = longs pay shorts. Crowded longs are squeeze-down fuel." },
    { question: "Your liquidation price should be…", options: ["Your stop loss", "Far beyond your stop — never realistically touchable", "Near entry", "Unknown"], answer: 1, explain: "The stop exits the trade; if liquidation does it, sizing was wrong from the start." }
  ]
};

function quizThemeForTier(tierId) {
  if (tierId.startsWith("of-")) return "orderflow";
  if (tierId.startsWith("fx-inst") || tierId.startsWith("st-adv") || tierId.startsWith("op-adv") || tierId.startsWith("cr-adv")) return "advanced";
  if (tierId.includes("foundations")) {
    if (tierId.startsWith("fx-")) return "fx-foundations";
    if (tierId.startsWith("st-")) return "st-foundations";
    if (tierId.startsWith("op-")) return "op-foundations";
    if (tierId.startsWith("cr-")) return "cr-foundations";
    return "foundations";
  }
  if (tierId.includes("structure")) return "structure";
  if (tierId.includes("liquidity")) return "liquidity";
  if (tierId.includes("smart-money")) return "smart-money";
  if (tierId.includes("strategies")) return "strategies";
  if (tierId.includes("psychology")) return "psychology";
  if (tierId.includes("proving")) return "proving";
  return null;
}

function buildRetryQuiz(lesson) {
  const found = findAcademyLesson(lesson.id);
  const theme = found ? quizThemeForTier(found.tier.id) : null;
  const bank = theme ? QUIZ_BANK[theme] : null;
  if (bank && bank.length >= 2) {
    const pool = [...bank].sort(() => Math.random() - 0.5).slice(0, lesson.quiz.length);
    while (pool.length < lesson.quiz.length) pool.push(lesson.quiz[pool.length]);
    return shuffleQuiz(pool);
  }
  return shuffleQuiz(lesson.quiz);
}

/* ---------- lesson modal ---------- */

const academyModalState = { lessonId: null, slideIndex: 0, phase: "slides", answers: [], justPassed: false };

function ensureAcademyModal() {
  let modal = document.getElementById("academy-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "academy-modal";
  modal.className = "academy-modal hidden";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="academy-modal-card" role="dialog" aria-modal="true" aria-labelledby="academy-modal-title">
      <button class="academy-modal-close" id="academy-modal-close" type="button" aria-label="Close lesson"><i data-lucide="x"></i></button>
      <div class="academy-modal-head">
        <span class="academy-modal-kicker" id="academy-modal-kicker"></span>
        <h2 id="academy-modal-title"></h2>
        <div class="academy-modal-dots" id="academy-modal-dots"></div>
      </div>
      <div class="academy-modal-body" id="academy-modal-body"></div>
      <div class="academy-modal-actions" id="academy-modal-actions"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector("#academy-modal-close")?.addEventListener("click", closeAcademyLesson);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeAcademyLesson();
  });
  return modal;
}

function openAcademyLesson(lessonId) {
  const found = findAcademyLesson(lessonId);
  if (!found) return;
  academyModalState.lessonId = lessonId;
  academyModalState.slideIndex = 0;
  academyModalState.phase = "slides";
  academyModalState.quizSet = shuffleQuiz(found.lesson.quiz);
  academyModalState.answers = academyModalState.quizSet.map(() => null);
  academyModalState.justPassed = false;
  const modal = ensureAcademyModal();
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  trackEvent("academy_lesson_opened", { lessonId });
  renderAcademyModal();
}

function closeAcademyLesson() {
  const modal = document.getElementById("academy-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  renderAcademy();
  renderHomeAcademyPath();
}

function renderAcademyModal() {
  const found = findAcademyLesson(academyModalState.lessonId);
  const modal = document.getElementById("academy-modal");
  if (!found || !modal) return;
  const { tier, lesson } = found;
  const kicker = modal.querySelector("#academy-modal-kicker");
  const title = modal.querySelector("#academy-modal-title");
  const dots = modal.querySelector("#academy-modal-dots");
  const body = modal.querySelector("#academy-modal-body");
  const actions = modal.querySelector("#academy-modal-actions");

  if (kicker) kicker.textContent = `${tier.title} · ${lesson.minutes} min`;
  if (title) title.textContent = lesson.title;

  const totalSteps = lesson.slides.length + 1;
  const activeStep = academyModalState.phase === "slides" ? academyModalState.slideIndex : lesson.slides.length;
  if (dots) {
    dots.innerHTML = Array.from({ length: totalSteps }, (_, i) =>
      `<span class="${i === activeStep ? "active" : i < activeStep ? "done" : ""}"></span>`
    ).join("");
  }

  if (academyModalState.phase === "slides") {
    const slide = lesson.slides[academyModalState.slideIndex];
    body.innerHTML = `
      <h3>${slide.heading}</h3>
      <p>${slide.body}</p>
      ${slide.points ? `<ul>${slide.points.map((point) => `<li>${point}</li>`).join("")}</ul>` : ""}
    `;
    const last = academyModalState.slideIndex === lesson.slides.length - 1;
    actions.innerHTML = `
      ${academyModalState.slideIndex > 0 ? `<button class="academy-btn ghost" type="button" data-academy-action="back">Back</button>` : "<span></span>"}
      <button class="academy-btn primary" type="button" data-academy-action="next">${last ? "Take the quiz" : "Next"}</button>
    `;
  } else if (academyModalState.phase === "quiz") {
    const quizSet = academyModalState.quizSet || lesson.quiz;
    body.innerHTML = quizSet.map((item, qIndex) => `
      <div class="academy-quiz-question">
        <p><b>Q${qIndex + 1}.</b> ${item.question}</p>
        <div class="academy-quiz-options">
          ${item.options.map((option, oIndex) => `
            <button class="academy-quiz-option ${academyModalState.answers[qIndex] === oIndex ? "selected" : ""}" type="button" data-academy-quiz="${qIndex}:${oIndex}">${option}</button>
          `).join("")}
        </div>
      </div>
    `).join("");
    const ready = academyModalState.answers.every((answer) => answer !== null);
    actions.innerHTML = `
      <button class="academy-btn ghost" type="button" data-academy-action="review">Review slides</button>
      <button class="academy-btn primary" type="button" data-academy-action="submit" ${ready ? "" : "disabled"}>Submit answers</button>
    `;
  } else if (academyModalState.phase === "result") {
    const quizSet = academyModalState.quizSet || lesson.quiz;
    const results = quizSet.map((item, qIndex) => ({
      item,
      picked: academyModalState.answers[qIndex],
      correct: academyModalState.answers[qIndex] === item.answer
    }));
    const passed = results.every((result) => result.correct);

    body.innerHTML = `
      <div class="academy-result ${passed ? "pass" : "fail"}">
        <span class="academy-result-icon"><i data-lucide="${passed ? "trophy" : "rotate-ccw"}"></i></span>
        <h3>${passed ? (academyModalState.justPassed ? `Lesson passed! +${academyModalState.lastEarnedXp || lesson.xp} XP${typeof streakBoostLabel === "function" && streakBoostLabel() ? ` <small class="academy-result-boost">${streakBoostLabel()}</small>` : ""}` : "Still sharp.") : "Not yet — review and retry."}</h3>
      </div>
      ${results.map(({ item, picked, correct }, qIndex) => `
        <div class="academy-result-item ${correct ? "correct" : "wrong"}">
          <p><b>Q${qIndex + 1}.</b> ${item.question}</p>
          <small>${correct ? "✓" : `✗ You picked: ${item.options[picked]}. Correct: ${item.options[item.answer]}.`} ${item.explain}</small>
        </div>
      `).join("")}
    `;

    if (passed) {
      const game = academyTierGame(tier.id);
      actions.innerHTML = `
        <button class="academy-btn ghost" type="button" data-academy-action="close">Back to Academy</button>
        ${game ? `<button class="academy-btn primary" type="button" data-academy-action="practice"><i data-lucide="gamepad-2"></i> Play: ${game.title}</button>` : ""}
      `;
    } else {
      actions.innerHTML = `
        <button class="academy-btn ghost" type="button" data-academy-action="review">Review slides</button>
        <button class="academy-btn primary" type="button" data-academy-action="retry">Retry quiz</button>
      `;
    }
  }

  actions.querySelectorAll("[data-academy-action]").forEach((button) => {
    button.addEventListener("click", () => handleAcademyAction(button.dataset.academyAction, lesson));
  });
  body.querySelectorAll("[data-academy-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      const [qIndex, oIndex] = button.dataset.academyQuiz.split(":").map(Number);
      academyModalState.answers[qIndex] = oIndex;
      renderAcademyModal();
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function handleAcademyAction(action, lesson) {
  if (action === "back") {
    academyModalState.slideIndex = Math.max(0, academyModalState.slideIndex - 1);
  } else if (action === "next") {
    if (academyModalState.slideIndex >= lesson.slides.length - 1) {
      academyModalState.phase = "quiz";
    } else {
      academyModalState.slideIndex += 1;
    }
  } else if (action === "review") {
    academyModalState.phase = "slides";
    academyModalState.slideIndex = 0;
  } else if (action === "retry") {
    academyModalState.quizSet = buildRetryQuiz(lesson);
    academyModalState.answers = academyModalState.quizSet.map(() => null);
    academyModalState.phase = "quiz";
  } else if (action === "submit") {
    academyModalState.phase = "result";
    const quizSet = academyModalState.quizSet || lesson.quiz;
    const passed = quizSet.every((item, index) => academyModalState.answers[index] === item.answer);
    academyModalState.justPassed = passed ? completeAcademyLesson(lesson) : false;
    if (typeof arcadeSound === "function") arcadeSound(passed ? "cashout" : "lose");
    if (!passed) {
      trackEvent("academy_quiz_failed", { lessonId: lesson.id });
      if (typeof journalRecord === "function") journalRecord({ type: "quiz", lessonId: lesson.id });
    }
  } else if (action === "close") {
    closeAcademyLesson();
    return;
  } else if (action === "practice") {
    const found = findAcademyLesson(lesson.id);
    const game = found ? academyTierGame(found.tier.id) : null;
    closeAcademyLesson();
    if (game && typeof openArcadeGame === "function") openArcadeGame(game.id);
    return;
  }
  renderAcademyModal();
}

function completeAcademyLesson(lesson) {
  const data = academyData();
  if (data.lessons[lesson.id]?.passedAt) return false;
  const streakMult = typeof streakXpMultiplier === "function" ? streakXpMultiplier() : 1;
  const earned = Math.round(lesson.xp * streakMult);
  data.lessons[lesson.id] = { passedAt: Date.now(), xpEarned: earned };
  const p = progress();
  p.xp += earned;
  academyModalState.lastEarnedXp = earned;
  saveProgress();
  updateProgressUi();
  const boostTag = typeof streakBoostLabel === "function" && streakBoostLabel() ? ` · ${streakBoostLabel()}` : "";
  showToast(`Lesson passed: +${earned} XP${boostTag}`, "success");
  trackEvent("academy_lesson_passed", { lessonId: lesson.id, xp: earned });
  if (typeof dailyBump === "function") dailyBump("lessons");
  if (typeof checkAchievements === "function") checkAchievements();
  if (typeof propfirmTrainingReward === "function") propfirmTrainingReward("lesson");

  const found = findAcademyLesson(lesson.id);
  if (found) {
    const stats = academyTierStats(found.tier);
    if (stats.done >= stats.total && typeof awardBadgeOnce === "function") {
      awardBadgeOnce(`academy_${found.tier.id}`, `${found.tier.title} Graduate`, `You completed every lesson in ${found.tier.title}.`);
    }
  }
  return true;
}

/* ---------- init ---------- */

(() => {
  if (state.currentView === "academy") renderAcademy();
})();
