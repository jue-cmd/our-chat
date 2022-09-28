/**
 * 找数组A与数组B的不同 返回值 differ->不同的项(数组) more->多出来的(数组){object}
 * @param {数组} array_A 
 * @param {数组} array_B 
 */
function find_array_differ(array_A, array_B) {
    var return_array = new Array;
    for (var i = 0; i < array_A.length; i++) {
        for (var b = 0; b < array_B.length; b++) {
            if (array_A[i].token == jarray_B[b].token) {
                if (array_A[i].num != array_B[b].num) {
                    return_array.push(array_B[b]);
                    array_A[i] = array_B[b];
                }
                json.friend.splice(b, 1);
                continue;
            }
        }
    }
}