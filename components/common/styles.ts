import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  center: { flex:1, justifyContent:"center", alignItems:"center" },
  row: {flex:1, flexDirection:"row", alignItems:"center", justifyContent:"space-around"},
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }, 
});
