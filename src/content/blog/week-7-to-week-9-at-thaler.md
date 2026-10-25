---
title: Week 7 to Week 9 at Thaler
date: 2026-08-14
tag: Weekly Update
image: /blog/blog-8/header.png
---

Three weeks. Here is all of it.

---

## Round 1: Final Numbers

Seven weeks of the vault running a delta-neutral strategy, earning from market volatility rather than price direction.

![](/blog/blog-8/image1.jpeg)

**64 vaults** opened across that period, with **21 unique depositors** and **128 SOL** in total deposits.

Net funding rates captured on Pacifica came to **$61.68**, with just over **$98K in total transaction volume** during this period.

Projected Net APR over the full period: **62.25%.**

![](/blog/blog-8/image2.jpeg)

![](/blog/blog-8/image3.jpeg)

Vault states, transactions and settlements are on-chain and verifiable.

---

## Closing Round 1

Round 1 closed on August 2. A truly productive period with many challenges and a few market scenarios where we stress tested our risk engine, workflows and overall efficiency.

Every vault settled automatically, as we tested both our emergency exit safety triggers and automatic claim triggers, and every tester received their principal deposit and realized yield, minus the 11% service fee on yield (we made our first protocol revenue of **1.51 SOL**). As well, 50% of vault creation fees were refunded, as stated from the start, and we will keep this creation fee redemptions onwards.

Full-or-nothing settlement. No partial state, no ambiguity.

We are grateful for every single tester that joined us during this round, w/ thanks to **Dean** (Blueshift), **Peak** (MagicBlock), **Tony** (Epicentral), **Apollo Surfer** (Range), for their valuable feedback and support.

---

## What Changed in Round 2

Liquidity Provision was part of the yield strategy in Round 1. Going into Round 2, that is no longer the case.

Each risk mode now has defined deposit limits:

- Safe: 6 to 1,111 SOL
- Conservative: 6 to 1,111 SOL
- Balanced: 8 to 1,111 SOL
- Optimistic: 11 to 1,112 SOL
- Aggressive: 9 to 1,111 SOL
- YOLO: 8 to 1,111 SOL

This is not a random decision, it is specifically set to ease the minimum operational thresholds of our underlying protocols used (_e.g. our short positions profit on Pacifica are captured in USDC and swapped to SOL, minimum amount required is $10_).

Testing on all six strategies began immediately after Round 1 closed. The team took the time needed to get this right before opening anything. The backend running Round 2 is using the latest stable version of our risk engine, with more safety triggers added and layered security checks.

This is the same version that will be audited, basically an early usage opportunity with improved returns.

---

## Where We Are

Round 2 is in internal testing, with current vaults admin-operated and open only to our previous Round 1 testers, and few more that requested access.

![](/blog/blog-8/image4.jpeg)

**98 SOL** in TVL, with **3.08% realized yield over deposits** across approximately **8 days** of production.

All-time realized yield across all strategies since private beta launch stands at **12.28 SOL**.

_The risk engine is being improved across all six strategies, and the 1:1 customer service commitment remains unchanged._

---

See you next week.
