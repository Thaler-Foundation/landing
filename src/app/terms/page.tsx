import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { getSEOTags } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Terms and Conditions',
  description:
    'The terms governing your use of the Thaler protocol and website, including protocol mechanics and risk disclosures.',
});

const sections: LegalSection[] = [
  {
    heading: '1. The protocol',
    body: [
      'Thaler Finance is a non-custodial protocol on Solana executing a predefined, non-discretionary yield strategy through independent third-party venues. User funds remain self-custodied at all times.',
      'Displayed APR and APY reflect the strategy’s mechanics and prevailing third-party venue yields. They are estimates, not guarantees, and may change with market conditions.',
    ],
  },
  {
    heading: '2. Vaults and smart accounts',
    body: [
      'Each vault is an independent Squads Smart Account owned by the user’s wallet, with policies enforced on-chain by the Squads Policy Network (operated by Selimor Investments Limited). Vault operations are executed by Privy Agentic Wallets and Cloudflare Workers under the user’s pre-authorized on-chain policy.',
    ],
  },
  {
    heading: '3. Yield and settlement',
    body: [
      'Yield is generated on-chain by the strategy and accrues to your vault. When you claim, it settles directly to your wallet in SOL, in full or not at all, with no partial transfers.',
      'Displayed APR and APY are estimates based on strategy mechanics and prevailing third-party venue rates. They are not guarantees and may change with market conditions.',
    ],
  },
  {
    heading: '4. Wallets and signing',
    body: [
      'Wallet provisioning and transaction signing use Privy embedded wallets and Privy Agentic Wallets, operated by Privy, Inc. Embedded wallets are self-custodial with signing authority retained by the user; Agentic Wallets operate under user-authorized policies scoped to strategy operations and revocable at any time.',
    ],
  },
  {
    heading: '5. Transaction execution',
    body: [
      'Strategy transaction bundles are constructed off-chain in Cloudflare isolated Workers’ ephemeral, sandboxed environments that do not persist user keys. Bundles are submitted to Privy Agentic Wallets for signing strictly within the scope of the on-chain policy set at vault creation; Thaler holds no signing authority.',
    ],
  },
  {
    heading: '6. Risk disclosures',
    body: [
      'Digital assets are volatile and interacting with DeFi protocols carries significant risk, including the partial or total loss of deposited funds. Yields are variable and depend on third-party venues whose performance and availability are outside Thaler’s control.',
      'Nothing on this website or in the protocol constitutes financial, investment, legal, or tax advice. You are solely responsible for evaluating the risks and for your compliance with the laws and regulations applicable to you.',
    ],
  },
  {
    heading: '7. Eligibility',
    body: [
      'The protocol is not offered to persons or entities in jurisdictions where access would be unlawful, and certain features may require identity verification through licensed partners. By using the protocol you represent that you are permitted to do so under applicable law.',
    ],
  },
  {
    heading: '8. No warranty and limitation of liability',
    body: [
      'The protocol and website are provided on an "as is" and "as available" basis without warranties of any kind. To the maximum extent permitted by law, Thaler and its contributors are not liable for any losses arising from your use of the protocol, third-party venues, or on-chain activity.',
    ],
  },
  {
    heading: '9. Changes to these terms',
    body: [
      'We may update these terms from time to time. Material changes will be reflected by the "last updated" date above, and continued use of the protocol constitutes acceptance of the revised terms.',
    ],
  },
  {
    heading: '10. Contact',
    body: [
      'Questions about these terms can be directed to us on X at @ThalerFinance or through thaler.finance.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      updated="June 2026"
      intro="These terms govern your access to and use of the Thaler protocol and the thaler.finance website. By using the protocol you agree to them, including the risk disclosures below."
      sections={sections}
    />
  );
}
