import {
  enrichTweet,
  QuotedTweet,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInReplyTo,
  TweetMedia,
} from 'react-tweet';
import { getTweet } from 'react-tweet/api';

export async function XPost({ id }: { id: string }) {
  const data = await getTweet(id).catch(() => undefined);
  const href = `https://x.com/i/status/${id}`;

  if (!data) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        View post on X →
      </a>
    );
  }

  const tweet = enrichTweet(data);

  return (
    <div className="blog-tweet">
      <TweetContainer>
        <TweetHeader tweet={tweet} />
        {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
        <TweetBody tweet={tweet} />
        {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} /> : null}
        {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      </TweetContainer>
      <a
        href={tweet.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View post by @${tweet.user.screen_name} on X`}
        className="blog-tweet-link"
      />
    </div>
  );
}
