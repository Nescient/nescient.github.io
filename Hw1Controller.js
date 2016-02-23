// Copyright © Sam Savage 2016
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//declare var d3: any;
var y_scale, x_scale;
//init_svg = function () {
//    var svg = d3.select("#graph");
//    svg.attr("width", 1000).attr("height", 1000);
//    x_scale = d3.scale.linear()
//        .domain([-10, 10])
//        .range([0, 1000]);
//    y_scale = d3.scale.linear()
//        .domain([-10, 10])
//        .range([1000, 0]);
//}
//plot = function (x, y) {
//    var svg = d3.select("#graph");
//    svg.append("circle")
//        .attr("cx", x_scale(x))
//        .attr("cy", y_scale(y))
//        .attr("r", 2)
//        .style("fill", "purple");
//    //alert("plot " + String(x) + " " + String(y));
//}
var Hw1Controller = (function (_super) {
    __extends(Hw1Controller, _super);
    function Hw1Controller(elementId) {
        _super.call(this, elementId);
        this.x = this.y = 0;
        this.a = 1.4;
        this.b = 0.3;
        var svg = d3.select("main").append("svg");
        svg.attr("width", 1000).attr("height", 1000);
        this.svg = svg;
        x_scale = d3.scale.linear()
            .domain([-10, 10])
            .range([0, 1000]);
        y_scale = d3.scale.linear()
            .domain([-10, 10])
            .range([1000, 0]);
    }
    Hw1Controller.prototype.dostuff = function () {
        this.plot(this.x, this.y);
        var x = 1 - this.a * (this.x * this.x) + this.y;
        var y = this.b * this.x;
        this.x = x;
        this.y = y;
        return;
    };
    Hw1Controller.prototype.plot = function (x, y) {
        this.svg.append("circle")
            .attr("cx", x_scale(x))
            .attr("cy", y_scale(y))
            .attr("r", 2)
            .style("fill", "purple");
    };
    return Hw1Controller;
})(BaseTimer);
//# sourceMappingURL=Hw1Controller.js.map