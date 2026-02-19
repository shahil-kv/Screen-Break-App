import Foundation
import FamilyControls
import ManagedSettings

@objc(ScreenTimeModule)
class ScreenTimeModule: NSObject {
    
    @objc
    func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            Task {
                do {
                    try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                    resolve(true)
                } catch {
                    reject("AUTH_ERROR", "Failed to request authorization", error)
                }
            }
        } else {
            reject("OS_VERSION", "Requires iOS 16.0+", nil)
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false // Runs on background thread
    }
}
