console.log('hello');

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

//实现
function admin(user_count, a) {
    var ret;
    if (a == 0) {
        ret = '<button onclick="set_admin(' + user_count + ')">设为管理员</button>';
    } else {
        ret = '<button onclick="unset_admin(' + user_count + ')">取消管理员</button>';
    }
    return ret;
}

function show_user() //显示用户
{
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name)
    post("admin.php?c=1", my_form, function(a) {
        console.log(a);
        if (a != 0) {
            ret = JSON.parse(a);
            var i = "";
            ret.forEach(row => {
                i = i + row.user_name + '  ' + admin(row.user_count, row.is_admin) + '_<button onclick="delete_user(' + row.user_count + ')"><font color = red>删除</font></button></br>';
            });
            document.getElementById("user_list").innerHTML = i;
        } else {
            document.getElementById("user_list").innerHTML = "你TM没有权限访问";
        }
    });
}
setInterval("show_user()", " 1000 ");

function delete_user(user_count) {
    if (confirm("are you sure?")) {
        token = getCookie('admin_token');
        user_name = getCookie('user_name');
        my_form = new FormData;
        my_form.append("token", token);
        my_form.append("user_name", user_name);
        my_form.append("user_count", user_count);
        post("admin.php?c=2", my_form, function(ret) {
            console.log(ret);
        });
    }
}

function set_admin(user_count) {
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name);
    my_form.append("user_count", user_count);
    post("admin.php?c=3", my_form, function(ret) {
        console.log(ret);
    });
}

function unset_admin(user_count) {
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name);
    my_form.append("user_count", user_count);
    post("admin.php?c=4", my_form, function(ret) {
        console.log(ret);
    });
}

function delete_all() {
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name);
    post("admin.php?c=5", my_form, function(ret) {
        console.log(ret);
    });
}

function show_allow_file() {
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name);
    post("admin.php?c=6", my_form, function(ret) {
        console.log(ret);
        ret = JSON.parse(ret);
        var a = "";
        ret.forEach(row => {
            a += "--->" + row.file_sort + '  <button onclick="delete_file_sort(' + row.id + ')">删除</button><br>';
        });
        document.getElementById("allow_file").innerHTML = a;
    });
}
show_allow_file();

function delete_file_sort(id) {
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name);
    my_form.append("id", id);
    post("admin.php?c=7", my_form, function(ret) {
        console.log(ret);
        setTimeout(function() {
            show_allow_file();
        }, 1000);
    });
}

function add_allow_file() {
    token = getCookie('admin_token');
    user_name = getCookie('user_name');
    my_form = new FormData;
    my_form.append("token", token);
    my_form.append("user_name", user_name);
    str = document.getElementById("str").value;

    my_form.append("str", str);
    post("admin.php?c=8", my_form, function(ret) {
        console.log(ret);
        if (ret == 1) {
            document.getElementById("str").value = "成功";
        }
        setTimeout(function() {
            show_allow_file();
            document.getElementById("str").value = "";
        }, 1000);
    });
}