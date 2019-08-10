const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "D&K Blog", // <title>
  shortSiteTitle: "D&K Blog", // <title> ending for posts and pages
  siteDescription: "D&K Blog",
  siteUrl: "https://dnkdream.com",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "ko",
  // author
  authorName: "Kim HyunSung",
  authorTwitterAccount: "kokily",
  // info
  infoTitle: "D&K Blog",
  infoTitleNote: "Made by kokily",
  // manifest.json
  manifestName: "D&K Blog",
  manifestShortName: "D&K Blog", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "hkkokily5@gmail.com",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/kokily" },
    { name: "twitter", url: "https://twitter.com/kokily" },
    { name: "facebook", url: "http://facebook.com/hkkokily5" }
  ]
};
