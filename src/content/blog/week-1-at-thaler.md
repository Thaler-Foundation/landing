---
title: Week 1 at Thaler
date: 2026-06-20
tag: Weekly Update
image: /blog/blog-2/header.jpeg
---

It was a good week. The kind where the thing you have been running quietly with your own money is finally ready to hand to other people.

Here is what we did.

## The strategy is no longer a secret

For four weeks we ran live vaults on Solana mainnet. Our capital. Our risk. We wanted to know the thing worked before we asked anyone to trust it.

Here is the problem we set out to solve. Almost every way to earn yield on Solana is a long position underneath. Staking. Lending. Liquidity. You earn while you hold and the price holds or rises. When SOL falls, the position falls with it, and the yield is rarely enough to cover the drop.

So the moment you most want a return, a falling market, is the moment these strategies pay the least. Sometimes they pay negative. Yield and protection end up on opposite sides of the same trade.

Thaler One separates them. A liquid staking position, a lending loop, and a short perpetual that hedges your principal, all working together inside one vault. The hedge keeps SOL's price from eroding what you put in. The funding and the loops earn while the market is calm or rising. And when SOL falls, the short books the move as profit, exactly when the long-based yields go quiet.

So the vault keeps earning whether SOL rises or falls. The principal stays neutral.

Over those four weeks the strategy returned more than 15 percent, measured in SOL, with most of it earned while SOL was falling. We wrote it all up this week: the strategy, the mechanics, the onchain proof. Then we published it.

[The yield that grows when SOL price is falling.](/blog/the-yield-that-grows-when-sol-price-is-falling)

We are careful about what that number means. Four weeks is a short window and the last one was unusually volatile. It is not an annual rate and it is not a forecast. In ordinary conditions the strategy targets the high single digits to the low twenties per year, depending on the risk tier. The 15 percent is what it did in this market, as proof of the conditions it is built for.

---

## The private beta opened on Monday

More than 50 people have claimed a spot and are waiting.

We are not turning them loose into the app. We are onboarding each one on a call. That is slower and it does not scale and we are doing it anyway. People are putting real money into a self-custodial vault. We want to sit with them, watch them set it up, hear the question they ask at the part that confuses them, and fix that part. There is no shortcut for this.

Your keys, your vault. The vault is a self-custodial smart account. The actions it is allowed to take are fixed onchain when you create it. You can claim your yield or close the vault whenever you want. We never hold your funds.

<video src="/blog/blog-2/video1.mp4" controls playsinline preload="metadata"></video>

## Two vaults, live

This week we opened two Thaler One vaults on mainnet. Four SOL between them. They are sitting at about 4.2 SOL today, up roughly 5 percent.

These are too new to read anything into, and we are not going to pretend otherwise. We open them, we point at them, and we let them run in the open so you can watch the system work in real time. That is the whole idea.

Here is where they stand, straight from the dashboard.

![](/blog/blog-2/image1.jpeg)

## Premium RPC, powered by [@triton_one](https://x.com/triton_one)

We moved to premium RPC powered by Triton.

This is the kind of thing you never see and always feel. When a vault rebalances or a hedge needs to move, it has to land fast and it has to land every time. Triton gives us the fast, reliable lane to the chain that a strategy like this depends on. Less waiting, fewer failed sends, execution you can count on.

---

## The smaller things

Everything stayed stable this week. We fixed the bugs we found. And we redesigned the landing page and the dashboard. The dashboard sits behind private access for now, for the people in the beta.

---

## No token, to be clear

We have not launched a token. There is no Thaler token, no presale, no airdrop. If you see one, it isn't us. The only things live are the vaults. If that ever changes, you'll hear it here first.

---

## Next Week

We start onboarding the first beta users, one call at a time. We keep the vaults running live on mainnet. We keep sharpening the parts of the flow that the calls show us are rough.

See you next week.
