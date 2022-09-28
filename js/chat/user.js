class user {
    constructor(Me) {
        this.user_count = Me.user_count;
        this.token = Me.token;
        this.Me = Me;
        this.user_info_array = new Array();
        var tmp = new Object();
        if (Me.friend_info != null) {
            for (var i = 0; i < Me.friend_info.length; i++) {
                tmp.user_name = Me.friend_info[i].user_name;
                tmp.user_count = Me.friend_info[i].user_count;
                tmp.alias = Me.friend_info[i].alias;
                tmp.pic = Me.friend_info[i].pic;
                this.user_info_array.push(tmp);
            }
        }
    }
    get_user_info_from_server(user_count) {
        form = new FormData;
        form.append("token", token);
        form.append("user_count_searched", user_count);
        form.append("user_count", user_count);
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'chat.php?c=9', false);
        httpRequest.send(form);
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            if (ret != 0) {
                tmp = JSON.parse(httpRequest.responseText);
                tmp_array = new Object();
                tmp_array.user_name = tmp.user_name;
                tmp_array.alias = '';
                tmp_array.pic = tmp.pic;
                tmp_array.user_count = user_count;
                return tmp_array;
            }
        }
        return null;
    }
    get_user_info(user_count) {
        for (var i = 0; i < user_info_array.length; i++) {
            if (user_info_array[i].user_count == user_count) { //在本地查询数据
                return user_info_array[i]; //查询成功立刻返回
            }
        }
        var ret = this.get_user_info_from_server(user_count);
        if (ret) {
            this.user_info_array.push(ret);
            return ret;
        } else {
            return null;
        }
    }
    tkoen_to_count(token) {
        for (var i = 0; i < this.Me.friend_info.length; i++) {
            if (this.Me.friend_info[i].token == token) {
                return this.Me.friend_info[i];
            }
        }
        return null;
    }
    add_friend() {

    }
};