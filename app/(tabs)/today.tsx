import { useNavigation } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { RefreshControl, SectionList, SectionListRenderItem, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiringItem } from '@/components/Airing/AiringItem';
import { useAiring } from '@/components/Airing/hooks/useAiring';
import { Text } from '@/components/common/Text';
import { useThemeColor } from '@/components/Themed';
import { getDay } from '../../util/Date';

type FollowStatus = "Following" | "Planning" | "All";
type AiringMediaSection = {
  id: FollowStatus;
  data: AiringMedia[];
}

const Labels: Record<string, string|undefined> = {
  "CURRENT": "Following", 
  "All": "All"
}

const AiringFeed = () => {
  const { media, refetch, loading } = useAiring();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets()
  const bgColor = useThemeColor({}, "background");
  const sections = useMemo(()=>{
    if(!media) return [];
    const map =  media.reduce<Partial<Record<FollowStatus, AiringMediaSection>>>((acc, airing)=>{
      const { mediaListEntry }= airing.media;
      const key = mediaListEntry?.status as FollowStatus ?? "All";
      if(!acc[key]) {
        const baseSection = {id: key, data: [] as AiringMedia[]};
        acc[key] = baseSection;
      } 
      acc[key].data.push(airing);
      return acc;
    },{});
    return Object.values(map);
  },[media]);

  useEffect(()=>{
    navigation.setOptions({
      headerTitle:`Airing ${getDay(new Date())}`
    })
  },[navigation, top])
 
  const renderItem: SectionListRenderItem<AiringMedia> = ({item}) => { 
    return <AiringItem item={item}/>
  }
  return (
    <SectionList<AiringMedia, AiringMediaSection>
      sections={sections}
      renderSectionHeader={({section})=> <Text variant='subheader' bold style={[styles.headers, {backgroundColor:bgColor}]}>{Labels[section.id]?? section.id}</Text>}
      renderItem={renderItem}
      keyExtractor={item=>item.id+""}
      refreshing={loading}
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    />
  )
}

export default AiringFeed;

const styles = StyleSheet.create({
  container: { flex:1 },
  headers: { padding: 12 },
  title: { color:"white" }, 
  header: { flexDirection: "row", alignItems:"center", justifyContent:"center", padding:12, maxHeight: 120,paddingTop: 36},
  day: { flex:1, padding:12 }
}); 
