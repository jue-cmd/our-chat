/**
 * 我
 * user_count->账户
 * token->通行证
 * user_name->用户名
 * user_pic->头像
 */
/**聊天数据类型定义**/
class me {
    /**
     * @param {string} user_count 
     * @param {string} token 
     */
    constructor(user_count, token) {
        this.user_count = user_count;
        this.token = token;
    }
    /**
     * 
     * @returns object
     */
    get_user_data(ok) {
        const self = this; //获取本地引用 防止报错
        var rt = new Object();
        var form = new FormData();
        form.append("token", this.token);
        form.append("user_count", this.user_count);
        post_no_yibu("/php/get_user_info.php", form, function (ret) { //获取个人数据
            if (ret != 0) {
                var user_data = JSON.parse(ret);
                self.user_name = user_data.user_info.user_name;
                self.user_header_pic = user_data.user_info.pic;
                self.user_chat_alarm_sound = user_data.user_info.chat_sound;
                self.user_text = user_data.user_info.personal_text;
                self.personal_data = user_data.user_info.personal_data;
                self.group_info = rt.group_info = user_data.group_info;
                self.friend_info = rt.friend_info = user_data.friend_info;
                console.log('群组用户消息')
                console.log(user_data.group_info);
                console.log(self.friend_info);
                if (typeof (ok) == 'function') {
                    ok(ok);
                }
                console.log(self);
            } else {
                window.location.replace("./?c=1");
            }
        });
        return rt;
    }
}
/**每一个对象的数据 token=>唯一标识 data=>存储的数据**/
class chat_data_number {
    constructor(token, data) {
        this.token = token;
        this.data = data;
    }
}

class chat_manager {
    get_chat_data(token) { //获取聊天记录
        if (this.chat_array.length > 0) {
            //数量少 查找方式
            for (i = 0; i < this.chat_array.length; i++) {
                if (this.chat_array[i].token == token) {
                    return this.chat_array[i];
                }
            }
            //多数量 懒得写
        }
    }
    H2S() //彩蛋 
    { }
}
/**
 * 群组数据
 * add_group=>加入群组
 * creat_group=>创建群组
 * get_group=>获取群组
 * search_group=>搜索群组
 * delete_group=>删除群组
 * exit_group=>删除群组
 * update_group=>刷新群组
 * edit_group=>编辑群组
 * token_to_group=>token->群组详细信息
 */
class group_data {
    constructor(user_data, data) {
        if (user_data == 'me') {
            if (typeof (data) != 'object') {
                throw '类型错误';
            }
            this.group_data = data;
            this.user_count = user_data.user_count;
            this.token = user_data.token;
        } else {
            throw '类型不为me';
        }
        this.chat_pages = new Array();

    }
    search_group() {
        form = new FormData();
        form.append("group_count", group.value);
        form.append("user_count", user_count);
        form.append("token", token);
        post("/php/group.php?c=2", form, function (ret) {
            return JSON.parse(ret);
        });
    }
    add_group() {

    }
}
/**
 * 私聊数据
 * add_friend=>添加好友
 * delete_friend=>删除好友
 * edit_friend=>修改备注
 * ignore_friend=>拉黑好友
 */
class friend_data {
    constructor() {
        this.friend_data = new Array();
    }
}
/**
 * in_chat_page=>进入聊天
 * exit_chat_page=>退出聊天
 * send_message=>发送聊天数据
 * quash_message=>撤回消息
 * get_message=>收取数据
 */
class chat {
    /**
     * 
     * @param {me} user_data me
     */
    constructor(user_data) {
        this.chat_token = '';
        this.user_count = user_data.user_count;
        this.token = user_data.token;
        this.group_data = user_data.group_info
        this.friend_data = user_data.friend_info;
        this.chat_pages = new Array();
    }
    /**
     * 
     * @param {string} message 聊天消息
     * @param {fileObj} fileObj 聊天文件
     * @param {string} post_progress_bar 上传数据进度条
     * @param {string} post_time 剩余时间
     * @param {function} call_back 回调函数为null时不回调
     */
    send_message(message, fileObj, post_progress_bar, post_time, call_back = null) //发送聊天记录
    {
        if (chat_token != '') {
            form = new FormData(); // FormData对象
            //添加数据
            form.append("file", fileObj);
            form.append("word", message);
            form.append("token", this.token);
            form.append("chat_token", this.chat_token);
            form.append("user_count", this.user_count);
            post("chat.php?c=1", form, function (ret) {
                if (call_back != null) {
                    call_back(ret);
                }
            }, post_progress_bar, post_time);
        }
    }

    /**
     * 
     * @param {聊天标识} chat_token 
     * @param {开始id} from 
     * @returns 
     */
    get_message_from_server(chat_token, from = 0) {
        if (chat_token != null) {
            var form = new FormData;
            form.append("user_count", this.user_count);
            form.append("token", this.token);
            form.append("chat_token", chat_token);
            form.append("from", from)
            var request = new XMLHttpRequest();
            request.open('POST', 'chat.php?c=2', false);
            request.send(form);
            if (request.status === 200) {
                return JSON.parse(request.responseText);
            }
        }
    }
};
class chat_page {
    /**
     * 聊天页面管理对象
     * @param {我} Me 
     * @param {聊天div id} documend_id 
     * @param {聊天记录} new_message 
     * @param {聊天类型} type 
     * @param {聊天人群 数组} users
     */
    constructor(Me, documend_id, new_message, type, token, name, users = new Array()) {
        this.Me = Me;
        this.Chat_Page = document.getElementById(documend_id);
        this.Chat_Page_Name = this.Chat_Page.getElementsByClassName("navbar-title")[0];
        this.Send = this.Chat_Page.getElementsByClassName("write-link send")[0];
        this.Chat_Box = this.Chat_Page.getElementsByClassName("mk-chat-box")[0];
        this.Text = document.getElementById("word");
        this.fileObj = this.Chat_Page.getElementsByClassName("fileobj")[0];
        this.name = name;
        this.message = new_message;
        this.type = type;
        this.users = users;
        this.token = token;
        this.unsend_text = "";
        this.is_out = false;
        this.is_talk = true;
        this.sended_message = new Array();
    }
    rul() {
        this.Chat_Box.scrollTop = this.Chat_Box.scrollHeight;
    }

    select_files(file_sort, file_url) { //文件显示
        if (file_sort != "") {
            var tmp = "";
            var str = "";
            if (file_sort == 'jpg' || file_sort == 'png' || file_sort == 'jpeg' || file_sort == 'gif') {
                tmp = '<img src ="' + file_url + '" class = "content img" </img>';
                str = '<a href="' + file_url + '" target="_blank">' + tmp + '</a>';
            } else if (file_sort == 'pdf') {
                tmp = '这有个pdf';
                str = '<a href="' + file_url + '" target="_blank">' + tmp + '</a>';
            } else if (file_sort == 'mp4') {
                tmp = '这有个视频文件';
                str = '<video controls="controls"><source src="' + file_url + '"/></video>';
            } else if (file_sort == 'mp3' || file_sort == 'wav') {
                tmp = '这有个音频文件';
                str = '<audio controls="controls"><source src="' + file_url + '" type="audio/mp3" /></audio>';
            } else if (file_sort == 'pptx' || file_sort == 'ppt') {
                tmp = '这有个幻灯片';
                file_url = "https://view.officeapps.live.com/op/view.aspx?src=" + file_url;
                str = '<a href="' + file_sort_url + '" target="_blank">' + tmp + '</a>';
            } else {
                tmp = '这有个' + file_sort;
            }

        } else {
            str = "";
        }
        return str;
    }
    show(data = this.message) {
        var ret;
        for (var i = 0; i < data.length; i++) {
            if (data[i] != null) {
                var div = document.createElement("div");
                ret = div;
                if (data[i].user_count == this.Me.user_count) {
                    div.className = "right msg";
                }
                else {
                    div.className = "left msg";
                }
                if (this.type == 1 && this.users.length != 0) {
                    var user_header_pic = this.users.pic;
                    var user_name = this.users.user_name;
                    var user_count = this.users.user_count;
                }
                div.innerHTML =
                    '<a href="javascript:void(0);" onclick="home_page(' + data[i].user_count + ')"><img class="head" src="/users/user_pictures/' + user_header_pic + '"></img></a>' +
                    '<span class="name">' + user_name + '</span>' +
                    '<span class="content">' + data[i].context + this.select_files(data[i].file_sort, data[i].file_url) + '</span>';
                this.Chat_Box.appendChild(div);
            }
        }
        setTimeout(() => { this.rul() }, 1);
        if (this.sended_message.length != 0) {
            this.sended_message[0].remove();
            this.sended_message.splice(0, 1);
        }
        return ret;
    }
    update(data) {
        for (var i = 0; i < data.length; i++) {
            this.message.push(data[i]);
        }
        if (this.is_out) {
            this.show(data);
        }
    }
    send() {
        this.sended_message.push(this.show([{
            context: this.Text.value,
            file_sort: null,
            file_url: null,
            id: "-1",
            time: null,
            token: this.token,
            user_count: this.Me.user_count,
        }]));
        if (checkCookie('user_count') && checkCookie('token')) {
            var form = new FormData(); // FormData对象
            //添加数据
            form.append("file", this.fileObj.files[0]);
            form.append("word", this.Text.value);
            form.append("token", this.Me.token);
            form.append("chat_token", this.token);
            form.append("user_count", this.Me.user_count);
            //console.log(this.fileObj.files[0]);
            post("chat.php?c=1", form, function (ret) {
                console.log(ret);
                // if (ret == 0) {
                //     window.location.replace("./?c=1");
                // } else if (ret != "1") { }
                //ret_.remove();
            }, 'progressBar', 'time_chat');
        }
        this, this.Text.value = "";
        this.fileObj.value = null;
        this.rul();
    }
    out() {
        this.unsend_text = this.Text.value;
    }
};
class chat_page_manager {
    constructor(Me) {
        this.Me = Me;
        this.group_data = Me.group_info;
        this.friend_data = Me.friend_info;
        this.is_in = false;
        this.already_in_page;
        this.chat_page_array = new Array();
        this.load_chat_page();
        //添加键盘事件
        var that = this;
        document.onkeydown = function (e) {
            if (that.is_in) {
                if (!e) {
                    e = window.event;
                }
                if ((e.keyCode || e.which) == 13) {
                    that.already_in_page.send();
                }
            }
        }
    }
    /**
     * 进入聊天
     * @param {聊天标识} token
     */
    in_chat_page(token) {
        for (var i = 0; i < this.chat_page_array.length; i++) {
            if (this.chat_page_array[i].token == token) {
                //console.log(this);
                this.chat_page_array[i].Chat_Box.innerHTML = "";
                this.chat_page_array[i].Chat_Page_Name.innerHTML = this.chat_page_array[i].name;
                this.chat_page_array[i].is_out = true;
                this.chat_token = this.chat_page_array[i].token;
                //console.log(this.chat_page_array[i]);
                this.chat_page_array[i].Send.onclick = () => {
                    this.chat_page_array[i].send();
                };
                this.chat_page_array[i].Text.value = this.chat_page_array[i].unsend_text;
                this.chat_page_array[i].show();
                this.is_in = true;
                this.already_in_page = this.chat_page_array[i];
                this.send_function = this.chat_page_array[i].send;
                return true;
            }
        }
        return false;
    }
    add_chat_page(data) {

        for (var i = 0; i < this.chat_page_array.length; i++) {
            if (this.chat_page_array[i].token == data.token) {
                return true;
            }
        }
        this.chat_page_array.push(data);
    }
    update_chat_message(chat_message_token, message_array) {

        for (var i = 0; i < this.chat_page_array.length; i++) {
            this.chat_page_array[i].token;
            if (this.chat_page_array[i].token == chat_message_token) {
                this.chat_page_array[i].update(message_array);
                //console.log(this.chat_page_array[i].message);
                return true;
            }
        }
        return false;
    }
    out() {
        if (this.is_in) {
            this.already_in_page.out();
            this.send_function = () => { }
        }
    }
    load_chat_page() {
        if (this.friend_data != null) {
            for (var i = 0; i < this.friend_data.length; i++) {
                this.add_chat_page(new chat_page(this.Me, 'chat', new Array(), 1, this.friend_data[i].token, this.friend_data[i].alias != null ? this.friend_data[i].alias : this.friend_data[i].user_name, this.friend_data[i]));
            }
        }
        if (this.group_data != null) {
            for (var i = 0; i < this.group_data.length; i++) {
                this.add_chat_page(new chat_page(this.Me, 'chat', new Array(), 1, this.group_data[i].token, this.group_data[i].alias != null ? this.group_data[i].alias : this.group_data[i].user_name, this.group_data[i]));
            }
        }
    }
};
/* FUCK 2345(章鱼) 金山毒霸 鲁大师 腾讯电脑管家 360 滕迅OO */