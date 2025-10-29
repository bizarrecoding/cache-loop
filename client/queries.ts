import { gql } from '@apollo/client';
import { MEDIA_DETAILS, MEDIA_ENTRY, PAGE_INFO, RELATION_DETAILS } from './fragments';

export const GET_SEASON = gql`query getSeasonAnime(
	$season: MediaSeason,
	$year: Int,
	$format: MediaFormat,
	$excludeFormat: MediaFormat,
	$status: MediaStatus,
	$minEpisodes: Int,
	$page: Int,
  $sort: [MediaSort]
){
	Page(page: $page) {
		pageInfo {
			...PageInfoDetails
		}
		media(
			season: $season
			seasonYear: $year
			format: $format,
			format_not: $excludeFormat,
			status: $status,
			episodes_greater: $minEpisodes,
			isAdult: false,
			type: ANIME,
      countryOfOrigin: JP,
			sort: $sort
		) {
      ...BasicMediaDetails
      studios(isMain: true) {
        nodes {
          id
          name
          siteUrl
        }
      }
      nextAiringEpisode {
        id
        episode
        timeUntilAiring
        airingAt
      }
      mediaListEntry{
        ...MediaEntryDetails
      }
      relations{
        ...RelationDetails
      }
		}
	}
}
${PAGE_INFO}
${MEDIA_DETAILS}
${MEDIA_ENTRY}
${RELATION_DETAILS}
`;

export const GET_AIRING_TODAY = gql`query getAiringAnime(
  $airingAt_lesser: Int,
  $airingAt_greater: Int,
  $sort: [AiringSort]
){
  Page(page: 1) {
    pageInfo {
      ...PageInfoDetails
    }
    airingSchedules(
      sort: $sort, 
      airingAt_lesser: $airingAt_lesser,
      airingAt_greater:$airingAt_greater
    ) {
      id
      episode
      airingAt
      timeUntilAiring
      media {
        ...BasicMediaDetails
        mediaListEntry{
          ...MediaEntryDetails
        }
      }
    }
  }
}
${PAGE_INFO}
${MEDIA_DETAILS}
${MEDIA_ENTRY}
`;