function start(Me) {
    this.form = new FormData;
    this.form.append("user_count", Me.user_count);
    this.form.append("token", Me.token);
    this.form.append("from", 0);
    setInterval(
        post_no_yibu("chat.php?c=5", this_.form, function (ret) {
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
            postMessage(i);
        })
        , 100);
}