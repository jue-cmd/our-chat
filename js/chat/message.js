class Task {//单个任务类
    /**
     * 
     * @param {模式} mode 
     * @param {要执行的函数} activity 
     * @param {权重} weight 
     * @param {需要的权限} permission 
     */
    constructor(mode, activity, weight, permission) {
        if (typeof (activity) != 'function') {
            throw 'activity应为函数';
        }
        this.mode = mode;
        this.activity = activity;
        this.weight = weight
        this.permission = permission;
    }
    Default() {
        this.activity();
    }
}
//进入时先检查身份再开启任务列队
class Tasks_Queued {//任务列队, 通过 权重 和 函数调用实现插件等功能
    /**
     * 激活时机
     * 1=>当获取到新消息时
     * 2=>当消息发送时
     * 21=>当消息发送失败时
     * 3=>当消息被撤回时
     * 4=>当获取到好友/聊群请求时
     * 5=>当发言状态改变时
     * 6=>当登录凭证失效时
     */
    /**
     * 
     * @param {用户数据} user_data 
     * @param {界面对象} Page 
     * @param {好友首页对象} Index 
     * @param {底部导航栏对象} Bottum_bar 
     * @param {用户方法对象} User 
     * @param {群组对象} Group 
     */
    constructor(user_data, Page, Index, Bottum_bar, Chat, User, Group, Chat_page_manager, Me, Friend) {
        //sthis.Tasks = new Array();
        this.Task_Got_NewMessage = new Array();
        this.Task_Sent = new Array();
        this.Task_Send_Fail = new Array();
        this.Task_Message_Recall = new Array();
        this.user_count = user_data.user_count;
        this.token = user_data.token;
        this.form = new FormData;
        this.form.append("user_count", this.user_count);
        this.form.append("token", this.token);
        this.form.append("from", 0);
        this.message_array = new Object();
        this.message_array.group = new Array();
        this.message_array.friend = new Array();
        this.message_array.ok = false;
        this.Me = Me;

        this.Page = Page;
        this.Index = Index;
        this.Bottum_bar = Bottum_bar;
        this.Chat = Chat;
        this.User = User;
        this.Group = Group;
        this.Chat_page_manager = Chat_page_manager;
        this.Friend_manager = Friend;
        //登录凭证及信息

        //好友信息
        this.friend_quest_num = 0;
    }

    /**
     * 
     * @param {传入任务对象} T 
     */
    Insect_Task(T) {
    }
    permission_give(T) {
        var APIs = new Object();
        APIs.Index = null;
        APIs.Me = null;
        APIs.Page = null;
        APIs.Bottum_bar = null;
        APIs.chat_page = null;
        APIs.Chat = null;
        for (var i = 0; i < T.permission.length; i++) {
            switch (T.permission[i]) {
                case 'Index':
                case 'Page':
                case 'Me':
                case 'Bottum_bar':
                case 'chat_page':
                case 'Chat':
            }
        }
    }
    init() {
        var this_ = this;
        var get;
        get = function () {
            /**
             * 获取最新消息
             */
            post("chat.php?c=5", this_.form, function (ret) {
                // 判断是否出现新消息
                var json = JSON.parse(ret);
                //console.log(json);
                if (this_.message_array.ok) {
                    var get_message = new Object;
                    get_message.friend = new Array;
                    get_message.group = new Array;

                    // var memory = new Array;
                    //处理好友消息
                    for (var i = 0; i < this_.message_array.friend.length; i++) {
                        for (var b = 0; b < json.friend.length; b++) {
                            if (this_.message_array.friend[i].token == json.friend[b].token) {
                                if (this_.message_array.friend[i].num != json.friend[b].num) {
                                    json.friend[b].old_id = this_.message_array.friend[i].newest_id;
                                    get_message.friend.push(json.friend[b]);
                                    this_.message_array.friend[i] = json.friend[b];
                                }
                                json.friend.splice(b, 1);
                                continue;
                            }
                        }
                    }

                    //处理群组消息
                    for (var i = 0; i < this_.message_array.group.length; i++) {
                        for (var b = 0; b < json.group.length; b++) {
                            if (this_.message_array.group[i].token == json.group[b].token) {
                                if (this_.message_array.group[i].num != json.group[b].num) {
                                    json.group[b].old_id = this_.message_array.group[i].newest_id;
                                    get_message.group.push(json.group[b]);
                                    this_.message_array.group[i] = json.group[b];
                                }
                                json.group.splice(b, 1);
                                continue;
                            }
                        }
                    }

                    //将新消息加入数组
                    for (var i = 0; i < json.friend.length; i++) {
                        this_.message_array.friend.push(json.friend[i]);
                        get_message.friend.push(json.friend[i])
                    }
                    for (var i = 0; i < json.group.length; i++) {
                        this_.message_array.group.push(json.group[i]);
                        get_message.group.push(json.group[i]);
                    }
                }
                else {
                    this_.message_array = json;
                    this_.message_array.ok = true;
                    get_message = json;
                }
                if (get_message.group.length > 0) {
                    new Promise(function (reslove, reject) {
                        this_.group_task(get_message.group);
                    });
                }
                if (get_message.friend.length > 0) {
                    new Promise(function (reslove, reject) {
                        this_.friend_task(get_message.friend);
                    });
                }
                if (get_message.group.length > 0 || get_message.friend.length > 0) {
                    var sum = 0;
                    if (get_message.group.length > 0) {
                        for (var i = 0; i < get_message.group.length; i++) {
                            sum = parseInt(get_message.group[i].num) + sum;
                        }
                    }
                    if (get_message.friend.length > 0) {
                        for (var i = 0; i < get_message.friend.length; i++) {
                            sum = parseInt(get_message.friend[i].num) + sum;
                        }
                    }
                    this_.Bottum_bar.set_alarm_num(sum, 'message');
                }
                setTimeout(get, 1000);
            });
        }
        get();
        /**
         * 获取好友请求
         */
        var get_friend;
        get_friend = function () {
            var form = new FormData();
            form.append("user_count", this_.Me.user_count);
            form.append("token", this_.Me.token);
            post("/php/friend.php?c=5", form, function (ret) {
                if (ret != -1) {
                    if (ret != this_.friend_quest_num) {
                        console.log(ret);
                        if (ret != this_.friend_quest_num) {
                            this_.friend_quest_num = ret;
                            new Promise(() => { this_.friend_quest_task() });
                        }
                    }
                    setTimeout(get_friend, 2000);
                } else {
                    console.log('error');
                }
            });
        }
        get_friend();
    }
    /**
     * 
     * @param {消息数组} message 
     * @param {函数库} data 
     */
    friend_task(message) {//好友消息处理函数
        console.log('好友消息');
        console.log(message);
        //console.log(data);
        var updated_message = new Array();
        var ret_tmp;
        for (var i = 0; i < message.length; i++) {
            var message_tmp = this.Chat.get_message_from_server(message[i].token, message[i].old_id);
            updated_message.push(message_tmp);
            ret_tmp = this.User.tkoen_to_count(message[i].token);
            //console.log(ret_tmp);
            this.Index.insect_index(
                new index_option(
                    1,
                    ret_tmp.pic == "no_set.webp" ? "../picture/no_set.webp" : ret_tmp.pic,
                    ret_tmp.alias != null ? ret_tmp.alias : ret_tmp.user_name,
                    "", message[i].token,
                    (token) => {
                        this.Chat_page_manager.in_chat_page(token);
                        this.Page.in_('chat');
                    },
                    message[i].num
                ));
            console.log(ret_tmp);
            this.Chat_page_manager.update_chat_message(message[i].token, message_tmp);
            //this.Chat_page_manager.add_chat_page(new chat_page(this.Me, 'chat', message_tmp, 1, message[i].token, ret_tmp.alias != null ? ret_tmp.alias : ret_tmp.user_name, ret_tmp));
            console.log(updated_message);
        }
    }
    /**
     * 
     * @param {消息数组} message 
     */
    group_task(message) {//群组消息处理函数
        console.log('群组消息');
        console.log(message);
        var updated_message = new Array();
        var ret_tmp;
        for (var i = 0; i < message.length; i++) {
            updated_message.push(this.Chat.get_message_from_server(message[i].token));
            ret_tmp = this.Group.token_to_info(message[i].token);
            console.log(ret_tmp);
            this.Index.insect_index(new index_option(1, ret_tmp.pic == null ? "../picture/no_set.webp" : ret_tmp.pic, ret_tmp.group_name, "", message[i].token, null, message[i].num,));
        }
    }

    friend_quest_task(reslove, reject) {
        var data = this.Friend_manager.get_fried_quest();
        console.log(data);
        var quest = this.Page.get_page_dom("friedn_quest_list");
        var p = this.Page.get_page_dom("allow_friend_quest");
        var 结果输出 = quest.get_dom("结果").get_dom("结果显示");
        console.log(结果输出);
        结果输出.dom.innerHTML = "";
        for (var i = 0; i < data.length; i++) {
            结果输出.insect(new Options_样式2(data[i].user_name, data[i].remark, "/users/user_pictures/" + data[i].pic, (d) => {
                p.send_data(d.data);
                this.Page.in_("allow_friend_quest");
            }, data[i].user_count, i))
        }
    }
}
