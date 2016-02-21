// Copyright © Sam Savage 2016
var CaViewer = (function () {
    function CaViewer(svg, rowLength, a, b) {
        this.currentRow = [];
        this.data = [];
        this.a = Math.random();
        this.b = Math.random();
        this.boxSize = 0;
        this.width = 0;
        this.height = 0;
        this.timerToken = 0;
        this.timerTimeout = 10;
        for (var i = 0; i < rowLength; ++i) {
            this.currentRow.push(Math.random());
        }
        this.a = a;
        this.b = b;
        this.svg = svg;
        this.width = parseInt(this.svg.style("width"));
        this.height = parseInt(this.svg.style("height"));
        this.boxSize = this.width / rowLength;
        this.graphRow(this.currentRow, 0);
        return;
    }
    CaViewer.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.timeStep(); }, this.timerTimeout);
        return;
    };
    CaViewer.prototype.stop = function () {
        clearInterval(this.timerToken);
        return;
    };
    CaViewer.prototype.timeStep = function () {
        if (this.data.length < gMaxTimeStep) {
            var next_row = this.nextRow(this.currentRow);
            this.data.push(this.currentRow);
            this.graphRow(next_row, this.data.length);
            this.currentRow = next_row;
        }
        else {
            this.stop();
        }
        return;
    };
    CaViewer.prototype.nextRow = function (row) {
        var rval = Array(row.length);
        for (var i = 0; i < row.length; ++i) {
            var previous = row[gRealMod(i - 1, row.length)];
            var current = row[gRealMod(i, row.length)];
            var next = row[gRealMod(i + 1, row.length)];
            rval[i] = this.poly(previous, current, next);
            if (rval[i] > 1) {
                alert(rval[i]);
            }
            else if (rval[i] < 0) {
                alert(rval[i]);
            }
        }
        return rval;
    };
    // taken from Blair's ALife1Dim Java program
    CaViewer.prototype.poly = function (u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI * (this.a + (this.a - this.b) * v + this.b * u * v - 2 * u * x * v)));
    };
    CaViewer.prototype.graphRow = function (row, yIndex) {
        var box_size = this.boxSize;
        var y_index = yIndex * this.boxSize;
        var context = this.svg.node().getContext("2d");
        if (y_index >= this.height) {
            //http://stackoverflow.com/a/8394985
            var img_data = context.getImageData(0, 1, this.width, this.height - 1);
            context.putImageData(img_data, 0, 0);
            y_index = this.height - 1;
        }
        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * box_size, y_index, box_size, box_size);
            context.fillStyle = "#" + gToHexString(row[i]);
            context.fill();
            context.closePath();
        });
        return;
    };
    return CaViewer;
})();
//# sourceMappingURL=CaViewer.js.map