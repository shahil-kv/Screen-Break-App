import { requireNativeComponent, ViewProps } from 'react-native';

interface NativeScreenTimeReportProps extends ViewProps {
  // Add props here if needed, e.g. filter duration
}

// This matches the name exported in the Objective-C/Swift bridge
const ScreenTimeReportName = 'ScreenTimeReportView';

export const NativeScreenTimeReport = requireNativeComponent<NativeScreenTimeReportProps>(ScreenTimeReportName);
