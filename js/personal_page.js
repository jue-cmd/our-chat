//功能实现
function post(url, value, ret) {
    var httpRequest = new XMLHttpRequest(); //创建需要的对象
    httpRequest.open('POST', url, true); //打开连接
    httpRequest.send(value); //发送请求 
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function() {
        //请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            //验证请求是否发送成功
            var json = httpRequest.responseText; //获取到服务端返回的数据
            ret(json);
            //console.log(json);

        }
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

function checkCookie(value) //检测cookie
{
    var ret = getCookie(value);
    if (ret != "") {
        return true;
    } else {
        return false;
    }
}

function write(name, user_count, pic_url) {
    document.getElementById("name").innerHTML = name;
}

function start() {
    form = new FormData();
    form.append("user_count", getCookie("exp_user_count"));
    post("/users/user_space/personal_page/show.php?c=1", form, function(ret) {
        if (ret != 0) {
            ret = JSON.parse(ret);
            document.getElementById("user_img").src = "/users/user_pictures/" + ret.pic;
            document.getElementById("name").innerHTML = ret.user_name + "(" + ret.user_count + ")";
            document.getElementById("user_name").innerHTML = ret.user_name;
            document.getElementById("context").innerHTML = ret.others.context;
        } else {
            document.getElementById("user_img").src = "/users/user_pictures/no_set.webp";
            document.getElementById("name").innerHTML = "此用户已注销";
            document.getElementById("user_name").innerHTML = "生活不易,珏珏叹气";
            document.getElementById("context").innerHTML = "生活不易,珏珏叹气";
        }
    });
}

function init() {
    start();
}

window.onload = init();

function back() {
    from = getCookie("from_page");
    setCookie("exp_user_count", "")
    setCookie("from_page", "");
    window.location.replace(from);
}