package com.shahil.myexpoapp

import android.accessibilityservice.AccessibilityService
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import android.os.Build
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.graphics.PixelFormat
import android.view.Gravity

class ScreenBreakAccessibilityService : AccessibilityService() {

    private var overlayView: View? = null
    private var windowManager: WindowManager? = null
    private val overlayPaint = Paint()

    // Listen for Intents from ScreenBreakModule
    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == "com.shahil.myexpoapp.SET_GRAYSCALE") {
                val level = intent.getFloatExtra("level", 0f)
                setGrayscaleLevel(level)
            }
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        
        // Register the BroadcastReceiver
        val filter = IntentFilter("com.shahil.myexpoapp.SET_GRAYSCALE")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(receiver, filter)
        }

        setupOverlay()
    }

    private fun setupOverlay() {
        if (overlayView != null) return

        overlayView = object : View(this) {
            override fun onDraw(canvas: android.graphics.Canvas) {
                super.onDraw(canvas)
                // The Paint filter does the color math automatically using hardware acceleration
                // It filters everything drawn *behind* this view.
            }
        }.apply {
            isClickable = false
            isFocusable = false
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

        // We initially set it to completely transparent (no filter)
        setGrayscaleLevel(0f)
        
        try {
            windowManager?.addView(overlayView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun setGrayscaleLevel(level: Float) {
        if (overlayView == null) return

        // level = 0.0 (full color) to 1.0 (full grayscale)
        // Ensure values are clamped
        val boundedLevel = Math.max(0f, Math.min(1f, level))
        
        val colorMatrix = ColorMatrix()
        colorMatrix.setSaturation(1f - boundedLevel)

        overlayPaint.colorFilter = ColorMatrixColorFilter(colorMatrix)
        
        // To apply the filter to the screen, we set the view's layer type to hardware
        // and apply the paint to the entire layer.
        overlayView?.setLayerType(View.LAYER_TYPE_HARDWARE, overlayPaint)
        overlayView?.invalidate()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // We do not need to process specific events for grayscale
    }

    override fun onInterrupt() {
        // Required override, but nothing to do
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(receiver)
        if (overlayView != null) {
            windowManager?.removeView(overlayView)
            overlayView = null
        }
    }
}
