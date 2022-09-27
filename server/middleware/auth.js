import { Shopify } from "@shopify/shopify-api";

import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";
import { registerWebhooks } from "../webhooks/index.js";
import {
  ShopifyShopServices,
  createShopifyRestClient,
  createShopifyGraphqlClient,
} from "../services/shopify/index.js";
import { DBShopServices } from "../services/db/index.js";
import { APP_STATUS } from "../constants/index.js";
export default function applyAuthMiddleware(app) {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(
        `/auth/toplevel?${new URLSearchParams(req.query).toString()}`
      );
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        host: req.query.host,
        query: req.query,
      })
    );
  });

  app.get("/auth/callback", async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );
      console.log("accessToken   :   ", session.accessToken);
      const host = req.query.host;

      //Register webhooks
      await registerWebhooks(session.shop, session.accessToken);

      //save shop data to db

      const restClient = createShopifyRestClient(
        session.shop,
        session.accessToken
      );

      const gqlClient = createShopifyGraphqlClient(
        session.shop,
        session.accessToken
      );

      // //GetShop data
      const {
        data: { shop },
      } = await ShopifyShopServices.getShopData(restClient);

      app.set(
        "active-shopify-shops",
        Object.assign(app.get("active-shopify-shops"), {
          [session.shop]: session.scope,
        })
      );

      await DBShopServices.addShopData({
        shop: session.shop,
        data: {
          ...shop,
          app_status: APP_STATUS.INSTALLED,
          access_token: session.accessToken,
          access_scope: session.scope,
        },
      });
      // all_delete_metafields(session);

      const dataShop = await DBShopServices.getShopData(session.shop);

      // Redirect to app with shop parameter upon auth
      res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e) {
      console.log(e);
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/auth?shop=${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
