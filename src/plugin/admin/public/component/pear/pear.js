window.rootPath = (function (src) {
	src = document.currentScript
		? document.currentScript.src
		: document.scripts[document.scripts.length - 1].src;
	return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
	base: rootPath + "module/",
	version: "3.10.0"
}).extend({
	admin: "admin", 	// 框架佈局元件
	menu: "menu",		// 資料選單組件
	frame: "frame", 	// 內容頁面元件
	tab: "tab",			// 多重選項卡組件
	echarts: "echarts", // 資料圖表組件
	echartsTheme: "echartsTheme", // 資料圖表主題
	encrypt: "encrypt",		// 資料加密元件
	select: "select",	// 下拉多重選擇組件
	xmSelect: "xm-select",	// 下拉多重選取元件 //變更
	drawer: "drawer",	// 抽屜彈層組件
	notice: "notice",	// 訊息提示元件
	step:"step",		// 分佈表單元件
	tag:"tag",			// 多重標籤頁元件
	popup:"popup",      // 彈層封裝
	treetable:"treetable",   // 樹狀表格
	dtree:"dtree",			// 樹狀結構
	tinymce:"tinymce/tinymce", // 編輯器
	area:"area",			// 省市級聯  
	count:"count",			// 數字滾動
	topBar: "topBar",		// 置頂組件
	button: "button",		// 載入按鈕
	design: "design",		// 表單設計
	card: "card",			// 資料卡組件
	loading: "loading",		// 載入元件
	cropper:"cropper",		// 裁切組件
	convert:"convert",		// 資料轉換
	yaml:"yaml",			// yaml 解析組件
	context: "context",		// 上下文元件
	http: "http",			// ajax請求元件
	theme: "theme",			// 主題轉換
	message: "message",     // 通知組件
	toast: "toast",         // 訊息通知
	iconPicker: "iconPicker",// 圖示選擇
	nprogress: "nprogress",  // 進度過渡
	watermark:"watermark/watermark", //水印
	fullscreen:"fullscreen",  //全螢幕組件
	popover:"popover/popover" //汽泡組件
}).use(['layer', 'theme'], function () {
	layui.theme.changeTheme(window, false);
});