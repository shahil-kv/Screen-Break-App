package com.shahil.myexpoapp

import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenBreakModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenBreak"
    }

    @ReactMethod
    fun setGrayscale(level: Float) {
        // First try the instant synchronous memory reference
        val service = ScreenBreakAccessibilityService.instance
        if (service != null) {
            service.setGrayscaleLevel(level)
        } else {
            // Fallback for edge cases where the service process is detached
            val intent = Intent("com.shahil.myexpoapp.SET_GRAYSCALE")
            intent.setPackage(reactContext.packageName)
            intent.putExtra("level", level)
            reactContext.sendBroadcast(intent)
        }
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: com.facebook.react.bridge.Promise) {
        try {
            var isEnabled = false
            val am = reactContext.getSystemService(android.content.Context.ACCESSIBILITY_SERVICE) as android.view.accessibility.AccessibilityManager
            val enabledServices = android.provider.Settings.Secure.getString(
                reactContext.contentResolver,
                android.provider.Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            val componentName = "${reactContext.packageName}/${ScreenBreakAccessibilityService::class.java.name}"
            
            if (enabledServices != null && enabledServices.contains(componentName)) {
                isEnabled = true
            }
            
            promise.resolve(isEnabled)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }
}

