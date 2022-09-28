window.onload = app;
function app() {
    //面页功能实现
    var Me, Page, Index, bottum_bar, Chat;
    Page = new page(); //面页对象
    ids = ['main', 'allow_friend_quest', 'personal_settings', 'chat', 'search_user', 'search_group', 'add_user_edit', 'friend_list', 'friedn_quest_list', 'group_creat', 'group_list',]; //id数组 对其进行批量注册
    for (i = 0; i < ids.length; i++) { //批量注册页面
        Page.reg(ids[i]);
    }
    Me = new me(getCookie("user_count"), getCookie('token'));
    ret = Me.get_user_data(() => {
        Page.ok_load();
    });
    Index = new index(null, 'index') //主页对象
    bottum_bar = new Navigation_bar('floor');
    bottum_bar.insect('消息列表', 'index_list_data', 1, 'icons-weixin', 'badge-danger', 0, 'message');
    bottum_bar.insect('好友', 'friends', 0, 'icons-contact', 'badge-danger', 0, 'friend');
    bottum_bar.insect('我', 'me', 0, 'icon-setting', 'badge-danger', 0, 'me');
    bottum_bar.init();
    function in_page(a) {
        Page.in_(a);
    }
    window.out_page = function out_page() {
        Page.out();
    }
    console.log(bottum_bar);
    //功能面页实现
    var TongXunLu = new Menu_Page("friends");
    TongXunLu.Insect_Option(new Menu_Option("查找用户", "/images/SVG/1_seo-mobile-setting-gear-cog-07.svg", () => {
         Page.in_("search_user") 
        }));
    TongXunLu.Insect_Option(new Menu_Option("查找聊群", "/images/SVG/1_seo-mobile-setting-gear-cog-07.svg", () => { 
        Page.in_("search_group")
        }));
    TongXunLu.Insect_Option(new Menu_Option("创建聊群", "/images/add.png", () => { 
        Page.in_("group_creat") 
        }));
    TongXunLu.Insect_Option(new Menu_Option("好友/聊群消息", "/images/SVG/1_marketing-email-mail-information-news.svg", () => { 
        Page.in_("friedn_quest_list") 
        }));
    TongXunLu.Insect_Option(new Menu_Option("好友列表", "/images/SVG/1_marketing-report-statistic-document-file.svg", ()=>{
        Page.in_("friend_list");
        }));
    //好友管理及聊群搜索实现
    var Friend = new friend_manager(Me);
    /**
     * 搜索实现
     */
    window.add_friend = function () {
        Friend.add_friend(Friend.user_count_add, document.getElementById("user_add_remark").value);
        Page.out();
    }

    /**
     * 搜索用户
     */
    //创建搜索框
    var search = Page.insect_something_topage("search_user", new input_search("人员搜索", "搜索", "", (ret) => {
    }, "", 0));
    //创建输出
    var list = Page.insect_something_topage("search_user", new list_样式1(1));
    //绑定行为
    search.change_onclick((data) => {
        //搜索实现
        list.dom.innerHTML = "";
        if (data.input.value != "") {
            var ret = new Promise(function (reslove, reject) {//异步调用

                var ret = Friend.search_friend(data.input.value);
                reslove(ret);
            });
            ret.then(function (value) {
                console.log(value);
                if (value != 0) {
                    for (var i = 0; i < value.length; i++) {
                        if (i > 50) {
                            break;
                        } else {
                            list.insect(new Options_样式2(value[i].user_name, value[i].user_count, "/users/user_pictures/" + value[i].pic, (value) => {
                                console.log(value);
                                Friend.add_friend_page(value.data);
                                Page.in_("add_user_edit");
                            }, value[i].user_count, i));
                        }
                    }
                } else {
                    list.insect(new Options_样式2("没这人", "没这人", null, () => {
                        window.alert("没这人");
                    }, null, i));
                }

            });
        }
    })
    /**
     * 好友请求同意
     */
    Page.insect_something_topage("friedn_quest_list", new 滚动条("结果")).insect(new list_样式1("结果显示"));
    //好友请求反应页面
    Page.insect_something_topage("allow_friend_quest",
        new 文本输入区("阿巴阿巴阿巴",
            "",
            0)).设置动作按钮([
                Page.insect_something_topage("allow_friend_quest",
                    new 按钮_样式绿色("加", (data) => {
                        console.log(data.get_bind_data().get_value())
                        console.log(data.get_father_data().get_data());
                        Friend.allow_friend_quest(1, data.get_father_data().get_data(), data.get_bind_data().get_value(), (ret) => {
                            Page.out();
                        });
                    }, 1)),
                Page.insect_something_topage("allow_friend_quest",
                    new 按钮_样式红色("不加", () => {
                        console.log(data.get_bind_data().get_value())
                        console.log(data.get_father_data().get_data());
                        Friend.allow_friend_quest(0, data.get_father_data().get_data(), data.get_bind_data().get_value(), (ret) => {
                            if (ret == 1) {
                                Page.out();
                            }
                        });
                    }, 2)),
            ]
            );
    /***
     * 输出好友列表
     */
    for (var i = 0; i < Me.friend_info.length; i++) {

    }

    window.in_page = (p) => {
        Page.in_(p);
    }
    //聊天功能实现
    //初始化消息列队
    console.log(typeof (Me))
    Chat = new chat(Me);
    var User = new user(Me);
    var Group = new group(Me);
    var chat_page = new chat_page_manager(Me);
    var task = new Tasks_Queued(Me,
        Page,
        Index,
        bottum_bar,
        Chat,
        User,
        Group,
        chat_page,
        Me,
        Friend);
    window.out_page = () => {
        Page.out();
        chat_page.out();
    };
    task.init();
    test = Me;
}