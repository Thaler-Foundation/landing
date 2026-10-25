---
title: The yield that grows when SOL price is falling.
date: 2026-06-16
tag: Private Beta Launch
image: /blog/blog-1/header.jpeg
excerpt: Onchain yield and protection from falling prices usually work against each other. We built a strategy where they do not, applied it to a vault, and tested it with our own money.
---

## Onchain yield and protection from falling prices usually work against each other.

> _We built a strategy where they do not, we applied it to vault, and tested it with our own money._

![](/blog/blog-1/image1.jpeg)

---

Almost every way to earn yield on Solana is a long position underneath. Staking, lending, providing liquidity, and even borrow-based loops built on top of them, all earn while you hold the asset and the price holds or rises.

**The return is tied to mostly positive price direction of SOL.**

When SOL falls, the position shifts with it, some to highly negative, and the yield is rarely enough to cover the decline speed.

---

## That is a problem worth naming.

The moment a holder most wants a return, a protection in a falling market, is the moment these strategies pay the least, or even negative. Yield and downside protection end up on opposite sides of the same trade.

![](/blog/blog-1/image2.jpeg)

**Thaler One** is designed to separate them.

> _Over the last four weeks we ran live vaults on Solana mainnet with our own capital, using [@jito](https://x.com/jito) for liquid staking, [@kamino](https://x.com/kamino) for the lending loop, and [@pacifica_fi](https://x.com/pacifica_fi) for the short perpetual. The first part of the period was calm and the return built slowly. Then SOL fell sharply, and the strategy returned more than 15 percent, measured in SOL over a period of 4 weeks, with most of that earned during the decline._

---

## How it works.

Three properties make a Thaler One vault behave differently:

1. **The short perpetual is delta neutral against your principal deposit.** The hedge offsets the effect of SOL's price on the capital you put in, so a move in the price of SOL does not, on its own, change the value of your principal.
2. **The perpetual funding and liquid staking in net positive markets.** The spread earned in the Kamino lending loop, and liquidity fees are layered on top of the funding rates, commonly increasing on the upside.
3. **The short position captures downward price movement as profit.** Each time SOL falls, the short is repositioned at the lower level and the move is booked as a liquid gain. This source produces the most while prices are falling, which is exactly when staking, lending, and other long-based yields produce the least.

![](/blog/blog-1/image3.jpeg)

> _Because the yield and the short position work best under opposite conditions, the vault keeps earning across both, while keeping the principal market-neutral. The hedge keeps direction from eroding your principal, the funding rate is amplified by other yields methods while markets are calm or rising, and falling markets are converted into liquid profit at lower dollar values, the moment the other long-based sources go quiet._

---

## What mainnet tests showed up.

We ran this ourselves, on mainnet, for 4 weeks.

**One SOL with a BIG goal.**

Early on, while the market was quiet, almost no return came from funding and short loss on the liquidity position, the lending loops built the spread slowly, as designed when prices are not moving, or slowly going downside.

![](/blog/blog-1/image4.jpeg)

When SOL dropped, the short captured the move as profit, while the liquidity loops continued earning underneath it, and the period closed above 15 percent, measured in SOL amount to initial deposit.

![](/blog/blog-1/image5.jpeg)

![](/blog/blog-1/image6.jpeg)

> _Measured in SOL is the figure that matters here, because the position is hedged against SOL's price._
>
> _The amount of SOL held in the vaults rose while the price fell._
>
> _It's early to say as 4 weeks is a short window, and the last one was unusually volatile, so this is not an annual rate or a forecast. In ordinary conditions the strategy targets returns in the high single digits to the low twenties of percent per year, depending on the risk tier selected._
>
> _The 15 percent is what it produced "in this economy" as proof for the conditions it is built for._

---

More of, another bigger sized example using [@MarinadeFinance](https://x.com/MarinadeFinance)'s mSOL:

![](/blog/blog-1/image7.jpeg)

![](/blog/blog-1/image8.jpeg)

![](/blog/blog-1/image9.jpeg)

---

## Latest Vault Opened

Last night we opened another Thaler One vault, but this time on our platform, and directly on Solana mainnet.

Users will be able to choose from different collateral assets, position sizes, and risk profiles, but the same core structure remains unchanged: liquid staking, lending loops, and a perpetual hedge to their principal, working together inside a self-custodial vault.

Note: this vault is too new to draw performance conclusions from, but we wanted to show a live snapshot of the system continuing to operate on mainnet during our for private beta.

![](/blog/blog-1/image10.jpeg)

![](/blog/blog-1/image11.png)

---

## What you keep.

Your keys, your vault.

The vault is a self-custodial smart account ([@multisig](https://x.com/multisig)), the set of actions it is allowed to run is fixed onchain when you create it (policies), you get a dedicated Cloudflare worker to execute your selected strategy and risk profile in an isolated workspace (container), so you can just claim any outstanding yields, or close your vault anytime (cooldown period added).

![](/blog/blog-1/image12.jpeg)

---

## The private beta is now opened.

The current round uses a fixed deposit per vault so that early capacity is shared evenly across the first users. Limited spots available, few remaining.

**24 hours** since we started cooking. Don't miss out, claim your spot 👉 [thaler.finance](https://thaler.finance/)

Our DMs are open for any questions.

> _The custody model implementation, the strategy workflows execution with real-time onchain tests, further UX improvements and some alpha stuff will be conducted during private beta. LFG!_

![](/blog/blog-1/image13.jpeg)

**Disclaimer:**

The private beta is not available to residents of restricted jurisdictions, and access requires approval and formal verification.

None of this is financial advice.
