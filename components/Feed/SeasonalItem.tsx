import React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import { Text } from '../common/Text';
 
type SeasonalItemProps = {
  item: Media
};

export const SeasonalItem:React.FC<SeasonalItemProps> = ({ item }) => {
  const {title, nextAiringEpisode, coverImage, description,status} = item;
  const {width} = useWindowDimensions();
  return (
    <View style={{ flexDirection:"row", padding:12}}>
      <Image source={{uri: coverImage.large}} style={{width: width/3, height:180, }} />
      <View style={{paddingHorizontal:12, flex:1}}>
        <Text>{title?.english ?? title?.romaji}</Text>
        <Text>{status} - ep.{nextAiringEpisode?.episode ?? 0}</Text>
        <Text ellipsizeMode="tail" numberOfLines={6} style={{marginTop:12}}>{description}</Text>
      </View>
    </View>
  )
}