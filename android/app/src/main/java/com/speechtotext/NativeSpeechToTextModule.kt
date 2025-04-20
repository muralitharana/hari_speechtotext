package com.speechtotext

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.speechtotext.NativeSpeechToTextSpec
import java.util.Locale

class NativeSpeechToTextModule(reactContext: ReactApplicationContext) :
    NativeSpeechToTextSpec(reactContext), RecognitionListener {

    companion object {
        const val NAME = "NativeSpeechToText"
    }

    private var speechRecognizer: SpeechRecognizer? = null

    override fun getName() = NAME

    override fun startListeningSpeech() {
        Handler(Looper.getMainLooper()).post {
            Log.d(NAME, "Start Listening")

            if (!checkPermission()) {
                Log.e(NAME, "RECORD_AUDIO permission not granted at startListening")
                return@post
            }

            if (speechRecognizer == null) {
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactApplicationContext)
                speechRecognizer?.setRecognitionListener(this)
            }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
            intent.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
            )
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)

            speechRecognizer?.startListening(intent)
        }
    }

    override fun stopListeningSpeech() {
        Log.d(NAME, "Stop Listening")
        Handler(Looper.getMainLooper()).post {
            speechRecognizer?.stopListening()
        }
    }


    private fun checkPermission(): Boolean {
        Log.d(NAME, "Check Permission")
        return ActivityCompat.checkSelfPermission(
            reactApplicationContext, Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
    }

    // ============ RecognitionListener Methods ============
    override fun onReadyForSpeech(params: Bundle?) {
        Log.d(NAME, "onReadyForSpeech")
    }

    override fun onBeginningOfSpeech() {
        Log.d(NAME, "onBeginningOfSpeech")
    }

    override fun onRmsChanged(rmsdB: Float) {}

    override fun onBufferReceived(buffer: ByteArray?) {}

    override fun onEndOfSpeech() {
        Log.d(NAME, "onEndOfSpeech")
    }

    override fun onError(error: Int) {
        Log.e(NAME, "Speech recognition error: $error")
        sendResultToJS("error:$error")
    }

    override fun onResults(results: Bundle?) {
        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (!matches.isNullOrEmpty()) {
            sendResultToJS(matches[0])
        }
    }

    override fun onPartialResults(partialResults: Bundle?) {
        val result = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (!result.isNullOrEmpty()) {
            val partial = result[0]
            Log.d("SpeechRecognizer", "Partial result: $partial")

            // Optional: Send to JS side
            sendPartialResultToJS(partial)
        } else {
            Log.d("SpeechRecognizer", "No partial result")
        }
    }

    override fun onEvent(eventType: Int, params: Bundle?) {}

    // ============ React Native Communication ============
    private fun sendResultToJS(result: String) {
        val params = Arguments.createMap()
        params.putString("result", result)
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onSpeechResults", params)
    }

    private fun sendPartialResultToJS(result: String) {
        val params = Arguments.createMap()
        params.putString("partial", result)
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onSpeechPartialResults", params)
    }

    // ============ Clean Up ============
    fun destroy() {
        speechRecognizer?.destroy()
        speechRecognizer = null
    }

}
