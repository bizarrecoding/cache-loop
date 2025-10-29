import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { globalStyles } from '../common/styles';
import { Text } from '../common/Text';
import { useThemeColor } from '../Themed';
 
type AiringItemProps = {
  item: AiringMedia
};
 
export const AiringItem:React.FC<AiringItemProps> = ({ item }) => {
  const {title, coverImage } = item?.media ?? {};
  const {width} = useWindowDimensions();
  const bgColor = useThemeColor({}, "panel");
  return (
    <View style={[styles.card, globalStyles.shadow, {backgroundColor: bgColor, width: width-16}]}>
      <Image source={{uri: coverImage.large}} style={{width: width/6, height:90, }} />
      <View style={{ flex:1, paddingHorizontal:12, justifyContent:"space-evenly"}}>
        <Text>{title?.english ?? title?.romaji}</Text>
        <Text>Ep.{item?.episode ?? 0} in {item.timeUntilAiring/60} mins</Text>
      </View>
    </View>
  ) 
}

const styles = StyleSheet.create({
  card: { flex:1, flexDirection:"row", borderRadius:8, margin:8, overflow:"hidden" },
  cardInfo: { flex:1, paddingHorizontal:16, justifyContent:"space-evenly" },
});
