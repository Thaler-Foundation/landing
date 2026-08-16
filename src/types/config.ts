export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  socials: {
    discord?: string | null;
    xTwitter?: string | null;
  };
  docs?: string;
}
