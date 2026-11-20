---
title: Week 10-13 at Thaler
date: 2026-09-12
tag: Weekly Update
image: /blog/blog-9/header.png
---

Four weeks with great progress and more productive stress test encounters.

---

## The Market

The last article went out on August 14. From that date through September 11, SOL opened the window near $77, slipped to $74, then rallied to $110.

The live vaults earned through a short grind lower before holding their short positions through a rapid rally.

![](/blog/blog-9/image1.jpeg)

The first move was modest. SOL eased from about $77 to $74.

- The spread APY from the lending loop continued to accrue at different rates, regardless of whether SOL moved lower or higher.
- Funding rates on the short provided an additional source of yield as the market moved, with over 85% of time the longs paid the shorts.
- A slow drift lower is not a crisis for a delta-neutral position. It is one of the conditions that captures profits and rebalances the hedge to the new lower price of the collateral.

The second move was the one that decided whether the structure is real.

- From that $74 area SOL ran to $110. The short was exposed to greater pressure than ever before.
- By 14th August the shorts had already been taken through earlier rally window of $65 to $84, which settled without a security incident across the three-layer gates or any liquidation risks.
- By 29th August the same hedge component had been stress tested on the $74 to $110 run, that held strong as well given the improvements done after the previous rally mentioned earlier.

The short stayed open and the liquidation buffers held. An important part of the setup is that **SOL is used as collateral for the short position.**

Basically, **a SOL price rally increases the dollar value of the same SOL collateral used as margin for the perpetual short position:**

![](/blog/blog-9/image2.jpeg)

The short is automatically managed throughout the move: additional SOL is added as margin from the lending loop's headroom when its liquidation buffer gets thinner. While profitable movements downward are harvested, short position is reset to its base size to keep the hedge aligned with the principal deposit, and the additional SOL is repaid back to the lending loop.

---

## When the Lending Market Moved

On 26th August roughly **$10 million of SOL** left the BTC/SOL market on Kamino in less than an hour, the same market used for our jitoSOL/SOL.

That is a different kind of stress from a price rally. A rally stresses the short. A sudden drain in the LST market stresses the lending loop, and the assumptions around available liquidity when the engine needs rebalancing.

![](/blog/blog-9/image3.jpeg)

The engine continuously monitors both sides of the strategy:

- If the Multiply lending loop APY drops to a critical level, it adjusts the position, it delevers to keep it at a positive rate.
- The short is kept sized against the deposited principal, additional collateral is added as buffer during rallies, pushing the LT higher.

These adjust automatically, without relying on someone to monitor the dashboard. Every market movement creates a deterministic action that is triggered to keep both strategy components safe from liquidation risks.

The 22nd August snapshot remains the last important checkpoint in this window: there were no security issues and more than **$1,100 in profit** had been recorded against the **271 SOL total deposits** into the strategy at that point, during both rounds of private beta on mainnet.

This is a point-in-time snapshot, not a projected APR or a promise about future returns.

---

## What Ran During the Market Rally

Rebalancing on both legs remained the operating rule throughout the window:

- The Kamino Multiply positions, earning the spread on the LST/SOL. The Pacifica hedge positions, which offset the directional exposure of the principal deposit.
- When either side moves away from its target, the vault automatically brings it back into range.

As SOL rises, the short comes under pressure. Funding rates provide an additional source of yield during this period that acts as a buffer as well, while the lending loop spreads continue to compound, increasing the collateral side of LST/SOL pair.

As SOL dips, the short captures profits in USDC, and swaps them directly to SOL, effectively Dollar-Cost Averaging. The short position is closed to realize the profit, and reopened at the new lower price.

Together, these components form the structural floor the strategy is designed around, at around a conservative **7% APR**, regardless of whether the next weeks or months look bullish or bearish.

---

## Deposit Bands

Deposit bands for the live risk profiles stayed the same.

As mentioned earlier, SOL is used as collateral yet the funding rate payments and short profits on Pacifica are settled in USDC and swapped back to SOL. This means the vault continuously accumulates more of the same asset used as collateral for the short.

- Safe: 6 to 1,111 SOL
- Conservative: 6 to 1,111 SOL
- Balanced: 8 to 1,111 SOL
- Optimistic: 11 to 1,112 SOL
- Aggressive: 9 to 1,111 SOL
- YOLO: 8 to 1,111 SOL

Higher risk modes continue to operate with a thinner margin for error.

Non-custodial design is kept unchanged. Each vault remains a Privy Agentic Wallet during the private beta period, using an authorization key instead of exposing the user's raw wallet private key. The authorization key is tied to the user's embedded wallet.

Further milestone remains the same: the migration to Squads Smart Accounts with immutable policies onchain as soon as audits are done.

---

## Work that happened alongside the market

Product work and engine upgrades during these four weeks continued alongside collecting valuable live data and performance of current vaults.

Backend and risk-engine patches followed the Kamino event hours after the pool moved. The perpetual short behaviour during rallies and chop markets are continuously monitored and documented.

On the community side, MonkeDAO Gen3 **#12890** went to a Round 1 tester who came in without a delta-neutral background, allowing him to learn the strategy while becoming part of a community that already understands it.

https://x.com/ThalerFinance/status/2093367173163225295

On 5 September the [@VictusGlobal](https://x.com/VictusGlobal) Space was a walkthrough of how a vault earns from movement: carry, funding, the hedge, isolation, settlement. While founders shared stories on how they got into web3, why and what they are currently building.

https://x.com/Victusglobal/status/2096252047423377752

---

## Total Numbers of the Private Beta

![](/blog/blog-9/image4.jpeg)

And a reminder,

There is no Thaler token.

See you next week.
