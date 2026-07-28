import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const spacing = {
  base: moderateScale(4),
  xs: moderateScale(8),
  sm: moderateScale(12),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  containerMargin: moderateScale(20),
};

export const radius = {
  sm: moderateScale(2),
  default: moderateScale(4),
  md: moderateScale(6),
  lg: moderateScale(8),
  xl: moderateScale(12),
  full: 9999,
};