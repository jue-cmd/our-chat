class background {
    constructor(background_id) {
        this.background_list;
        this.dom = document.getElementById(background_id);
    }
    get_background(num) {
        var ret = post_no_yibu("https://rt.huashi6.com/front/works/advance/list?cursor=1&sort=newest&count=" + num, null, null);
        this.background_list = JSON.parse(ret);
        return this.background_list;
    }
    random_select_background() {
        console.log(this.background_list)
        var max_num = this.background_list.data.count - 1;
        var rand = Math.random();
        if (rand / 2 < 0.5) {
            var ret = "http://img2.huashi6.com/" + this.background_list.data.datas[Math.floor(rand * max_num)].coverImage.path;
            return ret;
        }
        else {
            var ret = "http://img2.huashi6.com/" + this.background_list.data.datas[Math.ceil(rand * max_num)].coverImage.path;
            return ret;
        }
    }
    change_background(picurl = this.random_select_background()) {
        this.dom.style = "background-image: url('" + picurl + "')";
    }
}