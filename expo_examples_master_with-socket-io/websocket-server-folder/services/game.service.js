const TURN_DURATION = 30;

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const GAME_INIT = {
    gameState: {
        currentTurn: 'player:1',
        timer: null,
        player1Score: 0,
        player2Score: 0,
        grid: [],
        choices: {},
        deck: {},
        player1Token: 12,
        player2Token: 12
    }
}

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const ALL_COMBINATIONS = [
    { value: 'Brelan1', id: 'brelan1' },
    { value: 'Brelan2', id: 'brelan2' },
    { value: 'Brelan3', id: 'brelan3' },
    { value: 'Brelan4', id: 'brelan4' },
    { value: 'Brelan5', id: 'brelan5' },
    { value: 'Brelan6', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

const GameService = {
    init: {
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [ ...GRID_INIT];
            return game;
        },
        deck: () => {
            return { ...DECK_INIT };
        },
        choices: () => {
            return { ...CHOICES_INIT };
        },
        grid: () => {
            return [...GRID_INIT ];
        },
    },

    timer: {
        getTurnDuration: () => {
            return TURN_DURATION;
        }
    },

    dices: {
        roll: (dicesToRoll) => {
            const rolledDices = dicesToRoll.map(dice => {
                if (dice.value === "") {
                    // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        id: dice.id,
                        value: newValue,
                        locked: false
                    };
                } else if (!dice.locked) {
                    // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        ...dice,
                        value: newValue
                    };
                } else {
                    // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
                    return dice;
                }
            });
            return rolledDices;
        },

        lockEveryDice: (dicesToLock) => {
            const lockedDices = dicesToLock.map(dice => ({
                ...dice,
                locked: true
            }));
            return lockedDices;
        }
    },
    choices: {
        findCombinations: (dices, isDefi, isSec) => {
            console.log('findCombinations>>>>>>>>>>>><');
            const allCombinations = ALL_COMBINATIONS;
            console.log(allCombinations);
            // Tableau des objets 'combinations' disponibles parmi 'ALL_COMBINATIONS'
            const availableCombinations = [];

            // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
            const counts = Array(7).fill(0);

            let hasPair = false; // check: paire
            let threeOfAKindValue = null; // check: valeur brelan
            let hasThreeOfAKind = false; // check: brelan
            let hasFourOfAKind = false; // check: carré
            let hasFiveOfAKind = false; // check: yam
            let hasStraight = false; // check: suite
            let isLessThanEqual8 = false; // check: moins ou egal à 8
            let sum = 0; // sum of dices

            // Compter le nombre de dés de chaque valeur et calculer la somme
            for (let i = 0; i < dices.length; i++) {
                console.log('dices' , dices);
                const diceValue = parseInt(dices[i].value);
                console.log('diceValue',diceValue);
                counts[diceValue]++;
                console.log('counts[diceValue]',counts[diceValue]);
                sum += diceValue;
            }

            // Vérifier les combinaisons possibles
            console.log('hereeeeeeeeee')
            for (let i = 1; i <= 6; i++) {
                if (counts[i] === 2) {
                    hasPair = true;
                } else if (counts[i] === 3) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                } else if (counts[i] === 4) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                } else if (counts[i] === 5) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                    hasFiveOfAKind = true;
                }
            }
            //const dicesArray = Object.values(dices);
            const sortedValues = dices.map(dice => parseInt(dice.value)).sort((a, b) => a - b); // Trie les valeurs de dé

            // Vérifie si les valeurs triées forment une suite
            hasStraight = sortedValues.every((value, index) => index === 0 || value === sortedValues[index - 1] + 1);

            // Vérifier si la somme ne dépasse pas 8
            isLessThanEqual8 = sum <= 8;
            // return available combinations
            allCombinations.forEach(combination => {
                if (
                    (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                    (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                    (combination.id === 'carre' && hasFourOfAKind) ||
                    (combination.id === 'yam' && hasFiveOfAKind) ||
                    (combination.id === 'suite' && hasStraight) ||
                    (combination.id === 'moinshuit' && isLessThanEqual8) ||
                    (combination.id === 'defi' && isDefi)
                ) {
                    console.log(combination);
                    availableCombinations.push(combination);
                }
            });
            const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
            }
            return availableCombinations;
        }
    },

    grid: {

        resetcanBeCheckedCells: (grid) => {

            for (let i = 0; i < grid.length; i++) {
                // Parcourir chaque cellule de la ligne
                for (let j = 0; j < grid[i].length; j++) {
                    // Mettre à jour la valeur du champ 'owner'
                    grid[i][j].canBeChecked = false;
                }
            }
            const updatedGrid = grid;
            // La grille retournée doit avoir le flag 'canBeChecked' de toutes les cases de la 'grid' à 'false'

            return updatedGrid;
        },

        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
            for (let i = 0; i < grid.length; i++) {
                // Parcourir chaque cellule de la ligne
                for (let j = 0; j < grid[i].length; j++) {
                    // Mettre à jour la valeur du champ 'owner'
                    if (grid[i][j].id === idSelectedChoice) {
                        grid[i][j].canBeChecked = true;
                    }
                }
            }
            const updatedGrid = grid;

            // La grille retournée doit avoir toutes les 'cells' qui ont le même 'id' que le 'idSelectedChoice' à 'canBeChecked: true'
            return updatedGrid;
        },

        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
            if (grid[rowIndex][cellIndex].id === idCell) {
                grid[rowIndex][cellIndex].owner = currentTurn;
            }
            const updatedGrid = grid;

            // La grille retournée doit avoir avoir la case selectionnée par le joueur du tour en cours à 'owner: currentTurn'
            // Nous avons besoin de rowIndex et cellIndex pour différencier les deux combinaisons similaires du plateau

            return updatedGrid;
        },
        checkLine: (player,line, winScore) => {
            let count = 0;
            let align4 = false;
            let score = 0;
            for (let cell of line) {
                for (let cell of line) {
                    if (cell.owner === player) { // Vérifier si la case appartient au joueur en cours
                        count++;
                        if (count >= 4) {
                            console.log('dans 4')
                            score += 1;
                            align4 = true; // Si 4 cases alignées, marquer align4 comme vrai
                        }
                        if (count >= 3 && !align4) {
                            console.log('dans 3')
                            score += 1; // Si 3 cases alignées et pas encore align4
                        }
                        if (count === 5) {
                            return winScore; // Si 5 cases alignées, retourner score de victoire
                        }
                    } else {
                        count = 0;
                        align4 = false; // Réinitialiser align4
                    }
                }
                return score;
            }
        }
    },

    send: {
        forPlayer: {
            // Return conditionnaly gameState custom objet for player views
            viewGameState: (playerKey, game) => {
                return {
                    inQueue: false,
                    inGame: true,
                    idPlayer:
                        (playerKey === 'player:1')
                            ? game.player1Socket.id
                            : game.player2Socket.id,
                    idOpponent:
                        (playerKey === 'player:1')
                            ? game.player2Socket.id
                            : game.player1Socket.id
                };
            },
            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },
            gameTimer: (playerKey, gameState) => {
                // Selon la clé du joueur on adapte la réponse (player / opponent)
                const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
                const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;
                return { playerTimer: playerTimer, opponentTimer: opponentTimer };
            },
            deckViewState: (playerKey, gameState) => {
                const deckViewState = {
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
                return deckViewState;
            },
            choicesViewState: (playerKey, game) => {
                const choicesViewState = {
                    displayChoices: true,
                    canMakeChoice: playerKey === game.gameState.currentTurn,
                    idSelectedChoice: game.gameState.choices.idSelectedChoice,
                    availableChoices: game.gameState.choices.availableChoices
                }
                console.log(choicesViewState.idSelectedChoice);
                return choicesViewState;
            },
            gridViewState: (playerKey, game) => {

                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === game.gameState.currentTurn) && (game.gameState.choices.availableChoices.length > 0),
                    grid: game.gameState.grid
                };

            },
            gameScore: (playerKey, gameState) => {
                const playerScore = playerKey === 'player:1' ? gameState.player1Score : gameState.player2Score;
                const opponentScore = playerKey === 'player:1' ? gameState.player2Score : gameState.player1Score;
                return { playerScore: playerScore, opponentScore: opponentScore };
            },
            gameEnding: (playerKey, gameState) => {
                if(playerKey === 'player:1'){
                    if(gameState.currentTurn === 'player:1'){
                        if(gameState.player1Score === 1000){
                            console.log('gameState.player1Score === 10001', playerKey)
                            return { playerWinner: true, opponentWinner: false };
                        }else{
                            console.log('gameState.player1Tok === 02', playerKey)
                            console.log(gameState.player1Token)
                            console.log(gameState.player2Token)
                            return { playerWinner: false, opponentWinner: true };
                        }
                    }else{
                        if(gameState.player2Score === 1000){
                            console.log('gameState.player2Score === 10003', playerKey)
                            return { playerWinner: false, opponentWinner: true };
                        }else{
                            console.log('gameState.player2Tok === 04', playerKey)
                            console.log(gameState.player1Token)
                            console.log(gameState.player2Token)
                            return { playerWinner: true, opponentWinner: false };
                        }
                    }
                }else{
                    if(gameState.currentTurn === 'player:2'){
                        if(gameState.player2Score === 1000){
                            console.log('gameState.player2Score === 10005', playerKey)
                            return { playerWinner: true, opponentWinner: false };
                        }else{
                            console.log('gameState.player2Tok === 06', playerKey)
                            console.log(gameState.player1Token)
                            console.log(gameState.player2Token)
                            return { playerWinner: false, opponentWinner: true };
                        }
                    }else{
                        if(gameState.player1Score === 1000){
                            console.log('gameState.player1Score === 10007', playerKey)
                            return { playerWinner: false, opponentWinner: true };
                        }else{
                            console.log('gameState.player1Tok === 08', playerKey)
                            console.log(gameState.player1Token)
                            console.log(gameState.player2Token)
                            return { playerWinner: true, opponentWinner: false };
                        }
                    }
                }
            }
        }
    },

    utils: {
        // Return game index in global games array by id
        findGameIndexById: (games, idGame) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].idGame === idGame) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
        findGameIndexBySocketId: (games, socketId) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i]?.player1Socket.id === socketId || games[i]?.player2Socket.id === socketId) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findDiceIndexByDiceId: (dices, idDice) => {
            for (let i = 0; i < dices.length; i++) {
                if (dices[i].id === idDice) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        }
    }
}

module.exports = GameService;