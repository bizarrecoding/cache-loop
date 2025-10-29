import { useQuery } from '@apollo/client/react';
import { unionBy } from 'lodash';
import { useCallback, useMemo } from 'react';

import { GET_SEASON } from '@/client/queries';

export type SORT = 'FORMAT' | 'POPULARITY_DESC' | 'SCORE' | 'TITLE_ROMAJI';
export type GetSeason = {
  Page: {
    media: Media[];
    pageInfo: PageInfo
  }
}
type GetSeasonInput = {
  year: number;
  season: Season;
  page: number;
  format?: Format;
  excludeFormat?:Format
  sort?: SORT | SORT[]
}

const FormatSort = {
  TV:0,
  OVA:1,
  ONA:2,
  TV_SHORT:3,
  MOVIE:4,
}

const mediaHasPrequel = (m: Media, allow: boolean)=>{
  if(allow) return true;
  const hasPrequel =  m?.relations?.edges?.some(r=>r.relationType==="PREQUEL")
  return !hasPrequel
}
const mediaIsIsekai = (m: Media, allow: boolean)=>{
  if(allow) return true;
  const isIsekai = ["isekai","another world","reincarnated"].some(word=>{
    const title =  m?.title?.romaji?.toLowerCase()
    const desc = m?.description?.toLowerCase()
    return title?.includes(word) || desc?.includes(word)
  })
  // keep if false
  return !isIsekai
}

const none = [] as Media[];

export function useSeason({
  season,
  sort = "POPULARITY_DESC",
  year,
  allow_sequels,
  allow_isekai,
}: {
  season: Season;
  sort?: SORT;
  year: number;
  allow_sequels: boolean;
  allow_isekai: boolean;
}) {
  const variables: GetSeasonInput = useMemo(() => ({
    year,
    season,
    page: 1,
    excludeFormat: "MOVIE",
    sort: ["FORMAT", sort, "TITLE_ROMAJI"],
  }), [year, season, sort]);

  const {data, error, loading, refetch: _refetch, fetchMore: _fetchMore} = useQuery<GetSeason, GetSeasonInput>(GET_SEASON,{
    // FIXME: useQuery loops for unknown reasons, setting nextPolicy as standby/cache-only avoids
    // remount fetch without clearing the data field 
    variables,
  });

  // Combine data processing into a single memoized operation
  const processedData = useMemo(() => {
    if (!data?.Page?.media) return none;
    
    const filtered = data.Page.media.filter((s) => 
      mediaHasPrequel(s, allow_sequels) && 
      mediaIsIsekai(s, allow_isekai)
    ).sort((m1, m2) => {
      if (m1.format === m2.format) return 0;
      return FormatSort[m1.format] - FormatSort[m2.format] > 0 ? 1 : -1;
    });
    return filtered;
  }, [data?.Page?.media, allow_sequels, allow_isekai]);
   
  const fetchMore = useCallback(async function fetchMoreCallback () {
    if (!data?.Page?.pageInfo?.hasNextPage) return;
    try {
      await _fetchMore({
        variables: {
          ...variables,
          page: (data.Page.pageInfo.currentPage || 1) + 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult?.Page?.media?.length) return prev; 
          const prevMedia = prev.Page.media;
          const moreMedia = fetchMoreResult.Page.media;
          const media = unionBy(prevMedia, moreMedia, (a: {id:number}) => a.id);
          return {
            Page: {
              pageInfo: fetchMoreResult.Page.pageInfo,
              media
            }
          }; 
        }
      });
    } catch (e) {
      console.error("Error fetching more season media:", (e as Error)?.message);
    }
  }, [_fetchMore, variables, data?.Page?.pageInfo?.hasNextPage, data?.Page?.pageInfo?.currentPage]);

  const refetch = useCallback(async()=>{
    if(loading) return;
    await _refetch({
      year,
      season,
      page: 1,
      excludeFormat: "MOVIE"
    });
  },[_refetch, season, year, loading]);

  return {
    page: data?.Page?.pageInfo,
    media: processedData,
    error,
    loading,
    refetch,
    fetchMore,
  };
}
