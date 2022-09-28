function post(url, value, ret_function) {
    var httpRequest = new XMLHttpRequest(); //创建需要的对象
    httpRequest.open('POST', url, true); //打开连接
    httpRequest.send(value); //发送请求 
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            //验证请求是否发送成功
            var json = httpRequest.responseText; //获取到服务端返回的数据
            ret_function(json); //返回数据
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

function login() {
    user = document.getElementById("usr").value;
    password = document.getElementById('pwd').value;
    if (user == "" || password == "") {

    } else {
        my_form = new FormData;
        my_form.append("user_name", user);
        my_form.append("pass_word", password);
        post("login.php", my_form, function(ret) {
            console.log(ret);
            if (ret == 0) {
                document.getElementById("ret").innerHTML = "TMD登录失败";
            } else {
                ret = JSON.parse(ret);
                admin_token = ret.token;
                setCookie("admin_token", admin_token, 7);
                setCookie("user_name", user, 7);
                window.location.href = "ctrl.html";
            }
        });
    }
}