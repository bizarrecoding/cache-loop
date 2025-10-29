import { Text as NativeText, TextProps as _TextProps, ColorValue } from 'react-native'
import React from 'react'
import { useThemeColor } from '../Themed';
import { txStyles } from '../../constants/Typography';

export type TextProps = _TextProps & {
  variant?: "header" | "subheader" | "title" | "subtitle" | "text";
  light?: ColorValue;
  dark?: ColorValue;
  color?: ColorValue;
  bold?: boolean;
};

export const Text: React.FC<TextProps> = (props) => {
  const {style, bold, children, color, light, dark, variant='text', ...rest} = props
  const textColor = useThemeColor({ light, dark }, "text");
  const baseStyle = txStyles[variant] || txStyles.text;
  return ( 
    <NativeText style={[baseStyle, {color: color ?? textColor}, style, bold ? {fontWeight:"bold"}:null]} {...rest}>{children}</NativeText> 
  )
}

