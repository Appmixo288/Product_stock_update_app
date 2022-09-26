import { uninstallShop } from "../../services/db/shop/shop.services.js";

export const appUninstallWebhookHandler = async (topic, shop, body) => {
  await uninstallShop(shop);
};
