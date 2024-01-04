import React from "react";
import { View, Button, StyleSheet } from "react-native";

import {
  useFaceAuthenticator,
  FilterType,
  StageType,
  TimeType,
} from "react-native-caf-face-authenticator";

const App = () => {
  const mobileToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2NTRjZmFlMWM5YTM0NTAwMDg4YzIwODUifQ.maH9fynasnaRR2Hm5PxQ1XzLxlVZiZSvpVDD9zVtfgs";
  const peopleId = "47496803898";

  const { startFaceAuthenticator, result, error, cancelled, isLoading } =
    useFaceAuthenticator(mobileToken, peopleId, {
      cafStage: StageType.PROD,
      filter: FilterType.NATURAL,
      imageUrlExpirationTime: TimeType.THREE_HOURS,
      enableScreenshots: true,
      loadingScreen: true,
    });

  console.log({
    result,
    error,
    cancelled,
    isLoading,
  });

  return (
    <View style={styles.container}>
      <Button title="teste" onPress={startFaceAuthenticator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
