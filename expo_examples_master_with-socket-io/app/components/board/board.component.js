// app/components/board/board.component.js
import React, {useContext} from "react";
import { View, Text, StyleSheet } from 'react-native';
import OpponentTimer from "./timers/opponent-timer.component";
import PlayerTimer from "./timers/player-timer.component";
import OpponentDeck from "./decks/opponent-deck.component";
import PlayerDeck from "./decks/player-deck.component";
import Choices from "./choices/choice.component";
import Grid from "./grid/grid.component";
import PlayerScore from "./scores/player-score.component";
import OpponentScore from "./scores/opponent-score.component";

const OpponentInfos = () => { return (
    <View style={styles.opponentInfosContainer}>
        <Text>Opponent infos</Text>
    </View>
);
};

const PlayerInfos = () => { return (
    <View style={styles.playerInfosContainer}>
        <Text>Player Infos</Text>
    </View>
); };

const Board = ({ gameViewState}) => {
    return (

    <View style={styles.container}>
        <View style={[styles.row, { height: '5%' }]}>
            <OpponentInfos />
            <View style={styles.opponentTimerScoreContainer}>
                <OpponentTimer />
                <OpponentScore />
            </View>
        </View>
        <View style={[styles.row, { height: '25%' }]}>
            <OpponentDeck />
        </View>
        <View style={[styles.row, { height: '40%' }]}>
            <Grid />
            <Choices />
        </View>
        <View style={[styles.row, { height: '25%' }]}>
            <PlayerDeck />
        </View>

        <View style={[styles.row, { height: '5%' }]}>
            <PlayerInfos />
            <View style={styles.playerTimerScoreContainer}>
                <PlayerTimer />
                <PlayerScore />
            </View>
        </View>
    </View>
); };
const styles = StyleSheet.create({ container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }, row: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    opponentInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "lightgrey"
    },
    opponentTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
playerInfosContainer: {
    flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "lightgrey"
},
playerTimerScoreContainer: {
    flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
},

 });
export default Board;
