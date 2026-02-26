export const getLiveProviderKey = () => {
  if (!process.env.NEXT_PUBLIC_LIVE_PROVIDER_KEY) {
    throw new Error("NEXT_PUBLIC_LIVE_PROVIDER_KEY is not set");
  }
  return process.env.NEXT_PUBLIC_LIVE_PROVIDER_KEY;
};
