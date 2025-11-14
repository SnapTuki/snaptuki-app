import { authResolvers } from "./auth.resolvers";
import merge from 'lodash'

export const resolvers = merge(authResolvers)