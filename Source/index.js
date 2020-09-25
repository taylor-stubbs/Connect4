function render(board, player) {
    const rows = board[0].length;
    const cols = board.length;
    $('#select-row').empty();
    $('#game-board').empty();
    for (let i = 0; i < cols; i += 1) {
        $('#game-board').append(`<div id="${i}" class="column"></div>`);
        $(`#game-board #${i}`).on('click', () => {
          makeMove(i);
        });
        $(`#${i}`).hover(function () {
            $(`#select-row #${i}`).css('visibility', 'visible');
        }, function () {
            $(`#select-row #${i}`).css('visibility', 'hidden');
        });
        for (let j = 0; j < rows; j += 1) {
          $(`#${i}`).append(`<div id="${i}-${j}" class="row"></div>`);
          $(`#${i}-${j}`).css('background-color', board[i][j]);
        };
        $('#select-row').append(`<div id="${i}" class="row"></div>`);
        $('#select-row').children().css('background-color', player.colour);
    }
}


function makeMove(colChoice) {
    const body = {
        col: colChoice
    };
    $.ajax({
        type: 'POST',
        url: '/counter',
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: result => {
            render(result.board, result.players[result.turn]);
            if(result.winner !== null) {
                $('#win-banner').text(`${result.winner.name} wins!`);
                $('#win-banner').css('visibility', 'visible');
                $(`#${result.winner.colour}-score .score-label`).text(result.winner.score);
            }
        },
    });
}

function newGame() {
    $('#win-banner').css('visibility', 'hidden');

    const body = {
        col: $('#col-input').val(),
        row: $('#row-input').val(),
    }
    $.ajax({
        type: 'POST',
        url: '/board',
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: result => {
            render(result.board, result.players[result.turn]);
            $('#game-board').css('visibility', 'visible');
        },
        error: function () {
            window.alert("Invalid board size. Must be no larger than 10x12")
        },
    });
}


