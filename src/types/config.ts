export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  socials: {
    discord?: string | null;
    xTwitter?: string | null;
  };
  docs?: string;
  dashboard: string;
  seekerApp?: string;
  background: string;
}
