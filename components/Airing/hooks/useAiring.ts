import { GET_AIRING_TODAY } from '@/client/queries';
import { useQuery } from '@apollo/client/react';
import { useCallback, useMemo } from 'react';
import { limitRefresh } from '../../../client/client';

export type SORT = 'TIME' | 'TIME_DESC';

export type GetAiring = {
  Page: {
    airingSchedules: AiringMedia[];
    pageInfo: PageInfo
  }
}
type GetAiringInput = {
  airingAt_lesser: number;
  airingAt_greater: number;
  sort?: SORT[];
}

const none = [] as AiringMedia[];

const getDateInSeconds=(startOfDay=true)=>{
  const d = new Date();
  if(startOfDay) d.setHours(0,0,0,0);
  else d.setHours(23,59,59,999);
  return  Math.floor(d.getTime()/1000);
}

export const useAiring = () => {
  const variables: GetAiringInput = useMemo(()=>({
    airingAt_lesser: getDateInSeconds(false),
    airingAt_greater: getDateInSeconds(),
    sort: ['TIME_DESC'] as SORT[]
  }),[]);
  
  const {data, error, loading, refetch: _refetch} = useQuery<GetAiring,GetAiringInput>(GET_AIRING_TODAY,{
    variables,
    // FIXME: useQuery loops for unknown reasons, setting standby avoids remount fetch without clearing the data field 
    nextFetchPolicy: limitRefresh ? "standby": undefined
  }); 
  const media = useMemo(()=>{ 
    if(!data?.Page?.airingSchedules) return none;
    const c = [...data?.Page?.airingSchedules]
    .filter(m=>m.media.countryOfOrigin!=="CN" && !m.media.isAdult)
    .sort((a,b)=>{
      const { timeUntilAiring, media} = a
      const { timeUntilAiring: timeUntilAiring2, media: media2} = b
      if(media.mediaListEntry && !media2.mediaListEntry) return -1;
      if(!media.mediaListEntry && media2.mediaListEntry) return 1;

      if(Math.sign(timeUntilAiring)===Math.sign(timeUntilAiring2)) return timeUntilAiring-timeUntilAiring2;
      return timeUntilAiring>=0 ? -1 : 1;
    });
    return c ?? none;
  },[data]);
 
  const refetch = useCallback(async()=>{ 
    await _refetch({ 
      airingAt_lesser: getDateInSeconds(false),
      airingAt_greater: getDateInSeconds() 
    });
  },[_refetch]);

  return {
    page: data?.Page?.pageInfo,
    media,
    error,
    loading,
    refetch, 
  };
}
