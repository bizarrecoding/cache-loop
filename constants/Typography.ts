import { StyleSheet } from "react-native";

export const Sizes = {
  header: 26,
  subheader: 20,
  title: 16,
  subtitle: 14,
  text: 12,
} 

export const txStyles = StyleSheet.create({
  header: {
    fontSize: Sizes.header,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: Sizes.subheader,
  },
  title:{
    fontSize: Sizes.title,
    fontWeight: "bold",
  },
  subtitle:{
    fontSize: Sizes.subtitle,
  },
  text:{
    fontSize: Sizes.text,
  }
});
