/**
 * Builds the HLS playback URL for a live stream.
 * The provider key (NEXT_PUBLIC_LIVE_PROVIDER_KEY) is the base URL of the
 * streaming CDN (e.g. "https://stream.meetyoulive.net/live").
 * The full URL becomes: {providerKey}/{streamKey}/index.m3u8
 */
export const getStreamUrl = (streamKey) => {
  const providerKey = process.env.NEXT_PUBLIC_LIVE_PROVIDER_KEY;
  if (!providerKey || !streamKey) return null;
  return `${providerKey}/${streamKey}/index.m3u8`;
};
