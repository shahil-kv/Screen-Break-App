import Foundation
import React
import SwiftUI
import DeviceActivity

@objc(ScreenTimeReportViewManager)
class ScreenTimeReportViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        if #available(iOS 16.0, *) {
            let swiftUIView = ScreenTimeReportBridgeView()
            let hostingController = UIHostingController(rootView: swiftUIView)
            return hostingController.view
        } else {
            return UIView()
        }
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

@available(iOS 16.0, *)
struct ScreenTimeReportBridgeView: View {
    // Start with the Interactive Report Context
    @State private var context: DeviceActivityReport.Context = .init(rawValue: "Interactive Report")
    @State private var filter = DeviceActivityFilter(
        segment: .daily(during: Calendar.current.dateInterval(of: .day, for: .now)!)
    )
    
    var body: some View {
        DeviceActivityReport(context, filter: filter)
    }
}
