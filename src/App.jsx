import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import HomePage from "./components/HomePage";
export default function App() {
  window.shop = new URL(location).searchParams.get("shop");
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <HomePage />
        </MyProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
// "scripts": {
// "build": "npm run build:client",
// "build:client": "vite build --outDir dist/client",
// "debug": "node --inspect-brk server/index.js",
// "dev": "cross-env NODE_ENV=development nodemon server/index.js --watch ./server",
// "prepare": "husky install",
// "preserve": "npm run build",
// "serve": "cross-env NODE_ENV=production node server/index.js",
// "start": "npm run serve",
// "test": "vitest --reporter=verbose"
// },

// Heroku env live
// SHOPIFY_API_KEY=5cea00a85b27e38fbac46ff5ad66314e
// SHOPIFY_API_SECRET=aece88969f9621f7c5510d488f0307cc
// SHOP=dynamic-content-liveheroku.myshopify.com
// SCOPES=write_products,write_customers,write_draft_orders
// HOST=https://469f-2405-201-200c-69d7-2dff-fe26-fe38-8acc.ngrok.io
// mongo_srv=mongodb+srv://hackathon:appmixo123@cluster0.wzlae.mongodb.net/live-heroku-dynamic?retryWrites=true&w=majority
// SHOPIFY_API_VERSION=2022-07

// localhost env
// SHOPIFY_API_KEY=964ed8769221472c81e90a4e21284fa7
// SHOPIFY_API_SECRET=0be4c58c2e40d4b7ba559037b59e9d75
// SHOP=dynamic-content-liveheroku.myshopify.com
// SCOPES=write_customers
// HOST=https://b904-2405-201-200c-69d7-74bb-1166-1fd6-de10.ngrok.io
// mongo_srv=mongodb+srv://hackathon:appmixo123@cluster0.wzlae.mongodb.net/live-heroku-dynamic?retryWrites=true&w=majority
// SHOPIFY_API_VERSION=2022-07
