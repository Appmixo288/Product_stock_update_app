import axios from "axios";
import { Shopify } from "@shopify/shopify-api";

export const createShopifyRestClient = (shop, accessToken) => {
  return axios.create({
    baseURL: `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}`,
    responseType: "json",
    headers: {
      "X-Shopify-Access-Token": accessToken,
    },
  });
};

export const createShopifyGraphqlClient = (shop, accessToken) =>
  new Shopify.Clients.Graphql(shop, accessToken);

export * as ShopifyShopServices from "./shop/shop.services.js";
