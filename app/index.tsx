import { Redirect } from "expo-router";

export default function Index() {
  // avoids case where due to initial tab not been index, "/" is mapped to nowhere/+not-found
  return <Redirect href="/season" />;
}