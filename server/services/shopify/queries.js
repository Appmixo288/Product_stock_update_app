export const STOREFRONT_ACCESS_TOKENS = `
  {
    shop {
      storefrontAccessTokens(first: 1) {
        edges {
          node {
            accessToken
          }
        }
      }
    }
  }
`;
