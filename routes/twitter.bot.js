// Twitter API init
const TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
});

const callbackURL = "http://127.0.0.1:5000/faxnow-app/us-central1/callback";

// STEP 1 - Auth URL
router.get("/auth-url", async (req, res, next) => {
  try {
    const url = await twitterClient.generateAuthUrl(callbackURL);
    res.redirect(url);
  } catch (error) {
    next(error);
  }
});

