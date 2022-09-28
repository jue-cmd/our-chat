class friend_manager {
    constructor(Me, friend_page) {
        this.Me = Me;
        this.friend_data = Me.friend_data;
        this.friend_page = friend_page;
    }
    /**
     * 
     * @param {要搜索人的id或名字} name_or_id 
     * @returns 
     */
    search_friend(name_or_id) {
        if (name_or_id != '') {
            var form = new FormData();
            var returndata = new Object();
            form.append("user_name_count", name_or_id);
            form.append("user_count", this.Me.user_count);
            form.append("token", this.Me.token);
            post_no_yibu("/php/friend.php?c=1", form, function (ret) {
                //console.log(ret);
                if (ret != '0') {
                    returndata = JSON.parse(ret);
                } else {
                    returndata = 0;
                }
            });
            return returndata;
        }
        return null;
    }
    /**
     * 
     * @param {要加的人的账号} user_count 
     */
    add_friend(user_count, remark) {
        //remark = friend_add_remark.value;
        var form = new FormData();
        form.append("user_count", this.Me.user_count);
        form.append("token", this.Me.token);
        form.append("user_count_add", user_count);
        form.append("remark", remark)
        post("/php/friend.php?c=2", form, function (ret) {
            console.log(ret);
        });
    }
    /**
     * 获取好友申请 
     */
    get_fried_quest() {
        var returndata;
        var form = new FormData();
        form.append("user_count", this.Me.user_count);
        form.append("token", this.Me.token);
        post_no_yibu("/php/friend.php?c=4", form, function (ret) {
            if (ret != 0) {
                returndata = JSON.parse(ret);
            } else {
                returndata = null;
            }
        });
        return returndata;
    }
    update_friend() {

    }
    add_friend_page(count) {
        this.user_count_add = count;
    }
    /**
     * 同意或决绝请求
     */
    allow_friend_quest(c, allow_user_count_add, alias, ret) {
        var form = new FormData();
        form.append("user_count", this.Me.user_count);
        form.append("token", this.Me.token);
        form.append("alias", alias);
        form.append("c", c);
        form.append("user_a", allow_user_count_add);
        allow_user_count_add = "";
        post("/php/friend.php?c=6", form, function (ret) {
            //get_friend_list();
            ret(ret);
        });
    }
};