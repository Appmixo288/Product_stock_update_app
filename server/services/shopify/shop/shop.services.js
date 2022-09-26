import { STOREFRONT_ACCESS_TOKENS } from "../queries.js";
import { STOREFRONT_ACCESS_TOKEN_CREATE } from "../mutations.js";

export const getShopData = (client) => client.get("shop.json");

export const getStorefrontAccessToken = (gqlClient) =>
  gqlClient.query({ data: STOREFRONT_ACCESS_TOKENS });

export const createStorefrontAccessToken = (gqlClient) =>
  gqlClient.query({
    data: {
      query: STOREFRONT_ACCESS_TOKEN_CREATE,
      variables: {
        input: { title: "token" + Date.now() },
      },
    },
  });
