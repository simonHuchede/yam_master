const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');
const {init: gameState} = require("./services/game.service");

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------

let games = [];
let botGames = [];
let queue = [];

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const updateClientViewTimer = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
        game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
    },200);

};

const updateClientViewScore = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.score', GameService.send.forPlayer.gameScore('player:1', game.gameState));
        game.player2Socket.emit('game.score', GameService.send.forPlayer.gameScore('player:2', game.gameState));
    },200);

};

const updateClientViewDeck = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
        game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
    }, 200);

};

const updateClientsViewChoices = (game) => {
    setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game));
    game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game));
}, 200);
};

const updateClientsViewGrid = (game) => {
    setTimeout(() => {
        game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game));
        game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game));
    }, 200)
};

const onRollDice = (socket) => {
  const index= GameService.utils.findGameIndexBySocketId(games, socket.id);
    games[index].gameState.deck.dices = GameService.dices.roll( games[index].gameState.deck.dices);
    games[index].gameState.deck.rollsCounter++;
    const dices = games[index].gameState.deck.dices;
    const isDefi = false;
    const isSec = games[index].gameState.deck.rollsCounter === 2;
    const combinations = GameService.choices.findCombinations(dices, isDefi, isSec);
    console.log('combinations',combinations);
    games[index].gameState.choices.availableChoices = combinations;
    console.log('availableChoice',games[index].gameState.choices.availableChoices);
    updateClientsViewChoices(games[index]);


  if (games[index].gameState.deck.rollsCounter > games[index].gameState.deck.rollsMaximum) {
      games[index].gameState.deck.dices = GameService.dices.lockEveryDice( games[index].gameState.deck.dices);
      games[index].gameState.timer = 5;
  }

  updateClientViewDeck(games[index]);

};

const lockOrUnlockDice = (socket, idDice) => {
    const index= GameService.utils.findGameIndexBySocketId(games, socket.id);
    const diceIndex= GameService.utils.findDiceIndexByDiceId(games[index].gameState.deck.dices, idDice);
    games[index].gameState.deck.dices[diceIndex].locked = !games[index].gameState.deck.dices[diceIndex].locked;
    updateClientViewDeck(games[index]);
};

const newPlayerInQueue = (socket) => {
    queue.push(socket);
    // Queue management
    if (queue.length >= 2) {
        const player1Socket = queue.shift();
        const player2Socket = queue.shift();
        createGame(player1Socket, player2Socket);
    } else {
        socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
    }
};

const calculateScore = (player, game) => {
    const grid = game.grid;
    const numRows = grid.length;
    const numCols = grid[0].length;
    let score = 0;
    const winScore = 1000;

// Vérifier les lignes horizontales
    for (let i = 0; i < numRows; i++) {
        let result = GameService.grid.checkLine(player,grid[i], winScore);
        if (result === winScore) return winScore; // Retourner score de victoire s'il y a une victoire
        score += result;
        console.log('scorehorizontal',score)
    }

    // Vérifier les lignes verticales
    for (let j = 0; j < numCols; j++) {
        const column = [];
        for (let i = 0; i < numRows; i++) {
            column.push(grid[i][j]);
        }
        let result = GameService.grid.checkLine(player,column, winScore);
        if (result === winScore) return winScore; // Retourner score de victoire s'il y a une victoire
        score += result;
        console.log('scorevertical',score)
    }
    // Check diagonal lines (top-left to bottom-right)
    for (let row = 0; row <= numRows - 1; row++) {
        for (let col = 0; col <= numCols - 1; col++) {
            // Vérifier les diagonales de 3 à 5 cases
            for (let k = 3; k <= 5; k++) {
                if (row + k <= numRows && col + k <= numCols) {
                    let line = [];
                    for (let i = 0; i < k; i++) {
                        line.push(grid[row + i][col + i]);
                    }
                    let result = GameService.grid.checkLine(player, line, winScore);
                    if (result === winScore) return winScore; // Retourner score de victoire s'il y a une victoire
                    score += result;
                }
            }
        }
    }

// Check diagonal lines (top-right to bottom-left)
    for (let row = 0; row <= numRows - 1; row++) {
        for (let col = 0; col <= numCols - 1; col++) {
            // Vérifier les diagonales de 3 à 5 cases
            for (let k = 3; k <= 5; k++) {
                if (row + k <= numRows && col - k + 1 >= 0) {
                    let line = [];
                    for (let i = 0; i < k; i++) {
                        line.push(grid[row + i][col - i]);
                    }
                    let result = GameService.grid.checkLine(player, line, winScore);
                    if (result === winScore) return winScore; // Retourner score de victoire s'il y a une victoire
                    score += result;
                }
            }
        }
    }





    console.log('scorrrrrrre',score)
    return score;
};

const removeToken = (playerName, gameState) => {
    if(playerName === 'player:1' ){
        if(gameState.currentTurn === 'player:1'){
            return gameState.player1Token-1;
        }
            return gameState.player1Token;

    }else{
        if(gameState.currentTurn === 'player:2'){
            return gameState.player2Token-1;
        }
        return gameState.player2Token;
    }
}

const createGame = (player1Socket, player2Socket) => {
    const newGame = GameService.init.gameState();

    newGame['idGame'] = uniqid();
    newGame['player1Socket'] = player1Socket;
    newGame['player2Socket'] = player2Socket;
    games.push(newGame);
    console.log(newGame)
    console.log('GAMES',games)
    const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);
    games[gameIndex].gameState.grid = GameService.init.grid();
    updateClientsViewGrid(games[gameIndex]);

    const gameInterval = setInterval(() => {
        if(games[gameIndex]){

            games[gameIndex].gameState.timer--;

            // Si le timer tombe à zéro
            if (games[gameIndex].gameState.timer === 0) {

                // On change de tour en inversant le clé dans 'currentTurn'
                games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';

                // Méthode du service qui renvoie la constante 'TURN_DURATION'
                games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
                games[gameIndex].gameState.deck = GameService.init.deck();
                games[gameIndex].gameState.choices = GameService.init.choices();
                games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid)
                updateClientViewDeck(games[gameIndex]);
                updateClientsViewChoices(games[gameIndex]);
                updateClientsViewGrid(games[gameIndex]);
            }
            // On notifie finalement les clients que les données sont mises à jour.
            updateClientViewTimer(games[gameIndex]);
        }
    }, 1000);
    updateClientViewDeck(games[gameIndex]);

    games[gameIndex].player1Socket.emit(
        'game.start', GameService.send.forPlayer.viewGameState('player:1', games[gameIndex]));
    games[gameIndex].player2Socket.emit(
        'game.start', GameService.send.forPlayer.viewGameState('player:2', games[gameIndex]));
    // On prévoit de couper l'horloge
// pour le moment uniquement quand le socket se déconnecte
    player1Socket.on('game.over', () => {
        clearInterval(gameInterval);
    });

    player2Socket.on('game.over', () => {
        clearInterval(gameInterval);
    });
player1Socket.on('disconnect', () => {
    clearInterval(gameInterval);
});

player2Socket.on('disconnect', () => {
    clearInterval(gameInterval);
});

};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {
    console.log(`[${socket.id}] socket connected`);
    socket.on('queue.join', () => {
        console.log(`[${socket.id}] new player in queue `)
        newPlayerInQueue(socket);
    });
    socket.on('disconnect', reason => {
        console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
    socket.on('game.dices.roll', () => {
        onRollDice(socket);
    });
    socket.on('game.dices.lock', (idDice) => {
        lockOrUnlockDice(socket, idDice);
    });
    socket.on('game.choices.selected', (data) => {
        // gestion des choix
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        games[gameIndex].gameState.choices.idSelectedChoice = data.choiceId;
        games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);
        games[gameIndex].gameState.grid = GameService.grid.updateGridAfterSelectingChoice(games[gameIndex].gameState.choices.idSelectedChoice,games[gameIndex].gameState.grid);
        updateClientsViewGrid(games[gameIndex]);
        updateClientsViewChoices(games[gameIndex]);
    });
    socket.on('game.grid.selected', (data) => {

        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        // La sélection d'une cellule signifie la fin du tour (ou plus tard le check des conditions de victoires)
        // On reset l'état des cases qui étaient précédemment clicables.
        games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);
        games[gameIndex].gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, games[gameIndex].gameState.currentTurn, games[gameIndex].gameState.grid);

        games[gameIndex].gameState.player1Score = calculateScore('player:1', games[gameIndex].gameState);
        console.log('games[gameIndex].gameState.player1Score', games[gameIndex].gameState.player1Score)
        games[gameIndex].gameState.player2Score = calculateScore('player:2', games[gameIndex].gameState);
        console.log('games[gameIndex].gameState.player2Score', games[gameIndex].gameState.player2Score)

        // TODO: Puis check si la partie s'arrête (lines / diagolales / no-more-gametokens)
        console.log(games[gameIndex].gameState.currentTurn);
        games[gameIndex].gameState.player1Token = removeToken('player:1', games[gameIndex].gameState);
        games[gameIndex].gameState.player2Token = removeToken('player:2', games[gameIndex].gameState);
        console.log('games[gameIndex].gameState.player1Token',games[gameIndex].gameState.player1Token)
        console.log('games[gameIndex].gameState.player2Token',games[gameIndex].gameState.player2Token)
        const gameOver = games[gameIndex].gameState.player1Token === 0 || games[gameIndex].gameState.player2Token === 0 || games[gameIndex].gameState.player1Score === 1000 || games[gameIndex].gameState.player2Score === 1000;
        if (gameOver) {
            games[gameIndex].player1Socket.emit('game.end');
            games[gameIndex].player2Socket.emit('game.end');
            console.log(gameOver);

        }else{
            // Sinon on finit le tour
            games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
            games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();

            // On remet le deck et les choix à zéro (la grille, elle, ne change pas)
            games[gameIndex].gameState.deck = GameService.init.deck();
            games[gameIndex].gameState.choices = GameService.init.choices();

            // On reset le timer
            games[gameIndex].player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', games[gameIndex].gameState));
            games[gameIndex].player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', games[gameIndex].gameState));
        }


        // et on remet à jour la vue
        updateClientViewScore(games[gameIndex]);
        updateClientViewDeck(games[gameIndex]);
        updateClientsViewChoices(games[gameIndex]);
        updateClientsViewGrid(games[gameIndex]);
    });
    socket.on('game.ended', () => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        setTimeout(() => {
            games[gameIndex].player1Socket.emit('game.over', GameService.send.forPlayer.gameEnding('player:1', games[gameIndex].gameState));
            games[gameIndex].player2Socket.emit('game.over', GameService.send.forPlayer.gameEnding('player:2', games[gameIndex].gameState));
        });
    });
    socket.on('game.delete', () => {
        const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
        games[gameIndex] = GameService.init.gameState();
        games[gameIndex] = GameService.init.deck();
        games[gameIndex] = GameService.init.choices();
        games[gameIndex] = GameService.init.grid();
        games.splice(gameIndex, 1);
    });
});
// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));
http.listen(3000, function(){ console.log('listening on *:3000');
});