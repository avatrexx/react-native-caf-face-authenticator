import { useState, useEffect } from "react";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";

import { module, moduleEventEmitter } from "../module";

import {
  FaceAuthenticatorOptions,
  FaceAuthenticatorResponse,
  FilterType,
  StageType,
  TimeType,
} from "../types";

const useFaceAuthenticator = (
  mobileToken: string,
  peopleId: string,
  options?: FaceAuthenticatorOptions
) => {
  const [response, setResponse] = useState<FaceAuthenticatorResponse>({
    result: null,
    error: null,
    cancelled: false,
    isLoading: false,
  });

  const defaultOptions: FaceAuthenticatorOptions = {
    cafStage: options?.cafStage ?? StageType.PROD,
    filter: options?.filter ?? FilterType.NATURAL,
    imageUrlExpirationTime:
      options?.imageUrlExpirationTime ?? TimeType.THIRTY_MIN,
    loadingScreen: options?.loadingScreen ?? false,
    enableScreenshots: options?.enableScreenshots ?? false,
  };

  const formattedOptions = (): string => {
    const formatToJSON = JSON.stringify({
      ...defaultOptions,
      filter: isAndroid
        ? FilterType[defaultOptions.filter!]
        : defaultOptions.filter,
      cafStage: isAndroid
        ? StageType[defaultOptions.cafStage!]
        : defaultOptions.cafStage,
      imageUrlExpirationTime: isAndroid
        ? TimeType[defaultOptions.imageUrlExpirationTime!]
        : defaultOptions.imageUrlExpirationTime,
    });

    return formatToJSON;
  };

  const startFaceAuthenticator = () =>
    module.startFaceAuthenticator(mobileToken, peopleId, formattedOptions());

  useEffect(() => {
    moduleEventEmitter.addListener("FaceAuthenticator_Success", (event) => {
      setResponse({
        result: event,
        error: null,
        cancelled: false,
        isLoading: false,
      });
    });

    moduleEventEmitter.addListener("FaceAuthenticator_Error", (event) => {
      setResponse({
        result: null,
        error: event,
        cancelled: false,
        isLoading: false,
      });
    });

    moduleEventEmitter.addListener("FaceAuthenticator_Cancel", (event) => {
      setResponse({
        result: null,
        error: null,
        cancelled: event,
        isLoading: false,
      });
    });

    moduleEventEmitter.addListener("FaceAuthenticator_Loading", (event) => {
      setResponse({
        result: null,
        error: null,
        cancelled: false,
        isLoading: event,
      });
    });

    moduleEventEmitter.addListener("FaceAuthenticator_Loaded", (event) => {
      setResponse({
        result: null,
        error: null,
        cancelled: false,
        isLoading: !event,
      });
    });

    return () => {
      moduleEventEmitter.removeAllListeners("FaceAuthenticator_Success");
      moduleEventEmitter.removeAllListeners("FaceAuthenticator_Error");
      moduleEventEmitter.removeAllListeners("FaceAuthenticator_Cancel");
      moduleEventEmitter.removeAllListeners("FaceAuthenticator_Loading");
      moduleEventEmitter.removeAllListeners("FaceAuthenticator_Loaded");
    };
  }, []);

  return {
    startFaceAuthenticator,
    result: response.result,
    error: response.error,
    cancelled: response.cancelled,
    isLoading: response.isLoading,
  };
};

export { useFaceAuthenticator };
