// Global variables
var given = 0;
var validSolution = [];
var puzzle = [];

// Generate a solution for a 9x9 Sudoku board
function generateSudoku(){

    // Fill solution with zeros
    var solution = [];
    for (let index = 0; index < 81; index++) {
        solution[index] = 0;
    }

    // Board by rows
    var rowBoard = [[], [], [], [], [], [], [], [], []];

    // Board by columns
    var columnBoard = [[], [], [], [], [], [], [], [], []];

    // Board by quad
    var quadBoard = [[], [], [], [], [], [], [], [], []];

    // Retrieve a random element from an array
    function random_Element(array) {
        return array[Math.floor(Math.random()*array.length)];
    }

    function shuffle() {
        var values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var shuffled = [];
        while (values.length != 0) {
            var element = random_Element(values);
            shuffled.push(element);
            values.splice(values.indexOf(element), 1);
        }
        return shuffled;
    }

    var index = 0;
    while (index < 81) {
        var shuffledValues = shuffle();
        var row = Math.floor(index / 9);
        var column = Math.floor(index % 9);
        if ((row == 0 && column == 0) || (row == 0 && column == 1) || (row == 0 && column == 2) 
        || (row == 1 && column == 0) || (row == 1 && column == 1) || (row == 1 && column == 2) 
        || (row == 2 && column == 0) || (row == 2 && column == 1) || (row == 2 && column == 2)) {
            // Quad 0
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[0].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[0].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 0 && column == 3) || (row == 0 && column == 4) || (row == 0 && column == 5) 
        || (row == 1 && column == 3) || (row == 1 && column == 4) || (row == 1 && column == 5) 
        || (row == 2 && column == 3) || (row == 2 && column == 4) || (row == 2 && column == 5)) {
            // Quad 1
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[1].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[1].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 0 && column == 6) || (row == 0 && column == 7) || (row == 0 && column == 8) 
        || (row == 1 && column == 6) || (row == 1 && column == 7) || (row == 1 && column == 8) 
        || (row == 2 && column == 6) || (row == 2 && column == 7) || (row == 2 && column == 8)) {
            // Quad 2
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[2].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[2].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 3 && column == 0) || (row == 3 && column == 1) || (row == 3 && column == 2) 
        || (row == 4 && column == 0) || (row == 4 && column == 1) || (row == 4 && column == 2) 
        || (row == 5 && column == 0) || (row == 5 && column == 1) || (row == 5 && column == 2)) {
            // Quad 3
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[3].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[3].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 3 && column == 3) || (row == 3 && column == 4) || (row == 3 && column == 5) 
        || (row == 4 && column == 3) || (row == 4 && column == 4) || (row == 4 && column == 5) 
        || (row == 5 && column == 3) || (row == 5 && column == 4) || (row == 5 && column == 5)) {
            // Quad 4
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[4].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[4].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        }  else if ((row == 3 && column == 6) || (row == 3 && column == 7) || (row == 3 && column == 8) 
        || (row == 4 && column == 6) || (row == 4 && column == 7) || (row == 4 && column == 8) 
        || (row == 5 && column == 6) || (row == 5 && column == 7) || (row == 5 && column == 8)) {
            // Quad 5
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[5].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[5].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 6 && column == 0) || (row == 6 && column == 1) || (row == 6 && column == 2) 
        || (row == 7 && column == 0) || (row == 7 && column == 1) || (row == 7 && column == 2) 
        || (row == 8 && column == 0) || (row == 8 && column == 1) || (row == 8 && column == 2)) {
            // Quad 6
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[6].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[6].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 6 && column == 3) || (row == 6 && column == 4) || (row == 6 && column == 5) 
        || (row == 7 && column == 3) || (row == 7 && column == 4) || (row == 7 && column == 5) 
        || (row == 8 && column == 3) || (row == 8 && column == 4) || (row == 8 && column == 5)) {
            // Quad 7
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[7].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[7].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        } else if ((row == 6 && column == 6) || (row == 6 && column == 7) || (row == 6 && column == 8) 
        || (row == 7 && column == 6) || (row == 7 && column == 7) || (row == 7 && column == 8) 
        || (row == 8 && column == 6) || (row == 8 && column == 7) || (row == 8 && column == 8)) {
            // Quad 8
            for (let value = 0; value < shuffledValues.length; value++) {
                if (!rowBoard[row].includes(shuffledValues[value]) && !columnBoard[column].includes(shuffledValues[value]) && !quadBoard[8].includes(shuffledValues[value])) {
                    rowBoard[row].push(shuffledValues[value]);
                    columnBoard[column].push(shuffledValues[value]);
                    quadBoard[8].push(shuffledValues[value]);
                    solution[index] = shuffledValues[value];
                    break
                }
            }
        }
        index++;
    }

    return solution;
}

// Generate and display a startBoard based on selected level and generated solution
function startBoard(level, solution) {

    // A empty array that represents the starting board
    var startBoard = [];

    // Levels defined and numberOfGivenSquares declared
    if (level == "Easy") {
        given = 45;
    } else if (level == "Medium") {
        given = 35;
    } else if (level == "Hard") {
        given = 25;
    }

    // Get a random index based on the length of an array
    function randomIndex(lengthOfArray) {
        return Math.floor(Math.random()*lengthOfArray);
    }

    // Generate an array with n elements; where n is the numberOfGivenSqaures based on selected level
    for (let index = 0; index < given;) {
        var givensq = randomIndex(solution.length);
        if (startBoard.includes(givensq)) {
            continue
        } else {
            startBoard.push(givensq);
            index++;
        }
    }

    puzzle = startBoard;

    // Display starting board based on the elements in startBoard
    startBoard.forEach(element => {
        var square = "sq-" + (element+1);
        document.getElementById(square).innerText = solution[element];
        document.getElementById(square).style.fontWeight = "Bold";
    });


}

// Generate a puzzle based on the level passed from button clicked
function getPuzzle(level) {

    for (let index = 1; index < 82; index++) {
        var square = "sq-" + index;
        document.getElementById(square).innerText = "";
    }

    // Obtain user's selected level
    var level = level.innerText;

    // Call generateSudoku function to generate a valid solution (puzzle)
    validSolution = generateSudoku();

    // Test whether the solution is valid by checking if the generated solution includes an 0.
    // While generate solution (validSolution) includes an 0; call generateSudoku function until it doesn't
    while (validSolution.includes(0)) {
        validSolution = generateSudoku();
    }

    // Generate and display starting board based on level selected by calling startBoard()
    startBoard(level, validSolution);
}

// Check user's solution against validSolution and return message based on check
