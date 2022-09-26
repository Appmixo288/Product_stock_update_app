export const STOREFRONT_ACCESS_TOKEN_CREATE = `
  mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
    storefrontAccessTokenCreate(input: $input) {
      storefrontAccessToken {
        accessToken
      }
    }
  }
`;
