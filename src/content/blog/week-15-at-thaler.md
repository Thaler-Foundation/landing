---
title: Week 15 at Thaler
date: 2026-09-26
tag: Weekly Update
image: /blog/blog-11/header.png
---

Last week, we said v1.1 was coming on September 24.

Today, it is live.

For the past fourteen weeks, Thaler has been running in real markets. During that time, we have collected data across different market conditions, watched how the strategy behaved with real capital, and learned where the system could make better use of the Solana ecosystem.

v1.1 brings those lessons back into the product.

The strategy now has more assets and venues to work with, while the Pulse Router chooses between them automatically based on profitability.

<video src="/blog/blog-11/video1.mp4" controls playsinline preload="metadata"></video>

Here is what changed.

---

## More Markets, More Flexibility

Over the past fourteen weeks, we have seen how much the conditions around a yield strategy can change.

- Different staking assets offer different yields.
- Lending markets move at different rates.
- Funding conditions across perpetual venues change over time.

**v1.1** gives Thaler access to more of those markets.

The strategy now works with a broader range of liquid staking tokens, lending markets and perpetual venues across Solana, giving it more options when deciding where capital should be deployed and how the position should be hedged.

The underlying idea remains the same. The vault is designed to earn from the yield available across these markets while keeping the strategy's exposure to the underlying asset controlled towards neutral.

The difference is that the engine now has a much larger part of the Solana ecosystem to work with.

![](/blog/blog-11/image1.jpeg)

This gives the strategy more options to work with as conditions change. Users still interact with a vault in the same simple way, while the strategy has a larger set of markets available underneath.

---

## The Staking Layer

The first part of the strategy is staking.

Staking tokens represent SOL that is being staked through different protocols. Each one can have different characteristics and yield at a given point in time.

With nine supported staking tokens, Thaler can evaluate a much broader part of the market when deciding where the strategy should allocate.

![](/blog/blog-11/image2.jpeg)

This is one of the main lessons from the first fourteen weeks. Giving the strategy more options can make it more adaptable to the conditions it is operating in.

---

## The Lending Layer

The next part is lending.

Once the strategy has its staking position, it can use supported lending markets to create the next part of the yield strategy.

v1.1 currently supports **Kamino and Jupiter Lend**, giving the system two lending environments to evaluate as it looks for available opportunities.

![](/blog/blog-11/image3.jpeg)

The important part for the user is that these decisions happen inside the strategy. There is no need to move funds between different applications or manually compare rates throughout the day.

---

## The Hedge

The final part is the hedge.

Perpetual markets allow the strategy to take an opposing position against the price exposure created elsewhere in the vault. This is what allows the overall strategy to remain focused on earning from the underlying yield and market conditions rather than relying on the price of SOL moving in one particular direction.

v1.1 supports **Pacifica, Phoenix and Bulk (currently in tests)** for this part of the strategy.

![](/blog/blog-11/image4.jpeg)

Together, these three layers form the strategy that runs underneath a Thaler vault. The user does not need to manage each layer individually. The strategy handles the allocation and hedging while the vault remains non-custodial and its rules remain enforced.

---

## Meet Pulse Router

More markets also mean more decisions for the strategy to make.

That is where the Pulse Router comes in.

Pulse evaluates the supported parts of the strategy and selects the available routes based on current conditions.

- For staking, it looks across the supported liquid staking tokens and evaluates their available yield.
- For lending, it compares the supported lending markets for the relevant borrow rates.
- For the hedge, it evaluates the available perpetual venues and their funding rates conditions.

The strategy can therefore work with a larger part of the Solana ecosystem without needing the user to waste time to monitor everything.

This is what we wanted v1.1 to achieve. The system has more room to operate while the experience for the person depositing into a vault stays straightforward.

---

## What the numbers look like after 15 weeks

We opened two new vaults this week, bringing the total to **18 active vaults**.

As of September 25:

- **184 SOL in TVL**, approximately $22K
- **20.22% TVL growth** over the past 30 days
- **14.72 SOL generated**, approximately $1.75K, across all strategies since launch
- **8.00% protocol return rate**, measured against TVL

These are live numbers from the protocol at this point in time. They will change as the strategies continue running, so we will keep publishing them alongside future updates.

![](/blog/blog-11/image5.jpeg)

---

## Shipping v1.1 from Bangkok

While v1.1 was coming together, we were also in Bangkok for **MagicBlock Founders Camp**.

Thaler is one of the 14 teams participating in the camp from September 21 to 30, alongside builders from across the Solana ecosystem, with MagicBlock, Solana Foundation and Superteam supporting the program.

It has been a useful environment for shipping. We have spent the week building alongside other founders, sharing what we are working on, and getting exposed to problems being solved across different parts of Solana.

A lot of the work behind v1.1 happened during this period, which made the timing particularly fitting.

https://x.com/magicblock/status/2102768883497365791

---

## Taking Thaler to more places

The next step is making the strategy available in more parts of the ecosystem.

We are building a version of Thaler for the **Seeker dApp Store**, with the first version now close to ready.

The goal is to bring the same non-custodial, market-neutral vault experience to a device built specifically for the Solana ecosystem.

We are also continuing to build through **Crypto World's Fair by Colosseum**, where we are exploring new applications for the infrastructure we have built and testing where market-neutral strategies can be useful beyond the current vaults.

![](/blog/blog-11/image6.jpeg)

---

## What comes next

v1.1 gives the strategy more markets to work with. Pulse Router gives it a way to navigate those markets as conditions change. Seeker gives us another way to bring the product to users, while Crypto World's Fair and our other experiments are opening up new directions for the underlying strategy.

There is a lot more we want to build from here.

We will keep sharing what we learn along the way.

**More soon.**
