class group {
    constructor(me) {
        this.group_info = me.group_info;
        console.log(this.group_info);
    }
    get_info_from_server(count) {

    }
    token_to_id(token) {
        for (var i = 0; i < this.group_info.length; i++) {
            if (this.group_info[i].token == token) {
                return this.group_info[i].id;
            }
        }
        return null;
    }
    id_to_info(id) {
        for (var i = 0; i < this.group_info.length; i++) {
            if (this.group_info[i].id == id) {
                return this.group_info[i];
            }
        }
        return null;
    }
    token_to_info(token) {
        return this.id_to_info(this.token_to_id(token));
    }
}