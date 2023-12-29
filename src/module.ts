import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const LINKING_ERROR =
  `The package 'react-native-caf-face-authenticator' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

const module = NativeModules.CafFaceAuthenticator
  ? NativeModules.CafFaceAuthenticator
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const moduleEventEmitter = new NativeEventEmitter(module);

export { module, moduleEventEmitter };
