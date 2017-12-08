~function (desW) {
    var winW = document.documentElement.clientWidth;
    console.log(winW / desW * 100 + "px");
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(750);

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?d5f7b791ed096fc574658dd982bbe8d7";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
    console.log('baidu');
})();

