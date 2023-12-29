import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const LINKING_ERROR =
  `The package 'react-native-iproov-lib-test' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

const module = NativeModules.CafFaceLiveness
  ? NativeModules.CafFaceLiveness
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
