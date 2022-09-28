console.log("你好");
friend_add_remark = document.getElementById("user_add_remark");
chat_box = document.getElementById("chat_box");
var group_list = new Object;
group_list.list = document.getElementById("group_list_data");
group_list.append = function (data) {
    a = document.createElement("a");
    a.className = "cell-item";

    index.setAttribute("onclick", "start_chat_group('" + data.token + "')");
    index.href = "javascript:void(0);";
    '<div class = "cell-icon" > ' +
        '<img src ="' + (data.pic == '' ? "/picture/no_set.webp" : "/group/pic/" + element.pic) + '"alt=""></div><' +
        'div class ="cell-left">' + data.group_name + '</div><' +
        'div class ="cell-right cell-arrow">' + data.id + '</div>';
};
var index_page = document.getElementById('index_list_data');
//创建对象
var chat_box = new Object;
chat_box.title = document.getElementById("chat_name");
chat_box.chat_box = document.getElementById("chat_box");
var no_set = "no_set.webp";
/*-------功能实现----------*/


setCookie("exp_user_count", "");
setCookie("from_page", "");
var user_name,
    user_count,
    user_header_pic,
    user_chat_alarm_sound,
    user_text,
    token,
    friend_quest_num = -1,
    chat_token = '',
    user_count_add,
    allow_user_count_add,
    index_array = [],
    friend_quest = [],
    user_group = [],
    user_friends = [],
    Is_Talk, is_admin,
    chat_data_array = [],
    chat_user_data = [],
    chat_num_array = null;
//聊天数据类
class chat_data {

}
/*------检测登录----*/
function check_login(call_back) {
    if (checkCookie('user_count') && checkCookie('token')) {
        var token = getCookie('token');
        var user_count = getCookie('user_count');
        form = new FormData();
        form.append("user_count", user_count);
        form.append("token", token);

        post("./chat.php?c=4", form, function (ret) {
            if (ret == 0) {
                window.location.replace("./?c=1");
            }
            call_back();
        });
    } else {
        window.location.replace("./?c=1");
    }
}

var ele = document.getElementById('chat');
ele.scrollTop = ele.scrollHeight;
document.onkeydown = function (e) {
    if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        send();
    }
}
/*----加载用户数据-----*/
function init_user_data(call_back) {
    token = getCookie("token");
    user_count = getCookie("user_count");
    form = new FormData();
    form.append("token", token);
    form.append("user_count", user_count);
    if (!(checkCookie("user_name") && checkCookie("pic") && checkCookie("personal_text") && checkCookie("best_pictures") && checkCookie("chat_sound") && checkCookie("personal_data"))) {
        post("/php/get_user_info.php", form, function (ret) { //获取个人数据
            if (ret != 0) {
                user_data = JSON.parse(ret);
                user_name = user_data.user_info.user_name;
                user_count = getCookie("user_count");
                token = getCookie('token');
                user_header_pic = user_data.user_info.pic;
                user_chat_alarm_sound = user_data.user_info.chat_sound;
                user_text = user_data.user_info.personal_text;
                is_admin = user_data.user_info.is_admin;
                personal_data = user_data.user_info.personal_data;
                user_friends = user_data.friend_info;
                user_group = user_data.group_info;
                setCookie("user_name", user_name);
                setCookie("user_header_pic", user_header_pic);
                setCookie("user_chat_alarm_sound", user_chat_alarm_sound);
                setCookie("personal_data", personal_data);
                if (!checkCookie('user_group_index')) {
                    setCookie('user_group_index', '', 7);
                } else {
                    index_array = JSON.parse(getCookie('user_group_index'));
                }
                call_back();
            } else {
                console.log('失败,请检查网络连接');
            }
        });
    }
    
    document.getElementById("word").placeholder = getCookie("user_name");
}
/*---------搜索聊群--------*/
function search_group() {
    document.getElementById("search_group_ret").innerHTML = ''
    group = document.getElementById("search_group_input");
    console.log(group.value);
    if (group.value != '') {
        form = new FormData();
        form.append("group_count", group.value);
        form.append("user_count", user_count);
        form.append("token", token);
        post("/php/group.php?c=2", form, function (ret) {
            ret = JSON.parse(ret);
            if (ret != null) {
                var out_data_string = "";
                ret.forEach(element => {
                    out_data_string += '<a href="javascript:;" onclick="add_friend_page(' + element.group_count + ')" class="list-item">' +
                        '<div class="list-img">' +
                        '<img src="' + (element.pic == '' ? "/picture/no_set.webp" : "/group/pic/" + element.pic) + '">' +
                        '</div>' +
                        '<div class="list-mes">' +
                        '<h3 class="list-title">' + element.group_name + '</h3>' +
                        '<div class="list-mes-item"><div><span class="list-price"><em></em>群号:' + element.id + '</span></div></div></div></a>';
                });
                document.getElementById("search_group_ret").innerHTML = out_data_string;
            } else {
                document.getElementById("search_group_ret").innerHTML = '无';
            }
        });
    }
}
/*-------加载聊群列表------*/
function load_chat_group() {

}
/*获取聊天室token并验证权限*/
function get_chat_token() {

}
/*开始聊天*/
function in_chat_page(token) {

    data = token_to_friend_group(token);
    chat_box.chat_box.innerHTML = "";
    chat_box.title.innerHTML = data.title;
    show_message(token);
    chat_token = token;
    in_page("chat");
    rul();
}

function start_chat_friend(token) {
    if (data = token_to_friend(token)) {
        push_index_front(data);
        in_chat_page(token);
    }
}

function start_chat_group(token) {
    if (data = token_to_group(token)) {
        push_index_front(data);
        in_chat_page(token);
        return true;
    }
    return false;
}

function append_chat(context) {
    div = document.createElement("div");
    div.className = "right msg";
    div.innerHTML =
        '<a href="javascript:void(0);" onclick="home_page(' + user_count + ')"><img class="head" src="/users/user_pictures/' + user_header_pic + '"></img></a>' +
        '<span class="name">' + user_name + admin_ctrl() + '</span>' +
        '<span class="content">' + context + '</span>';
    chat_box.chat_box.appendChild(div);
}

function send() //发送聊天记录
{
    if (chat_token != '') {
        if (checkCookie('user_count') && checkCookie('token')) {
            var x = document.getElementById("word").value;
            append_chat(x);
            rul();
            var fileObj = document.getElementById("file").files[0]; //获取文件对象
            var form = new FormData(); // FormData对象
            //添加数据
            form.append("file", fileObj);
            form.append("word", x);
            form.append("token", token);
            form.append("chat_token", chat_token);
            form.append("user_count", user_count);
            post("chat.php?c=1", form, function (ret) {
                if (ret == 0) {
                    window.location.replace("./?c=1");
                } else if (ret != "1") { }
            }, 'progressBar', 'time_chat');
            document.getElementById("word").value = "";
        } else {
            window.location.replace("./?c=1");
        }
        document.getElementById("file").value = "";
    }
}

/* 接收聊天记录 */
function select_files(in_data, in_data_url) { //文件显示
    if (in_data != "") {
        if (in_data == 'jpg' || in_data == 'png' || in_data == 'jpeg' || in_data == 'gif') {
            tmp = '<img src ="' + in_data_url + '" class = "content img" </img>';
            str = '<a href="' + in_data_url + '" target="_blank"><font color = "white" >' + tmp + '</font></a>';
        } else if (in_data == 'pdf') {
            tmp = '这有个pdf';
            str = '<a href="' + in_data_url + '" target="_blank"><font color = "white" >' + tmp + '</font></a>';
        } else if (in_data == 'mp4') {
            tmp = '这有个视频文件';
            str = '<audio controls="controls"><source src="' + in_data_url + '/></audio>';
        } else if (in_data == 'mp3' || in_data == 'wav') {
            tmp = '这有个音频文件';
            str = '<audio controls="controls"><source src="' + in_data_url + '" type="audio/mp3" /></audio>';
        } else if (in_data == 'pptx' || in_data == 'ppt') {
            tmp = '这有个幻灯片';
            in_data_url = "https://view.officeapps.live.com/op/view.aspx?src=" + in_data_url;
            str = '<a href="' + in_data_url + '" target="_blank"><font color = "white" >' + tmp + '</font></a>';
        } else {
            tmp = '这有个' + in_data;
        }

    } else {
        str = "";
    }
    return str;
}

function admin_ctrl(c_id) { //管理员控制
    str = "";
    if (is_admin == 1) {
        str = '<button class="button"onclick="delete_word(' + c_id + ')">撤回</button>';
    }
    return str;
}
/* 接收消息 */
function get_user_data(user__count) { //获取聊群 好友 头像 昵称 备注 个性签名
    for (i = 0; i < chat_user_data.length; i++) {
        if (chat_user_data[i].user_count == user__count) { //在本地查询数据
            return chat_user_data[i]; //查询成功立刻返回
        }
    }
    for (i = 0; i < user_friends.length; i++) {
        if (user_friends[i].user_count == user__count) {
            //在本地好友列表中查询数据
            tmp = new Object();
            tmp.user_name = user_friends[i].user_name;
            tmp.alias = user_friends[i].alias;
            tmp.pic = user_friends[i].pic;
            tmp.user_count = user_friends[i].user_count;
            chat_user_data.push(tmp); //加入本地数据
            return tmp; //查询成功立刻返回
        }
    }
    // form = new FormData;
    // form.append("token", token);
    // form.append("user_count_searched", user__count);
    // form.append("user_count", user_count);
    // post("chat.php?c=9", form, function(ret) { //在服务器查找
    //     if (ret != 0) {
    //         tmp = JSON.parse(ret);
    //         tmp_array = new Object();
    //         tmp_array.user_name = tmp.user_name;
    //         tmp_array.alias = null;
    //         tmp_array.pic = tmp.pic;
    //         tmp_array.user_count = user__count;
    //         chat_user_data.push(tmp);
    //         return tmp;
    //     }
    // });
    return null;
}
//组合消息
function gether_message(in_data) {
    if (in_data != null) {
        var str = "";
        console.log(in_data);
        in_data.forEach(row => {
            if (row != null) {
                if (row.user_count == user_count) {
                    tmp = 'right msg';
                    user_pic = user_header_pic;
                    user_name_chat = user_name;
                } else {
                    tmp = 'left msg';
                    ret = get_user_data(row.user_count);
                    if (ret != null) {
                        user_pic = ret.pic;

                        if (ret.alias != "") {
                            user_name_chat = ret.alias;
                        } else {
                            user_name_chat = ret.user_name;
                        }
                    } else {
                        user_name_chat = "正在加载";
                        user_pic = "no_set.webp"
                    }
                }
                str += '<div class="' + tmp + ' msg">' +
                    '<a href="javascript:void(0);" onclick="home_page(' + row.user_count + ')"><img class="head" src="/users/user_pictures/' + user_pic + '"></img></a>' +
                    '<span class="name">' + user_name_chat + admin_ctrl(row['id']) + '</span>' +
                    '<span class="content">' + row.context + select_files(row['file_sort'], row['file_url']) + '</span>' +
                    '</div>';
                user_count_sound = row.user_count;
            }
            tmp = ''
        });
        return str;
    }
    return '';
}
//获取消息数目
function get_message_num() {
    user_count = getCookie('user_count');
    token = getCookie('token');
    my_form = new FormData;
    my_form.append("user_count", user_count);
    my_form.append("token", token);
    post("chat.php?c=5", my_form, function (ret) {
        ret = JSON.parse(ret);
        if (chat_num_array != null && ret != null) {
            ret.forEach(array1 => {
                chat_num_array.forEach(array2 => {
                    if (array1.token == array2.token) {
                        if (array1.num != array2.num) {
                            get_message(array1.token);
                            push_index_front(token_to_friend_group(array1.token));
                        }
                    }
                });
            });
            chat_num_array = ret;
        } else {
            chat_num_array = ret;
            if (chat_num_array != null) {
                for (i = 0; i < chat_num_array.length; i++) {
                    get_message(chat_num_array[i].token);
                    if (chat_num_array[i].num != 0) {
                        push_index_front(token_to_friend_group(array1.token));
                    }
                }
            }
        }
    });
}

function show_message(in_token) {
    document.getElementById("chat_box").innerHTML = gether_message(get_chat_data(in_token));
    rul();
}

function get_message(chat__token) {
    form = new FormData;
    form.append("user_count", user_count);
    form.append("token", token);
    form.append("chat_token", chat__token);
    post("chat.php?c=2", form, function (ret) {
        if (ret != 0) {
            console.log("ok");
            data = JSON.parse(ret)
            set_chat_data(chat__token, data);
            if (chat_token != "") {
                show_message(chat_token);
            }
            setCookie("chat_data", JSON.stringify(chat_data_array));
        }
    });
}


//撤回
function delete_word(id) //撤回消息
{
    dele_word_(id);
    my_form = new FormData();
    my_form.append("user_count", user_count);
    my_form.append("token", token);
    my_form.append("id", id);
    my_form.append("talk_token", chat_token);
    post("ctrl.php?c=1", my_form, function (ret) {
        if (ret != 0) {

        } else {
            window.alert("粗问题了");
        }
    });
}

function dele_word_(id_) {
    chat_token_tmp = chat_token;
    ret = get_chat_data(chat_token_tmp);
    tmp_ = [];
    for (i = 0; i < ret.length; i++) {
        if (ret[i] != null) {
            if (ret[i].id != id_) {
                tmp_.push(ret[i]);
            }
        }
    }
    chat_box.innerHTML = gether_message(tmp_);
    set_chat_data(chat_token_tmp, tmp_);
}

/*--------自动滚动------*/
function rolling() {
    var ele = document.getElementById('chat');
    ele.scrollTop = ele.scrollHeight;
}
var auto_rulling_ = 1;

function auto_rolling() {
    if (document.getElementById('auto_rolling').innerHTML == "自动滚动ing") {
        document.getElementById('auto_rolling').innerHTML = "滚动已停止";
        auto_rulling_ = 0;
    } else {
        document.getElementById('auto_rolling').innerHTML = "自动滚动ing";
        auto_rulling_ = 1;
    }
}

function rul() {
    if (auto_rulling_ == 1) {
        var ele = document.getElementById('chat_box');
        ele.scrollTop = ele.scrollHeight;
    }
}

function exit() {
    token = getCookie("token");
    user_count = getCookie("user_count");
    form = new FormData();
    form.append("user_count", user_count);
    form.append("token", token);
    var httpRequest = new XMLHttpRequest();
    post("chat.php?c=3", form, function (ret) {
        if (ret == 1) {
            clearAllCookie();
            window.location.replace("./?c=1");
        }
    });
}
/*------好友功能实现------*/

/* 添加好友 */
function add_friend() {
    remark = friend_add_remark.value;
    form = new FormData();
    form.append("user_count", user_count);
    form.append("token", token);
    form.append("user_count_add", user_count_add);
    form.append("remark", remark)
    post("/php/friend.php?c=2", form, function (ret) {
        user_count_add = '';
        out_page();
    });
}

function get_friend_quest_num() {
    form = new FormData();
    form.append("user_count", user_count);
    form.append("token", token);
    post("/php/friend.php?c=5", form, function (ret) {
        if (ret != -1) {
            if (ret != friend_quest_num) {
                if (ret < friend_quest_num) {
                    show_friend_list();
                }
                friend_quest_num = ret;
                get_friend_quest();
            }
        } else {
            console.log('error');
        }
    });
}
/* 加载好友请求 */
function show_friend_quest() {
    out_string = "";
    friend_quest.forEach(element => {
        out_string += '<div class="m-cell">' +
            '<a href="javascript:void(0);" onclick="allow_add_friend_page(' + element.user_count + ')" class="cell-item">' +
            '<div class="cell-icon">' +
            '<img src="' + '/users/user_pictures/' + element.pic + '" alt=""></div>' +
            '<div class="cell-left">' + element.user_name + '</div>' +
            '<div class="cell-right cell-arrow">' + element.remark + '</div></a>';
    });
    document.getElementById('friend_quest_data').innerHTML = out_string;
}
//处理好友请求
function allow_add_friend_page(count) {
    allow_user_count_add = count;
    in_page('allow_friend_quest');
}

function allow_friend_quest(c) {
    alias = document.getElementById("allow_friend_quest_alias").value;
    form = new FormData();
    form.append("user_count", user_count);
    form.append("token", token);
    form.append("alias", alias);
    form.append("c", c);
    form.append("user_a", allow_user_count_add);
    allow_user_count_add = "";
    post("/php/friend.php?c=6", form, function (ret) {
        if (ret == 1) {
            alert('添加/删除成功');
            get_friend_list();
            out_page();
        } else {
            alert("未知错误");
        }
    });
}

function get_friend_quest() {
    form = new FormData();
    form.append("user_count", user_count);
    form.append("token", token);
    post("/php/friend.php?c=4", form, function (ret) {
        if (ret != 0) {
            friend_quest = JSON.parse(ret);
            show_friend_quest();
        } else {
            document.getElementById('friend_quest_data').innerHTML = "";
        }
    });
}

function add_friend_editor() { }

/* 搜索好友 */
function search_user() {
    document.getElementById("search_ret").innerHTML = ''
    user = document.getElementById("search_user_input");
    console.log(user.value);
    if (user.value != '') {
        form = new FormData();
        form.append("user_name_count", user.value);
        form.append("user_count", user_count);
        form.append("token", token);
        post("/php/friend.php?c=1", form, function (ret) {
            console.log(ret);
            if (ret != '0') {
                ret = JSON.parse(ret);
                var out_data_string = "";
                ret.forEach(element => {
                    out_data_string += '<a href="javascript:;" onclick="add_friend_page(' + element.user_count + ')" class="list-item">' +
                        '<div class="list-img">' +
                        '<img src="/users/user_pictures/' + element.pic + '">' +
                        '</div>' +
                        '<div class="list-mes">' +
                        '<h3 class="list-title">' + element.user_name + '</h3>' +
                        '<div class="list-mes-item"><div><span class="list-price"><em></em>' + element.user_count + '</span></div></div></div></a>';
                });
                document.getElementById("search_ret").innerHTML = out_data_string;
            } else {
                document.getElementById("search_ret").innerHTML = '无';
            }
        });
    }
}

function add_friend_page(count) {
    friend_add_remark.value = "";
    user_count_add = count;
    in_page('add_user_edit');
}

function delete_friend(friedn_token) {
    form = new FormData();
    form.append("user_count", user_count);
    form.append("token", token);
    form.append("friend_token", friedn_token);

}

function show_friend_list() {
    out_data = '';
    if (user_friends != null) {
        user_friends.forEach(element => {
            if (element.pic == null) {
                friend_pic = "/users/user_pictures/no_set.webp";
            } else {
                friend_pic = "/users/user_pictures/" + element.pic;
            }
            out_data += '<a href="javascript:void(0);" onclick="start_chat_friend(\'' + element.token + '\')" class="cell-item"> <' +
                'div class ="cell-icon" >' +
                '<img src ="' + friend_pic + '"alt=""></div><' +
                'div class ="cell-left">' + (element.alias == "" ? element.user_name : element.alias + '(' + element.user_name + ')') + '</div><' +
                'div class ="cell-right cell-arrow">' + element.alias + '</div></a>';
        });
    } else {
        out_data = '空空如也';
    }
    document.getElementById('friend_list_data').innerHTML = out_data;
}
/*------群组实现----------*/
//创建群组
function create_froup() {
    create_group_name = document.getElementById("greate_group_name").value;
    if (create_group_name != "") {
        create_group_pic = document.getElementById("create_group_pic").files[0]; //获取文件对象
        creat_group_check = document.getElementById("creat_group_check").value;
        creat_group_text = document.getElementById("creat_group_text").value;
        form = new FormData();
        form.append("user_count", user_count);
        form.append("token", token);
        form.append("create_group_pic", create_group_pic);
        form.append("creat_group_check", creat_group_check);
        form.append("creat_group_text", creat_group_text);
        form.append("create_group_name", create_group_name);
        post('/php/group.php?c=1', form, (ret) => {
            if (ret == 1) {
                alert("ok");
                out_page();
            } else {
                alert("no ok");
            }
        });
    }
}
//列出群组
function list_group() {
    if (user_group != null) {
        out_data = "";

        user_group.forEach(element => {
            out_data += '<a href="javascript:void(0);" onclick="start_chat_group(\'' + element.token + '\')" class="cell-item"> <' +
                'div class ="cell-icon" >' +
                '<img src ="' + (element.pic == '' ? "/picture/no_set.webp" : "/group/pic/" + element.pic) + '"alt=""></div><' +
                'div class ="cell-left">' + element.group_name + '</div><' +
                'div class ="cell-right cell-arrow">' + element.id + '</div></a>';
        });
        document.getElementById("group_list_data").innerHTML = out_data;
    }
}

function add_group() {

}

function token_to_friend(token) {
    for (i = 0; i < user_friends.length; i++) {
        if (user_friends[i].token == token) {
            ok = user_friends[i];
            tmp = new Object;
            tmp.picture = ok.pic;
            if (ok.alias == "") {
                tmp.title = ok.user_name;
            } else {
                tmp.title = ok.alias;
            }
            tmp.token = ok.token;
            return tmp;
        }
    }
    return null;
}

function token_to_group(token) {
    for (i = 0; i <= user_group.length; i++) {
        if (user_group[i].token == token) {
            ok = user_group[i];
            tmp = new Object;
            tmp.picture = ok.pic;
            if (ok.pic == "") {
                tmp.picture = no_set;
            }
            tmp.title = ok.group_name;
            tmp.token = ok.token;
            return tmp;
        }
    }
    return null;
}

function token_to_friend_group(token) {
    if (!(data = token_to_friend(token))) {
        data = token_to_group(token);
    }
    return data;
}


/*------加载个人主页------*/
function home_page(user_count) {
    setCookie("exp_user_count", user_count);
    setCookie("from_page", "/html/?c=2");
    window.location.replace("/html/?c=5");
}

/* -------主界面------------ */

function push_friend() {

}

function push_index_front(data) {
    //进行查重
    if (index_array.length != 0) {
        for (i = 0; i < index_array.length; i++) {
            if (data.token == index_array[i].token) {
                return;
            }
        }
    }
    a = document.createElement("a");
    index = index_page.insertBefore(a, index_page.childNodes[0]);
    index.innerHTML = '<div class = "cell-icon">' +
        '<img src = "/users/user_pictures/' + data.picture + '">' +
        '</div> <div class = "cell-left"> ' + data.title +
        ' </div> <div class = "cell-right cell-arrow"> </div> </a>';
    index.setAttribute("onclick", "in_chat_page('" + data.token + "')");
    index.className = "cell-item";
    index.href = "javascript:void(0);";

    index_array.push(data);
    setCookie("index_page", JSON.stringify(index_array), 7);
}

function show_index() {
    for (i = 0; i < index_array.length; i++) {
        a = document.createElement("a");
        tmp = index_page.appendChild(a);
        tmp.className = "cell-item";
        tmp.href = "javascript:void(0);";
        tmp.setAttribute("onclick", "in_chat_page('" + index_array[i].token + "')");
        tmp.innerHTML =
            '<div class = "cell-icon">' +
            '<img src = "/users/user_pictures/' + index_array[i].picture + '">' +
            '</div> <div class = "cell-left"> ' + index_array[i].title +
            ' </div> <div class = "cell-right cell-arrow"> </div> </a>';
    }
}

/*-------主聊天动画--------*/
var stack = [];
var stack_leg = 0;

function init_main() {
    stack[0] = "main";
    stack_leg++;
    document.getElementById('load_page').style = "display:none";
    document.getElementById('main').style = "display:block";
}
/*-------加载主题（可自定义）-----*/

function load_css(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
}

function change_show(id_) {
    document.getElementById(id_).className = "tabbar-item tabbar-active";
    for (i = 0; i < 4; i++) {
        if (i != id_) {
            document.getElementById(i).className = "tabbar-item";
        }
    }
    id_ += 4;
    document.getElementById(id_).style = "display:block;";
    for (i = 4; i < 8; i++) {
        if (i != id_) {
            document.getElementById(i).style = "display:none;";
        }
    }
}
/*---------界面切换---------*/
//显示界面
function in_page(id) {
    document.getElementById(stack[stack_leg - 1]).style = "display:none;";
    document.getElementById(id).style = "display:block;";
    stack[stack_leg] = id;
    stack_leg++;
}
//隐藏界面
function out_page() {
    document.getElementById("greate_group_name").value = "";
    document.getElementById("create_group_pic").files[0] = ""; //获取文件对象
    document.getElementById("creat_group_check").value = "";
    document.getElementById("creat_group_text").value = "";
    chat_token = "";
    document.getElementById(stack[stack_leg - 1]).style = "display:none;";
    delete stack[stack_leg - 1];
    stack_leg--;
    console.log(stack_leg);
    console.log(stack);
    document.getElementById(stack[stack_leg - 1]).style = "display:block;";
}
window.onload = init;



function init() //初始化函数
{
    check_login(() => {
        init_user_data(() => {
            if (data = getCookie("index_page")) {
                index_array = JSON.parse(data);
            }
            if (data = getCookie("chat_data")) {
                chat_data_array = JSON.parse(data);
            }
            show_index();
            show_friend_list();
            list_group();
            init_main();
            setInterval("get_message_num()", "1000");
            setInterval("get_friend_quest_num()", '2000');
        });

    })
}