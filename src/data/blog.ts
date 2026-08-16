export type BlogPost = {
  title: string;
  link: string;
  tag: string;
  date: string;
  image?: string;
  imageFit?: 'cover' | 'contain';
};

export const blogPosts: BlogPost[] = [
  {
    title: 'Week 3 at Thaler',
    link: 'https://x.com/ThalerFinance/status/2073414712776401262',
    tag: 'Weekly Update',
    date: '2026-07-04',
    image: '/ArticleHeaders/Week3.png',
  },
  {
    title: 'Week 2 at Thaler',
    link: 'https://x.com/ThalerFinance/status/2070915629058863429',
    tag: 'Weekly Update',
    date: '2026-06-27',
    image: '/ArticleHeaders/Week2.png',
  },
  {
    title: 'Week 1 at Thaler',
    link: 'https://x.com/ThalerFinance/status/2068337196172738692',
    tag: 'Weekly Update',
    date: '2026-06-20',
    image: '/ArticleHeaders/Week1.png',
  },
  {
    title: 'The yield that grows when SOL price is falling',
    link: 'https://x.com/ThalerFinance/status/2066885870905708617',
    tag: 'Private Beta Launch',
    date: '2026-06-16',
    image: '/ArticleHeaders/Article-1.png',
  },
];
