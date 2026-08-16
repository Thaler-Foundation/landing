export type RoadmapPeriodType = 'Q' | 'H' | 'Y';

export type RoadmapEventItem = {
  title: string;
  isChecked: boolean;
};

export type RoadmapEvent = {
  year: number;
  periodType: RoadmapPeriodType;
  periodNumber: number;
  isChecked: boolean;
  isActive?: boolean;
  events: RoadmapEventItem[];
};

export const roadmapEvents: RoadmapEvent[] = [
  {
    year: 2026,
    periodType: 'Q',
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: 'Finalize backtests', isChecked: true },
      { title: 'Protocol architecture', isChecked: true },
      { title: 'Documentation drafts', isChecked: true },
      { title: 'Landing Page v0', isChecked: true },
    ],
  },
  {
    year: 2026,
    periodType: 'Q',
    periodNumber: 2,
    isChecked: false,
    isActive: true,
    events: [
      { title: 'Building and testing', isChecked: true },
      { title: 'Colosseum Frontier submission', isChecked: true },
      { title: 'Monke Foundry Submission', isChecked: true },
      { title: 'Main DeFi protocols integration', isChecked: false },
      { title: 'Building community', isChecked: false },
      { title: 'Opening Private Beta (mainnet)', isChecked: true },
    ],
  },
  {
    year: 2026,
    periodType: 'Q',
    periodNumber: 3,
    isChecked: false,
    events: [
      { title: 'Private Beta, protocol improvements', isChecked: false },
      { title: 'Landing page v1 and UI overhaul', isChecked: false },
      { title: 'Additional DeFi protocols integration', isChecked: false },
      { title: 'Full metrics documentation, Whitepaper', isChecked: false },
      { title: 'Raising funds and pre-Launch partnerships', isChecked: false },
      { title: 'Mainnet launch (pre-deposits)', isChecked: false },
    ],
  },
  {
    year: 2026,
    periodType: 'Q',
    periodNumber: 4,
    isChecked: false,
    events: [
      { title: '[REDACTED] strategy addition', isChecked: false },
      { title: '[REDACTED] partnerships', isChecked: false },
      { title: '[REDACTED] campaigns', isChecked: false },
      { title: '[REDACTED] integrations', isChecked: false },
    ],
  },
];
