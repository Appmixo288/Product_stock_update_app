// import express from "express";
// import { Shopify, DataType } from "@shopify/shopify-api";
// import "dotenv/config";
// import applyAuthMiddleware from "../../middleware/auth.js";
// import verifyRequest from "../../middleware/verify-request.js";
// const app = express();
// const router = express.Router();
// app.use(express.json());
// applyAuthMiddleware(app);

// import axios from "axios";
// import { isIframeModal } from "@shopify/app-bridge/actions/Modal/index.js";
// const QuerySku = async (sku) => {
//   return `query MyProductVariants {
//     productVariants(first: ${1}, query: "${sku}") {
//       edges {
//         node {
//           id
//           sku
//           inventoryItem {
//             id
//             inventoryLevels(first: ${1}, query: "${sku}") {
//               edges {
//                 node {
//                   id
//                   location {
//                     id
//                   }
//                   available
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }`;
// };
// const QuerySkuiid = async (id) => {
//   return `query getInventoryItemByID {
//     inventoryItem( id: "${id}") {
//       id
//       inventoryLevels(first: 6) {
//         edges {
//           node {
//             id
//             available
//             location {
//               id
//             }
//           }
//         }
//       }
//     }
//   }`;
// };
// const QueryUpdate = async (info) => {
//   return `query M(
//     $inventoryItemId: ID!
//     $locationId: ID!
//     $available: Int
//   ) {
//     inventoryActivate(
//       inventoryItemId: ${info.inventory_item_id}
//       locationId: ${info.location_id}
//       available: ${info.available}
//     ) {
//       inventoryLevel {
//         id
//         available
//         item {
//           id
//         }
//         location {
//           id
//         }
//       }
//     }
//   }`;
// };
// const graphql_URL = `https://${process.env.SHOP}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
// const inventory_levels_URL = `https://${process.env.SHOP}/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`;
// const configData = async (url, data, token, status) => {
//   return {
//     method: "post",
//     url: url,
//     headers: {
//       "Content-Type": status ? "application/graphql" : "application/json",
//       "X-Shopify-Access-Token": `${token}`,
//     },
//     data: data,
//   };
// };
// const callGraphql = async (test_session, info) => {
//   try {
//     console.log("GraphqlUrl");

//     const client = new Shopify.Clients.Graphql(shop, accessToken);
//     const data = await client.query({
//       data: {
//         query: `mutation M(
//                     $inventoryItemId: ID!
//                     $locationId: ID!
//                     $available: Int
//                   ) {
//                     inventoryActivate(
//                       inventoryItemId: $inventoryItemId
//                       locationId: $locationId
//                       available: $available
//                     ) {
//                       inventoryLevel {
//                         id
//                         available
//                         item {
//                           id
//                         }
//                         location {
//                           id
//                         }
//                       }
//                     }
//                   }`,
//         variables: {
//           inventoryItemId: info.inventory_item_id,
//           locationId: info.location_id,
//           available: info.available,
//         },
//       },
//     });
//     console.log("inventoryItem : DATA : ", JSON.stringify(data));
//   } catch (e) {
//     console.log("Error : ", e.message);
//   }
// };
// const getLocationArray = async (token, info) => {
//   try {
//     const config = await configData(
//       graphql_URL,
//       await QuerySkuiid(
//         `gid://shopify/InventoryItem/${info.inventory_item_id}`
//       ),
//       token,
//       1
//     );
//     const response = await axios(config);
//     if (
//       response.data &&
//       response.data.data.inventoryItem.inventoryLevels.edges[0]
//     ) {
//       const res_data = response.data.data.inventoryItem.inventoryLevels.edges[0]
//         ? response.data.data.inventoryItem.inventoryLevels.edges[0].node
//         : "";

//       return Promise.resolve({
//         inventory_item_id:
//           "gid://shopify/InventoryItem/" + info.inventory_item_id,
//         location_id: res_data.location.id,
//         available: info.quantity,
//       });
//     } else {
//       console.log(
//         "inventory_item_id not found this inventory_item_id : ",
//         info.inventory_item_id
//       );
//       return Promise.resolve(false);
//     }
//   } catch (error) {
//     console.log("getLocationArray error : ", error.message);
//     return Promise.reject(error);
//   }
// };
// const Update_Inventory_Levels = async (token, data) => {
//   try {
//     console.log("inventory_levels_URL : ", inventory_levels_URL);
//     const config = await configData(
//       graphql_URL,
//       await QueryUpdate(data),
//       token,
//       1
//     );

//     console.log("config : ", config);
//     const response = await axios(config);
//     console.log("response", response.data);

//     return Promise.resolve(response);
//   } catch (error) {
//     console.log("Update_Inventory_Levels error : ", error.message);
//     return Promise.reject(false);
//   }
// };

// router.get("/get-all-products", verifyRequest(app), async (req, res) => {
//   try {
//     console.log("get-all-products calling .......");
//     let fData = [];

//     const session = await Shopify.Utils.loadCurrentSession(req, res, false);
//     // console.log(session);
//     const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
//     const product = await client.get({
//       path: `products`,
//     });
//     console.log(product.body.products.images);
//     const results = await product.body.products.map((product) => {
//       const pro_vari = product.variants;
//       pro_vari.map((pro) => {
//         fData.push({
//           variant_id: pro.id,
//           inventory_item_id: pro.inventory_item_id,
//           inventory_quantity: pro.inventory_quantity,
//           product_id: pro.product_id,
//           image_src: product?.images ? product?.images : [],
//           sku: pro.sku ? pro.sku : "undefined",
//           title: product.title ? product.title : "undefined",
//           status: product.status ? product.status : "undefined",
//           updated_at: new Date(pro.updated_at).getTime(),
//           price: pro.price ? pro.price : 0,
//           option1: pro.option1 ? pro.option1 : "undefined",
//         });
//       });
//     });
//     return res.status(200).send(
//       fData.sort(function (a, b) {
//         return b.updated_at - a.updated_at;
//       })
//     );
//   } catch (error) {
//     console.log("get-all-products error .......", error.message);
//     return res.status(500).json({ success: false, data: error.message });
//   }
// });

// router.post(
//   "/update_inventory_quantity",
//   verifyRequest(app),
//   async (req, res) => {
//     try {
//       let fData = [];
//       const session = await Shopify.Utils.loadCurrentSession(req, res, false);
//       console.log("update_inventory_quantity calling .......");
//       // console.log("req.body.data : ", session.accessToken);
//       const result = await getLocationArray(session.accessToken, req.body.data);
//       console.log("result : ", result);

//       // const final_result = await Update_Inventory_Levels(
//       //   session.accessToken,
//       //   result
//       // );
//       // console.log("final_result : ", final_result);
//       return res.status(200).send({ success: true });
//     } catch (error) {
//       console.log("update_inventory_quantity error .......", error);
//       return res.status(500).json({ success: false, data: error.message });
//     }
//   }
// );
// export default router;
import express from "express";
import { Shopify, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);

import axios from "axios";
const Queryid = async (id) => {
  return `query getInventoryItemByID {
    inventoryItem( id: "${id}") {
      id
      inventoryLevels(first: 6) {
        edges {
          node {
            id
            available
            location {
              id
            }
          }
        }
      }
    }
  }`;
};
const graphql_URL = `https://${process.env.SHOP}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
const inventory_levels_URL = `https://${process.env.SHOP}/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`;
const configData = async (url, data, token, status) => {
  return {
    method: "post",
    url: url,
    headers: {
      "Content-Type": status ? "application/graphql" : "application/json",
      "X-Shopify-Access-Token": `${token}`,
    },
    data: data,
  };
};

const getLocationArray = async (token, info) => {
  try {
    const config = await configData(
      graphql_URL,
      await Queryid(`gid://shopify/InventoryItem/${info.inventory_item_id}`),
      token,
      1
    );
    const response = await axios(config);
    if (
      response.data &&
      response.data.data.inventoryItem.inventoryLevels.edges[0]
    ) {
      const res_data = response.data.data.inventoryItem.inventoryLevels.edges[0]
        ? response.data.data.inventoryItem.inventoryLevels.edges[0].node
        : "";

      return Promise.resolve({
        inventory_item_id: info.inventory_item_id,
        location_id: res_data.location.id.split("Location/")[1],
        available: info.quantity,
      });
    } else {
      console.log(
        "inventory_item_id not found this inventory_item_id : ",
        info.inventory_item_id
      );
      return Promise.resolve(false);
    }
  } catch (error) {
    console.log("getLocationArray error : ", error.message);
    return Promise.reject(error);
  }
};
const Update_Inventory_Levels = async (token, data) => {
  try {
    console.log("inventory_levels_URL : ", inventory_levels_URL);
    const config = await configData(
      inventory_levels_URL,
      {
        location_id: data.location_id,
        inventory_item_id: data.inventory_item_id,
        available: data.available,
      },
      token,
      0
    );
    // console.log("config : ", JSON.stringify(config));
    const response = await axios(config);
    // console.log("response", response.data);

    return Promise.resolve(response);
  } catch (error) {
    console.log("Update_Inventory_Levels error : ", error.message);
    return Promise.reject(false);
  }
};

router.get("/get-all-products", verifyRequest(app), async (req, res) => {
  try {
    console.log("get-all-products calling .......");
    let fData = [];

    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const product = await client.get({
      path: `products`,
    });
    const c_date = new Date().getTime();
    const results = await product.body.products.map((product) => {
      const pro_vari = product.variants;
      pro_vari.map((pro, index) => {
        if (
          new Date(pro.updated_at).getTime() >=
            c_date - 1000 * 24 * 60 * 60 * 7 &&
          pro.inventory_quantity <= 0
        ) {
          fData.push({
            variant_id: pro.id,
            inventory_item_id: pro.inventory_item_id,
            inventory_quantity: pro.inventory_quantity,
            product_id: pro.product_id,
            image_src: product?.images ? product?.images : [],
            sku: pro.sku ? pro.sku : "undefined",
            title: product.title ? product.title : "undefined",
            status: product.status ? product.status : "undefined",
            updated_at: new Date(pro.updated_at).getTime(),
            price: pro.price ? pro.price : 0,
            option1: pro.option1 ? pro.option1 : "undefined",
          });
        }
      });
    });
    console.log(fData);
    return res.status(200).send(
      fData.sort(function (a, b) {
        return b.updated_at - a.updated_at;
      })
    );
  } catch (error) {
    console.log("get-all-products error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});

router.post(
  "/update_inventory_quantity",
  verifyRequest(app),
  async (req, res) => {
    try {
      let fData = [];
      const session = await Shopify.Utils.loadCurrentSession(req, res, false);
      console.log("update_inventory_quantity calling .......");
      const result = await getLocationArray(session.accessToken, req.body.data);
      console.log("result : ", JSON.stringify(result));
      const final_result = await Update_Inventory_Levels(
        session.accessToken,
        result
      );
      // console.log("final_result : ", JSON.stringify(final_result));
      return res.status(200).send({ success: true });
    } catch (error) {
      console.log("update_inventory_quantity error .......", error);
      return res.status(500).json({ success: false, data: error.message });
    }
  }
);
export default router;
