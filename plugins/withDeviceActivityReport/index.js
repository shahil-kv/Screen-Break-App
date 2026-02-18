const { withXcodeProject, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const xcode = require('xcode');

const withDeviceActivityReportExtension = (config) => {
  return withXcodeProject(config, async (config) => {
    const projectPath = path.join(config.modRequest.projectRoot, 'ios', 'myexpoapp.xcodeproj', 'project.pbxproj');
    // Note: In managed workflow, the project name might be different. 
    // We strictly use the config.modRequest.platformProjectRoot if possible.
    
    // This is a simplified placeholder. Automating Target Creation is extremely complex and error-prone in a plugin without a robust library.
    // Instead of risking a broken project file, we will log a critical instruction.
    
    console.warn("---------------------------------------------------");
    console.warn("⚠️  Native Screen Time Integration (DeviceActivityReport) ⚠️");
    console.warn("Auto-generating the Extension Target is not fully supported in this script yet.");
    console.warn("Please run 'npx expo prebuild', open ios/my-expo-app.xcworkspace in Xcode,");
    console.warn("and add a 'Device Activity Report Extension' target named 'DeviceActivityReportExtension'.");
    console.warn("Then copy the Swift files from 'assets/ios/DeviceActivityReportExtension' to the new target.");
    console.warn("---------------------------------------------------");
    
    return config;
  });
};

module.exports = withDeviceActivityReportExtension;
