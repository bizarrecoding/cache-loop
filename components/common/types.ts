import { SectionListData } from "react-native";

export type SectionListRenderHeader<ItemT, SectionT> = ((info: {
  section: SectionListData<ItemT, SectionT>;
}) => React.ReactElement | null)
| undefined;
