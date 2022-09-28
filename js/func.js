/**
 * 
 * @param {地址} url 
 * @param {参数} value 
 * @param {回调函数} ret 
 * @param {DOMid进度} id_progress 
 * @param {DOMid上传速度} id_time 
 */
function post(url, value, ret, id_progress = null, id_time = null) { //地址 参数(formdata) 回调函数 进度id 速度id 
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    if (id_progress != null) {
        httpRequest.upload.onprogress = (evt) => {
            var progressBar = document.getElementById(id_progress);
            if (evt.lengthComputable) {
                progressBar.max = evt.total;
                progressBar.value = evt.loaded;
            }
            var time = document.getElementById(id_time);
            var nt = new Date().getTime();
            var pertime = (nt - ot) / 1000;
            ot = new Date().getTime();
            var perload = evt.loaded - oloaded;
            oloaded = evt.loaded;
            var speed = perload / pertime; //单位b/s
            var bspeed = speed;
            var units = 'b/s'; //单位名称
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                units = 'k/s';
            }
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                units = 'M/s';
            }
            speed = speed.toFixed(1);
            //剩余时间
            var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
            time.innerHTML = '速度:' + speed + units + ',剩余时间:' + resttime + 's';
            if (bspeed == 0) time.innerHTML = '上传已取消';
        };
        httpRequest.upload.onloadstart = function () { //上传开始执行方法
            ot = new Date().getTime(); //设置上传开始时间
            oloaded = 0;
        };
    }
    httpRequest.send(value); //发送请求 
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            //验证请求是否发送成功
            var json = httpRequest.responseText; //获取到服务端返回的数据
            ret(json);
        }
    };
}

function post_no_yibu(url, value, ret) { //地址 参数(formdata) 回调函数 进度id 速度id 
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, false);
    httpRequest.send(value); //发送请求 

    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var json = httpRequest.responseText;
        if (ret != null) {
            ret(json);
        }
        return json;
    };
}
function setCookie(cname, cvalue, exdays) //存入cookie
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) //获取cookie
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

function checkCookie(value) //检测cookie
{
    var ret = getCookie(value);
    if (ret != "") {
        return true;
    } else {
        return false;
    }
}