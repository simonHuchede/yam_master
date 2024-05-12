import { StyleSheet, View, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { commonStyles } from '../../styles/common';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/home.jpeg")}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={commonStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("OnlineGameScreen")}
            style={commonStyles.button}
          >
            Jouer en ligne
          </Button>
        </View>
        <View style={commonStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("VsBotGameScreen")}
            style={commonStyles.button}
          >
            Jouer contre le bot
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
});
