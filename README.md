# AniList API Cache loop IN RN

A React Native implementation of AniList GraphQL API.
It follows [Pagination](https://docs.anilist.co/guide/graphql/pagination) to fetch Media within the season and AiringSchedules. Due to the default behavior of Apollo Client is replacing the Page contents and forcing the other Page queries to fetch again. Two queries using Page will trigger an uncontrolled loop until it reaches rate limit.

The following flag will change the base configuration behavior (loop) to a more stable behavior by stalling the nextFetchPolicy behavior of other Page queries.
  
```ts
// client/index.tsx
export const limitRefresh = true
```



## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo (Fastest to test and recommended for this project)
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

 
 