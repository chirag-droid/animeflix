import { GraphQLClient } from "graphql-request";
import { apiEndpoint } from "../constants";

const client = new GraphQLClient(apiEndpoint, { headers: {} })

export default client
