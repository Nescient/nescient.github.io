var MomsImage = (function () {
    function MomsImage(file, id, name, description) {
        this.fileName = file;
        this.imageId = id;
        this.name = name;
        this.description = description;
    }
    MomsImage.prototype.getTitle = function () {
        return ("0" + this.imageId.toString()).slice(-2) + " - " + this.name;
    };
    return MomsImage;
}());
var img1 = new MomsImage("1.png", 1, "Zentangle Tribute", "There can be only one and thus it was and shall now always be known as the first for that is when it was and that is when it is.");
var img2 = new MomsImage("2.png", 2, "Spring Storm", "Sometimes it rains in the spring.");
var img3 = new MomsImage("3.png", 3, "Octopus Dance", "It involves a lot of stepping on things squishy.");
var img4 = new MomsImage("4.png", 4, "Oceans Echoes", "");
var img5 = new MomsImage("5.png", 5, "Kelp Dance", "This is some fish and kelp and stuff cus I'm artzy and whatnots with water things that some people call mariene life but I say more like MARLEENE LIFE yak yak yak");
var img6 = new MomsImage("6.png", 6, "Salmon Hide-and-Seek", "There can be only one and thus it was and shall now always be known as the first for that is when it was and that is when it is.");
var img7 = new MomsImage("7.png", 7, "Climax Forrest", "Sometimes it rains in the spring.");
var img8 = new MomsImage("8.png", 8, "Florida Peak-A-Boo", "Inreqay would be embarressed by this name.");
var img9 = new MomsImage("9.png", 9, "Early Birds", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
var img10 = new MomsImage("10.png", 10, "Kitchen Kama", "This is some fish and kelp and stuff cus I'm artzy and whatnots with water things that some people call mariene life but I say more like MARLEENE LIFE yak yak yak");
var img11 = new MomsImage("11.png", 11, "Wonder Weed", "Lets bake some brownies...");
var img12 = new MomsImage("12.png", 12, "May Zing", "Eeeeaaaaaaaahhhhhhhhhh.");
var img13 = new MomsImage("13.png", 13, "Waldheim", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
var img14 = new MomsImage("14.png", 14, "Sparkle and Splash", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
var imgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14];
//# sourceMappingURL=data.js.map