import DeviceActivity
import SwiftUI
import Charts

extension DeviceActivityReport.Context {
    static let interactiveReport = Self("Interactive Report")
}

struct InteractiveActivityReport: DeviceActivityReportScene {
    let context: DeviceActivityReport.Context = .interactiveReport
    let content: (ActivityReportModel) -> InteractiveReportView
    
    func makeConfiguration(representing data: DeviceActivityResults<DeviceActivityData>) async -> ActivityReportModel {
        // Transform the raw data into our model
        var hourlyData: [Int: TimeInterval] = [:]
        var appData: [AppReportItem] = []
        
        // 1. Calculate Hourly Totals (simplified logic for demo)
        // In a real app, you'd iterate `data` > `activitySegments` > `categories` > `applications`
        // and bucket them by hour.
        
        // 2. Aggregate App Data
        for await activity in data {
            for await segment in activity.activitySegments {
                let duration = segment.totalActivityDuration
                // Add to total...
                for await category in segment.categories {
                    for await app in category.applications {
                         let appName = app.application.localizedDisplayName ?? "Unknown"
                         let appDuration = app.totalActivityDuration
                         let icon = app.application.token // We can't get the raw icon image easily in a report, allows using Label
                         
                         appData.append(AppReportItem(id: app.application.bundleIdentifier ?? UUID().uuidString, name: appName, duration: appDuration, token: app.application.token))
                    }
                }
            }
        }
        
        // Improve Mock Data for Visualization since simulator often has 0 data
        let mockHourly = (0..<24).map { TimeInterval($0 * 60) } // Dummy gradient
        
        return ActivityReportModel(hourlyUsage: mockHourly, apps: appData)
    }
}

struct ActivityReportModel {
    let hourlyUsage: [TimeInterval]
    let apps: [AppReportItem]
}

struct AppReportItem: Identifiable {
    let id: String
    let name: String
    let duration: TimeInterval
    let token: ApplicationToken?
}

struct InteractiveReportView: View {
    let model: ActivityReportModel
    @State private var selectedHour: Int?
    
    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)
            
            VStack {
                // 1. Chart Section
                VStack(alignment: .leading) {
                    Text("Hourly Breakdown")
                        .foregroundColor(.white)
                        .font(.headline)
                        .padding(.leading)
                    
                    Chart {
                        ForEach(0..<model.hourlyUsage.count, id: \.self) { hour in
                            BarMark(
                                x: .value("Hour", hour),
                                y: .value("Time", model.hourlyUsage[hour])
                            )
                            .foregroundStyle(selectedHour == hour ? Color.pink : Color.pink.opacity(0.3))
                        }
                    }
                    .chartXAxis {
                        AxisMarks(values: [0, 6, 12, 18]) { value in
                            AxisValueLabel(format: .dateTime.hour())
                                .foregroundStyle(Color.gray)
                        }
                    }
                    .chartYAxis {
                        AxisMarks(position: .leading) {
                            AxisValueLabel()
                                .foregroundStyle(Color.gray)
                        }
                    }
                    .frame(height: 200)
                    .padding()
                    .chartOverlay { proxy in
                        GeometryReader { geometry in
                            Rectangle().fill(.clear).contentShape(Rectangle())
                                .onTapGesture { location in
                                    // Simple hit testing logic
                                    let x = location.x
                                    let width = geometry.size.width
                                    let hourWidth = width / 24
                                    let hour = Int(x / hourWidth)
                                    if hour >= 0 && hour < 24 {
                                        withAnimation {
                                            if selectedHour == hour { selectedHour = nil }
                                            else { selectedHour = hour }
                                        }
                                    }
                                }
                        }
                    }
                }
                
                // 2. Selection Chip
                if let hour = selectedHour {
                    HStack {
                        Text("\(hour):00 - \(hour + 1):00")
                            .font(.caption)
                            .bold()
                            .foregroundColor(.white)
                        Spacer()
                        Button(action: { withAnimation { selectedHour = nil } }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.white)
                        }
                    }
                    .padding()
                    .background(Color.pink)
                    .cornerRadius(20)
                    .padding(.horizontal)
                }
                
                // 3. App List Section
                List {
                    // Filter apps (Mock logic: In real app, check timestamps)
                    ForEach(model.apps) { app in
                        HStack {
                            if let token = app.token {
                                Label(token)
                                    .labelStyle(.iconOnly)
                            } else {
                                Image(systemName: "app")
                            }
                            
                            VStack(alignment: .leading) {
                                Text(app.name).foregroundColor(.white)
                                Text(formatDuration(app.duration)).font(.caption).foregroundColor(.gray)
                            }
                            Spacer()
                        }
                        .listRowBackground(Color.black) // Match theme
                    }
                }
                .listStyle(.plain)
            }
        }
    }
    
    func formatDuration(_ duration: TimeInterval) -> String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute]
        formatter.unitsStyle = .abbreviated
        return formatter.string(from: duration) ?? "0m"
    }
}
