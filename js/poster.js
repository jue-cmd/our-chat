var edit_lock = 0;

function edit() {
    if (!edit_lock) {
        var str = '<div class = "div_edit"><p><input type="text" class = "input" placeholder="填写标题" id = "tittle" required></input><input type="input" class="input" placeholder="重要等级" id="important"></p><p><textarea required hard class = "textarea" id = "context"></textarea></br></p><p><button class="animated-button-2" onclick="submit()">提交</button> <button class="animated-button-2" onclick="edit()">点我隐藏编辑</button></p></div>';
        form = new FormData();
        form.append("user_count", getCookie("user_count"));
        var httpRequest = new XMLHttpRequest(); //创建需要的对象
        httpRequest.open('POST', "poster.php?c=5", true); //打开连接
        httpRequest.send(form); //发送请求 
        /**
         * 获取数据后的处理程序
         */
        httpRequest.onreadystatechange = function() {
            //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                //验证请求是否发送成功
                var json = httpRequest.responseText; //获取到服务端返回的数据
                console.log(json);
                if (json == 1) {
                    document.getElementById("edit").innerHTML = str;
                    edit_lock = 1;
                } else {
                    edit_lock = 1;
                }
            }
        };
    } else {
        document.getElementById("edit").innerHTML = '<button onclick="edit()" class="animated-button-2">点我显示编辑</button>';
        edit_lock = 0;
    }
}

function submit() {
    console.log("ok");

    var tittle = document.getElementById('tittle').value;
    var context = document.getElementById('context').value;
    var is_important = document.getElementById("important").value;
    var user_count = getCookie('user_count');
    var token = getCookie('token');
    var name = getCookie('user_name');

    if (tittle == "" || context == "") {
        window.alert("字段没填写完");
        return;
    }

    console.log(tittle);
    console.log(context);
    document.getElementById('tittle').value = "";
    document.getElementById('context').value = "";
    document.getElementById('important').value = "";
    var form = new FormData(); // FormData 对象
    //添加数据
    form.append("token", token);
    form.append("name", name);
    form.append("user_count", user_count);
    form.append("tittle", tittle);
    form.append("context", context);
    form.append("is_important", is_important);
    //创建http对象
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("post", "poster.php?c=2", true); //初始化请求
    httpRequest.send(form); //发送请求

    //回调查看返回数据
    httpRequest.onreadystatechange = function() {
        //请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) //验证请求是否发送成功
        {
            var json = httpRequest.responseText; //获取到服务端返回的数据
            //判断
            console.log(json);
        }
    };
}

//cookie相关函数
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

function get_post() {
    user_count = getCookie('user_count');
    token = getCookie('token');
    //var value={user_count:user_count,token:token};
    my_form = new FormData;
    my_form.append("user_count", user_count);
    my_form.append("token", token);
    post("poster.php?c=1", my_form, function(ret) {
        ret = JSON.parse(ret);
        out_data = "";
        ret.forEach(row => {
            out_data += '<a href="javascript:void(0);" class="cell-item">' +
                '<div class="cell-left">' + row.tittle + '</div>' +
                '<div class="cell-right cell-arrow"></div>' +
                '</a>';
        });
        document.getElementById("notice").innerHTML = out_data;
    });
}
setInterval("get_post()", " 5000 ");

function delete_post(id) {
    var r = confirm("Are you sure?");
    if (r != true) {
        return;
    }
    user_count = getCookie('user_count');
    token = getCookie('token');
    my_form = new FormData;
    my_form.append("user_count", user_count);
    my_form.append("token", token);
    my_form.append("id", id);
    var httpRequest = new XMLHttpRequest(); //创建需要的对象
    httpRequest.open('POST', "poster.php?c=4", true); //打开连接
    httpRequest.send(my_form); //发送请求 
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function() {
        //请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            //验证请求是否发送成功
            var json = httpRequest.responseText; //获取到服务端返回的数据
            console.log(json);
        }
    };
}