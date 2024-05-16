document.addEventListener('DOMContentLoaded', function () {
    var draw = SVG().addTo('#map').size(800, 800);

    const mapData = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ];

    const colorMap = {
        0: 'white',
        1: 'blue',
        2: 'black'
    };

    let sx = 50;
    let sy = 0;
    let initialX = 0, initialY = 0; // przechowuje pozycję początkową przy przesuwaniu mapy
    let dx = 0, dy = 0;
    
    function snapToGrid(value, gridSize) {
        return Math.round(value / gridSize) * gridSize;
    }

    // Przetwórz dane mapy
    for (let i = 0; i < mapData.length; i++) {
        for (let j = 0; j < mapData[i].length; j++) {
            const value = mapData[i][j];
            const color = colorMap[value] || 'gray'; // Domyślny kolor szary

            // Utwórz prostokąt SVG
            draw.rect(30, 30)
                .attr({
                    x: j * 30 + sx, // Dostosuj rozmiar komórki
                    y: i * 30 + sy,
                    fill: color
                });
        }
    }

    // Umożliw przeciąganie mapy za pomocą myszki
    let isDragging = false;
    let isDrawing = false;
    let startX, startY;

    draw.on('mousedown', function (event) {

        
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;

        
    });

    draw.on('mousemove', function (event) {
        if (isDragging) {
                if (isDrawing) {
                    const snappedX = snapToGrid(event.clientX - draw.node.getBoundingClientRect().left - sx-15, 30) + sx;
                    const snappedY = snapToGrid(event.clientY - draw.node.getBoundingClientRect().top - sy-15, 30) + sy;
                    const rect = draw.rect(30, 30).fill('red').move(snappedX, snappedY);
                    const gridX = Math.round((snappedX - sx) / 30);
                    const gridY = Math.round((snappedY - sy) / 30);
                    if (gridX >= 0 && gridX < mapData[0].length && gridY >= 0 && gridY < mapData.length) {
                        mapData[gridY][gridX] = 2;
                        console.log(mapData);
                    }}
            else{
            dx = event.clientX - startX;
            dy = event.clientY - startY;
            const transform = `scale(${zoomLevel}) translate(${initialX + dx}, ${initialY + dy})`;
            draw.attr('transform', transform);}
        }
    });

    draw.on('mouseup', function () {
        isDragging = false;
        if (!isDrawing){
        initialX = initialX + dx;
        initialY = initialY + dy;}
    });

    draw.on('mouseleave', function () {
        isDragging = false;
    });

    // Obsługa przycisków powiększania/pomniejszania
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const drawToggleButton = document.getElementById('draw-toggle');

    // Inicjalizacja zmiennych
    let zoomLevel = 1;

    // Funkcja aktualizująca transformację
    function updateTransform() {
        const transform = `scale(${zoomLevel}) translate(${initialX}, ${initialY})`;
        draw.attr('transform', transform);
    }

    zoomInButton.addEventListener('click', () => {
        zoomLevel *= 1.2;
        updateTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        zoomLevel *= 0.833333;
        updateTransform();
    });

    drawToggleButton.addEventListener('click', () => {
        isDrawing = !isDrawing;
        drawToggleButton.textContent = isDrawing ? 'Tryb przesuwania' : 'Tryb rysowania';
    });
});
