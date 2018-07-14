$(document).ready(function() {
    init();
});

var startGame = false;
var index = 1;
var timeout = false;
var destroy = true;
var initsort = false;

function init() {
    changeTitleColor();
    btnReinicio();
    prependPanelTablero();
}

function prependPanelTablero() {
    $('.panel-tablero div[class^="col"]').each(function() {
        var length = $(this).find('img').length;

        if (length < 7) {
            var lack = 7 - length;

            for (var i = 0; i < lack; i++) {
                $(this).prepend(createImage(index++));
            }
        }
    });

    setTimeout(function() {
        candyValidate();
    }, 1000);
}

function candyValidate() {
    if (startGame && !timeout) {
        var matriz = [];
        var hmatriz = [];
        var harray = [];
        var vertical = [];
        var horizontal = [];

        $('.panel-tablero div[class^="col"]').each(function(i) {
            var images = $(this).find('img');
            matriz[i] = new Array(images.length);

            images.each(function(j) {
                var map = {};
                var $this = $(this);
                map[$this.attr('alt')] = $this.attr('id');
                matriz[i][j] = map;
            });
        });

        $.each(matriz, function(i, value1) {
            hmatriz[i] = new Array(value1.length);

            $.each(matriz, function(j, value2) {
                hmatriz[i][j] = value2[i];
            });
        });

        proccessMatriz(matriz, vertical);
        proccessMatriz(hmatriz, horizontal);
        proccessImages(vertical);
        proccessImages(horizontal);

        if ($('.effect-hide').length > 0) {
            $('.effect-hide').toggle('pulsate', 1500, function() {
                var score = parseInt($('#score-text').text());
                var calculate = $('.effect-hide').length * 10;
    
                $('#score-text').text(score + calculate);
                $('.effect-hide').remove();
    
                prependPanelTablero();
                destrySortable();
            });
        } else {
            initSortable();
        }
    } else {
        prependPanelTablero();
    }
}

function proccessImages(array) {
    $.each(array, function(i, val) {
        $.each(val, function(j, val2) {
            $('#' + val2).addClass('effect-hide');
        });
    });
}

function proccessMatriz(matriz, array) {
    $.each(matriz, function(index, value1) {
        $.each(value1, function(jindex, value2) {
            if (value2) {
                var temparr = [];
                var first = true;
                var key1 = Object.keys(value2);
                var val1 = Object.values(value2);
                key1 = key1[0];

                if (!includes(array, val1[0])) {
                    $.each(value1, function(zindex, value3) {
                        if (zindex > jindex && value3) {
                            var key2 = Object.keys(value3);
                            key2 = key2[0];
        
                            if (key1 === key2) {
                                if (first) {
                                    temparr.push(val1[0]);
                                    first = false;
                                }
        
                                var val2 = Object.values(value3);
                                temparr.push(val2[0]);
                            } else {
                                if (temparr.length < 3) {
                                    temparr = [];
                                }
        
                                return false;
                            }
                        }
                    });
                }
                
                if (temparr.length >= 3) {
                    array.push(temparr);
                }
            }
        });
    });
}

function includes(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }

    return false;
}

function emptyPanelTablero() {
    $('.panel-tablero div[class^="col"]').each(function() {
        $(this).empty();
    });
}

function btnReinicio() {
    var resume = false;

    $('.btn-reinicio').click(function() {
        if (!resume) {
            timer();
            $(this).html('Reiniciar');
            resume = true;
            startGame = true;
        } else {
            if (!timeout) {
                $('#timer').timer('remove');
                timer();
                index = 1;
                emptyPanelTablero();
                prependPanelTablero();
                destrySortable();
            } else {
                location.reload();
            }
        }
    });
}

function initSortable() {
    if (destroy) {
        destroy = false;
        initsort = true;

        $('.panel-tablero div[class^="col"]').sortable({
            stop: function(event, ui) {
                var mov = parseInt($('#movimientos-text').text());
                mov++;
                $('#movimientos-text').text(mov);
                prependPanelTablero();
            }
        });
    }
}

function destrySortable() {
    if (initsort) {
        destroy = true;
        initsort = false;

        $('.panel-tablero div[class^="col"]').sortable('destroy');
    }
}

function timer() {
    $('#timer').timer({
        format: '%M:%S',
        duration: '2m',
        countdown: true,
        callback: function() {
            timeout = true;

            $('.panel-tablero').animate({
                width: '0',
                height: '0'
            }, 900, function() {
                $(this).hide();
                $('.score-titulo').show();
            });

            $('.time').animate({
                width: '0',
                height: '0'
            }, 1000, function() {
                $(this).hide();
            });
            
            $('.panel-score').animate({
                width: '100%'
            }, 1000, function() {
                $('.btn-reinicio').html('Volver a Jugar');
            });

            destrySortable();
        }
    });
}

function changeTitleColor() {
    $('.main-titulo').animate({
        color: '#DCFF0E'
    }, 500).animate({
        color: '#fff'
    }, 500).animate({
        color: '#DCFF0E'
    }, 1000).animate({
        color: '#fff'
    }, 1000, function() {
        changeTitleColor();
    });
}

function createImage(index) {
    var number = getNumber();
    var image = new Image();
    image.src = 'image/' + number + '.png';
    image.alt = number;
    image.id = 'candy-' + index;
    return image;
}

function getNumber() {
    return Math.floor(Math.random() * 4) + 1;
}