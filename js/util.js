var utilAjax = {
    // leftUrl: 'http://www.xiaozhuanshu.com/xzs/',
    // leftUrl: 'http://114.215.220.254:8005/',
    // leftUrl: 'http://192.168.66.28/xzs/',
    leftUrl: 'http://thyme.natappvip.cc/merchant/',
    imgPreFix: '',
    mainTitle: '',
    otherTitle: '我是小专鼠，为你的宝贝定制专属故事库，现在登录可以免费体验哟~',
    otherDesc: '快来找我玩吧'
};

var ajaxTool = function (rightUrl, method, dataObj, successFunc) {
    $.ajax({
        url: utilAjax.leftUrl + rightUrl,
        type: method,
        data: dataObj,
        dataType: 'json',
        async: false,
        success: function (res) {
            successFunc(res);
        },
        error: function (error) {
        },
    })
}

var Tool = {
    phoneCheck: function (val) {
        return (/^1\d{10}$/.test(val));
    },
    LDYstore: window.localStorage,
    LDYstoreGetIcode: function (iCode) {
        return this.LDYstore.getItem(iCode);
    }
}
//检测下你的破手机是傻逼iPhone还是更煞笔的Android
var thisPhone = {
    u: navigator.userAgent,
    isAndroid: function () {
        return this.u.indexOf('Android') > -1 || this.u.indexOf('Adr') > -1;
    },
    isApple: function () {
        return !!this.u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
}
//前后N天的方法抽取 dayNum传正时表示N天后，负数表示N天前
var LDY_Rencent_date = function (dayNum) {
    var date1, date2, time1, time2;
    if (dayNum > 0) {
        date1 = new Date();
        time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
        date2 = new Date(date1);
        date2.setDate(date1.getDate() + dayNum - 1);
        time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
        return [time1, time2]
    } else {
        date1 = new Date();
        time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
        date2 = new Date(date1);
        date2.setDate(date1.getDate() + dayNum + 1);
        time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
        return [time2, time1]
    }
}
//字符串转对象
var strToObj=function(str,splitStr,keyArr) {
    var arr=[],obj={};
    arr = str.split('-');
    if(arr.length!=keyArr.length){
        return;
    }
    for (var i = 0; i < keyArr.length; i++) {
        obj[keyArr[i]] = arr[i];
    }
    return obj;
}
//高级浏览器的样式获取
window.LDYGetCss = function (ele, attr) {
    return window.getComputedStyle(ele, null)[attr];
}
//两个高级选择器
window.querySel = function (sel) {
    return document.querySelector(sel);
};
//返回值为集合
window.querySelAll = function (sel) {
    return document.querySelectorAll(sel);
};

//利用iframe重写alert
window.alert = function (name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};

//暂时还没什么屌用
window.tabChange = function (index, src) {

}

var touchEvent = {

    /*单次触摸事件*/
    tap: function (element, fn) {
        var startTx, startTy;
        element.addEventListener('touchstart', function (e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
        }, false);

        element.addEventListener('touchend', function (e) {
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY;
            // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
            if (Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6) {
                fn();
            }
        }, false);
    },

    /*两次触摸事件*/
    doubleTap: function (element, fn) {
        var isTouchEnd = false,
            lastTime = 0,
            lastTx = null,
            lastTy = null,
            firstTouchEnd = true,
            body = document.body,
            dTapTimer, startTx, startTy, startTime;
        element.addEventListener('touchstart', function (e) {
            if (dTapTimer) {
                clearTimeout(dTapTimer);
                dTapTimer = null;
            }
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
        }, false);
        element.addEventListener('touchend', function (e) {
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                now = Date.now(),
                duration = now - lastTime;
            // 首先要确保能触发单次的 tap 事件
            if (Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6) {
                // 两次 tap 的间隔确保在 500 毫秒以内
                if (duration < 301) {
                    // 本次的 tap 位置和上一次的 tap 的位置允许一定范围内的误差
                    if (lastTx !== null &&
                        Math.abs(lastTx - endTx) < 45 &&
                        Math.abs(lastTy - endTy) < 45) {
                        firstTouchEnd = true;
                        lastTx = lastTy = null;
                        fn();
                    }
                }
                else {
                    lastTx = endTx;
                    lastTy = endTy;
                }
            }
            else {
                firstTouchEnd = true;
                lastTx = lastTy = null;
            }
            lastTime = now;
        }, false);
        // 在 iOS 的 safari 上手指敲击屏幕的速度过快，
        // 有一定的几率会导致第二次不会响应 touchstart 和 touchend 事件
        // 同时手指长时间的touch不会触发click
        if (~navigator.userAgent.toLowerCase().indexOf('iphone os')) {
            body.addEventListener('touchstart', function (e) {
                startTime = Date.now();
            }, true);
            body.addEventListener('touchend', function (e) {
                var noLongTap = Date.now() - startTime < 501;
                if (firstTouchEnd) {
                    firstTouchEnd = false;
                    if (noLongTap && e.target === element) {
                        dTapTimer = setTimeout(function () {
                            firstTouchEnd = true;
                            lastTx = lastTy = null;
                            fn();
                        }, 400);
                    }
                }
                else {
                    firstTouchEnd = true;
                }
            }, true);
            // iOS 上手指多次敲击屏幕时的速度过快不会触发 click 事件
            element.addEventListener('click', function (e) {
                if (dTapTimer) {
                    clearTimeout(dTapTimer);
                    dTapTimer = null;
                    firstTouchEnd = true;
                }
            }, false);
        }
    },

    /*长按事件*/
    longTap: function (element, fn) {
        var startTx, startTy, lTapTimer;
        element.addEventListener('touchstart', function (e) {
            if (lTapTimer) {
                clearTimeout(lTapTimer);
                lTapTimer = null;
            }
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            lTapTimer = setTimeout(function () {
                fn();
            }, 1000);
            e.preventDefault();
        }, false);
        element.addEventListener('touchmove', function (e) {
            var touches = e.touches[0],
                endTx = touches.clientX,
                endTy = touches.clientY;
            if (lTapTimer && (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5)) {
                clearTimeout(lTapTimer);
                lTapTimer = null;
            }
        }, false);
        element.addEventListener('touchend', function (e) {
            if (lTapTimer) {
                clearTimeout(lTapTimer);
                lTapTimer = null;
            }
        }, false);
    },

    /*滑屏事件*/
    swipe: function (element, fn) {
        var isTouchMove, startTx, startTy;
        element.addEventListener('touchstart', function (e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false);
        element.addEventListener('touchmove', function (e) {
            isTouchMove = true;
            e.preventDefault();
        }, false);
        element.addEventListener('touchend', function (e) {
            if (!isTouchMove) {
                return;
            }
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                distanceX = startTx - endTx
            distanceY = startTy - endTy,
                isSwipe = false;
            if (Math.abs(distanceX) > 20 || Math.abs(distanceY) > 20) {
                fn();
            }
        }, false);
    },

    /*向上滑动事件*/
    swipeUp: function (element, fn) {
        var isTouchMove, startTx, startTy;
        element.addEventListener('touchstart', function (e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false);
        element.addEventListener('touchmove', function (e) {
            if (e.targetTouches.length > 1) {
                return;
            }
            isTouchMove = true;
            // e.preventDefault();
        }, false);
        element.addEventListener('touchend', function (e) {
            if (!isTouchMove) {
                return;
            }
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                distanceX = startTx - endTx
            distanceY = startTy - endTy,
                isSwipe = false;
            if (e.targetTouches.length > 1 || Math.abs(distanceX) > 25) {
                return;
            }
            ;
            if (Math.abs(distanceX) < Math.abs(distanceY)) {
                if (distanceY > 10) {
                    fn();
                    isSwipe = true;
                }
            }
        }, false);
    },

    /*向下滑动事件*/
    swipeDown: function (element, fn) {
        var isTouchMove, startTx, startTy;
        element.addEventListener('touchstart', function (e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false);
        element.addEventListener('touchmove', function (e) {
            if (e.targetTouches.length > 1) {
                return;
            }
            ;
            isTouchMove = true;
            // e.preventDefault();
        }, false);
        element.addEventListener('touchend', function (e) {

            if (!isTouchMove) {
                return;
            }
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                distanceX = startTx - endTx
            distanceY = startTy - endTy,
                isSwipe = false;
            if (e.targetTouches.length > 1 || Math.abs(distanceX) > 25) {
                return;
            }
            ;
            if (Math.abs(distanceX) < Math.abs(distanceY)) {
                if (distanceY < -10) {
                    fn();
                    isSwipe = true;
                }
            }
        }, false);
    },

    /*向左滑动事件*/
    swipeLeft: function (element, fn) {
        var isTouchMove, startTx, startTy;
        element.addEventListener('touchstart', function (e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false);
        element.addEventListener('touchmove', function (e) {
            isTouchMove = true;
            e.preventDefault();
        }, false);
        element.addEventListener('touchend', function (e) {
            if (!isTouchMove) {
                return;
            }
            if (e.targetTouches.length > 1) {
                return;
            }
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                distanceX = startTx - endTx
            distanceY = startTy - endTy,
                isSwipe = false;
            if (Math.abs(distanceX) >= Math.abs(distanceY)) {

                if (distanceX > 20) {
                    fn();
                    isSwipe = true;
                }
            }
        }, false);
    },

    /*向右滑动事件*/
    swipeRight: function (element, fn) {
        var isTouchMove, startTx, startTy;
        element.addEventListener('touchstart', function (e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false);
        element.addEventListener('touchmove', function (e) {

            isTouchMove = true;
            e.preventDefault();
        }, false);
        element.addEventListener('touchend', function (e) {
            if (!isTouchMove) {
                return;
            }
            if (e.targetTouches.length > 1) {
                return;
            }
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                distanceX = startTx - endTx
            distanceY = startTy - endTy,
                isSwipe = false;
            if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                if (distanceX < -20) {
                    fn();
                    isSwipe = true;
                }
            }
        }, false);
    }

}

var actDom = {
    tapLy: function (dom, callBack) {
//      第一不能超过延时时间，第二不能使移动
//      获取一些必要的值开始时间，延时时间，是否是移动
        var startTime = 0;
        var delayTime = 300;
        var isMove = false;
        dom.addEventListener("touchstart", function (event) {
            //记录开始时间
            startTime = Date.now();
        });
        dom.addEventListener("touchmove", function (event) {
            //如果发生了移动就改变isMove的值
            isMove = true;
        });
        dom.addEventListener("touchend", function (event) {
            //如果发生了移动就不执行回调
            if (isMove) return;
            //如果大于延时时间就不执行回调函数
            if (Date.now() - startTime > delayTime) return;
            callBack(event);

        });
    }
}
//
// mediaAudio.onloadstart=function () {
// //                alert('onloadstart');
//     console.log(mediaAudio.duration+'onloadstart');
// };
// mediaAudio.ondurationchange=function () {
// //                alert('onloadstart');
//     $('.rightTime').text(secondToMin(mediaAudio.duration));
//     console.log(mediaAudio.duration+'ondurationchange');
// };
// mediaAudio.onloadedmetadata=function () {
// //                alert('onloadstart');
//     $('.rightTime').text(secondToMin(mediaAudio.duration));
//     console.log(mediaAudio.duration+'onloadedmetadata');
// };
// mediaAudio.onloadeddata=function () {
// //                alert('onloadstart');
//     $('.rightTime').text(secondToMin(mediaAudio.duration));
//     console.log(mediaAudio.duration+'onloadeddata');
// };
// mediaAudio.onprogress=function () {
// //                alert('onloadstart');
//     $('.rightTime').text(secondToMin(mediaAudio.duration));
//     console.log(mediaAudio.duration+'onprogress');
// };
// mediaAudio.oncanplay=function () {
// //                alert('onloadstart');
//     $('.rightTime').text(secondToMin(mediaAudio.duration));
//     console.log(mediaAudio.duration+'oncanplay');
// };
// mediaAudio.oncanplaythrough=function () {
// //                alert('onloadstart');
//     $('.rightTime').text(secondToMin(mediaAudio.duration));
//     console.log(mediaAudio.duration+'oncanplaythrough');
// };