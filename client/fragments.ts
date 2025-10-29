import { gql } from '@apollo/client';

export const PAGE_INFO = gql`
  fragment PageInfoDetails on PageInfo {
    currentPage
    hasNextPage
    lastPage
  }
`;

export const MEDIA_ENTRY = gql`
  fragment MediaEntryDetails on MediaList {
    id
    status
    progress
  }
`;

export const MEDIA_DETAILS = gql`
  fragment BasicMediaDetails on Media {
    id
    title {
      romaji
      native
      english
    }
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    countryOfOrigin
    status
    season
    format
    genres
    duration
    popularity
    episodes
    chapters
    averageScore
    siteUrl
    description
    bannerImage
    isAdult
    coverImage {
      extraLarge
      large
      color
    }
    trailer {
      id
      site
      thumbnail
    }
    externalLinks {
      site
      icon
      color
      url
    }
  } 
`;

export const RELATION_DETAILS = gql`
  fragment RelationDetails on MediaConnection {
    edges {
      id
      relationType
      node {
        id
        title {
          romaji
          native
          english
        }
        coverImage {
          extraLarge
          large
          color
        }
        format
        status
        episodes
        season
      }
    }
  }
`;