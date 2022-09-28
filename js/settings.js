function upload() //发送图片
{
    if (checkCookie('user_count') && checkCookie('token')) {

        var user_count = getCookie('user_count');
        var token = getCookie('token');
        //文件处理
        var fileObj = document.getElementById("user_head_pic").files[0]; // js 获取文件对象
        var image = new Image();
        var form = new FormData(); // FormData 对象
        //添加数据
        form.append("file", fileObj);
        form.append("token", token);
        form.append("user_count", user_count);
        document.getElementById("file").value = "";
        //post发送请求
        post("/users/settings/go.php?c=1", form, function(ret) {
            if (ret == 1) {
                console.log("ok");
                document.getElementById("user_head_pic").value = "成功";

            }
        }, "progressBar_settings");
    }
}

function upload_text(user_count) {
    var user_count = getCookie('user_count');
    var token = getCookie('token');
    context = document.getElementById("context").value;
    form = new FormData();
    form.append("token", token);
    form.append("user_count", user_count);
    form.append("context", context);
    post("/users/settings/go.php?c=2", form, function(ret) {
        console.log(ret);
        if (ret == 1) {
            context = document.getElementById("context").value = "成功";
            setTimeout(200, function() {
                context = document.getElementById("context").value = "";
            });
        }
    })
}