import { FontAwesome } from "@expo/vector-icons";
import { Platform, StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "../Themed";

type SearchHeaderProps = {
  value: string 
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onSearch: (text:string)=>void
}

export const SearchHeader:React.FC<SearchHeaderProps> = ({ value, placeholder, onSearch, containerStyle, textStyle })=> {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({ light: "#0008"}, 'text',);
  const bgColor = useThemeColor({}, 'panel');
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginTop: top }, containerStyle]}>
      <View style={[styles.inputWrapper, { backgroundColor: bgColor }]}>
        <FontAwesome name="search" size={24} color={iconColor} style={styles.icon} />
        <TextInput 
          style={[styles.text, {color: textColor}, textStyle]} 
          onChangeText={onSearch} 
          value={value} 
          placeholder={placeholder}
          placeholderTextColor={`${textColor as string}88`}
        />
        {value ? <FontAwesome name="close" size={24} color={iconColor} style={styles.icon} onPress={()=>onSearch("")}/> : null}
      </View> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom:6,
    paddingHorizontal:12,
    flexDirection:"row",
    alignItems:"center",
  },
  inputWrapper:{
    flex:1,
    flexDirection:"row",
    borderRadius:18,
    paddingVertical: Platform.OS === "ios" ? 6: 0,
    paddingHorizontal:12,
    alignItems:"center",
  },
  text: { flex:1 },
  icon:{ marginRight: 6 }
});
