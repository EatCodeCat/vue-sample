/**
 * Created by TQ on 2017/4/6.
 */



//转换数字每三位加上逗号
function toThousands (s){
    let n = 3
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat ((s + "").replace (/[^\d\.-]/g, "")).toFixed (n) + "";
    var l = s.split (".")[ 0 ].split ("").reverse (),
        r = s.split (".")[ 1 ];
    let t = "";
    for ( let i = 0; i < l.length; i++ ) {
        t += l[ i ] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split ("").reverse ().join ("");
}

function toTenThousand (num){

    if ( num >= 10000 ) {
        return (num / 10000).toFixed (2) + "万";
    }
    else {
        return num;
    }
}

function formatPhone (num){

    if ( !/\d{11}/.test (num) ) {
        return num;
    }

    var a = Array.from (num.toString ())
    a.splice (3, 0, '-');
    a.splice (8, 0, '-');
    return a.join ('');

}

export {
    toThousands, toTenThousand,formatPhone
}
