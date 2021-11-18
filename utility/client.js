import { GraphQLClient } from "graphql-request";
import { ApiEndpoint } from "../constants";

const client = new GraphQLClient(ApiEndpoint, { headers: {} })

export default client
