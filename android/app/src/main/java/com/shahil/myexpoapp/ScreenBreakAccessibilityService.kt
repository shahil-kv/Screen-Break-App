package com.shahil.myexpoapp

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent

class ScreenBreakAccessibilityService : AccessibilityService() {

    private var overlayView: View? = null
    private var windowManager: WindowManager? = null

    companion object {
        // A static reference so the React Native module can call us instantly
        // without waiting for Android Intent Broadcasts.
        var instance: ScreenBreakAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d("ScreenBreak", "Accessibility Service Connected!")
        instance = this
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        
        setupOverlay()
    }

    private fun setupOverlay() {
        Log.d("ScreenBreak", "Setting up Overlay View...")
        if (overlayView != null) {
            return
        }

        overlayView = View(this).apply {
            isClickable = false
            isFocusable = false
            // Start fully transparent
            setBackgroundColor(android.graphics.Color.TRANSPARENT)
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) 
                WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY 
            else 
                WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
        }
        
        try {
            windowManager?.addView(overlayView, params)
            Log.d("ScreenBreak", "Overlay successfully added to WindowManager.")
        } catch (e: Exception) {
            Log.e("ScreenBreak", "Failed to add overlay view", e)
        }
    }

    fun setGrayscaleLevel(level: Float) {
        // Must run on the Main UI Thread since we are touching Views
        Handler(Looper.getMainLooper()).post {
            if (overlayView == null) return@post

            val boundedLevel = Math.max(0f, Math.min(1f, level))
            
            // True Grayscale requires Root on Android. 
            // Instead, we use a highly effective "Wash-out" tint overlay!
            // When level is 1.0, we draw a 75% opaque dark-gray box.
            // This instantly kills the vibrant colors of TikTok/Instagram, making them boring.
            
            val alphaInt = (boundedLevel * 0.75f * 255).toInt()
            // A neutral dark gray that washes out bright colors
            val color = android.graphics.Color.argb(alphaInt, 80, 80, 80)
            
            overlayView?.setBackgroundColor(color)
            Log.d("ScreenBreak", "Applied wash-out overlay with alpha: $alphaInt")
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}
    override fun onInterrupt() {}

    override fun onDestroy() {
        super.onDestroy()
        instance = null
        if (overlayView != null) {
            windowManager?.removeView(overlayView)
            overlayView = null
        }
    }
}
