package com.caffaceauthenticator;

import android.content.Context;
import android.os.Bundle;

import javax.annotation.Nonnull;

import input.FaceAuthenticator;
import input.VerifyAuthenticationListener;
import output.FaceAuthenticatorResult;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import org.json.JSONException;

public class CafFaceAuthenticator extends ReactContextBaseJavaModule {
    private Context context;
    private String customConfig;

    CafFaceAuthenticator(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "CafFaceAuthenticator";
    }

    @ReactMethod
    public void startFaceAuthenticator(String token, String personId, String config) throws JSONException {
        customConfig = config;

        FaceAuthenticatorConfig formattedConfig = new FaceAuthenticatorConfig(customConfig);
        
        FaceAuthenticator faceAuthenticator = new FaceAuthenticator.Builder(token)
            .setStage(formattedConfig.cafStage)
            .setFilter(formattedConfig.filter)
            .setEnableScreenshots(formattedConfig.enableScreenshots)
            .setLoadingScreen(formattedConfig.loadingScreen)
            .setImageUrlExpirationTime(formattedConfig.imageUrlExpirationTime)
            .build();

        faceAuthenticator.authenticate(this.context, personId, new VerifyAuthenticationListener() {
            @Override
            public void onSuccess(FaceAuthenticatorResult faceAuthenticatorResult) {
                WritableMap writableMap = new WritableNativeMap();
                writableMap.putString("data", faceAuthenticatorResult.getSignedResponse());

                getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FaceAuthenticator_Success", writableMap);
            }

            @Override
            public void onError(FaceAuthenticatorResult faceAuthenticatorResult) {
                String message = "Error: " + faceAuthenticatorResult.getErrorMessage();
                String type = "Error";

                WritableMap writableMap = new WritableNativeMap();
                output.failure.SDKFailure sdkFailure = null;

                if (sdkFailure instanceof output.failure.NetworkReason) {
                    message = ("FaceAuthenticator " + "onError: " + " Throwable: " + ((output.failure.NetworkReason) faceAuthenticatorResult.getSdkFailure()).getThrowable());
                } else if (sdkFailure instanceof output.failure.ServerReason) {
                    message = ("FaceAuthenticator " + "onError: " + " Status Code: " + ((output.failure.ServerReason) faceAuthenticatorResult.getSdkFailure()).getCode());
                    message = message + " Status Message: " + faceAuthenticatorResult.getSdkFailure().getMessage();
                }

                writableMap.putString("message", message);
                writableMap.putString("type", type);

                getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FaceAuthenticator_Error", writableMap);
            }

            @Override
            public void onCancel(FaceAuthenticatorResult faceAuthenticatorResult) {
                getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FaceAuthenticator_Cancel", true);
            }

            @Override
            public void onLoading() {
                getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FaceAuthenticator_Loading", true);
            }

            @Override
            public void onLoaded() {
                getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FaceAuthenticator_Loaded", true);
            }
        });
    }
}