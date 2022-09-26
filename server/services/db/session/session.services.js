import Session from "./session.model.js";

export const createOrUpdateSession = (session) =>
  Session.updateOne(
    { sessionId: session.id },
    {
      sessionData: JSON.stringify(session),
      accessToken: session.accessToken,
      shop: session.shop,
    },
    { upsert: true }
  );

export const getSession = (sessionId) => Session.findOne({ sessionId });

export const removeSession = (sessionId) =>
  Session.findOneAndRemove({ sessionId });

export const getAccessTokenByShop = (shop) =>
  Session.findOne({ shop }).select("accessToken").lean();
