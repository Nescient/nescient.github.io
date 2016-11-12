// Copyright © Sam Savage 2016
var MomsImage = (function () {
    function MomsImage(id) {
        this.imageId = id;
    }
    MomsImage.prototype.getImageFileName = function () {
        return "data/" + this.imageId.toString() + ".png";
    };
    MomsImage.prototype.getDescriptionFileName = function () {
        return "data/" + this.imageId.toString() + ".htm";
    };
    return MomsImage;
}());
var imgs = [new MomsImage(1), new MomsImage(2), new MomsImage(3),
    new MomsImage(4), new MomsImage(5), new MomsImage(6),
    new MomsImage(7), new MomsImage(8), new MomsImage(9),
    new MomsImage(10), new MomsImage(11), new MomsImage(12),
    new MomsImage(13), new MomsImage(14), new MomsImage(15),
    new MomsImage(16), new MomsImage(17), new MomsImage(18),
    new MomsImage(19), new MomsImage(20), new MomsImage(21),
    new MomsImage(22), new MomsImage(23)];
//# sourceMappingURL=data.js.map