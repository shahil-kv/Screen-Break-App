import DeviceActivity
import SwiftUI
import Charts

extension DeviceActivityReport.Context {
    // Context for the Total Activity Report
    static let totalActivity = Self("Total Activity")
}

struct TotalActivityReport: DeviceActivityReportScene {
    // Define which context your scene represents.
    let context: DeviceActivityReport.Context = .totalActivity
    
    // Define how to convert your data into the view's model.
    let content: (String) -> TotalActivityView
    
    func makeConfiguration(representing data: DeviceActivityResults<DeviceActivityData>) async -> String {
        // Reformat data into a simple string for demo (in production, pass structured data)
        // Accessing raw data here is allowed within the extension sandbox
        let totalDuration = data.flatMap { $0.activitySegments }.reduce(0) { $0 + $1.totalActivityDuration }
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute]
        formatter.unitsStyle = .abbreviated
        return formatter.string(from: totalDuration) ?? "0m"
    }
}

struct TotalActivityView: View {
    let totalActivity: String
    
    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)
            VStack {
                Text("Total Screen Time")
                    .font(.headline)
                    .foregroundColor(.white)
                Text(totalActivity)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
        }
    }
}
