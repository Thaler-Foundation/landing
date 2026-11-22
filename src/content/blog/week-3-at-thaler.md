---
title: Week 3 at Thaler
date: 2026-07-04
tag: Weekly Update
image: /blog/blog-4/header.jpeg
---

Last week we said we would keep sharpening the rough edges. This week we did more than sharpen. We rebuilt large parts of the thing.

A massive upgrade is rolling out in stages over the next little while. One of those stages is one we are genuinely excited about: PnL cards. Shareable proof of what a vault actually earned. When they land, we will run our first showcase post, where our testers show off their realized yields in their own words. Not our numbers about them. Theirs.

Here is what we did this week.

---

## Where the vaults stand

100 SOL in TVL, across 50 vaults. At 2 SOL each, every vault is full. That is 100 SOL of other people's capital running the strategy live.

![](/blog/blog-4/image1.jpeg)

---

## What we shipped

Most of the week went into something you never see directly and always feel: making the backend stable. From there, the upgrade reached almost every part of the flow.

Vault deploys are faster again. 1.5 minutes last week, 40 to 45 seconds now, and heading for 25 to 30 once the Agave 4.2 upgrade lands.

We integrated [@Titan_Exchange](https://x.com/Titan_Exchange) v3, with the DART meta-aggregator handling swap routes. Faster fills, and fees under 10 bps.

We built a poller we call ThalerQuant to drive the UI. The stats, the charts, and the formulas behind them now render in milliseconds instead of making you wait. Every stat also carries a tooltip now, so you can see what it means and how it is calculated without leaving the page.

We hardened the security and cut the cost of the routes that claim yield and close vaults, the two moments where your money actually moves.

And we set up the route for the Conservative risk profile. It is almost ready, but it did not open this week.

Two targets we set last week we did not hit: opening Conservative, and our user goal. The reason is the same for both. We spent the week making the backend stable instead, and given the choice we would make that trade again. Stable first, fast second, everything else after that.

---

## We stress-tested the hard case

The honest question about a strategy that carries a short is simple. What happens when SOL rips upward? A rally is the moment a short hurts. So we tested exactly that.

We ran the vaults through two rallies, $67 to $73 and $73 to $84. The short positions held. Automated extra borrows pushed their liquidation thresholds above a $100 SOL price. And because a rising SOL needs less SOL to offset the short's PnL (accounted in USD), the vaults gained roughly 22% more borrowing headroom. In testing, that is enough to hold the short up to a SOL price of $246 until reaching the max borrowing limit.

The same rally that pressures the short lifts the other side of the vault. The lending loops on [@kamino](https://x.com/kamino) Multiply ran a net APY around 9 to 10%, autocompounding and lowering the LTV to widen the headroom further. The pressure and the relief are counter cyclical by design, which is the whole point.

Funding rates paid us 65 to 70% of the hours we held. The rest of the time, we paid it. That is the honest shape of funding, a stream that mostly runs toward you, not a faucet that only ever does.

And JTO, the farm token the vault collects and swaps to SOL on each yield claim, rose about 40% over the past 2 weeks. That was a tailwind we did not build and will not always have. It helped this week. It will not help every week, and we would rather have you know that now.

---

## Next week

We ship a faster pipeline for data delivery. We open the Conservative vault. We put out a stable release of the Safe vault. We will prepare our first steps in getting our stable release ready for audit.

See you next week.
