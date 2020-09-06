import { request, gql } from "graphql-request";

const gplQuery = gql`
  {
    assetRates {
      id
      name
      rate
      isFrozen
    }
  }
`;

const getSynPrice = () =>
  request(global._env_.REACT_APP_TOKEN_PRICE_API, gplQuery).catch(() => []);

export default getSynPrice;
