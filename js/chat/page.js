/**
 * 前端dom控制
 */

/**
 * 主页选项
 */

class background {
    constructor(background_id) {
        this.dom = document.getElementById(background_id);
    }
    change_background(picurl) {
        this.dom.style = "background-image: url('" + picurl + "')";
    }
}
class sound {

}
class index_option {
    /**
     * 
     * @param {int} type 1->聊群 2->好友
     * @param {string} pic_url 图片url
     * @param {string} title 标题
     * @param {string} subtitle 小标题
     */
    constructor(type, pic_url, title, subtitle, token, onclick_, alarm) {
        this.type = type;
        this.pic_url = pic_url;
        this.title = title;
        this.subtitle = subtitle;
        this.token = token;
        this.onclick = onclick_;
        this.alarm = alarm;
    }
}
/**
 * 主页类
 */
class index {
    /**
     * @param {index_option} index_array , null->重新开始
     * @param {string} 主页id
     */
    constructor(index_array, index_id) {
        if (typeof (index_array) == 'Object') {
            this.index_array = index_array;
        } else if (index_array == null) {
            this.index_array = new Array();
        } else {
            throw '类型错误';
        }
        this.index_page = document.getElementById(index_id);
    }
    //删除
    delete_index(token) {
        if (this.index_array.length != 0) {
            for (var i = 0; i < this.index_array.length; i++) {
                if (token == this.index_array[i].token) {
                    this.index_array.splice(i, 1);
                    this.index_page.removeChild(document.getElementById(token));
                    return;
                }
            }
        }
    }
    /**
     * 
     * @param {index_option} index_option 添加一条_在前面
     */
    insect_index(index_option) {
        if (this.index_array.length != 0) {
            for (var i = 0; i < this.index_array.length; i++) {
                if (index_option.token == this.index_array[i].token) {
                    if (index_option.alarm != this.index_array[i].alarm) {
                        this.delete_index(index_option.token);
                        this.insect_index(index_option);
                    }
                    return;
                }
            }
        }
        this.index_array.unshift(index_option);
        var a = document.createElement("a");
        a.className = "cell-item";
        a.href = "javascript:void(0);";
        a.id = index_option.token;
        a.onclick = () => {
            index_option.onclick(index_option.token);
        };
        var tmp_div = a.appendChild(document.createElement("div"));
        tmp_div.className = 'cell-icon';
        var tmp_img = tmp_div.appendChild(document.createElement('img'));
        tmp_img.src = index_option.pic_url;
        var tmp_div_ = a.appendChild(document.createElement('div'));
        tmp_div_.className = "cell-left";
        tmp_div_.innerHTML = index_option.title;
        var tmp_div__ = a.appendChild(document.createElement('div'));
        tmp_div__.className = "cell-right cell-arrow"
        var alarm = tmp_div__.appendChild(document.createElement('span'));
        alarm.className = 'badge badge-danger';
        if (index_option.alarm != 0) {
            alarm.innerHTML = index_option.alarm;
        }
        else {
            alarm.style = 'display: none';
        }
        this.index_page.insertBefore(a, this.index_page.childNodes[0]);
        var return_value = new Object;
        return_value.alarm = alarm;
        return_value.title = tmp_div_;
        return_value.picture = tmp_img;
        return return_value;
    }
    load_from_message(data) {

    }
}
/**
 * 单个面页类
 * page_dom
 * id
 */
class page_number {
    constructor(id) {
        this.id = id;
        this.page_dom = document.getElementById(id);
        this.data;
        this.elements = new Array();
    }
    insect(dom) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == dom.id) {
                return false;
            }
        }
        this.page_dom.appendChild(dom.dom);
        console.log("ok");
        this.elements.push(dom);
        dom.set_father_data(this);
        return dom;
    }
    get_dom(id) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id) {
                return this.elements[i];
            }
        }
    }
    send_data(data) {
        this.data = data;
    }
    clearn_data() {
        this.data = null;
    }
    get_data() {
        return this.data;
    }
}
/**
 * 面页管理类
 * in_(id)=>进入id为id的页面
 * out()=>退出当前界面
 * creat()=>创建界面
 * delete(id)=>删除界面
 * display()=>显示主界面
 * reg()=>注册页面 将已有页面注册进入数组
 */
class page {
    constructor() {
        this.page_array = new Array(); //创建面页数组
        this.entried_page = new Array(); //进入过的面页
    }
    /**
     * 
     * @param {string/int} id id
     * @returns pool
     */
    in_(id) {
        /**
         * 进入过的面页再次进入直接放到顶层 
         * 每个面页都有唯一的id
         */
        //检索面页是否存在
        if (this.entried_page.length > 0) {
            //遍历entried_page数组进行查重操作
            for (var i = 0; i < this.entried_page.length; i++) {
                if (this.entried_page[i].id == id) {
                    this.entried_page[this.entried_page.length - 1].page_dom.style = "display: none";
                    var tmp = this.entried_page[i];
                    this.entried_page.splice(i, 1);
                    this.entried_page.push(tmp);
                    tmp.page_dom.style = '';
                    return true;
                }
            }
        }
        for (var i = 0; i < this.page_array.length; i++) {
            if (this.page_array[i].id == id) {
                if (this.entried_page.length != 0) {
                    this.entried_page[this.entried_page.length - 1].page_dom.style = "display: none";
                }
                this.entried_page.push(this.page_array[i]);
                this.page_array[i].page_dom.style = '';
                return true;
            }
        }
        console.log("未找到面页");
        throw '未找到面页';
        return false;
    }

    /**
     * 退出页面
     */
    out() {
        if (this.entried_page.length - 1 > 0 && this.entried_page[this.entried_page.length - 1] != 'main') {
            this.entried_page[this.entried_page.length - 1].page_dom.style = "display: none";
            this.entried_page.splice(this.entried_page.length - 1, 1);
            this.entried_page[this.entried_page.length - 1].page_dom.style = "";
            return 'ok';
        }
        return '不能再退了';
    }
    //传入数组从上往下拼接
    creat(tittle, page_data) {
        if (typeof (page_data) == 'Array') {
            //创建div
            var tmp_div = document.body.appendChild(document.createElement("div"));
        }
    }
    delete() {

    }
    /**
     * @param {*} id 
     */
    reg(id) {
        var tmp = new page_number(id);
        tmp.page_dom.style = "display: none";
        this.page_array.push(tmp);

    }
    ok_load() {
        document.getElementById('load_page').style = "display:none";
        this.in_('main');
    }
    insect_something_topage(id, dom) {
        for (var i = 0; i < this.page_array.length; i++) {
            if (this.page_array[i].id == id) {
                return this.page_array[i].insect(dom);
            }
        }
    }
    get_page_dom(id) {
        for (var i = 0; i < this.page_array.length; i++) {
            if (this.page_array[i].id == id) {
                return this.page_array[i];
            }
        }
    }
}
/**
 * 标签为a
 */
class Navigation_bar {
    constructor(father) {
        this.father = document.getElementById(father);

        this.bottum = new Array();
    }
    insect(tittle, page_id, auto, ico, ico_class, alarm_num, id) {
        var tmp_a = this.father.appendChild(document.createElement("a"));//创建父节点
        tmp_a.className = "tabbar-item";
        tmp_a.href = "javascript:void(0);";

        //创建子节点 =>图标节点
        var tmp_ico = tmp_a.appendChild(document.createElement("span"));
        tmp_ico.className = "tabbar-icon";
        var tmp_ico_tmp = tmp_ico.appendChild(document.createElement("i"));
        tmp_ico_tmp.className = ico;
        //创建子子节点=> 消息数目提醒节点
        var tmp_message_alarm = tmp_ico.appendChild(document.createElement("span"));
        tmp_message_alarm.className = "badge " + ico_class;
        if (alarm_num == 0) {
            tmp_message_alarm.style = "display: none";
        }
        else {
            tmp_message_alarm.innerHTML = alarm_num;
        }
        //子节点=> 名称
        var tmp_name = tmp_a.appendChild(document.createElement("span"));
        tmp_name.className = "tabbar-txt";
        tmp_name.innerHTML = tittle;
        var ok_bottum = new Object();
        ok_bottum.father = tmp_a;
        ok_bottum.name = tmp_name;
        ok_bottum.alarm = tmp_message_alarm;
        ok_bottum.auto = auto;
        ok_bottum.page_dom = document.getElementById(page_id);
        ok_bottum.page_dom.style = 'display: none';
        var this_ = this;
        tmp_a.onclick = function () {
            for (var i = 0; i < this_.bottum.length; i++) {
                this_.bottum[i].father.className = "tabbar-item";
                this_.bottum[i].page_dom.style = 'display: none';
            }
            ok_bottum.page_dom.style = '';
            this.className = "tabbar-item tabbar-active";
        };
        ok_bottum.id = id;
        this.bottum.push(ok_bottum);
    }
    /**
     * @param {int} num 数字
     * @param {int} id  编号-》第几个
     */
    set_alarm_num(num, id) {
        for (var i = 0; i < this.bottum.length; i++) {
            if (this.bottum[i].id == id) {
                if (num == 0) {
                    this.bottum[i].alarm.style = 'display: none';
                } else {
                    this.bottum[i].alarm.style = "";
                    this.bottum[i].alarm.innerHTML = num;
                }
                return;
            }
        }
        console.log('你TM的');
    }
    init() {
        for (var i = 0; i < this.bottum.length; i++) {
            if (this.bottum[i].auto == 1) {
                this.bottum[i].father.className = "tabbar-item tabbar-active";
                this.bottum[i].page_dom.style = '';
                return;
            }
        }
    }
}
class Menu_Option {
    constructor(title, pic_url, onclick) {
        this.title = title;
        this.pic_url = pic_url;
        this.onclick = onclick;
    }
}
class Menu_Page {
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        this.id = id;
        this.page_dom = document.getElementById(id);
        this.Menu_Option_Array = new Array();
    }
    /**
     * 选项对象
     * @param {Menu_Option选项对象} menu_Option 
     * @returns 
     */
    Insect_Option(menu_Option) {
        var a = document.createElement("a");
        a.className = "cell-item";
        a.href = "javascript:void(0);";
        a.onclick = () => {
            menu_Option.onclick();
        };
        var tmp_div = a.appendChild(document.createElement("div"));
        tmp_div.className = 'cell-icon';
        var tmp_img = tmp_div.appendChild(document.createElement('img'));
        tmp_img.src = menu_Option.pic_url;
        var tmp_div_ = a.appendChild(document.createElement('div'));
        tmp_div_.className = "cell-left";
        tmp_div_.innerHTML = menu_Option.title;
        var tmp_div__ = a.appendChild(document.createElement('div'));
        tmp_div__.className = "cell-right cell-arrow"
        this.page_dom.append(a);
        //this.page_dom.insertBefore(a, this.page_dom.childNodes[0]);
        this.Menu_Option_Array.push(a);
        return a;
    }
}
class simple_functional_page_selection {
    /**
     * 
     * @param {页面的id} id 
     * @param {模式
     *         1=>开始时清空的
     *         2=>开始时保留的} mod 
     */
    constructor(id, mod) {
        this.page_dom = document.getElementById(id);
        this.mod = mod;
    }
    Insect() {

    }
}
/**
 * 以下是一些基本面页元素类
 */
class simple_elements {
    constructor() {

    }
    set_father_data(data) {
        this.father_data = data;
    }
    get_father_data() {
        return this.father_data;
    }
    set_data(data) {
        this.data = data;
    }
    get_data() {
        return this.data;
    }
    get_value() {

    }
}
//小选项卡
class Options_样式1 extends simple_elements {
    constructor(title, subtitle, pic_url, onclick, data, id) {
        var a = document.createElement("a");
        a.className = "cell-item";
        a.href = "javascript:void(0);";
        a.onclick = () => {
            onclick(this);
        };
        var tmp_div = a.appendChild(document.createElement("div"));
        tmp_div.className = 'cell-icon';
        var tmp_img = tmp_div.appendChild(document.createElement('img'));
        tmp_img.src = pic_url;
        var tmp_div_ = a.appendChild(document.createElement('div'));
        tmp_div_.className = "cell-left";
        tmp_div_.innerHTML = title;
        var tmp_div__ = a.appendChild(document.createElement('div'));
        tmp_div__.className = "cell-right cell-arrow"
        a.dataset.data = data;
        this.data = data;
        this.id = id;
        this.dom = a;
        this.father_data = null;
    }
}
class Options_样式2 extends simple_elements {
    constructor(title, subtitle, pic_url, onclick, data, id) {
        super();
        var a = document.createElement("a");
        a.href = "javascript:;";
        a.className = "list-item"
        a.onclick = () => {
            onclick(this);
        }
        var img = a.appendChild(document.createElement("div"));
        img.className = "list-img";
        img.appendChild(document.createElement("img")).src = pic_url;
        var div = a.appendChild(document.createElement("div"));
        div.className = "list-mes";
        var h3 = div.appendChild(document.createElement("h3"));
        h3.className = "list-title";
        h3.innerHTML = title;
        var div_ = div.appendChild(document.createElement("div"));
        div_.className = "list-mes-item";
        var span = div_.appendChild(document.createElement("span"));
        span.className = "list-price";
        span.appendChild(document.createElement("em"));
        span.innerHTML += subtitle;
        this.dom = a;
        this.data = data;
        this.id = id;
    }
    get_data() {
        return this.data;
    }
}
//输入框
class input_search extends simple_elements {
    constructor(title, subtitle, pic_url, onclick, data, id) {
        super();
        var search = document.createElement("div");
        search.className = "cell-item";
        var left = search.appendChild(document.createElement("div"));
        left.className = "cell-left";
        var i = left.appendChild(document.createElement("i"));
        i.className = "icon-search";
        var right = search.appendChild(document.createElement("div"));
        right.className = "cell-right";
        var input_dom = right.appendChild(document.createElement("input"));
        input_dom.className = "cell-input";
        input_dom.placeholder = title;
        input_dom.mplete = "off";
        input_dom.oninput = () => {
            onclick(this);
        }
        var a = right.appendChild(document.createElement("a"));
        a.href = "javascript:;";
        a.onclick = () => { onclick(this) }
        a.className = "btn btn-primary";
        a.innerHTML = subtitle;
        a.dataset.data = data;
        this.input = input_dom;
        this.dom = search;
        this.a = a;
        this.id = id;
    }
    change_onclick(func) {
        this.input.oninput = () => {
            func(this);
        }
        this.a.onclick = () => {
            func(this);
        }
    }
}
/**
 * 摞列类
 */
class list_样式1 extends simple_elements {
    constructor(id) {
        super();
        var dom;
        dom = document.createElement("article");
        dom.className = "m-list list-theme4";
        this.dom = dom;
        this.id = id;
    }
    insect(dom) {
        return this.dom.appendChild(dom.dom);
    }
}


/**
 * 滚动条
 */

class 滚动条 extends simple_elements {
    constructor(id) {
        super();
        this.dom = document.createElement("section");
        this.dom.className = "g-scrollview";
        this.id = id;
        this.elements = new Array();
        return this;
    }
    insect(dom) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == dom.id) {
                return false;
            }
        }
        this.dom.appendChild(dom.dom);
        console.log("ok");
        this.elements.push(dom);
        return dom;
    }
    get_dom(id) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id) {
                return this.elements[i];
            }
        }
    }
}
//文本输入
class 文本输入区 extends simple_elements {
    constructor(悬浮的字, 默认的字, id) {
        super();
        var a = document.createElement("textarea");
        a.className = "cell-textarea";
        a.placeholder = 悬浮的字;
        a.innerHTML = 默认的字;
        this.id = id;
        this.dom = a;

    }
    设置动作按钮(动作按钮) {
        if (动作按钮 != null) {
            for (var i = 0; i < 动作按钮.length; i++) {
                动作按钮[i].add_bind_data(this);
            }
        }
        this.动作按钮 = 动作按钮;
    }
    get_value() {
        return this.dom.value;
    }
}
class 按钮_样式绿色 extends simple_elements {
    constructor(里面的字, 动作, id) {
        super();
        var a = document.createElement("button");
        a.type = "button";
        a.className = "btn-block btn-primary";
        a.onclick = () => {
            动作(this
            );
        };
        a.innerHTML = 里面的字;
        this.id = id;
        this.dom = a;
        this.return_value = null;
    }
    add_bind_data(data) {
        this.return_value = data;
    }
    get_bind_data() {
        return this.return_value;
    }
    get_value() {
        return true;
    }
}
class 按钮_样式红色 extends simple_elements {
    constructor(里面的字, 动作, id) {
        super();
        var a = document.createElement("button");
        a.type = "button";
        a.className = "btn-block btn-danger";
        a.onclick = () => {
            动作(
                this
            );
        };
        a.innerHTML = 里面的字;
        this.id = id;
        this.dom = a;
        this.return_value = null;
    }
    add_bind_data(data) {
        this.return_value = data;
    }
    get_bind_data() {
        return this.return_value;
    }
    get_value() {
        return false;
    }
}
/* FUCK 2345(章鱼) 金山毒霸 鲁大师 腾讯电脑管家 360 滕迅OO */
