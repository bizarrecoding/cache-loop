import { ApolloClient, ApolloLink, CombinedGraphQLErrors, defaultDataIdFromObject, HttpLink, InMemoryCache, InMemoryCacheConfig, InternalTypes, WatchQueryFetchPolicy } from "@apollo/client";
import { ErrorLink } from '@apollo/client/link/error';
import { ApolloProvider } from '@apollo/client/react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { print } from 'graphql/language/printer';
import React from 'react';

import { rateLimitingLink } from './tools/RateLimiter';

// ############# ONE STEP CHANGE #############
export const limitRefresh = true
// #######################################

const configurations = {
  client:{
    controlled:{
      dataIdFromObject(object: { __typename: string } & any) {
        if(object.__typename==="Page") {
          //const page = (object?.pageInfo as PageInfo | undefined)?.currentPage ?? '';
          if(object.media) return `PageMedia`;
          if(object.mediaList) return `PageMediaList`;
          if(object.airingSchedules) return `PageAiringSchedules`;
        }
        return defaultDataIdFromObject(object);
      }, 
      initialFetchPolicy: "cache-first" as WatchQueryFetchPolicy,
      nextFetchPolicy: (current: WatchQueryFetchPolicy,context: InternalTypes.NextFetchPolicyContext<any,any>)=>{
        // stalls query refetch to avoid hitting servers too often due to cache-induced re-render
        const {reason, initialFetchPolicy} = context
        // const operation = options.query.definitions.at(0) as ExecutableDefinitionNode
        // console.log(`🚀 ~ ${operation?.name?.value} ~ reason:`, reason);
        if(reason==="variables-changed") return initialFetchPolicy
        if(current==="network-only" || current==="cache-and-network") return "cache-first"
        return current
      },
    },
    uncontrolled:{
      // no changes to defaults
    }
  },
  cache: {
    controlled:{
      typePolicies: {
        Page: { 
          keyFields: false,
        },
      },
    },
    uncontrolled:{
      // no changes to defaults
    }
  } as Record<string,InMemoryCacheConfig> 
} 

const errorLink = new ErrorLink(({error, operation})=>{
  if(CombinedGraphQLErrors.is(error)){
    error.errors.forEach(({ message, locations, path, extensions }) => {
      const errorInfo = {
        type: 'GraphQL Error',
        message,
        locations,
        path,
        extensions,
        operation: operation.operationName,
        variables: operation.variables,
        query: print(operation.query),
        timestamp: new Date().toISOString()
      }

      console.error('🔴 GraphQL Error:', errorInfo);
    })
    return;
  }
  return;
})

const httpLink = new HttpLink({
  uri: 'https://graphql.anilist.co/',
});

const cache = new InMemoryCache({
  ...configurations.cache[limitRefresh ? "controlled":"uncontrolled"],  
});
 
export let client: ApolloClient;
 
export const cacheRehydrated = persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
  debug: __DEV__,
  trigger: 'background', 
}).then(() => {
  // cleans accumulated data that becomes obsolete overtime
  // else the cache will grow endlessly on continuous use.
  cache.gc()
}).catch((e)=>{
  console.warn('persistCache failed', e?.message ?? e);
}).finally(()=>undefined);

client = new ApolloClient({
  link: ApolloLink.from(__DEV__ ? [errorLink, rateLimitingLink, httpLink] : [errorLink, httpLink]),
  cache, 
  defaultOptions:{
    query:{
      errorPolicy: "all"
    },
    watchQuery:{
      errorPolicy: "all",
      ...configurations.client[limitRefresh ? "controlled":"uncontrolled"],     
    },
  },
  devtools:{ enabled: __DEV__ },
});

export const ApolloGQLProvider: React.FC<React.PropsWithChildren> = ({children})=>{
  return (
    <ApolloProvider client={client}>
     {children}
    </ApolloProvider>
  );
};

