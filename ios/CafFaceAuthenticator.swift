//
//  CafFaceLiveness.swift
//  cafbridge_faceliveness
//
//  Created by Lorena Zanferrari on 20/11/23.
//

import Foundation
import React
import FaceAuthenticator

@objc(CafFaceAuthenticator)
class CafFaceAuthenticator: RCTEventEmitter, FaceAuthSDKDelegate {
  static let shared = CafFaceAuthenticator()
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(startFaceAuthenticator:personId:config:)
  func startFaceAuthenticator(token: String, personId: String, config: String) {
    var configDictionary: [String: Any]? = nil
    var filter = Filter.lineDrawing;
    var cafStage = FaceAuthenticator.CAFStage.PROD
    var setLoadingScreen:Bool? = nil;
    var setExpiringTime:FaceAuthenticator.Time? = .threeHours;
    
    if let data = config.data(using: .utf8) {
      configDictionary = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
    }
    
    if let loadingScreen = configDictionary?["loadingScreen"] as? Bool {
      setLoadingScreen = loadingScreen
    }
    
    if let filterValue = configDictionary?["filter"] as? Int, let newFilter = Filter(rawValue: filterValue) {
      filter = newFilter
    }
    
    if let cafStageValue = configDictionary?["cafStage"] as? Int, let newCafStage = FaceLiveness.CAFStage(rawValue: cafStageValue) {
      cafStage = newCafStage
    }

    if let expiringTime = configDictionary?["imageUrlExpirationTime"] as? String, let newImageUrlExpirationTime = FaceLiveness.Time(rawValue: expiringTime){
      setExpiringTime = newImageUrlExpirationTime
    }
    
    let faceAuthenticator = FaceAuthSDK.Builder()
      .setStage(stage: cafStage)
      .setFilter(filter: filter)
      .setLoadingScreen(withLoading: setLoadingScreen!)
      .setCredentials(mobileToken: token, personId: personId)
      .setImageUrlExpirationTime(time: setExpiringTime!)
      .build()

      faceAuthenticator.delegate = self

      DispatchQueue.main.async {
        guard let currentViewController = UIApplication.shared.keyWindow!.rootViewController else { return }
        faceAuthenticator.startSDK(viewController: currentViewController)
      }
    }

  // FaceLiveness Events
  func didFinishLiveness(with faceAuthenticatorResult: FaceAuthenticator.FaceAuthenticatorResult) {
    let response : NSMutableDictionary = [:]
        response["data"] = faceAuthenticatorResult.signedResponse
        sendEvent(withName: "FaceAuthenticator_Success", body: response)
  }
  
  func didFinishWithFail(with faceAuthenticatorFailResult: FaceAuthenticator.FaceAuthenticatorFailResult) {
    let response : NSMutableDictionary = [:]
        response["message"] = faceAuthenticatorFailResult.description
        response["type"] = String(describing: faceAuthenticatorFailResult.failType)
        response["signedResponse"] = String(describing: faceAuthenticatorFailResult.signedResponse)
        sendEvent(withName: "FaceAuthenticator_Error", body: response)
  }
  
  func didFinishWithCancelled(with faceAuthenticatorResult: FaceAuthenticator.FaceAuthenticatorResult) {
    sendEvent(withName: "FaceAuthenticator_Cancel", body: true)
  }
  
  func didFinishWithError(with faceAuthenticatorErrorResult: FaceAuthenticator.FaceAuthenticatorErrorResult) {
    let response : NSMutableDictionary = [:]
        response["message"] = faceAuthenticatorErrorResult.description
        response["type"] = String(describing: faceAuthenticatorErrorResult.errorType)
        sendEvent(withName: "FaceAuthenticator_Error", body: response)
  }
  
  func openLoadingScreenStartSDK() {
    sendEvent(withName: "FaceAuthenticator_Loading", body: true)
  }
  
  func closeLoadingScreenStartSDK() {
    sendEvent(withName: "FaceAuthenticator_Loaded", body: true)
  }
  
  func openLoadingScreenValidation() {
    sendEvent(withName: "FaceAuthenticator_Loading", body: true)
  }
  
  func closeLoadingScreenValidation() {
    sendEvent(withName: "FaceAuthenticator_Loaded", body: true)
  }
  
  override func supportedEvents() -> [String]! {
    return [
      "FaceAuthenticator_Success",
      "FaceAuthenticator_Error",
      "FaceAuthenticator_Cancel",
      "FaceAuthenticator_Loading",
      "FaceAuthenticator_Loaded",
    ]
  }
}
