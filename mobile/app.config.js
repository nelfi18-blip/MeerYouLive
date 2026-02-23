export default {
  expo: {
    name: "MeetYouLive",
    slug: "meetyoulive",
    version: "1.0.0",
    orientation: "portrait",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "net.meetyoulive.app",
    },
    android: {
      package: "net.meetyoulive.app",
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
    },
    extra: {
      API_URL: process.env.API_URL || "https://api.meetyoulive.net",
    },
  },
};
