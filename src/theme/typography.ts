import { TextStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const typography: { [key: string]: TextStyle } = {
  headlineLgMobile: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    lineHeight: moderateScale(32),
    letterSpacing: -0.2,
  },
  headlineMd: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    lineHeight: moderateScale(28),
  },
  bodyLg: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    lineHeight: moderateScale(24),
  },
  bodySm: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    lineHeight: moderateScale(20),
  },
  labelCaps: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    lineHeight: moderateScale(16),
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  versionText: {
    fontSize: moderateScale(11),
    fontWeight: '400',
    lineHeight: moderateScale(14),
  },
};