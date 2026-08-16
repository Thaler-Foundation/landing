import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { getSEOTags } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Privacy Policy',
  description:
    'How Thaler collects, uses, and protects your information when you use thaler.finance.',
});

const sections: LegalSection[] = [
  {
    heading: '1. Information we collect',
    body: [
      'When you join the waitlist or request access, we collect the email address you provide and, optionally, the Solana wallet address you connect and any Discord or X handles you choose to link.',
      'We also collect limited, largely aggregated technical information about how the site is used, such as device and browser type and pages visited.',
    ],
  },
  {
    heading: '2. On-chain data',
    body: [
      'Vault creation and strategy activity occur on the Solana blockchain and are public by nature. Thaler does not control on-chain data and cannot alter or remove it. Your wallet remains self-custodial at all times.',
    ],
  },
  {
    heading: '3. How we use information',
    body: [
      'We use the information we collect to communicate with you about access and product updates, to operate and improve the website, to prevent abuse and fraud, and to comply with legal obligations.',
    ],
  },
  {
    heading: '4. How we share information',
    body: [
      'We do not sell your personal information. We share it only with service providers that help us operate the site, such as infrastructure, email, and analytics providers, and where required by law or to protect our rights.',
      'Identity verification and on-/off-ramping, where applicable, are handled by licensed third-party partners subject to their own privacy practices.',
    ],
  },
  {
    heading: '5. Cookies and analytics',
    body: [
      'We use cookies and similar technologies to keep the site working and to understand usage. You can control cookies through your browser settings, though some features may not function without them.',
    ],
  },
  {
    heading: '6. Data retention',
    body: [
      'We retain personal information for as long as needed to provide access and for legitimate business or legal purposes, after which it is deleted or anonymized.',
    ],
  },
  {
    heading: '7. Your rights',
    body: [
      'Depending on your location, you may have the right to access, correct, or delete the personal information we hold about you, and to object to or restrict certain processing. To exercise these rights, contact us using the details below.',
    ],
  },
  {
    heading: '8. Changes to this policy',
    body: [
      'We may update this policy from time to time. Material changes will be reflected by the "last updated" date above.',
    ],
  },
  {
    heading: '9. Contact',
    body: [
      'For privacy questions or requests, reach us on X at @ThalerFinance or through thaler.finance.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="This policy explains what information Thaler collects when you use thaler.finance, how we use it, and the choices you have."
      sections={sections}
    />
  );
}
