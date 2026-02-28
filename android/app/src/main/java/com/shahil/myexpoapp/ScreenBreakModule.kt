package com.shahil.myexpoapp

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenBreakModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenBreak"
    }

    @ReactMethod
    fun setGrayscale(level: Float) {
        // Broadcast an intent to our Accessibility Service to update the grayscale level
        val intent = Intent("com.shahil.myexpoapp.SET_GRAYSCALE")
        intent.putExtra("level", level)
        reactContext.sendBroadcast(intent)
    }
}
