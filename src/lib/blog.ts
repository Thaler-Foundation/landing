import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  image: string;
  imagePosition?: string;
  content: string;
};

const dir = path.join(process.cwd(), 'src/content/blog');

const toDate = (value: unknown) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : String(value);

const plainExcerpt = (content: string) => {
  let excerpt = '';
  for (const block of content.split(/\n\s*\n/).map((b) => b.trim())) {
    if (!block) continue;
    if (/^(#|!\[|>|-{3,}|```|<|[-*] |\d+\. )/.test(block)) continue;
    const text = block
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ');
    excerpt = excerpt ? `${excerpt} ${text}` : text;
    if (excerpt.length > 400) break;
  }
  return excerpt;
};

function readPost(slug: string): BlogPost {
  const { data, content } = matter(fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8'));
  return {
    slug,
    title: data.title,
    date: toDate(data.date),
    tag: data.tag,
    excerpt: data.excerpt ?? plainExcerpt(content),
    image: data.image,
    imagePosition: data.imagePosition,
    content,
  };
}

export function getPosts() {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => readPost(file.replace(/\.md$/, '')))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function embedCard(slug: string) {
  if (!fs.existsSync(path.join(dir, `${slug}.md`))) return null;
  const post = readPost(slug);
  return `<a class="blog-embed" href="/blog/${slug}"><img src="${post.image}" alt="" loading="lazy"><span class="blog-embed-body"><span class="blog-embed-title">${escape(post.title)}</span><span class="blog-embed-excerpt">${escape(post.excerpt)}</span></span></a>`;
}

const videoPlayer = (src: string) => `<media-controller class="blog-video">
<video slot="media" src="${src}" playsinline preload="metadata"></video>
<media-play-button slot="centered-chrome" class="blog-video-center"></media-play-button>
<media-control-bar>
<media-play-button></media-play-button>
<media-mute-button></media-mute-button>
<media-time-range></media-time-range>
<media-time-display showduration></media-time-display>
<media-fullscreen-button></media-fullscreen-button>
</media-control-bar>
</media-controller>
`;

marked.use({
  renderer: {
    paragraph({ tokens }) {
      const [only] = tokens;
      if (tokens.length === 1 && only.type === 'link') {
        const tweet = only.href.match(/^https:\/\/(?:x|twitter)\.com\/\w+\/status\/(\d+)/)?.[1];
        if (tweet) return `<!--tweet:${tweet}-->`;
        const slug = only.href.match(/^\/blog\/([\w-]+)$/)?.[1];
        const card = slug && embedCard(slug);
        if (card) return card;
      }
      return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    },
    html({ text }) {
      const src = text.match(/^<video[^>]*\ssrc="([^"]+)"/)?.[1];
      return src ? videoPlayer(src) : text;
    },
    image({ href, text }) {
      return `<img src="${href}" alt="${text}" loading="lazy" decoding="async">`;
    },
    link({ href, tokens }) {
      const external = /^https?:\/\//.test(href)
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      return `<a href="${href}"${external}>${this.parser.parseInline(tokens)}</a>`;
    },
  },
});

export type PostPart = { html: string } | { tweet: string };

export function renderPost(post: BlogPost) {
  return marked
    .parse(post.content, { async: false })
    .split(/<!--tweet:(\d+)-->/)
    .map((part, i): PostPart => (i % 2 ? { tweet: part } : { html: part }));
}

export function formatPostDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  const month = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}
