import { Property } from 'csstype';

// 基础样式属性类型
export interface BaseStyleProps {
  className?: string;
  style?: React.CSSProperties;
}

// 尺寸类型
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';

// 颜色类型
export type ColorScheme = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'white'
  | 'black'
  | 'transparent';

// 变体类型
export type Variant = 'solid' | 'outline' | 'ghost' | 'link' | 'subtle' | 'unstyled';

// 位置类型
export type Placement = 
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

// 对齐方式类型
export type Alignment = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

// 间距类型
export type Space = number | string;

// 响应式属性类型
export type ResponsiveValue<T> = T | Array<T | null> | { [key: string]: T };

// 主题配置类型
export interface ThemeConfig {
  colors: {
    [key in ColorScheme]: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  fontSizes: {
    [key in Size]: string;
  };
  fontWeights: {
    hairline: number;
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeights: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacings: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
  space: {
    [key: string]: string;
  };
  sizes: {
    [key: string]: string;
  };
  borders: {
    none: string;
    thin: string;
    normal: string;
    thick: string;
  };
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
  };
  zIndices: {
    hide: number;
    auto: string;
    base: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
  transitions: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    timing: {
      ease: string;
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

// 布局属性类型
export interface LayoutProps extends BaseStyleProps {
  m?: ResponsiveValue<Space>;
  mt?: ResponsiveValue<Space>;
  mr?: ResponsiveValue<Space>;
  mb?: ResponsiveValue<Space>;
  ml?: ResponsiveValue<Space>;
  mx?: ResponsiveValue<Space>;
  my?: ResponsiveValue<Space>;
  p?: ResponsiveValue<Space>;
  pt?: ResponsiveValue<Space>;
  pr?: ResponsiveValue<Space>;
  pb?: ResponsiveValue<Space>;
  pl?: ResponsiveValue<Space>;
  px?: ResponsiveValue<Space>;
  py?: ResponsiveValue<Space>;
  width?: ResponsiveValue<Property.Width>;
  height?: ResponsiveValue<Property.Height>;
  minWidth?: ResponsiveValue<Property.MinWidth>;
  maxWidth?: ResponsiveValue<Property.MaxWidth>;
  minHeight?: ResponsiveValue<Property.MinHeight>;
  maxHeight?: ResponsiveValue<Property.MaxHeight>;
  display?: ResponsiveValue<Property.Display>;
  verticalAlign?: ResponsiveValue<Property.VerticalAlign>;
  overflow?: ResponsiveValue<Property.Overflow>;
  overflowX?: ResponsiveValue<Property.OverflowX>;
  overflowY?: ResponsiveValue<Property.OverflowY>;
}

// Flex布局属性类型
export interface FlexProps extends LayoutProps {
  align?: ResponsiveValue<Property.AlignItems>;
  justify?: ResponsiveValue<Property.JustifyContent>;
  wrap?: ResponsiveValue<Property.FlexWrap>;
  direction?: ResponsiveValue<Property.FlexDirection>;
  basis?: ResponsiveValue<Property.FlexBasis>;
  grow?: ResponsiveValue<Property.FlexGrow>;
  shrink?: ResponsiveValue<Property.FlexShrink>;
  order?: ResponsiveValue<Property.Order>;
}

// Grid布局属性类型
export interface GridProps extends LayoutProps {
  templateColumns?: ResponsiveValue<Property.GridTemplateColumns>;
  templateRows?: ResponsiveValue<Property.GridTemplateRows>;
  templateAreas?: ResponsiveValue<Property.GridTemplateAreas>;
  gap?: ResponsiveValue<Space>;
  rowGap?: ResponsiveValue<Space>;
  columnGap?: ResponsiveValue<Space>;
  autoFlow?: ResponsiveValue<Property.GridAutoFlow>;
  autoRows?: ResponsiveValue<Property.GridAutoRows>;
  autoColumns?: ResponsiveValue<Property.GridAutoColumns>;
  row?: ResponsiveValue<Property.GridRow>;
  column?: ResponsiveValue<Property.GridColumn>;
  area?: ResponsiveValue<Property.GridArea>;
}

// 定位属性类型
export interface PositionProps extends LayoutProps {
  position?: ResponsiveValue<Property.Position>;
  top?: ResponsiveValue<Space>;
  right?: ResponsiveValue<Space>;
  bottom?: ResponsiveValue<Space>;
  left?: ResponsiveValue<Space>;
  zIndex?: ResponsiveValue<Property.ZIndex>;
}

// 背景属性类型
export interface BackgroundProps extends BaseStyleProps {
  bg?: ResponsiveValue<Property.Background>;
  bgColor?: ResponsiveValue<Property.BackgroundColor>;
  bgImage?: ResponsiveValue<Property.BackgroundImage>;
  bgSize?: ResponsiveValue<Property.BackgroundSize>;
  bgPosition?: ResponsiveValue<Property.BackgroundPosition>;
  bgRepeat?: ResponsiveValue<Property.BackgroundRepeat>;
  bgAttachment?: ResponsiveValue<Property.BackgroundAttachment>;
}

// 边框属性类型
export interface BorderProps extends BaseStyleProps {
  border?: ResponsiveValue<Property.Border>;
  borderWidth?: ResponsiveValue<Property.BorderWidth>;
  borderStyle?: ResponsiveValue<Property.BorderStyle>;
  borderColor?: ResponsiveValue<Property.BorderColor>;
  borderRadius?: ResponsiveValue<Property.BorderRadius>;
  borderTop?: ResponsiveValue<Property.BorderTop>;
  borderRight?: ResponsiveValue<Property.BorderRight>;
  borderBottom?: ResponsiveValue<Property.BorderBottom>;
  borderLeft?: ResponsiveValue<Property.BorderLeft>;
}

// 文字属性类型
export interface TypographyProps extends BaseStyleProps {
  fontFamily?: ResponsiveValue<Property.FontFamily>;
  fontSize?: ResponsiveValue<Property.FontSize | Size>;
  fontWeight?: ResponsiveValue<Property.FontWeight>;
  lineHeight?: ResponsiveValue<Property.LineHeight>;
  letterSpacing?: ResponsiveValue<Property.LetterSpacing>;
  textAlign?: ResponsiveValue<Property.TextAlign>;
  fontStyle?: ResponsiveValue<Property.FontStyle>;
  textTransform?: ResponsiveValue<Property.TextTransform>;
  textDecoration?: ResponsiveValue<Property.TextDecoration>;
}

// 组合样式属性类型
export type StyleProps = 
  & LayoutProps 
  & FlexProps 
  & GridProps 
  & PositionProps 
  & BackgroundProps 
  & BorderProps 
  & TypographyProps; 