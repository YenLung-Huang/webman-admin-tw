/**
 * 取得控制器詳細權限，並決定要展示哪些按鈕或dom元素
 */
layui.$(function () {
    let $ = layui.$;
    $.ajax({
        url: "/app/admin/rule/permission",
        dataType: "json",
        success: function (res) {
            let style = '';
            let codes = res.data || [];
            let isSuperAdmin = false;
            // codes里有*，说明是超级管理员，拥有所有权限
            if (codes.indexOf('*') !== -1) {
                $("head").append("<style>*[permission]{display: initial}</style>");
                isSuperAdmin = true;
            }
            if (self !== top) {
                top.Admin.Account.isSuperAdmin = isSuperAdmin;
            } else {
                window.Admin.Account.isSuperAdmin = isSuperAdmin;
            }
            if (isSuperAdmin) return;

            // 細分權限
            layui.each(codes, function (k, code) {
                codes[k] = '*[permission^="'+code+'"]';
            });
            if (codes.length) {
                $("head").append("<style>" + codes.join(",") + "{display: initial}</style>");
            }
        }
    });
});