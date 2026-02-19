import DeviceActivity
import SwiftUI

@main
struct DeviceActivityReportExtension: DeviceActivityReportExtension {
    var body: some DeviceActivityReportScene {
        // Register the Interactive Report
        InteractiveActivityReport { model in
            InteractiveReportView(model: model)
        }
    }
}
