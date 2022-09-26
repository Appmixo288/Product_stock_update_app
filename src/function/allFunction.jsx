import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";
export const Get_All_Products = async (app) => {
  try {
    const token = await getSessionToken(app);
    console.log("Get_All_Products  calling ....");
    const response = await axios.get("/get-all-products", {
      headers: {
        Authorization: "Bearer " + token,
        "ngrok-skip-browser-warning": false,
      },
    });
    console.log("Get_All_Products  Successfull ....");
    // console.log("Product_update_qty : ", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    console.log("Get_All_Products  Error : ", error.message);
    return Promise.reject(error);
  }
};
export const Update_inventory_quantity = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("Update_inventory_quantity ....");
    const response = await axios.post(
      "/update_inventory_quantity",
      { data: info },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    // console.log("Update_inventory_quantity ....", response.data);
    // console.log("ADDED CONTENT : ", response);
    return Promise.resolve(response);
  } catch (error) {
    console.log("Update_inventory_quantity  error : ", error);

    return Promise.reject(error);
  }
};
