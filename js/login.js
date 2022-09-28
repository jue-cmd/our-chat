function login() //发送数据
{
    var user_coun_name = document.getElementById("name").value;
    var user_passward = document.getElementById("pass").value;
    form = new FormData();
    form.append("user_count", user_coun_name);
    form.append("user_passwd", user_passward);
    post("login.php?c=1", form, (ret) => {
        token = JSON.parse(ret);
        if (ret != -1) {
            //登陆成功
            console.log('LOGIN SEUSSFUL');
            setCookie("user_count", token.user_count, 7);
            setCookie("token", token.token, 7);
            setCookie("user_name", token.user_name, 7);
            window.location.replace("/html/?c=2");
        } else {
            //登录失败
            console.log('LOGIN FAIL');
            alert("账户或密码错误");
        }
    });
}

function reg() {
    var user_name = document.getElementById("regname").value;
    var user_passward = document.getElementById("regpass").value;
    var user_repassward = document.getElementById("reregpass").value;
    if (user_name != "" && user_passward == user_repassward && user_passward != "") {
        form = new FormData();
        form.append("user_name", user_name);
        form.append("user_password", user_passward);
        post("login.php?c=2", form, (ret) => {
            if (ret == 0) {
                console.log("注册失败");
                alert("换一个用户名 已经有有缘人注册了此用户");
            } else {
                console.log('REG SUSSFULLY');
                token = JSON.parse(ret);
                setCookie("user_count", token.user_count, 7);
                setCookie("token", token.token, 7);
                setCookie("user_name", user_name, 7);
                alert("注册成功!!");
                window.location.href = "./?c=2";
                return;
            }
        });
    } else { alert("奶奶的,为什么不输入?"); }
}