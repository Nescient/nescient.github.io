var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
}());
window.onload = function () {
    var el = document.getElementById('content');
    for (var index in imgs) {
        var img = imgs[index];
        var img_el = document.createElement('img');
        img_el.src = img.fileName;
        img_el.alt = img.getTitle();
        //img_el.addEventListener("click", function () {
        //    window.location.href = '/detail?id=' + img.imageId;
        //});
        var link_el = document.createElement("a");
        link_el.href = "/momsite/detail.html?id=" + img.imageId.toString();
        link_el.appendChild(img_el);
        el.appendChild(link_el);
    }
    //var greeter = new Greeter(el);
    //greeter.start();
};
//# sourceMappingURL=app.js.map