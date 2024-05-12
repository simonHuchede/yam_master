// app/components/board/board.component.js
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import OpponentScore from "../board/scores/opponent-score.component";
import PlayerScore from "../board/scores/player-score.component";
import Winner from "./winner/winner.component";

const OpponentInfos = () => {
  return (
    <View style={styles.opponentInfosContainer}>
      <Text>Informations sur l'adversaire</Text>
    </View>
  );
};

const PlayerInfos = () => {
  return (
    <View style={styles.playerInfosContainer}>
      <Text>Informations sur le joueur</Text>
    </View>
  );
};

const Recap = ({ navigateFonction }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { height: "5%" }]}>
        <OpponentInfos />
        <View style={styles.opponentTimerScoreContainer}>
          <OpponentScore />
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.row, { height: "100%" }]}>
          <Winner navigation={navigateFonction} />
        </View>
      </View>
      <View style={[styles.row, { height: "5%" }]}>
        <PlayerInfos />
        <View style={styles.playerTimerScoreContainer}>
          <PlayerScore />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "black",
  },
  opponentInfosContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "black",
    backgroundColor: "lightgrey",
  },
  opponentTimerScoreContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  opponentTimerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  choicesContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  playerInfosContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "black",
    backgroundColor: "lightgrey",
  },
  playerTimerScoreContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  playerTimerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
});
export default Recap;
