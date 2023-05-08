const router = require("express").Router();
const {
  collection,
  setDoc,
  addDoc,
  doc,
  getDoc,
} = require("@firebase/firestore");
const { db } = require("../firebase");
// Twitter API init
const TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

const callbackURL =
  "https://spotify-build-ab932.firebaseapp.com/__/auth/handler";

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

// STEP 1 - Auth URL
router.get("/auth-url", async (req, res, next) => {
  try {
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
    );
    const docRef = doc(db, "twitter", state);
    // Save codeVerifier and state in firestore
    await setDoc(docRef, { codeVerifier, state });
    res.send({ url, codeVerifier, state });
  } catch (error) {
    next(error);
  }
});

// STEP 2 - Callback

router.get("/callback", async (req, res, next) => {
  try {
    const { state, code } = req.query;
    console.log(state);
    const docRef = doc(db, "twitter", state);
    const docSnap = await getDoc(docRef);

    const { codeVerifier } = docSnap.data();

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: callbackURL,
    });
    const { data } = await loggedClient.v2.me(); // start using the client if you want
    // set refresh token in firestore
    await setDoc(docRef, { refreshToken }, { merge: true });

    res.send({ accessToken, refreshToken, data });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// STEP 3 - Refresh tokens and post tweets

router.get("/tweet", async (req, res, next) => {
  try {
    const { refreshToken } = req.query;
    console.log(refreshToken);
    const {
      client: refreshedClient,
      accessToken,
      refreshToken: newRefreshToken,
    } = await twitterClient.refreshOAuth2Token(refreshToken);

    const { data } = await refreshedClient.v2.tweet(
      "Hello this is magesh working with tTwitter API v2!"
    );

    // set new refresh token in firestore


    res.send({ accessToken, newRefreshToken, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
