import React, { useCallback, useMemo } from 'react';
import { RefreshControl, SectionList, SectionListRenderItem, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/common/Text';
import { SectionListRenderHeader } from '@/components/common/types';
import { useSeason } from '@/components/Feed/hooks/useSeason';
import { SeasonalItem } from '@/components/Feed/SeasonalItem';
import { useThemeColor } from '@/components/Themed';
import { Labels } from '@/constants/Values';

type MediaFormat = {
  id: Format;
  data: Media[]
}

const SeasonFeed = () => {

  const bgColor = useThemeColor({}, "background"); 
  const { media, fetchMore, refetch, loading } = useSeason({ 
    season: "FALL",
    sort:'POPULARITY_DESC',
    year:2025, 
    allow_sequels: true, 
    allow_isekai: true
  });
  const { top } = useSafeAreaInsets()

  const sections = useMemo(()=>{
    if(!media) return [];
    const map =  media.reduce<Record<Format, MediaFormat>>((acc, media)=>{
      if(!acc[media.format]) {
        const baseSection = {id: media.format, data: [] as Media[]};
        acc[media.format] = baseSection;
      }
      acc[media.format].data.push(media);
      return acc;
    },{} as Record<Format, MediaFormat>);
    return Object.values(map);
  },[media]);

  const renderSection:SectionListRenderHeader<Media,MediaFormat> = ({section})=> (
    <Text variant='header' style={[styles.headers, { backgroundColor:bgColor}]}>{Labels[section.id]??section.id}</Text>
  );

  const renderItem: SectionListRenderItem<Media> = useCallback(({item}) => { 
    return <SeasonalItem item={item}/>
  },[]);
 
  return (
    <SectionList<Media, MediaFormat>
      sections={sections}
      keyboardShouldPersistTaps="handled"
      stickySectionHeadersEnabled
      renderSectionHeader={renderSection}
      renderItem={renderItem}
      keyExtractor={item=>item.id.toString()}
      onEndReached={fetchMore}
      refreshing={loading}
      style={[styles.container, {marginTop:top}]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    />
  )
};

export default SeasonFeed


const styles = StyleSheet.create({
  container: { flex:1 },
  headers: { padding: 8, paddingVertical:6 },
  title: { color:"white" },
  header: {  alignItems:"center", padding:12},
  pillWrapper:{
    flexDirection:"row", 
    alignItems:"center", 
    justifyContent:"space-between", 
    paddingHorizontal:8, 
    marginTop:6
  }
});
