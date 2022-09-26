import mongoose from "mongoose";
import { APP_STATUS } from "../../../constants/index.js";

const ShopSchema = mongoose.Schema({
  shop: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    trim: true,
  },
  access_token: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  country_code: {
    type: String,
    trim: true,
    required: true,
  },
  country_name: {
    type: String,
    trim: true,
    required: true,
  },
  access_scope: {
    type: String,
    trim: true,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  domain: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  customer_email: {
    type: String,
    trim: true,
  },
  money_format: {
    type: String,
    trim: true,
    required: true,
  },
  currency: {
    type: String,
    trim: true,
    required: true,
  },
  timezone: {
    type: String,
    trim: true,
    required: true,
  },
  app_status: {
    type: String,
    trim: true,
    default: "installed",
    required: true,
    enum: Object.values(APP_STATUS),
  },
  zip: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  shop_owner: {
    type: String,
    trim: true,
  },
  emails: [
    {
      email: String,
      insertedAt: Number,
    },
  ],
});

const Shop = mongoose.model("country_wise_content_shops", ShopSchema);

export default Shop;
