import axios from "axios";
import { getShopData } from "../../services/db/shop/shop.services.js";

export const appCheckoutUpdateWebhookHandler = async (topic, shop, body) => {
  const shop_data = await getShopData(shop);
  console.log(
    "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  const dd = JSON.parse(body);
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  const token = dd.token;
  var config = {
    method: "get",
    url: `https://${shop}/admin/api/2022-10/checkouts/${token}.json`,
    headers: {
      "X-Shopify-Access-Token": `${shop_data.access_token}`,
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  // console.log("topic :", topic);
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  console.log("shop :", shop);
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
};
