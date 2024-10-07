/**
 *@Name dtree 樹狀組件
 *@Author 智慧的小西瓜
 *@DOCS http://www.wisdomelon.com/DTreeHelper/
 *@License https://www.layui.com/
 *@LASTTIME 2019/10/24
 *@VERSION v2.5.6
 */
layui.define(['jquery','layer','form'], function(exports) {
    var $ = layui.$,
        layer = layui.layer,
        form = layui.form;

    // 樹的公共定義樣式總結
    var LI_NAV_CHILD = "dtree-nav-ul-sid", LI_NAV_ITEM = "dtree-nav-item",
        LI_DIV_ITEM = "dtree-nav-div",  DTREEFONTSPECIAL="dtreefont-special", NONETITLE="dtree-none-text",
        LI_DIV_MENUBAR = "dtree-menubar",
        LI_DIV_TOOLBAR = "dtree-toolbar", TOOLBAR_TOOL = "dtree-toolbar-tool",  TOOLBAR_TOOL_EM = "dtree-toolbar-fixed",
        LI_DIV_CHECKBAR = "dtree-nav-checkbox-div",
        LI_CLICK_CHECKBAR = "d-click-checkbar",		//綁定點擊複選框時需要用到
        LI_DIV_TEXT_CLASS = "t-click", UL_ROOT="dtree",
        LI_NAV_FIRST_LINE = "dtree-nav-first-line", LI_NAV_LINE = "dtree-nav-line", LI_NAV_LAST_LINE = "dtree-nav-last-line";


    // 樹的公共指定
    var NAV_THIS = "dtree-nav-this",	//當前節點
        NAV_SHOW = "dtree-nav-show",	//顯示子節點
        NAV_HIDE = "dtree-nav-hide",	//隱藏節點
        NAV_DIS = "dtree-disabled",		//禁用節點
        ICON_HIDE = "dtree-icon-hide",  //隱藏圖示
        $BODY = $("body"),				//body選擇器
        $WIN = $(window),				//window窗口
        $DOC = $(document),				//當前文檔
        MOD_NAME = "dtree",				//模組名稱
        VERSION = "v2.5.6",				//版本
        OPTIONS = {},					//全域屬性配置
        DTrees = {};				    //目前被實例化的樹的集合

    // 樹的自訂圖示
    var DTREEFONT = "dtreefont",									//預設使用圖示字體
        LI_DIV_CHECKBAR_ON = "dtree-icon-fuxuankuangxuanzhong", 	//複選框選取圖示
        LI_DIV_CHECKBAR_OUT = "dtree-icon-fuxuankuang", 			//複選框未選取圖示
        LI_DIV_CHECKBAR_NOALL = "dtree-icon-fuxuankuang-banxuan",	//複選框半選圖示
        LI_DIV_MENUBAR_DOWN = "dtree-icon-move-down", 				//menubar的展開全部的圖示
        LI_DIV_MENUBAR_UP = "dtree-icon-move-up", 					//menubar的收縮全部的圖示
        LI_DIV_MENUBAR_REFRESH = "dtree-icon-refresh",				//menubar的重新整理圖示
        LI_DIV_MENUBAR_CHECKALL = "dtree-icon-roundcheckfill", 		//menubar的全選圖示
        LI_DIV_MENUBAR_UNCHECKALL = "dtree-icon-roundclosefill", 	//menubar的全不選圖示
        LI_DIV_MENUBAR_INVERTALL = "dtree-icon-roundcheck", 		//menubar的反選圖示
        LI_DIV_MENUBAR_DELETE = "dtree-icon-delete1", 				//menubar的刪除圖示
        LI_DIV_MENUBAR_SEARCH = "dtree-icon-search_list_light",		//menubar的搜尋圖示
        LI_DIV_TOOLBAR_PULLDOWN = "dtree-icon-pulldown", 			//toolbar的展開圖示
        LI_DIV_TOOLBAR_PULLUP = "dtree-icon-pullup", 				//toolbar的收縮圖示
        LI_DIV_TOOLBAR_ADD = "dtree-icon-roundadd", 				//toolbar的新增圖示
        LI_DIV_TOOLBAR_EDIT = "dtree-icon-bianji", 					//toolbar的編輯圖示
        LI_DIV_TOOLBAR_DEL = "dtree-icon-roundclose";				//toolbar的刪除圖示

    // 樹的非葉節點圖示集合
    var nodeIconArray = {
        "-1": {"open": "dtree-icon-null-open", "close": "dtree-icon-null-close"},			//未指定
        "0" : {"open": "dtree-icon-wenjianjiazhankai", "close": "dtree-icon-weibiaoti5"},	//資料夾(二級圖示預設樣式)
        "1" : {"open": "dtree-icon-jian", "close": "dtree-icon-jia"},						//+-圖示(一級圖示預設樣式)
        "2" : {"open": "dtree-icon-xiangxia1", "close": "dtree-icon-xiangyou"}				//箭頭圖示
    };

    // 樹的葉子節點圖示集合
    var leafIconArray = {
        "-1": "dtree-icon-null",				//未指定
        "0" : "dtree-icon-weibiaoti5", 			//資料夾
        "1" : "dtree-icon-yonghu",				//人員
        "2" : "dtree-icon-fenzhijigou",			//機構
        "3" : "dtree-icon-fenguangbaobiao",		//報表
        "4" : "dtree-icon-xinxipilu",			//資訊
        "5" : "dtree-icon-shuye1",				//葉子(二級圖示預設樣式)
        "6" : "dtree-icon-caidan_xunzhang",	    //勳章
        "7" : "dtree-icon-normal-file",		    //文件
        "8" : "dtree-icon-dian",				//小圓點（一級圖示預設樣式）
        "9" : "dtree-icon-set-sm",				//齒輪
        "10" : "dtree-icon-rate"				//星星
    };

    // 樹的自訂樣式
    var DTREE = "dtree-",			//自訂樣式前綴
        ITEMTHIS = "-item-this",	//自訂樣式目前行選取後綴
        ITEM = "-item",				//自訂樣式目前行後綴
        DFONT = "-dtreefont",		//自訂樣式圖示樣式後綴
        FICON = "-ficon",			//自訂樣式一級圖示樣式後綴
        ICON = "-icon",				//自訂樣式二級圖示樣式後綴
        CBOX = "-checkbox",			//自訂樣式複選框樣式後綴
        CHS = "-choose";			//自訂樣式複選框選取樣式後綴

    // 樹自訂操作事件名稱集合	綁定dtree-click的事件
    var eventName = {
        checkNodeClick: "checkNodeClick",				//點擊複選框
        itemNodeClick: "itemNodeClick"					//點擊子節點div
    };

    // 樹預設toolbar提供的功能集合	綁定dtree-tool的事件
    var defaultTool = {
        pulldown: "pulldown",							//點擊展開目前節點下的全部節點
        pullup: "pullup",								//點擊收縮目前節點下的全部節點
        addTool: "addToolbar",						//點擊toolbar新增
        editTool: "editToolbar",						//點擊toolbar編輯
        delTool: "delToolbar"						//點擊toolbar刪除
    };

    // 樹預設menubar提供的功能集合	綁定dtree-menu的事件
    var defaultMenu = {
        moveDown: "moveDown",							//menubar展開全部節點
        moveUp: "moveUp",								//menubar收縮全部節點
        refresh: "refresh",								//menubar重新整理樹
        checkAll: "checkAll",							//menubar全選
        unCheckAll: "unCheckAll",						//menubar全不選
        invertAll: "invertAll",							//menubar反選
        remove: "remove",								//menubar刪除選取節點
        searchNode: "searchNode"						//menubar查詢節點
    };

    // 樹的公共事件
    var event = {
        getElemId: function(options){	// 根據傳入的參數取得ID
            var elem = options.elem || "";
            var obj = options.obj || $(elem);

            if (obj.length == 0) {	//頁面中未找到綁定id
                return "";
            } else {
                return $(obj)[0].id;
            }
        },
        escape: function(html){
            if(typeof html !== 'string') return '';
            return html.replace(entityReg.escape, function(match){return entityMap.escape[match];});
        },
        unescape: function(str){
            if(typeof str !== 'string') return '';
            return str.replace(entityReg.unescape, function(match){return entityMap.unescape[match];});
        },
        cloneObj: function (obj, filter) {  //深複製物件方法
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            var str = "";
            if(typeof filter !== 'undefined') {str = filter.join(",");}
            for (var key in obj) {
                if(str.indexOf(key) == -1){
                    var val = obj[key];
                    newObj[key] = typeof val === 'object' ? event.cloneObj(val, typeof filter !== undefined ? filter : []): val;
                }

            }
            return newObj;
        },
        trimToDot: function(str){
            return str.replace(/ /g, ".");
        }
    };

    // 特殊符號轉義
    var keys = Object.keys || function(obj) {
        obj = Object(obj);
        var arr = [];
        for(var a in obj) arr.push(a);
        return arr;
    };
    var invert = function(obj){
        obj = Object(obj);
        var result = {};
        for(var a in obj) result[obj[a]] = a;
        return result;
    };
    var entityMap = {
        escape: {
            "&" : "&amp;",
            "<" : "&lt;",
            ">" : "&gt;",
            "'" : "&quo;"
        }
    };
    entityMap.unescape = invert(entityMap.escape);
    var entityReg = {
        escape: RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
    };

    //非同步載入介面
    var AjaxHelper = {
        request : function(config) {
            var data = config.data ? config.data : {};
            var async = (typeof (config.async) === "boolean") ? config.async : true;
            $.ajax({
                type : config.type ? config.type : "POST",
                headers : config.headers,
                url : config.url,
                dataType : config.dataType ? config.dataType : "json",
                data : data,
                async : async,
                contentType : config.contentType,
                xhrFields: {withCredentials: config.withCredentials},
                success : config.success,
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof (config.error) === "function") {
                        config.error(XMLHttpRequest, textStatus, errorThrown);
                    } else {
                        layer.msg("非同步載入失敗： " + textStatus,{icon:5, shift:6});
                    }
                },
                statusCode : {
                    404 : function() {
                        layer.msg('未找到指定請求，請檢查存取路徑！',{icon:5, shift:6});
                    },
                    500 : function() {
                        layer.msg('系統錯誤！',{icon:5, shift:6});
                    }
                },
                complete : function(XMLHttpRequest, textStatus) {
                    if (typeof (config.complete) === "function") {
                        config.complete(XMLHttpRequest, textStatus);
                    }
                }
            });
        },
        serialize: function(param){	//json序列化   key=value&key1=value1
            var p = "?";
            for (var key in param) {
                p += key + "=" + param[key] + "&";
            }
            p = p.substring(0, p.length-1);
            return p;
        }
    };

    // 樹類
    var DTree = function(options){
        var _this = this;
        /** 預設賦值**/
        this.formatter = {	// 資料過濾
            title: false    // 文字，預設不開啟
        };
        this.response = {  // 樹回傳的json格式
            statusName: "code",		//返回標識
            statusCode: 200,		//返回碼
            message: "message",		//返回訊息
            rootName: "data",		//根節點名稱
            treeId: "id",			//節點ID
            parentId: "parentId",	//父節點ID
            title: "title",			//節點名稱
            ficonClass: "ficonClass", //自訂一級圖示
            iconClass: "iconClass",	  //自訂二級圖示
            childName: "children",	//子節點名稱
            last: "last",		//是否最後一級節點
//			level: "level",			//層級
            spread: "spread",		//展開
            disabled: "disabled",	//禁用
            hide: "hide",		//隱藏
            checkArr: "checkArr",	//複選框清單
            checked: "checked", //是否選取
            type: "type",			//複選框標記
            basicData: "basicData"	//表示使用者自訂需要儲存在樹節點中的資料
        };
        this.defaultRequest = {  // 樹的預設發起請求參數格式，最後會將value作為參數名稱傳遞
            nodeId: "nodeId",		//節點ID
            parentId: "parentId",	//父節點ID
            context: "context",	//節點內容
            leaf: "leaf",		//是否葉子節點
            level: "level",		//層級
            spread: "spread",		//節點展開狀態
            dataType: "dataType",	//節點標記
            checked: "checked",	//節點複選框選取狀態
            initchecked: "initchecked",	//節點複選框初始狀態
            basicData: "basicData",		//用戶自訂的記錄節點資料
            recordData: "recordData",		//當前data資料（排除basicData和children欄位）
        };
        this.toolbarFun = {
            addTreeNode: function(param, $div) {	//新增樹節點後呼叫的函數，用於使用者自訂，如未指定則樹不會改變
                return ;
            },
            editTreeNode: function(param, $div) {	//編輯樹節點後呼叫的函數，用於使用者自訂，如未指定則樹不會改變
                return ;
            },
            editTreeLoad: function(param){	// 編輯樹的資料回顯，用於開啟編輯時，回填資料
                return ;
            },
            delTreeNode: function(param, $div){	//刪除樹後呼叫的函數，用於使用者自訂，如未指定則樹不會改變
                return ;
            },
            loadToolbarBefore: function(buttons, param, $div){  // 右鍵選單載入前的函數
                return buttons;
            }
        };
        this.toolbarStyle = {
            title: "節點",
            area: ["60%","80%"]
        };
        this.menubarFun = {
            remove: function(checkbarNodes){			//刪除複選框選取節點，需要使用者自訂，如未指定則樹只是頁面上做了修改
                return true;
            }
        };
        this.menubarTips = {
            toolbar: [],
            group: [defaultMenu.moveDown, defaultMenu.moveUp, defaultMenu.refresh, defaultMenu.checkAll, defaultMenu.unCheckAll, defaultMenu.invertAll, defaultMenu.remove, defaultMenu.searchNode],
            freedom: []
        };
        this.checkbarFun = {
            chooseBefore: function($i, node){	// 複選框點擊前回呼
                return true;
            },
            chooseDone: function(checkbarNodesParam) {	//複選框點擊事件完畢後，返回該樹關於複選框操作的全部資訊，用於用戶自定義，如未指定則樹只是頁面上做了修改
                return ;
            }
        };
        this.iframeDefaultRequest = {  //iframe的預設參數,目的是與載入樹的參數不一樣
            nodeId: "nodeId",		//節點ID
            parentId: "parentId",	//父節點ID
            context: "context",	//節點內容
            leaf: "leaf",		//是否葉子節點
            level: "level",		//層級
            spread: "spread",		//節點展開狀態
            dataType: "dataType",	//節點標記
            checked: "checked",	//節點複選框選取狀態
            initchecked: "initchecked",	//節點複選框初始狀態
            basicData: "basicData",		//用戶自訂的記錄節點資料
            recordData: "recordData",		//當前data資料（排除basicData和children欄位）
        };

        this.iframeFun = {
            iframeDone: function(iframeParam){	//iframe載入完畢後，用於使用者自訂事件
                return ;
            }
        };
        this.style = {			//樹最終使用的樣式集合
            item: "",			//每一項div的樣式
            itemThis: "",		//選中div的樣式
            dfont: "",			//一級圖示的樣式
            icon: "",			//二級圖示的樣式
            cbox: "",			//複選框的樣式
            chs: ""				//複選框選取的樣式
        };
        this.usefontStyle = {		//樹最終使用的圖示集合
            fnode:{					//一級節點
                node:{				//非葉節點
                    open:"",		//節點展開
                    close:""		//節點關閉
                },
                leaf:""				//葉子節點
            },
            snode:{					//二級節點
                node:{				//非葉節點
                    open:"",		//節點展開
                    close:""		//節點關閉
                },
                leaf:""				//葉子節點
            },
            checkbox:{				//複選框
                on:"",				//複選框選取
                out:"",				//未選取
                noall:""			//半選
            },
            menubar:{				//選單列
                movedown:"",		//全部展開
                moveup:"",			//全部收縮
                refresh:"",			//重新整理
                checkAll:"",		//全選
                unCheckAll:"",		//全不選
                invertAll:"",		//反選
                remove:"",			//刪除
                search:""			//搜尋
            },
            menubarExt:"",			//擴充功能表列
            toolbar:{				//工具列
                menubar:{			//依附在選單列的工具列
                    movedown:"",	//全部展開
                    moveup:"",		//全部收縮
                    refresh:"",		//重新整理
                    checkAll:"",	//全選
                    unCheckAll:"",	//全不選
                    invertAll:"",	//反選
                    remove:"",		//刪除
                    search:""		//搜尋
                },
                menubarExt:"",		//依附在選單列的擴充功能表列
                pulldown:"",		//展開
                pullup:"",			//收縮
                add:"",				//添加
                edit:"",			//編輯
                del:""				//刪除
            },
            toolbarExt:""			//擴充工具列
        }

        /** 資料綁定**/
        this.node = {		// 樹節點選取時，包含目前節點的全部資訊
            nodeId: "",		//節點ID
            parentId: "",	//父節點ID
            context: "",	//節點內容
            leaf: "",		//是否葉子節點
            level: "",		//層級
            spread: "",		//節點展開狀態
            dataType: "",	//節點標記
            checked: "",	//節點複選框選取狀態
            initchecked: "",	//節點複選框初始狀態
            basicData: "",		//用戶自訂的記錄節點資料
            recordData: "",		//當前data資料（排除basicData和children欄位）
        };
        
        this.toolbarMenu = {};	// 工具列右鍵選單綁定的所有元素
        this.checkbarNode = [];	// 複選框標記的全部節點資料
        this.errData = [];		// 記錄在渲染節點時有問題的資料
        this.checkArrLen = 0;	//新增節點的時判斷複選框個數
        this.temp = [];	// 暫時變數
        this.bak = "";	// 暫時變數
        this.setting(options);
    };

    /******************** 初始參數載入 ********************/
    // 設定基本參數值
    DTree.prototype.setting = function(options) {
        this.options = options || {};

        /** 綁定元素參數（必填，2個參數項目必填一個）**/
        this.elem = this.options.elem || OPTIONS.elem ||  ""; //樹綁定的元素ID：#elem
        if(typeof this.options.obj === 'undefined'){
            if(this.elem) {
                if($(this.elem).length > 0) {
                    this.obj = $(this.elem);
                }
            }
        } else {
            this.obj = this.options.obj || OPTIONS.obj || this.obj; //樹綁定的jquery元素，用來當元素是延遲載入出來的話，可以用這個找到
            this.elem = "#" + this.obj[0].id;
        }

        /** 基本參數**/
        this.scroll = this.options.scroll || OPTIONS.scroll || this.elem; //樹的上級div容器，讓樹可以顯示捲軸的div容器的ID
        this.accordion = (typeof (this.options.accordion) === "boolean") ? this.options.accordion : (typeof (OPTIONS.accordion) === "boolean") ? OPTIONS.accordion : false; //手風琴加載， 預設false
        if(this.accordion) {
            this.initLevel = 1; //預設展開節點 1節
        } else {
            this.initLevel = this.options.initLevel || OPTIONS.initLevel || 2; //預設展開節點 2節
        }
        this.type = this.options.type || OPTIONS.type || "load"; //樹的載入方式 all，全量樹， load，增量樹，預設load
        this.cache = (typeof (this.options.cache) === "boolean") ? this.options.cache : (typeof (OPTIONS.cache) === "boolean") ? OPTIONS.cache : true; //資料緩存，預設true
        this.record =  this.options.record || OPTIONS.record || false; //開啟資料記錄模式，預設false
        this.load = (typeof (this.options.load) === "boolean") ? this.options.load : (typeof (OPTIONS.load) === "boolean") ? OPTIONS.load : true; //開啟載入動畫，預設true
        this.none = this.options.none || OPTIONS.nont || "無資料";	 //初始載入無記錄時顯示文字
        this.tempHeight = this.options.height || OPTIONS.height; //暫時轉換高度變數
        if(this.tempHeight) { // 設定高度
            if(/^full-\d+$/.test(this.tempHeight)) {
                this.fullHeightGap = this.tempHeight.split('-')[1];
                this.height = $WIN.height() - this.fullHeightGap; //設定高度
            } else {
                this.fullHeightGap = this.tempHeight;
                this.height = this.tempHeight;
            }
        } else {
            this.fullHeightGap = "";
            this.height = "";
        }
        this.width = this.options.width || OPTIONS.width  || "260"; //寬度
        this.obj.css("width", this.width);

        /** 樣式相關參數**/
        this.iconfont = this.options.iconfont || OPTIONS.iconfont || DTREEFONT; //預設圖示字體 dtreefont
        this.iconfontStyle = this.options.iconfontStyle  || OPTIONS.iconfontStyle || {}; //用於自訂樹的每個關鍵部位使用的圖示
        this.nodeIconArray = $.extend(nodeIconArray, this.options.nodeIconArray || OPTIONS.nodeIconArray) || nodeIconArray; //使用者自訂非葉子節點圖示集合，node
        this.leafIconArray = $.extend(leafIconArray, this.options.leafIconArray || OPTIONS.leafIconArray) || leafIconArray; //使用者自訂葉節點圖示集合，leaf
        this.skin = this.options.skin || OPTIONS.skin || "theme"; // 自訂樣式
        if(this.skin == "layui"){ // layui主題
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : (typeof (OPTIONS.line) === "boolean") ? OPTIONS.line : true; //開啟樹線，預設開啟
            this.ficon = this.options.ficon || OPTIONS.ficon || "7"; //一級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示一級圖示。默認'7'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一級圖示中的node節點圖示。0：資料夾，1：+、-，2：三角形， -1：不顯示一級圖標，預設'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1]; //一級圖示中的leaf節點圖示
            this.icon = this.options.icon || OPTIONS.icon || "-1"; //二級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示二級圖示。默認'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二級圖示中的node節點圖標。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二級圖示中的leaf節點圖示
        } else if(this.skin == "laySimple"){ // laySimple主題
            this.line = this.options.line || OPTIONS.line || false; //開啟樹線，預設不開啟
            this.ficon = this.options.ficon || OPTIONS.ficon || ["2","-1"];	//一級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示一級圖示。默認'-1'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "2") : this.ficon[0]; //一級圖示中的node節點圖示。0：資料夾，1：+、-，2：三角形， -1：不顯示一級圖標，預設'2'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1];	// 一級圖示中的leaf節點圖示
            this.icon = this.options.icon || OPTIONS.icon || "-1"; //二級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示二級圖示。默認'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二級圖示中的node節點圖標。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二級圖示中的leaf節點圖示
        } else { // 預設主題 或自訂主題
            this.line = this.options.line || OPTIONS.line || false; //開啟樹線，預設不開啟
            this.ficon = this.options.ficon || OPTIONS.ficon || "8"; //一級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示一級圖示。默認'8'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一級圖示中的node節點圖示。0：資料夾，1：+、-，2：三角形， -1：不顯示一級圖標，預設'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1];	// 一級圖示中的leaf節點圖示
            this.icon = this.options.icon || OPTIONS.icon || "5"; //二級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示二級圖示。默認'5'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "0") : this.icon[0]; //二級圖示中的node節點圖標。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'0'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二級圖示中的leaf節點圖示
        }

        /** 資料載入參數**/
        this.url = this.options.url || OPTIONS.url || ""; //請求地址
        this.async = (typeof (this.options.async) === "boolean") ? this.options.async : (typeof (OPTIONS.async) === "boolean") ? OPTIONS.async : true; //非同步同步載入,預設非同步載入
        this.headers = this.options.headers || OPTIONS.headers || {}; //ajax header屬性
        this.method = this.options.method || OPTIONS.method || "post"; //請求類型
        this.dataType = this.options.dataType || OPTIONS.dataType || "json"; //參數類型
        this.contentType = this.options.contentType || OPTIONS.contentType || "application/x-www-form-urlencoded"; //傳送訊息至伺服器時內容編碼類型
        this.defaultRequest = $.extend(this.defaultRequest, this.options.defaultRequest || OPTIONS.defaultRequest) || this.defaultRequest; //預設請求參數
        this.filterRequest = this.options.filterRequest || OPTIONS.filterRequest || [];	//過濾請求參數
        this.request = this.options.request || OPTIONS.request || {}; //使用者自訂請求參數
        this.response = $.extend(this.response, this.options.response || OPTIONS.response) || this.response; //返回json格式
        this.data = this.options.data || OPTIONS.data || null; //初始化指定該參數，則不會存取非同步介面
        this.dataFormat = this.options.dataFormat || OPTIONS.dataFormat || "levelRelationship"; //用於使用者配置的data資料格式，list：列表， levelRelationship：層級關係，預設
        this.dataStyle = this.options.dataStyle || OPTIONS.dataStyle || "defaultStyle"; //用於使用者配置layui通用的json資料風格,layuiStyle:layui風格，defaultStyle：預設風格
        this.errDataShow = this.options.errDataShow || OPTIONS.errDataShow || false; //遞迴資料是否出現錯誤後，顯示錯誤訊息，預設false
        this.withCredentials = this.options.withCredentials || OPTIONS.withCredentials || false; //是否允許跨域請求，預設false
        this.success = this.options.success || OPTIONS.success || function(data, obj){}; //樹載入完畢後執行解析樹之前的回呼
        this.done = this.options.done || OPTIONS.done || function(data, obj){};	 //樹載入完畢後的回呼
        this.formatter = $.extend(this.formatter, this.options.formatter || OPTIONS.formatter) || this.formatter; //資料過濾
        this.error = this.options.error || OPTIONS.error || function(XMLHttpRequest, textStatus, errorThrown){}; // 非同步載入異常回呼
        this.complete = this.options.complete || OPTIONS.complete || function(XMLHttpRequest, textStatus){};	// 非同步載入完成回呼

        /** 複選框參數**/
        this.checkbar = this.options.checkbar || OPTIONS.checkbar || false; //是否開啟複選框模式
        this.checkbarLoad = this.options.checkbarLoad || OPTIONS.checkbarLoad || "node"; //複選框作用範圍，node：所有節點， leaf：最後一級；預設所有節點
        this.checkbarType = this.options.checkbarType || OPTIONS.checkbarType || "all";	//複選框選中形式	all：子集選中父級也選中， no-all：子集選中父級半選中，子集全選父級選中，p-casc：父級選中子集全選，子集無法改變父級選取狀態， self：沒有任何級聯關係，only：只能選取一個複選框。   默認all
        this.checkbarData = this.options.checkbarData || OPTIONS.checkbarData || "choose"; //複選框記錄資料類型形式， change表示記錄變更數據，choose表示記錄選取數據，all記錄全部數據，halfChoose記錄選取和半選取的數據，預設choose
        this.checkbarFun =  $.extend(this.checkbarFun, this.options.checkbarFun || OPTIONS.checkbarFun) || this.checkbarFun; //checkbar事件載入

        /** 選單列參數**/
        this.menubar = this.options.menubar || OPTIONS.menubar || false; //是否開啟選單列
        this.menubarTips = $.extend(this.menubarTips, this.options.menubarTips || OPTIONS.menubarTips) || this.menubarTips; //選單列吸附， toolbar：依附在工具列，group：依附在按鈕組，freedom，自由
        this.menubarFun = $.extend(this.menubarFun, this.options.menubarFun || OPTIONS.menubarFun) || this.menubarFun; //menubar事件載入

        /** 工具列參數**/
        this.toolbar = this.options.toolbar || OPTIONS.toolbar || false; //是否開啟可編輯模式
        this.toolbarWay = this.options.toolbarWay || OPTIONS.toolbarWay || "contextmenu"; //工具列顯示方式，contextmenu:右鍵，follow:跟隨節點，fixed:固定在節點右側
        this.toolbarStyle = $.extend(this.toolbarStyle, this.options.toolbarStyle || OPTIONS.toolbarStyle) || this.toolbarStyle; //toolbar的自訂風格，標題，彈框大小
        this.toolbarLoad = this.options.toolbarLoad || OPTIONS.toolbarLoad || "node"; //toolbar作用範圍：node:所有節點，noleaf:非最後一級節點，leaf:最後一級
        this.toolbarShow = this.options.toolbarShow || OPTIONS.toolbarShow || ["add","edit","delete"]; //toolbar三個按鈕自訂載入
        this.toolbarBtn = this.options.toolbarBtn || OPTIONS.toolbarBtn || null; //toolbar增刪改中內容的自訂載入
        this.toolbarExt = this.options.toolbarExt || OPTIONS.toolbarExt || []; //toolbar按鈕擴充
        this.toolbarFun = $.extend(this.toolbarFun, this.options.toolbarFun || OPTIONS.toolbarFun) || this.toolbarFun; //toolbar事件載入

        /** iframe模式參數**/
        this.useIframe = this.options.useIframe || OPTIONS.useIframe || false; //是否載入iframe 預設false，
        this.iframeElem = this.options.iframeElem || OPTIONS.iframeElem || ""; //iframe的ID
        this.iframeUrl = this.options.iframeUrl || OPTIONS.iframeUrl || ""; //樹關聯的iframe位址
        this.iframeLoad = this.options.iframeLoad || OPTIONS.iframeLoad || "leaf"; //點擊哪一層載入frame： node：所有節點， leaf：默認，最後一級
        this.iframeDefaultRequest = $.extend(this.iframeDefaultRequest, this.options.iframeDefaultRequest || OPTIONS.iframeDefaultRequest) || this.iframeDefaultRequest; //iframe的預設傳遞參數
        this.iframeRequest = $.extend(this.iframeRequest, this.options.iframeRequest) || $.extend(this.iframeRequest, OPTIONS.iframeRequest) || this.iframeRequest; //iframe的自訂參數
        this.iframeFun = $.extend(this.iframeFun, this.options.iframeFun) || $.extend(this.iframeFun, OPTIONS.iframeFun) || this.iframeFun;	//iframe事件載入

        /** 下拉樹模式參數**/
        this.select = this.options.select || false; 
        if(this.select) {
        	// 重置下拉樹
        	this.selectSetting();
        }
        
        /** 呼叫確認最終主題方法*/
        this.ensureTheme();
    };

    // 設定基本參數值
    DTree.prototype.reloadSetting = function(options) {
        this.options = $.extend(this.options, options) || this.options;

        /** 綁定元素參數**/
        this.elem = this.options.elem || this.elem;	  //樹綁定的元素ID：#elem
        if(typeof this.options.obj === 'undefined'){
            if(this.elem) {
                if($(this.elem).length > 0) {
                    this.obj = $(this.elem);
                }
            }
        } else {
            this.obj = this.options.obj || this.obj; //樹綁定的jquery元素，用來當元素是延遲載入出來的話，可以用這個找到
            this.elem = "#" + this.obj[0].id;
        }

        /** 基本參數**/
        this.scroll = this.options.scroll || this.scroll; //樹的上級div容器，讓樹可以顯示捲軸的div容器
        this.accordion = (typeof (this.options.accordion) === "boolean") ? this.options.accordion : this.accordion; //開啟手風琴加載
        if(this.accordion) {
            this.initLevel = 1; //預設展開節點 1節
        } else {
            this.initLevel = this.options.initLevel || this.initLevel; //預設展開節點 2節
        }
        this.type = this.options.type || this.type; //樹的載入方式 all，全量樹， load，增量樹，預設load
        this.cache = (typeof (this.options.cache) === "boolean") ? this.options.cache : this.cache; //開啟資料快取
        this.record = (typeof (this.options.record) === "boolean") ? this.options.record : this.record; //開啟資料記錄模式
        this.load = (typeof (this.options.load) === "boolean") ? this.options.load : this.load; //開啟載入動畫
        this.none = this.options.none || this.none;  //初始節點載入無資料時顯示文字
        this.tempHeight = this.options.height || this.height; //暫時轉換高度變數
        if(this.tempHeight) {  //設定高度
            if(/^full-\d+$/.test(this.tempHeight)) {
                this.fullHeightGap = this.tempHeight.split('-')[1];
                this.height = $WIN.height() - this.fullHeightGap;
            } else {
                this.fullHeightGap = this.tempHeight;
                this.height = this.tempHeight;
            }
        }
        this.width = this.options.width || this.width; //寬度
        this.obj.css("width", this.width);

        /** 樣式相關參數**/
        this.line = (typeof (this.options.line) === "boolean") ? this.options.line : this.line; //開啟樹線，預設不開啟
        this.iconfont = this.options.iconfont || this.iconfont; //預設圖示字體 dtreefont
        this.iconfontStyle = this.options.iconfontStyle || this.iconfontStyle; //用於自訂樹的每個關鍵部位使用的圖示
        this.nodeIconArray = $.extend(nodeIconArray, this.options.nodeIconArray) || this.nodeIconArray;	//使用者自訂非葉子節點圖示集合，node
        this.leafIconArray = $.extend(leafIconArray, this.options.leafIconArray) || this.leafIconArray;	//使用者自訂葉節點圖示集合，leaf
        this.skin = this.options.skin || this.skin;	//自訂樣式
        if(this.skin == "layui"){ //layui主題
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : true; //開啟樹線，預設開啟
            this.ficon = this.options.ficon || this.ficon; //一級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示一級圖示。默認'7'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一級圖示中的node節點圖示。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1]; //一級圖示中的leaf節點圖示
            this.icon = this.options.icon || this.icon;	//二級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示二級圖示。默認'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二級圖示中的node節點圖標。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二級圖示中的leaf節點圖示
        } else if(this.skin == "laySimple"){ //laySimple主題
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : false; //開啟樹線，預設不開啟
            this.ficon = this.options.ficon || this.ficon; //一級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示一級圖示。默認'-1'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "2") : this.ficon[0]; //一級圖示中的node節點圖示。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'2'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1];//一級圖示中的leaf節點圖示
            this.icon = this.options.icon || this.icon;	//二級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示二級圖示。默認'-1'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "-1") : this.icon[0]; //二級圖示中的node節點圖標。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'-1'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二級圖示中的leaf節點圖示
        } else { // 預設主題 或自訂主題
            this.line = (typeof (this.options.line) === "boolean") ? this.options.line : false; //開啟樹線，預設不開啟
            this.ficon = this.options.ficon || this.ficon; //一級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示一級圖示。默認'8'
            this.fnodeIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? (this.ficon == "-1" ? "-1" : "1") : this.ficon[0]; //一級圖示中的node節點圖示。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'1'
            this.fleafIcon = (typeof this.ficon === 'string' || typeof this.ficon === 'number') ? this.ficon : this.ficon[1]; // 一級圖示中的leaf節點圖示
            this.icon = this.options.icon || this.icon;	//二級圖示樣式，0：文件夾，1：人員，2：機構，3：報表，4：訊息，5：葉子，6：勳章，7：文件，8：小圓點，9：齒輪，10 ：星星， -1：不顯示二級圖示。默認'5'
            this.nodeIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? (this.icon == "-1" ? "-1" : "0") : this.icon[0]; //二級圖示中的node節點圖標。0：資料夾，1：+、-，2：三角形， -1：不顯示二級圖標，預設'0'
            this.leafIcon = (typeof this.icon === 'string' || typeof this.icon === 'number') ? this.icon : this.icon[1]; //二級圖示中的leaf節點圖示
        }

        /** 資料載入參數**/
        this.url = this.options.url || this.url; //請求地址
        this.async = (typeof (this.options.async) === "boolean") ? this.options.async : this.async;	//非同步同步載入,預設非同步載入
        this.headers = this.options.headers || this.headers; //ajax header屬性
        this.method = this.options.method || this.method; //請求類型
        this.dataType = this.options.dataType || this.dataType; //參數類型
        this.contentType = this.options.contentType || this.contentType; //傳送訊息至伺服器時內容編碼類型
        this.defaultRequest = $.extend(this.defaultRequest, this.options.defaultRequest) || this.defaultRequest; //預設請求參數
        this.filterRequest = this.options.filterRequest || this.filterRequest; //過濾請求參數
        this.request = this.options.request || this.request; //使用者自訂請求參數
        this.response = $.extend(this.response, this.options.response) || this.response; //返回json格式
        this.data = this.options.data || this.data; //初始化指定該參數，則不會存取非同步介面
        this.dataFormat = this.options.dataFormat || this.dataFormat; //用於使用者配置的data資料格式，list：列表， levelRelationship：層級關係，預設
        this.dataStyle = this.options.dataStyle || this.dataStyle; //用於使用者配置layui通用的json資料風格,layuiStyle:layui風格，defaultStyle：預設風格
        this.errDataShow = (typeof (this.options.errDataShow) === "boolean") ? this.options.errDataShow : this.errDataShow; //是否在使用list模式遞迴資料出現錯誤時，顯示錯誤訊息
        this.withCredentials = (typeof (this.options.withCredentials) === "boolean") ? this.options.withCredentials : this.withCredentials; //是否允許跨域請求
        this.success = this.options.success || this.success; //樹載入完畢後執行解析樹之前的回呼
        this.done = this.options.done || this.done; //樹載入完畢後的回呼
        this.formatter = $.extend(this.formatter, this.options.formatter)|| this.formatter; //資料過濾
        this.error = this.options.error || this.error; //非同步載入異常回呼
        this.complete = this.options.complete || this.complete; //非同步載入完成回呼

        /** 複選框參數**/
        this.checkbar = this.options.checkbar || this.checkbar; //是否開啟複選框模式
        this.checkbarLoad = this.options.checkbarLoad || this.checkbarLoad; //複選框作用範圍，node：所有節點， leaf：最後一級；預設所有節點
        this.checkbarType = this.options.checkbarType || this.checkbarType;	//複選框選中形式	all：子集選中父級也選中， no-all：子集選中父級半選中，子集全選父級選中，p-casc：父級選中子集全選，子集無法改變父級選取狀態， self：沒有任何級聯關係，only：只能選取一個複選框。   默認all
        this.checkbarData = this.options.checkbarData || this.checkbarData; //複選框記錄資料類型形式， change表示記錄變更數據，choose表示記錄選取數據，all記錄全部數據，halfChoose記錄選取和半選取的數據，預設choose
        this.checkbarFun =  $.extend(this.checkbarFun, this.options.checkbarFun)|| this.checkbarFun; //checkbar事件載入

        /** 選單列參數**/
        this.menubar = this.options.menubar || this.menubar; //是否開啟選單列
        this.menubarTips = $.extend(this.menubarTips, this.options.menubarTips) || this.menubarTips; //選單列吸附， toolbar：依附在工具列，group：依附在按鈕組，freedom，自由
        this.menubarFun = $.extend(this.menubarFun, this.options.menubarFun) || this.menubarFun; //menubar事件載入

        /** 工具列參數**/
        this.toolbar = this.options.toolbar || this.toolbar; //是否開啟工具列
        this.toolbarWay = this.options.toolbarWay || this.toolbarWay; //工具列顯示方式，contextmenu:右鍵，follow:跟隨節點，fixed:固定在節點右側
        this.toolbarStyle = $.extend(this.toolbarStyle, this.options.toolbarStyle) || this.toolbarStyle; //toolbar的自訂風格，標題，彈框大小
        this.toolbarLoad = this.options.toolbarLoad || this.toolbarLoad; //toolbar作用範圍：node:所有節點，noleaf:非最後一級節點，leaf:最後一級
        this.toolbarShow = this.options.toolbarShow || this.toolbarShow; //toolbar三個按鈕
        this.toolbarBtn = this.options.toolbarBtn || this.toolbarBtn; //toolbar增刪改中內容的自訂載入
        this.toolbarExt = this.options.toolbarExt || this.toolbarExt; //toolbar按鈕擴充
        this.toolbarFun = $.extend(this.toolbarFun, this.options.toolbarFun) || this.toolbarFun; //toolbar事件載入

        /** iframe模式參數**/
        this.useIframe = this.options.useIframe || this.useIframe;//是否載入iframe 預設false
        this.iframeElem = this.options.iframeElem || this.iframeElem; //iframe的ID
        this.iframeUrl = this.options.iframeUrl || this.iframeUrl; //樹關聯的iframe位址
        this.iframeLoad = this.options.iframeLoad || this.iframeLoad; //點擊哪一層載入frame： node：所有節點， leaf：默認，最後一級
        this.iframeDefaultRequest = $.extend(this.iframeDefaultRequest, this.options.iframeDefaultRequest) || this.iframeDefaultRequest; //iframe的預設傳遞參數
        this.iframeRequest = $.extend(this.iframeRequest, this.options.iframeRequest) || this.iframeRequest; //iframe的自訂參數
        this.iframeFun = $.extend(this.iframeFun, this.options.iframeFun) || this.iframeFun; //iframe事件載入

        /** 下拉樹模式參數**/
        if(this.select) {
        	// 重置下拉樹
        	this.reloadSelectSetting();
        }
        
        /** 呼叫確認最終主題方法*/
        this.ensureTheme();
        
    };
    
    // 設定下拉樹的基本參數值
    DTree.prototype.selectSetting = function() {
    	/** select模式參數*/
        this.select = true; //配置成select模式
        
        this.selectInitVal = this.obj.attr("data-value") || this.options.selectInitVal || "";	//輸入框的值
        this.selectTreeDiv = this.obj[0].id + "_tree_div";		// 上級DIV節點
        this.selectCardDiv = this.obj[0].id + "_select_card_div";	// 上級layui卡片節點
        this.selectDiv = this.obj[0].id + "_select_div";		// 模擬的select節點
        this.selectTipsName = this.obj[0].id + "_select_input"; // select的提示輸入框名稱
        this.selectTips = this.options.selectTips || "請選擇";			// 輸入框的提示語
        this.selectInputName = this.options.selectInputName || {nodeId: this.obj[0].id + "_select_nodeId"};  // select表單中的元素
        
        // 調取下拉樹的特殊處理頁面元素標識
        this.renderSelectDom();
    }
    
    // 重新設定下拉樹的基本參數值
    DTree.prototype.reloadSelectSetting = function() {
        
    	this.selectInitVal = this.obj.attr("data-value") || this.options.selectInitVal || this.selectInitVal;	//輸入框的值
        this.selectTips = this.options.selectTips || this.selectTips;			// 輸入框的提示語
        this.selectInputName = $.extend(this.selectInputName, this.options.selectInputName) || this.selectInputName;  // select表單中的元素
        
        // 調取下拉樹的特殊處理頁面元素標識
        this.reloadSelectDom();
    }

    /******************** 下拉樹設定區域 ********************/
    // 渲染下拉樹的Dom結構
    DTree.prototype.renderSelectDom = function() {
        var _this = this;
        var rootId = _this.obj[0].id;
        
        // 設定自訂表單隱藏域
        var selectInputName = _this.selectInputName;
        var selectInput = [];
        for(var key in selectInputName) {
        	selectInput.push('<input type="hidden" dtree-id="' + rootId + '" dtree-node="' + key + '" name="' + selectInputName[key] + '" value="" readonly>');
        }

        // 設定html
        var prevHtml = ['<div class="layui-unselect layui-form-select" dtree-id="' + rootId + '" dtree-select="' + _this.selectDiv + '">',
			            '<div class="layui-select-title">', selectInput.join(""), 
			            '<input type="text" dtree-id="' + rootId + '" id="' +  _this.selectTipsName +'_id" name="' + _this.selectTipsName + '" placeholder="' + _this.selectTips + '" value="" readonly class="layui-input layui-unselect">',
			            '<i class="layui-edge"></i>',
			            '</div></div>'].join('');

        _this.obj.before(prevHtml);

        _this.obj.wrap('<div class="layui-card dtree-select" dtree-id="' + rootId + '" dtree-card="' + _this.selectCardDiv + '"></div>').wrap('<div class="layui-card-body"></div>').wrap('<div id="' + _this.selectTreeDiv + '"></div>');
    
    }
    
    // 重新渲染下拉樹的Dom結構
    DTree.prototype.reloadSelectDom = function() {
        var _this = this;
        var rootId = _this.obj[0].id;
        
        // 設定自訂表單隱藏域
        var selectInputName = _this.selectInputName;
        var selectInput = [];
        for(var key in selectInputName) {
        	selectInput.push('<input type="hidden" dtree-id="' + rootId + '" dtree-node="' + key + '" name="' + selectInputName[key] + '" value="" readonly>');
        }
        
        $("div[dtree-id='"+rootId+"'][dtree-select='"+_this.selectDiv+"']").find("div.layui-select-title").html("");

        // 設定html
        var prevHtml = [selectInput.join(""), 
			            '<input type="text" dtree-id="' + rootId + '" id="' +  _this.selectTipsName +'_id" name="' + _this.selectTipsName + '" placeholder="' + _this.selectTips + '" value="" readonly class="layui-input layui-unselect">',
			            '<i class="layui-edge"></i>'].join('');

        $("div[dtree-id='"+rootId+"'][dtree-select='"+_this.selectDiv+"']").find("div.layui-select-title").html(prevHtml);

    }

    // 設定輸入框的值
    DTree.prototype.selectVal = function(param) {
        var _this = this;
        var rootId = _this.obj[0].id;
        var selectInputName = _this.selectInputName;
        var selectTipsNameValue = "";
        var selectValues = {};
        
        // 如果開啟了複選框，則此方法用來取值
        if(_this.checkbar) {
        	$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "']").each(function(){
        		var name = $(this).attr("name");
        		var val = $(this).val();
        		selectValues[name] = val;
        	});
        } else {
        	if(typeof param === 'undefined') { // 不傳，則為目前樹中記錄的ID
            	param = _this.getNowParam();
            }
            if(typeof param === 'string') { // 傳遞ID，則查詢樹節點ID對應的值
            	param = _this.getParam(param);
            }
            
            selectTipsNameValue = param["context"];
        	for(var key in selectInputName) {
        		selectValues[selectInputName[key]] = param[key];
        		$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+selectInputName[key]+"']").val(param[key] || "");
        	}
        	
        	if(param["nodeId"] && !param["context"]) {
        		selectTipsNameValue = _this.getParam(param["nodeId"]);
        	}
        	
            // 返顯提示輸入框值
            $("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+_this.selectTipsName+"']").val(selectTipsNameValue || "");
            
        }
        
        
        // 傳回隱藏域中的值
        return selectValues;
    }
    
    // 設定複選框模式中的下拉樹的值
    DTree.prototype.selectCheckboxVal = function() {
    	var _this = this;
    	var rootId = _this.obj[0].id;
    	var selectInputName = _this.selectInputName;
    	
    	// 取得全部複選框選取節點
    	var param = _this.getCheckbarJsonArrParam();
    	
    	selectTipsNameValue = param["context"];
    	var selectValues = {};
    	for(var key in selectInputName) {
    		var value = param[key].join(",");
    		selectValues[selectInputName[key]] = value;
    		$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+selectInputName[key]+"']").val(value);
    	}
    	
    	$("div[dtree-select='" + _this.selectDiv + "']").find("input[dtree-id='" + rootId + "'][name='"+_this.selectTipsName+"']").val(selectTipsNameValue);
    	
    	// 傳回隱藏域中的值
        return selectValues;
    }
    
    // 重置下拉樹的值
    DTree.prototype.selectResetVal = function() {
    	var _this = this;
    	var rootId = _this.obj[0].id;
    	// 表單清空
        $("input[dtree-id='"+rootId+"']").val("");
        // 節點重置
        _this.cancelNavThis();
        if(_this.checkbar) {
        	// 複選框重置
        	_this.cancelCheckedNode();
        }
    }


    /******************** 字體及圖示區域 ********************/
    // 確認最終主題
    DTree.prototype.ensureTheme = function(){
        var _this = this;

        // 確認style
        this.style.item = DTREE + this.skin + ITEM;
        this.style.itemThis = DTREE + this.skin + ITEMTHIS;
        this.style.dfont = DTREE + this.skin + DFONT;
        this.style.ficon = DTREE + this.skin + FICON;
        this.style.icon = DTREE + this.skin + ICON;
        this.style.cbox = DTREE + this.skin + CBOX;
        this.style.chs = DTREE + this.skin + CHS;

        // 確認usefontStyle
        var iconfont = this.iconfont;
        var iconfonts = [];
        if(typeof iconfont === 'string') {
            iconfonts.push(iconfont);
        } else {
            iconfonts = iconfont;
        }

        var iconfontStyle = this.iconfontStyle;
        var iconfontStyles = [];
        if(iconfontStyle.length == undefined) {
            iconfontStyles.push(iconfontStyle);
        } else {
            iconfontStyles = iconfontStyle;
        }

        for(var i=0; i<iconfonts.length; i++){
            var ifont = iconfonts[i];
            var ifontStyle = iconfontStyles[i];
            if(typeof ifontStyle !== 'undefined') {
                // 判斷，賦值
                this.useDefaultOrUserDefineFnodeStyle(ifont, ifontStyle.fnode);
                this.useDefaultOrUserDefineSnodeStyle(ifont, ifontStyle.snode);
                this.useDefaultOrUserDefineCheckboxStyle(ifont, ifontStyle.checkbox);
                this.useDefaultOrUserDefineMenubarStyle(ifont, ifontStyle.menubar);
                this.useDefaultOrUserDefineMenubarExtStyle(ifont, ifontStyle.menubarExt);
                this.useDefaultOrUserDefineToolbarStyle(ifont, ifontStyle.toolbar);
                this.useDefaultOrUserDefineToolbarExtStyle(ifont, ifontStyle.toolbarExt);
            }
        }
    };

    // 賦值一級圖示
    DTree.prototype.useDefaultOrUserDefineFnodeStyle = function(ifont, fnode){
        var _this = this;
        var tempOpen = this.usefontStyle.fnode.node.open;
        var tempClose = this.usefontStyle.fnode.node.close;
        var tempLeaf = this.usefontStyle.fnode.leaf;

        if(typeof fnode === 'undefined'){
            this.usefontStyle.fnode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["open"]) : tempOpen; // 一級圖示中的node節點open圖示
            this.usefontStyle.fnode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["close"]) : tempClose; // 一級圖示中的node節點close圖示
            this.usefontStyle.fnode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.fleafIcon]) : tempLeaf; // 一級圖示中的node節點的leaf圖示
        } else {
            var node = fnode.node;
            var leaf = fnode.leaf;
            if(typeof node === 'undefined'){
                this.usefontStyle.fnode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["open"]) : tempOpen; // 一級圖示中的node節點open圖示
                this.usefontStyle.fnode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["close"]) : tempClose; // 一級圖示中的node節點close圖示
            } else {
                var open = node.open;
                var close = node.close;
                if(typeof open === 'undefined'){
                    this.usefontStyle.fnode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["open"]) : tempOpen; // 一級圖示中的node節點open圖示
                } else {
                    this.usefontStyle.fnode.node.open = ifont + " " + open;
                }
                if(typeof close === 'undefined') {
                    this.usefontStyle.fnode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.fnodeIcon]["close"]) : tempClose; // 一級圖示中的node節點close圖示
                } else {
                    this.usefontStyle.fnode.node.close = ifont + " " + close;
                }
            }
            if(typeof leaf === 'undefined'){
                this.usefontStyle.fnode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.fleafIcon]) : tempLeaf; // 一級圖示中的node節點的leaf圖示
            } else {
                this.usefontStyle.fnode.leaf = ifont + " " + leaf;
            }
        }
    };

    // 賦值二級圖示
    DTree.prototype.useDefaultOrUserDefineSnodeStyle = function(ifont, snode){
        var _this = this;
        var tempOpen = this.usefontStyle.snode.node.open;
        var tempClose = this.usefontStyle.snode.node.close;
        var tempLeaf = this.usefontStyle.snode.leaf;

        if(typeof snode === 'undefined'){
            this.usefontStyle.snode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["open"]) : tempOpen;  // 二級圖示中的node節點open圖示
            this.usefontStyle.snode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["close"]) : tempClose; // 二級圖示中的node節點close圖示
            this.usefontStyle.snode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.leafIcon]) : tempLeaf; // 二級圖示中的leaf節點圖示
        } else {
            var node = snode.node;
            var leaf = snode.leaf;
            if(typeof node === 'undefined') {
                this.usefontStyle.snode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["open"]) : tempOpen;  // 二級圖示中的node節點open圖示
                this.usefontStyle.snode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["close"]) : tempClose; // 二級圖示中的node節點close圖示
            } else {
                var open = node.open;
                var close = node.close;
                if(typeof open === 'undefined'){
                    this.usefontStyle.snode.node.open = (tempOpen == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["open"]) : tempOpen;  // 二級圖示中的node節點open圖示
                } else {
                    this.usefontStyle.snode.node.open = ifont + " " + open;
                }
                if(typeof close === 'undefined') {
                    this.usefontStyle.snode.node.close = (tempClose == "") ? (ifont + " " + this.nodeIconArray[this.nodeIcon]["close"]) : tempClose; // 二級圖示中的node節點close圖示
                } else {
                    this.usefontStyle.snode.node.close = ifont + " " + close;
                }
            }
            if(typeof leaf === 'undefined') {
                this.usefontStyle.snode.leaf = (tempLeaf == "") ? (ifont + " " + this.leafIconArray[this.leafIcon]) : tempLeaf; // 二級圖示中的leaf節點圖示
            } else {
                this.usefontStyle.snode.leaf = ifont + " " + leaf;
            }
        }
    };

    // 賦值複選框圖示
    DTree.prototype.useDefaultOrUserDefineCheckboxStyle = function(ifont, checkbox){
        var _this = this;
        var tempOn = this.usefontStyle.checkbox.on;
        var tempOut = this.usefontStyle.checkbox.out;
        var tempNoall = this.usefontStyle.checkbox.noall;

        if(typeof checkbox === 'undefined'){
            this.usefontStyle.checkbox.on = (tempOn == "") ? (ifont + " " + LI_DIV_CHECKBAR_ON) : tempOn;
            this.usefontStyle.checkbox.out = (tempOut == "") ? (ifont + " " + LI_DIV_CHECKBAR_OUT) : tempOut;
            this.usefontStyle.checkbox.noall = (tempNoall == "") ? (ifont + " " + LI_DIV_CHECKBAR_NOALL) : tempNoall;
        } else {
            var on = checkbox.on;
            var out = checkbox.out;
            var noall = checkbox.noall;
            if(typeof on === 'undefined') {
                this.usefontStyle.checkbox.on = (tempOn == "") ? (ifont + " " + LI_DIV_CHECKBAR_ON) : tempOn;
            } else {
                this.usefontStyle.checkbox.on = ifont + " " + on;
            }
            if(typeof out === 'undefined') {
                this.usefontStyle.checkbox.out = (tempOut == "") ? (ifont + " " + LI_DIV_CHECKBAR_OUT) : tempOut;
            } else {
                this.usefontStyle.checkbox.out = ifont + " " + out;
            }
            if(typeof noall === 'undefined') {
                this.usefontStyle.checkbox.noall = (tempNoall == "") ? (ifont + " " + LI_DIV_CHECKBAR_NOALL) : tempNoall;
            } else {
                this.usefontStyle.checkbox.noall = ifont + " " + noall;
            }
        }
    };

    // 賦值選單欄圖示
    DTree.prototype.useDefaultOrUserDefineMenubarStyle = function(ifont, menubar){
        var _this = this;
        var tempMovedown = this.usefontStyle.menubar.movedown;
        var tempMoveup = this.usefontStyle.menubar.moveup;
        var tempRefresh = this.usefontStyle.menubar.refresh;
        var tempCheckAll = this.usefontStyle.menubar.checkAll;
        var tempUncheckAll = this.usefontStyle.menubar.unCheckAll;
        var tempInvertAll = this.usefontStyle.menubar.invertAll;
        var tempRemove = this.usefontStyle.menubar.remove;
        var tempSearch = this.usefontStyle.menubar.search;

        if(typeof menubar === 'undefined'){
            this.usefontStyle.menubar.movedown = (tempMovedown == "") ? (ifont + " " + LI_DIV_MENUBAR_DOWN) : tempMovedown;
            this.usefontStyle.menubar.moveup = (tempMoveup == "") ? (ifont + " " + LI_DIV_MENUBAR_UP) : tempMoveup;
            this.usefontStyle.menubar.refresh = (tempRefresh == "") ? (ifont + " " + LI_DIV_MENUBAR_REFRESH) : tempRefresh;
            this.usefontStyle.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_CHECKALL) : tempCheckAll;
            this.usefontStyle.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_UNCHECKALL) : tempUncheckAll;
            this.usefontStyle.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + LI_DIV_MENUBAR_INVERTALL) : tempInvertAll;
            this.usefontStyle.menubar.remove = (tempRemove == "") ? (ifont + " " + LI_DIV_MENUBAR_DELETE) : tempRemove;
            this.usefontStyle.menubar.search = (tempSearch == "") ? (ifont + " " + LI_DIV_MENUBAR_SEARCH) : tempSearch;
        } else {
            var movedown = menubar.movedown;
            var moveup = menubar.moveup;
            var refresh = menubar.refresh;
            var checkAll = menubar.checkAll;
            var unCheckAll = menubar.unCheckAll;
            var invertAll = menubar.invertAll;
            var remove = menubar.remove;
            var search = menubar.search;
            if(typeof movedown === 'undefined') {
                this.usefontStyle.menubar.movedown = (tempMovedown == "") ? (ifont + " " + LI_DIV_MENUBAR_DOWN) : tempMovedown;
            } else {
                this.usefontStyle.menubar.movedown = ifont + " " + movedown;
            }
            if(typeof moveup === 'undefined') {
                this.usefontStyle.menubar.moveup = (tempMoveup == "") ? (ifont + " " + LI_DIV_MENUBAR_UP) : tempMoveup;
            } else {
                this.usefontStyle.menubar.moveup = ifont + " " + moveup;
            }
            if(typeof refresh === 'undefined') {
                this.usefontStyle.menubar.refresh = (tempRefresh == "") ? (ifont + " " + LI_DIV_MENUBAR_REFRESH) : tempRefresh;
            } else {
                this.usefontStyle.menubar.refresh = ifont + " " + refresh;
            }
            if(typeof checkAll === 'undefined') {
                this.usefontStyle.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_CHECKALL) : tempCheckAll;
            } else {
                this.usefontStyle.menubar.checkAll = ifont + " " + checkAll;
            }
            if(typeof unCheckAll === 'undefined') {
                this.usefontStyle.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + LI_DIV_MENUBAR_UNCHECKALL) : tempUncheckAll;
            } else {
                this.usefontStyle.menubar.unCheckAll = ifont + " " + unCheckAll;
            }
            if(typeof invertAll === 'undefined') {
                this.usefontStyle.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + LI_DIV_MENUBAR_INVERTALL) : tempInvertAll;
            } else {
                this.usefontStyle.menubar.invertAll = ifont + " " + invertAll;
            }
            if(typeof remove === 'undefined') {
                this.usefontStyle.menubar.remove = (tempRemove == "") ? (ifont + " " + LI_DIV_MENUBAR_DELETE) : tempRemove;
            } else {
                this.usefontStyle.menubar.remove = ifont + " " + remove;
            }
            if(typeof search === 'undefined') {
                this.usefontStyle.menubar.search = (tempSearch == "") ? (ifont + " " + LI_DIV_MENUBAR_SEARCH) : tempSearch;
            } else {
                this.usefontStyle.menubar.search = ifont + " " + search;
            }
        }
    };

    // 賦值擴充功能表列圖示
    DTree.prototype.useDefaultOrUserDefineMenubarExtStyle = function(ifont, menubarExt){
        var _this = this;
        var tempExt = this.usefontStyle.menubarExt;

        if(typeof menubarExt === 'undefined'){
            this.usefontStyle.menubarExt = (tempExt == "") ? ifont : tempExt;
        } else {
            this.usefontStyle.menubarExt = menubarExt;
        }
    };

    // 賦值工具列圖示
    DTree.prototype.useDefaultOrUserDefineToolbarStyle = function(ifont, toolbar){
        var _this = this;
        var tempMovedown = this.usefontStyle.toolbar.menubar.movedown;
        var tempMoveup = this.usefontStyle.toolbar.menubar.moveup;
        var tempRefresh = this.usefontStyle.toolbar.menubar.refresh;
        var tempCheckAll = this.usefontStyle.toolbar.menubar.checkAll;
        var tempUnCheckAll = this.usefontStyle.toolbar.menubar.unCheckAll;
        var tempInvertAll = this.usefontStyle.toolbar.menubar.invertAll;
        var tempRemove = this.usefontStyle.toolbar.menubar.remove;
        var tempSearch = this.usefontStyle.toolbar.menubar.search;
        var tempExt = this.usefontStyle.toolbar.menubarExt;
        var tempPulldown = this.usefontStyle.toolbar.pulldown;
        var tempPullup = this.usefontStyle.toolbar.pullup;
        var tempAdd = this.usefontStyle.toolbar.add;
        var tempEdit = this.usefontStyle.toolbar.edit;
        var tempDel = this.usefontStyle.toolbar.del;


        if(typeof toolbar === 'undefined'){
            this.usefontStyle.toolbar.menubar.movedown = (tempMovedown == "") ? (ifont + " " + this.usefontStyle.menubar.movedown) : tempMovedown;
            this.usefontStyle.toolbar.menubar.moveup = (tempMoveup == "") ? (ifont + " " + this.usefontStyle.menubar.moveup) : tempMoveup;
            this.usefontStyle.toolbar.menubar.refresh = (tempRefresh == "") ? (ifont + " " + this.usefontStyle.menubar.refresh) : tempRefresh;
            this.usefontStyle.toolbar.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.checkAll) : tempCheckAll;
            this.usefontStyle.toolbar.menubar.unCheckAll = (tempUnCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.unCheckAll) : tempUnCheckAll;
            this.usefontStyle.toolbar.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + this.usefontStyle.menubar.invertAll) : tempInvertAll;
            this.usefontStyle.toolbar.menubar.remove = (tempRemove == "") ? (ifont + " " + this.usefontStyle.menubar.remove) : tempRemove;
            this.usefontStyle.toolbar.menubar.search = (tempSearch == "") ? (ifont + " " + this.usefontStyle.menubar.search) : tempSearch;
            this.usefontStyle.toolbar.menubarExt = (tempExt == "") ? this.usefontStyle.menubarExt : tempExt;
            this.usefontStyle.toolbar.pulldown = (tempPulldown == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLDOWN) : tempPulldown;
            this.usefontStyle.toolbar.pullup = (tempPullup == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLUP) : tempPullup;
            this.usefontStyle.toolbar.add = (tempAdd == "") ? (ifont + " " + LI_DIV_TOOLBAR_ADD) : tempAdd;
            this.usefontStyle.toolbar.edit = (tempEdit == "") ? (ifont + " " + LI_DIV_TOOLBAR_EDIT) : tempEdit;
            this.usefontStyle.toolbar.del = (tempDel == "") ? (ifont + " " + LI_DIV_TOOLBAR_DEL) : tempDel;
        } else {
            var menubar = toolbar.menubar;
            var menubarExt = toolbar.menubarExt;
            var pulldown = toolbar.pulldown;
            var pullup = toolbar.pullup;
            var add = toolbar.add;
            var edit = toolbar.edit;
            var del = toolbar.del;

            if(typeof menubar === 'undefined'){
                this.usefontStyle.toolbar.menubar.movedown = (tempMovedown == "") ? (ifont + " " + this.usefontStyle.menubar.movedown) : tempMovedown;
                this.usefontStyle.toolbar.menubar.moveup = (tempMoveup == "") ? (ifont + " " + this.usefontStyle.menubar.moveup) : tempMoveup;
                this.usefontStyle.toolbar.menubar.refresh = (tempRefresh == "") ? (ifont + " " + this.usefontStyle.menubar.refresh) : tempRefresh;
                this.usefontStyle.toolbar.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.checkAll) : tempCheckAll;
                this.usefontStyle.toolbar.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.unCheckAll) : tempUncheckAll;
                this.usefontStyle.toolbar.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + this.usefontStyle.menubar.invertAll) : tempInvertAll;
                this.usefontStyle.toolbar.menubar.remove = (tempRemove == "") ? (ifont + " " + this.usefontStyle.menubar.remove) : tempRemove;
                this.usefontStyle.toolbar.menubar.search = (tempSearch == "") ? (ifont + " " + this.usefontStyle.menubar.search) : tempSearch;
            } else {
                var movedown = menubar.movedown;
                var moveup = menubar.moveup;
                var refresh = menubar.refresh;
                var checkAll = menubar.checkAll;
                var unCheckAll = menubar.unCheckAll;
                var invertAll = menubar.invertAll;
                var remove = menubar.remove;
                var search = menubar.search;
                if(typeof movedown === 'undefined') {
                    this.usefontStyle.toolbar.menubar.movedown = (tempMovedown == "") ? (ifont + " " + this.usefontStyle.menubar.movedown) : tempMovedown;
                } else {
                    this.usefontStyle.toolbar.menubar.movedown = ifont + " " + movedown;
                }
                if(typeof moveup === 'undefined') {
                    this.usefontStyle.toolbar.menubar.moveup = (tempMoveup == "") ? (ifont + " " + this.usefontStyle.menubar.moveup) : tempMoveup;
                } else {
                    this.usefontStyle.toolbar.menubar.moveup = ifont + " " + moveup;
                }
                if(typeof refresh === 'undefined') {
                    this.usefontStyle.toolbar.menubar.refresh = (tempRefresh == "") ? (ifont + " " + this.usefontStyle.menubar.refresh) : tempRefresh;
                } else {
                    this.usefontStyle.toolbar.menubar.refresh = ifont + " " + refresh;
                }
                if(typeof checkAll === 'undefined') {
                    this.usefontStyle.toolbar.menubar.checkAll = (tempCheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.checkAll) : tempCheckAll;
                } else {
                    this.usefontStyle.toolbar.menubar.checkAll = ifont + " " + checkAll;
                }
                if(typeof unCheckAll === 'undefined') {
                    this.usefontStyle.toolbar.menubar.unCheckAll = (tempUncheckAll == "") ? (ifont + " " + this.usefontStyle.menubar.unCheckAll) : tempUncheckAll;
                } else {
                    this.usefontStyle.toolbar.menubar.unCheckAll = ifont + " " + unCheckAll;
                }
                if(typeof invertAll === 'undefined') {
                    this.usefontStyle.toolbar.menubar.invertAll = (tempInvertAll == "") ? (ifont + " " + this.usefontStyle.menubar.invertAll) : tempInvertAll;
                } else {
                    this.usefontStyle.toolbar.menubar.invertAll = ifont + " " + invertAll;
                }
                if(typeof remove === 'undefined') {
                    this.usefontStyle.toolbar.menubar.remove = (tempRemove == "") ? (ifont + " " + this.usefontStyle.menubar.remove) : tempRemove;
                } else {
                    this.usefontStyle.toolbar.menubar.remove = ifont + " " + remove;
                }
                if(typeof search === 'undefined') {
                    this.usefontStyle.toolbar.menubar.search = (tempSearch == "") ? (ifont + " " + this.usefontStyle.menubar.search) : tempSearch;
                } else {
                    this.usefontStyle.toolbar.menubar.search = ifont + " " + search;
                }
            }

            if(typeof menubarExt === 'undefined'){
                this.usefontStyle.toolbar.menubarExt = (tempExt == "") ? this.usefontStyle.menubarExt : tempExt;
            } else {
                this.usefontStyle.toolbar.menubarExt = menubarExt;
            }

            if(typeof pulldown === 'undefined'){
                this.usefontStyle.toolbar.pulldown = (tempPulldown == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLDOWN) : tempPulldown;
            } else {
                this.usefontStyle.toolbar.pulldown = ifont + " " + pulldown;
            }
            if(typeof pullup === 'undefined'){
                this.usefontStyle.toolbar.pullup = (tempPullup == "") ? (ifont + " " + LI_DIV_TOOLBAR_PULLUP) : tempPullup;
            } else {
                this.usefontStyle.toolbar.pullup = ifont + " " + pullup;
            }
            if(typeof add === 'undefined'){
                this.usefontStyle.toolbar.add = (tempAdd == "") ? (ifont + " " + LI_DIV_TOOLBAR_ADD) : tempAdd;
            } else {
                this.usefontStyle.toolbar.add = ifont + " " + add;
            }
            if(typeof edit === 'undefined'){
                this.usefontStyle.toolbar.edit = (tempEdit == "") ? (ifont + " " + LI_DIV_TOOLBAR_EDIT) : tempEdit;
            } else {
                this.usefontStyle.toolbar.edit = ifont + " " + edit;
            }
            if(typeof del === 'undefined'){
                this.usefontStyle.toolbar.del = (tempDel == "") ? (ifont + " " + LI_DIV_TOOLBAR_DEL) : tempDel;
            } else {
                this.usefontStyle.toolbar.del = ifont + " " + del;
            }
        }
    };

    // 賦值擴充工具列圖示
    DTree.prototype.useDefaultOrUserDefineToolbarExtStyle = function(ifont, toolbarExt){
        var _this = this;
        var tempExt = this.usefontStyle.toolbarExt;

        if(typeof toolbarExt === 'undefined'){
            this.usefontStyle.toolbarExt = (tempExt == "") ? ifont : tempExt;
        } else {
            this.usefontStyle.toolbarExt = toolbarExt;
        }
    };

    // 設定圖示的展開關閉，以及展開時/關閉時是最後一級圖示的處理
    DTree.prototype.operateIcon = function($i_spread, $i_node){
        var _this = this;
        var ficonClass = $i_spread.attr("data-iconClass");
        var iconClass = $i_node.attr("data-iconClass");
        return{
            open: function(){
                $i_spread.attr("data-spread","open");
                $i_node.attr("data-spread","open");
                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.close);
                    $i_spread.addClass(_this.usefontStyle.fnode.node.open);
                }
                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.node.close);
                    $i_node.addClass(_this.usefontStyle.snode.node.open);
                }
            },
            close: function(){
                $i_spread.attr("data-spread","close");
                $i_node.attr("data-spread","close");
                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.open);
                    $i_spread.addClass(_this.usefontStyle.fnode.node.close);
                }
                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.node.open);
                    $i_node.addClass(_this.usefontStyle.snode.node.close);
                }
            },
            openWithLeaf: function(){
                $i_spread.attr("data-spread","open");
                $i_node.attr("data-spread","open");
                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.leaf);
                    $i_spread.addClass(_this.usefontStyle.fnode.node.open);
                }
                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.leaf);
                    $i_node.addClass(_this.usefontStyle.snode.node.open);
                }
            },
            closeWithLeaf: function(){
                $i_spread.attr("data-spread","last");
                $i_node.attr("data-spread","last");

                if(!ficonClass) {
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.open);
                    $i_spread.removeClass(_this.usefontStyle.fnode.node.close);
                    $i_spread.addClass(_this.usefontStyle.fnode.leaf);
                }

                if(!iconClass) {
                    $i_node.removeClass(_this.usefontStyle.snode.node.open);
                    $i_node.removeClass(_this.usefontStyle.snode.node.close);
                    $i_node.addClass(_this.usefontStyle.snode.leaf);
                }
            }
        }
    };

    // 顯示樹線
    DTree.prototype.showLine = function($lis){
        var _this = this;
        if(_this.line){
            if($lis && $lis.length > 0) {
                $lis.each(function(){
                    _this.showLineLi($(this));
                });
            } else {
                _this.obj.find("li[data-id]").each(function(){
                    _this.showLineLi($(this));
                });
            }
        }
    }

    // 真正顯示樹線的方法
    DTree.prototype.showLineLi = function($li){
        var _this = this;
        var $div = $li.children("div"),
            $nextLi = $li.next("li"),
            $ul = $li.parent("ul");
        if($ul[0].id == _this.obj[0].id) {
            // 根節點下的節點
            $li.removeClass(LI_NAV_LINE);
            $li.removeClass(LI_NAV_LAST_LINE);
            $li.addClass(LI_NAV_FIRST_LINE);
        } else {
            // 非根節點下的節點
            var $pnextLi = $ul.parent("li").next("li");
            if($pnextLi.length == 0) {
                if($nextLi.length == 0){
                    $li.removeClass(LI_NAV_LINE);
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.addClass(LI_NAV_LAST_LINE);
                } else {
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.removeClass(LI_NAV_LAST_LINE);
                    $li.addClass(LI_NAV_LINE);
                }
            }else {
                var $pnextdiv = $pnextLi.children("div");
                if($nextLi.length == 0 && $div.children("cite").attr("data-leaf") == "leaf" && $pnextdiv.children("cite").attr("data-leaf") == "leaf") {
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.removeClass(LI_NAV_LINE);
                    $li.addClass(LI_NAV_LAST_LINE);
                } else {
                    $li.removeClass(LI_NAV_FIRST_LINE);
                    $li.removeClass(LI_NAV_LAST_LINE);
                    $li.addClass(LI_NAV_LINE);
                }
            }
        }
    }

    /******************** 初始化資料區域 ********************/
    // 設定高度
    DTree.prototype.autoHeight = function(){
        var _this = this;
        var height = _this.height;
        if(height != "") {
            if(_this.elem == _this.scroll){
                _this.obj.parent().css("height", height + "px");
            } else {
                var $toolbarDiv = _this.obj.closest(_this.scroll);
                $toolbarDiv.css("height", height + "px");
            }
        }
    };

    // 重載樹
    DTree.prototype.reload = function(options){
        var _this = this;
        _this.reloadSetting(options);
        _this.init();
    };

    // 初始化樹
    DTree.prototype.init = function(){
        var _this = this;
        if (typeof _this !== "object") {
            //_this.obj.html(_this.getNoneDom().errText("樹組件未成功加載，請檢查配置"));
            layer.msg("樹組件未成功加載，請檢查配置", {icon:5});
            return ;
        }

        // 設定組件高度
        _this.autoHeight();

        if(_this.data) {
            if(typeof _this.data.length === 'undefined'){
                //_this.obj.html(_this.getNoneDom().errText("資料解析異常，data資料格式不正確"));
                layer.msg("資料解析異常，data資料格式不正確", {icon:5});
                return ;
            }

            if(_this.data.length == 0) {
                _this.obj.html(_this.getNoneDom().text());
                return ;
            }

            //先將ul中的元素清空
            _this.obj.html("");

            setTimeout(function () {
                // 載入完畢後執行樹解析前的回呼
                _this.success(_this.data, _this.obj);

                // 第一次解析樹
                if (_this.dataFormat == 'list'){
                    //1.辨識根節點ul中的data-id標籤，判斷頂層父節點
                    var pid = _this.obj.attr("data-id");
                    //2.建構一個存放節點的樹組
                    var rootListData = _this.queryListTreeByPid(pid, _this.data);
                    _this.loadListTree(rootListData, _this.data, 1);
                } else {
                    _this.loadTree(_this.data, 1);
                }

                // 顯示樹線
                _this.showLine();

                // 這種情況下需要一開始就將toolbar顯示在頁面上
                if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                    _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
                }

                // 判斷是否有錯誤數據，並是否列印錯誤數據
                _this.msgErrData();
                
                // 設定複選框的初始值
                if(_this.select){
                	_this.selectVal(_this.selectInitVal);
                }

                // 保存樹副本
                _this.bak = _this.obj.html();
                
                // 載入完畢後的回呼
                _this.done(_this.data, _this.obj);
            }, 100);
        } else {
            if (!_this.url) {
                //_this.obj.html(_this.getNoneDom().errText("資料請求異常，url參數未指定"));
                layer.msg("資料請求異常，url參數未指定", {icon:5});
                return ;
            }

            //先將ul中的元素清空
            _this.obj.html("");

            var index = _this.load ? layer.load(1) : "";

            AjaxHelper.request({
                async: _this.async,
                headers: _this.headers,
                type: _this.method,
                url: _this.url,
                dataType: _this.dataType,
                contentType: _this.contentType,
                withCredentials: _this.withCredentials,
                data: _this.getFilterRequestParam(_this.getRequestParam()),
                success: function(result) {
                    if (typeof result === 'string') {
                        result = $.parseJSON(result);
                    }
                    
                    // 載入完畢後執行樹解析前的回呼
                    _this.success(result, _this.obj);
                    
                    var code = "";
                    if (_this.dataStyle == 'layuiStyle'){
                        code = result[_this.response.statusName];
                    } else {
                        code = result.status[_this.response.statusName];
                    }

                    if (code == _this.response.statusCode) {
                        var d = result[_this.response.rootName];

                        if(typeof d.length === 'undefined'){
                            _this.obj.html(_this.getNoneDom().errText("資料解析異常，url回呼後的資料格式不正確"));
                            //layer.msg("資料解析異常，url回呼後的資料格式不正確", {icon:5});
                            return ;
                        }

                        if(d.length == 0) {
                            _this.obj.html(_this.getNoneDom().text());
                            return ;
                        }

                        // 第一次解析樹
                        if (_this.dataFormat == 'list'){
                            //1.辨識根節點ul中的data-id標籤，判斷頂層父節點
                            var pid = _this.obj.attr("data-id");
                            //2.建構一個存放節點的樹組
                            var rootListData = _this.queryListTreeByPid(pid, d);
                            _this.loadListTree(rootListData, d, 1);
                        } else {
                            _this.loadTree(d, 1);
                        }

                        // 顯示樹線
                        _this.showLine();

                        // 這種情況下需要一開始就將toolbar顯示在頁面上
                        if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                            _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
                        }

                        // 判斷是否有錯誤數據，並是否列印錯誤數據
                        _this.msgErrData();
                        
                        // 設定複選框的初始值
                        if(_this.select){
                        	_this.selectVal(_this.selectInitVal);
                        }

                        // 保存樹副本
                        _this.bak = _this.obj.html();
                        
                        // 載入完畢後的回呼
                        _this.done(result, _this.obj);
                    } else {
                        // 如果列印不出任何資訊說明是在這裡，用了錯誤的資料格式， 或回傳碼不正確
                        if (_this.dataStyle == 'layuiStyle'){
                            _this.obj.html(_this.getNoneDom().errText(result[_this.response.message]));
                            _this.error(null, code, result[_this.response.message]);
                            //layer.msg(result[_this.response.message], {icon:2});
                        } else {
                            _this.obj.html(_this.getNoneDom().errText(result.status[_this.response.message]));
                            _this.error(null, code, result.status[_this.response.message]);
                            //layer.msg(result.status[_this.response.message], {icon:2});
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){// 非同步載入異常回呼
                    _this.obj.html(_this.getNoneDom().errText(textStatus + ": " + errorThrown));
                    _this.error(XMLHttpRequest, textStatus, errorThrown);
                },
                complete: function(XMLHttpRequest, textStatus){// 非同步載入完成回呼
                    if(_this.load){layer.close(index);}
                    _this.complete(XMLHttpRequest, textStatus);
                }
            });
        }
    };

    // 載入子節點
    DTree.prototype.getChild = function($div, data) {
        var _this = this, $ul = $div.next("ul");

        _this.setNodeParam($div);

        if(typeof data !== 'undefined') {
            if(typeof data.length === 'undefined'){
                //_this.obj.html(_this.getNoneDom().errText("資料解析異常，data資料格式不正確"));
                layer.msg("資料解析異常，data資料格式不正確", {icon:5});
                return ;
            }

            //先將ul中的元素清空
            $ul.html("");

            // 解析樹
            if (_this.dataFormat == 'list'){
                var pid = _this.node.nodeId;
                var level = parseInt(_this.node.level)+1;

                var listData = _this.queryListTreeByPid(pid, data);
                _this.loadListTree(listData, _this.data, level);
            } else {
                _this.loadTree(data, level);
            }

            // 顯示樹線
            _this.showLine();

            // 這種情況下需要一開始就將toolbar顯示在頁面上
            if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
            }

            // 判斷是否有錯誤數據，並是否列印錯誤數據
            _this.msgErrData();
            
            // 保存樹副本
            _this.bak = _this.obj.html();

        } else {
            if (!_this.url) {
                //_this.obj.html(_this.getNoneDom().errText("資料請求異常，url參數未指定"));
                layer.msg("資料請求異常，url參數未指定", {icon:5});
                return ;
            }

            $ul.html("");
            var index = _this.load ? layer.load(1) : "";
            AjaxHelper.request({
                async: _this.async,
                headers: _this.headers,
                type: _this.method,
                url: _this.url,
                dataType: _this.dataType,
                withCredentials: _this.withCredentials,
                data:  _this.getFilterRequestParam(_this.getRequestParam()),
                success: function(result) {
                    if (typeof result === 'string') {
                        result = $.parseJSON(result);
                    }
                    var code = "";
                    if (_this.dataStyle == 'layuiStyle'){
                        code = result[_this.response.statusName];
                    } else {
                        code = result.status[_this.response.statusName];
                    }

                    if (code == _this.response.statusCode) {
                        // 解析樹
                        var pid = _this.node.nodeId;
                        var level = parseInt(_this.node.level)+1;
                        if (_this.dataFormat == 'list'){
                            var pListData = _this.queryListTreeByPid(pid, result[_this.response.rootName]);
                            _this.loadListTree(pListData, result[_this.response.rootName], level, $ul);
                        } else {
                            _this.loadTree(result[_this.response.rootName], level, $ul);
                        }

                        // 顯示樹線
                        _this.showLine();

                        // 這種情況下需要一開始就將toolbar顯示在頁面上
                        if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                            _this.setToolbarDom().setToolbarPlace(_this.toolbarMenu);
                        }

                        // 判斷是否有錯誤數據，並是否列印錯誤數據
                        _this.msgErrData();

                        $ul.addClass(NAV_SHOW);
                        
                        // 保存樹副本
                        _this.bak = _this.obj.html();
                    } else {
                        if (_this.dataStyle == 'layuiStyle'){
                            _this.obj.html(_this.getNoneDom().errText(result[_this.response.message]));
                            _this.error(null, code, result[_this.response.message]);
                            //layer.msg(result[_this.response.message], {icon:2});
                        } else {
                            _this.obj.html(_this.getNoneDom().errText(result.status[_this.response.message]));
                            _this.error(null, code, result.status[_this.response.message]);
                            //layer.msg(result.status[_this.response.message], {icon:2});
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){// 非同步載入異常回呼
                    _this.obj.html(_this.getNoneDom().errText(textStatus + ": " + errorThrown));
                    _this.error(XMLHttpRequest, textStatus, errorThrown);
                },
                complete: function(XMLHttpRequest, textStatus){// 非同步載入完成回呼
                    if(_this.load){layer.close(index);}
                    _this.complete(XMLHttpRequest, textStatus);
                }
            });
        }
    };

    // 初始化樹或者拼接樹
    DTree.prototype.loadListTree = function(pListData, listData, level, $ul){
        var _this = this;
        $ul = $ul || _this.getNodeDom().nowOrRootUl();	//目前選取的節點或根節點
        if (pListData.length > 0){
            for (var i = 0; i < pListData.length; i++) {
                // 1.取得已知節點的全部資料
                var data = pListData[i];
                if(typeof data !== "object") continue;
                var parseData = _this.parseData(data);
                var childListData = _this.queryListTreeByPid(parseData.treeId(), listData); // 根據已知資料的id判斷該條資料是否還有子資料

                // 3. 頁面元素載入資料
                $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(childListData.length), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(level), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), ($ul.hasClass(UL_ROOT) ? "root" : "item")));
                // 4.有子資料的元素載入子節點
                if(childListData.length > 0){
                    var cLevel = parseInt(level)+1;
                    _this.loadListTree(childListData, listData, cLevel, _this.obj.find("ul[data-id='"+parseData.treeId()+"']"));
                }
            }
        }
    };

    // 根據父ID找出list資料中符合的元素
    DTree.prototype.queryListTreeByPid = function(pid, listData){
        var _this = this;
        var rootListData = [];
        if (listData) {
            for (var i = 0; i < listData.length; i++) {
                var data = listData[i];
                if(typeof data !== "object") continue;
                if(pid == "null" || pid == null){
                    if(data[_this.response.parentId] == null) { rootListData.push(data); }
                } else {
                    if (data[_this.response.parentId] == pid){
                        if (data[_this.response.treeId] == pid){
                            _this.errData.push(data);
                        } else {
                            rootListData.push(data);
                        }
                    }
                }
            }
        }
        return rootListData;
    };

    // 初始化樹或者拼接樹
    DTree.prototype.loadTree = function(root, level, $ul){
        var _this = this;
        if (root) {
            $ul = $ul || _this.getNodeDom().nowOrRootUl();	//目前選取的節點或根節點
            for (var i = 0; i < root.length; i++) {	// 遍歷跟節點或追加的跟節點
                var data = root[i];
                if(typeof data !== "object") continue;
                if(data[_this.response.treeId] == data[_this.response.parentId]) { _this.errData.push(data); }
                var parseData = _this.parseData(data);
                var children = parseData.children();
                $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(children.length), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(level), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), ($ul.hasClass(UL_ROOT) ? "root" : "item")));
                if (children.length != 0) {
                    var cLevel = parseInt(level)+1;
                    _this.loadTree(children, cLevel, _this.obj.find("ul[data-id='"+parseData.treeId()+"']"));
                }
            }
        }
    };

    // 判斷資料載入時是否有錯誤數據，並是否列印錯誤資料
    DTree.prototype.msgErrData = function() {
        var _this = this;
        if(_this.errData.length > 0 && _this.errDataShow) {
            var title = "";
            for(var i=0; i<_this.errData.length; i++) {
                var edata = _this.errData[i];
                title += "数据：【"+edata[_this.response.title]+"】中節點id和上级id值一致！ \n";
            }
            layer.msg(title, {icon:2,time:5000});
        }
        // 顯示之後，將錯誤資料製空
        _this.errData = [];
    };

    // 解析data資料
    DTree.prototype.parseData = function(data) {
        var _this = this;

        return {
            treeId: function(){
                return data[_this.response.treeId];
            },
            parentId: function(){
                return data[_this.response.parentId];
            },
            fmtTitle: function(){
                if(typeof _this.formatter.title === 'function'){
                    var ftitle = _this.formatter.title(data);
                    var tt = data[_this.response.title];
                    tt = (ftitle == "" || ftitle == undefined || ftitle == null) ? tt : ftitle;
                    return tt || "";
                }
                return data[_this.response.title];
            },
            title: function(){
                return data[_this.response.title];
            },
            level: function(){
                return data[_this.response.level] || "";
            },
            ficonClass: function(){
                return data[_this.response.ficonClass] || "";
            },
            iconClass: function(){
                return data[_this.response.iconClass] || "";
            },
            last: function(len){
                return ((len == 0) ?
                    ((typeof (data[_this.response.last]) === "boolean") ? data[_this.response.last] : true) :
                    ((typeof (data[_this.response.last]) === "boolean") ? data[_this.response.last] : false));
            },
            spread: function(level){
                return ((level < _this.initLevel) ?
                    ((typeof (data[_this.response.spread]) === "boolean") ? data[_this.response.spread] : true) :
                    ((typeof (data[_this.response.spread]) === "boolean") ? data[_this.response.spread] : false));
            },
            disabled: function(){
                return (typeof (data[_this.response.disabled]) === "boolean") ? data[_this.response.disabled] : false;
            },
            hide: function(){
                return (typeof (data[_this.response.hide]) === "boolean") ? data[_this.response.hide] : false;
            },
            checkArr: function(){
                var checkArr = [];
                var checkArrData = data[_this.response.checkArr];
                if(typeof checkArrData === 'string'){
                    if(checkArrData.indexOf("{") > -1 && checkArrData.indexOf("}") > -1){
                        checkArrData = JSON.parse(checkArrData);
                    } else {
                        checkArrData = {"type":"0","checked":checkArrData};
                    }
                }
                if(typeof checkArrData === 'object'){
                    if(typeof checkArrData.length === 'undefined'){
                        checkArr.push(checkArrData);
                    } else {
                        checkArr = checkArrData;
                    }
                }

                if(checkArr.length > 0 && checkArr.length > _this.checkArrLen){
                    _this.checkArrLen = checkArr.length;		// 取得複選框個數
                }
                return checkArr;

            },
            children: function(){
                return data[_this.response.childName] || [];
            },
            basicData: function(){
                return event.escape(JSON.stringify(data[_this.response.basicData])) || JSON.stringify({});
            },
            recordData: function(){
                var recordData = _this.record ? event.cloneObj(data, [_this.response.treeId,
                    _this.response.parentId,
                    _this.response.title,
                    _this.response.iconClass,
                    _this.response.childName,
                    _this.response.last,
                    _this.response.spread,
                    _this.response.disabled,
                    _this.response.hide,
                    _this.response.checkArr,
                    _this.response.checked,
                    _this.response.type,
                    _this.response.basicData]) : {};

                return event.escape(JSON.stringify(recordData));
            },
            data: function(){
                return data;
            }
        }

    };

    //當無節點資料時顯示dom
    DTree.prototype.getNoneDom = function(){
        var _this = this,
            rootId = _this.obj[0].id,
            noneTitle = _this.none;

        return {
            text: function(){
                return "<div class='"+NONETITLE+"' dtree-id='"+rootId+"'>"+noneTitle+"</div>";
            },
            errText: function(errInfo){
                return "<div class='"+NONETITLE+"' dtree-id='"+rootId+"'>"+errInfo+"</div>";
            }
        }
    };

    //新增節點的dom值
    DTree.prototype.getDom = function(treeId, parentId, title, fmtTitle, last, ficonClass, iconClass, checkArr, level, spread, disabled, hide) {
        var _this = this,
            rootId = _this.obj[0].id,
            toolbar = _this.toolbar,
            checkbar = _this.checkbar;

        return {
            fnode: function() {	// + - 圖示
                // 取得圖示的變數
                var fnodeIcon = _this.fnodeIcon,
                    fleafIcon = _this.fleafIcon;

                var fleafIconLeaf = _this.usefontStyle.fnode.leaf,
                    fnodeIconOpen =  _this.usefontStyle.fnode.node.open,
                    fnodeIconClose =  _this.usefontStyle.fnode.node.close;

                if(ficonClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        fleafIconLeaf = iconfont + " " + ficonClass;
                        fnodeIconOpen = iconfont + " " + ficonClass;
                        fnodeIconClose = iconfont + " " + ficonClass;
                    } else {
                        fleafIconLeaf = iconfont[0] + " " + ficonClass;
                        fnodeIconOpen = iconfont[0] + " " + ficonClass;
                        fnodeIconClose = iconfont[0] + " " + ficonClass;
                    }
                }

                if(fnodeIcon != "-1" && fleafIcon != "-1"){	// 都載入
                    return last ? "<i class='"+fleafIconLeaf+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }

                if(fnodeIcon != "-1" && fleafIcon == "-1"){	// 載入node 隱藏leaf
                    return last ? "<i class='"+fleafIconLeaf+" "+ICON_HIDE+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }

                if(fnodeIcon == "-1" && fleafIcon != "-1"){	// 隱藏node 載入leaf
                    return last ? "<i class='"+fleafIconLeaf+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }

                if(fnodeIcon == "-1" && fleafIcon == "-1"){	// 都隱藏
                    return last ? "<i class='"+fleafIconLeaf+" "+ICON_HIDE+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' style='display:none;'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"'></i>" : "<i class='"+fnodeIconClose+" "+_this.style.dfont+" "+_this.style.ficon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }
            },
            node: function() {	// 二級圖示樣式
                // 取得圖示的變數
                var nodeIcon = _this.nodeIcon,
                    leafIcon = _this.leafIcon;

                var sleafIconLeaf = _this.usefontStyle.snode.leaf,
                    snodeIconOpen =  _this.usefontStyle.snode.node.open,
                    snodeIconClose =  _this.usefontStyle.snode.node.close;
                if(iconClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        sleafIconLeaf = iconfont + " " + iconClass;
                        snodeIconOpen = iconfont + " " + iconClass;
                        snodeIconClose = iconfont + " " + iconClass;
                    } else {
                        sleafIconLeaf = iconfont[0] + " " + iconClass;
                        snodeIconOpen = iconfont[0] + " " + iconClass;
                        snodeIconClose = iconfont[0] + " " + iconClass;
                    }
                }

                if(nodeIcon != "-1" && leafIcon != "-1"){	// 都載入
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }

                if(nodeIcon != "-1" && leafIcon == "-1"){	// 載入node 隱藏leaf
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }

                if(nodeIcon == "-1" && leafIcon != "-1"){	// 隱藏node 載入leaf
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }

                if(nodeIcon == "-1" && leafIcon == "-1"){	// 都隱藏
                    return last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }
            },
            checkbox: function() {	// 複選框
                var flag = false;
                if(_this.checkbarLoad == "node"){if (checkbar) {flag = true;}} else {if (last) {if (checkbar) {flag = true;}}}

                if(flag){
                    var result = "<div class='"+LI_DIV_CHECKBAR+"' data-id='"+treeId+"' dtree-id='"+rootId+"'>";
                    if(checkArr && checkArr.length > 0){

                        for (var i = 0; i < checkArr.length; i++) {
                            var checkData = checkArr[i];
                            var checked = checkData.checked;
                            var CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            if (checked == "2") {	//半選擇
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.noall + " " + _this.style.chs;
                            } else if (checked == "1") {	//選擇
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.on + " " + _this.style.chs;
                            } else {	//未選擇或無值
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            }
                            var disClass = "";
                            if(disabled){disClass = NAV_DIS;}
                            result += "<i class='"+CHOOSE_CLASS+" "+_this.style.dfont+" "+_this.style.cbox+" "+disClass+"' data-id='"+treeId+"' dtree-id='"+rootId+"' data-checked='"+checkData.checked+"' data-initchecked='"+checkData.checked+"' data-type='"+checkData.type+"' dtree-click='"+eventName.checkNodeClick+"' data-par='."+LI_CLICK_CHECKBAR+"' dtree-disabled='"+disabled+"'></i>";
                        }
                    }
                    result += "</div>";
                    return result;
                }

                return "";
            },
            text: function() {	// 文字顯示
                var disClass = "";
                if(disabled){disClass = NAV_DIS;}
                return "<cite class='"+LI_DIV_TEXT_CLASS+" "+disClass+"' data-id='"+treeId+"' data-leaf='"+(last ? "leaf" : "node")+"' dtree-disabled='"+disabled+"' data-title='"+title+"' >"+fmtTitle+"</cite>";
            },
            ul: function() {	//子節點ul
                return last ? "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" :
                    (spread ? "<ul class='"+LI_NAV_CHILD+" "+NAV_SHOW+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" : "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>");
            }
        };
    };

    //替換節點的dom值，或指定值
    DTree.prototype.replaceDom = function($div, treeId, last, spread, disabled, hide) {
        var _this = this,
            rootId = _this.obj[0].id,
            toolbar = _this.toolbar,
            checkbar = _this.checkbar;

        return {
            fnode: function(ficonClass) {	// + - 圖示
                var fnode = "";

                // 取得圖示的變數
                var fnodeIcon = _this.fnodeIcon,
                    fleafIcon = _this.fleafIcon;

                var fleafIconLeaf = _this.usefontStyle.fnode.leaf,
                    fnodeIconOpen =  _this.usefontStyle.fnode.node.open,
                    fnodeIconClose =  _this.usefontStyle.fnode.node.close;

                if(ficonClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        fleafIconLeaf = iconfont + " " + ficonClass;
                        fnodeIconOpen = iconfont + " " + ficonClass;
                        fnodeIconClose = iconfont + " " + ficonClass;
                    } else {
                        fleafIconLeaf = iconfont[0] + " " + ficonClass;
                        fnodeIconOpen = iconfont[0] + " " + ficonClass;
                        fnodeIconClose = iconfont[0] + " " + ficonClass;
                    }
                }

                if(fnodeIcon != "-1" && leafIcon != "-1"){	// 都載入
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }else if(nodeIcon != "-1" && leafIcon == "-1"){	// 載入node 隱藏leaf
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon != "-1"){	// 隱藏node 載入leaf
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon == "-1"){	// 都隱藏
                    fnode = last ? "<i class='"+fleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+fnodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+fnodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+ficonClass+"'></i>");
                }
                if(fnode != ""){_this.getNodeDom($div).fnode().replaceWith($(fnode));}
            },
            node: function(iconClass) {	// 二級圖示樣式
                var snode = "";

                // 取得圖示的變數
                var nodeIcon = _this.nodeIcon,
                    leafIcon = _this.leafIcon;

                var sleafIconLeaf = _this.usefontStyle.snode.leaf,
                    snodeIconOpen =  _this.usefontStyle.snode.node.open,
                    snodeIconClose =  _this.usefontStyle.snode.node.close;
                if(iconClass){
                    var iconfont = _this.iconfont;
                    if(typeof iconfont === 'string') {
                        sleafIconLeaf = iconfont + " " + iconClass;
                        snodeIconOpen = iconfont + " " + iconClass;
                        snodeIconClose = iconfont + " " + iconClass;
                    } else {
                        sleafIconLeaf = iconfont[0] + " " + iconClass;
                        snodeIconOpen = iconfont[0] + " " + iconClass;
                        snodeIconClose = iconfont[0] + " " + iconClass;
                    }
                }

                if(nodeIcon != "-1" && leafIcon != "-1"){	// 都載入
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }else if(nodeIcon != "-1" && leafIcon == "-1"){	// 載入node 隱藏leaf
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon != "-1"){	// 隱藏node 載入leaf
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }else if(nodeIcon == "-1" && leafIcon == "-1"){	// 都隱藏
                    snode = last ? "<i class='"+sleafIconLeaf+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='last' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" :
                        (spread ? "<i class='"+snodeIconOpen+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='open' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>" : "<i class='"+snodeIconClose+" "+DTREEFONTSPECIAL+" "+_this.style.dfont+" "+_this.style.icon+"' data-spread='close' data-id='"+treeId+"' dtree-id='"+rootId+"' data-iconClass='"+iconClass+"'></i>");
                }
                if(snode != ""){_this.getNodeDom($div).snode().replaceWith($(snode));}
            },
            checkbox: function(checkArr) {	// 複選框
                var flag = false;
                if(_this.checkbarLoad == "node"){if (checkbar) {flag = true;}} else {if (last) {if (checkbar) {flag = true;}}}

                if(flag){
                    var result = "<div class='"+LI_DIV_CHECKBAR+"' data-id='"+treeId+"' dtree-id='"+rootId+"'>";
                    if(checkArr && checkArr.length > 0){

                        for (var i = 0; i < checkArr.length; i++) {
                            var checkData = checkArr[i];
                            var checked = checkData.checked;
                            var CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            if (checked == "2") {	//半選擇
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.noall + " " + _this.style.chs;
                            } else if (checked == "1") {	//選擇
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.on + " " + _this.style.chs;
                            } else {	//未選擇或無值
                                CHOOSE_CLASS = _this.usefontStyle.checkbox.out;
                            }
                            var disClass = "";
                            if(disabled){disClass = NAV_DIS;}
                            result += "<i class='"+CHOOSE_CLASS+" "+_this.style.dfont+" "+_this.style.cbox+" "+disClass+"' data-id='"+treeId+"' dtree-id='"+rootId+"' data-checked='"+checkData.checked+"' data-initchecked='"+checkData.checked+"' data-type='"+checkData.type+"' dtree-click='"+eventName.checkNodeClick+"' data-par='."+LI_CLICK_CHECKBAR+"' dtree-disabled='"+disabled+"'></i>";
                        }
                    }
                    result += "</div>";
                    _this.getNodeDom($div).snode().next("div").replaceWith($(result));
                }
            },
            text: function(title) {	// 文字顯示
                var disClass = "";
                if(disabled){disClass = NAV_DIS;}
                var cite = "<cite class='"+LI_DIV_TEXT_CLASS+" "+disClass+"' data-id='"+treeId+"' data-leaf='"+(last ? "leaf" : "node")+"' dtree-disabled='"+disabled+"' >"+title+"</cite>"
                _this.getNodeDom($div).cite().replaceWith($(cite));
            },
            ul: function() {	//子節點ul
                var ul = last ? "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" :
                    (spread ? "<ul class='"+LI_NAV_CHILD+" "+NAV_SHOW+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>" : "<ul class='"+LI_NAV_CHILD+"' data-id='"+treeId+"' dtree-id='"+rootId+"'></ul>");
                _this.getNodeDom($div).nextUl().replaceWith($(ul));
            },
            div: function(){
                $div.attr("data-id", treeId);
            },
            basicData: function(basicData){
                basicData = (basicData == "{}") ? "" : basicData;
                $div.attr("data-basic", basicData);
            },
            recordData: function(recordData){
                recordData = (recordData == "{}") ? "" : recordData;
                $div.attr("data-record", recordData);
            },
            p_li: function(pId){
            	var $li = $div.parent("li");
            	$li.attr("data-id", treeId);
                if(pId) {
                	$li.attr("data-pid", pId);
                }
                return $li;
            }
        };

    };

    // 取得拼接好的li
    DTree.prototype.getLiItemDom =  function(treeId, parentId, title, fmtTitle, last, ficonClass, iconClass, checkArr, level, spread, disabled, hide, basicData, recordData, flag) {
        var _this = this,
            rootId = _this.obj[0].id;

        var dom = _this.getDom(treeId, parentId, title, fmtTitle, last, ficonClass, iconClass, checkArr, level, spread, disabled, hide);
        basicData = (basicData == "{}") ? "" : basicData;
        recordData = (recordData == "{}") ? "" : recordData;
        var div = "<div class='"+LI_DIV_ITEM+" "+_this.style.item+"' data-id='"+treeId+"' dtree-id='"+rootId+"' dtree-click='"+eventName.itemNodeClick+"' data-basic='"+basicData+"' data-record='"+recordData+"' dtree-disabled='"+disabled+"' dtree-hide='"+hide+"' ";
        if(_this.toolbar){
            if(_this.toolbarWay == "contextmenu") {
                if(_this.toolbarLoad == "node") { div += " d-contextmenu='true'>"; }
                if(_this.toolbarLoad == "noleaf") { if(!last){ div += " d-contextmenu='true'>"; } else { div += " d-contextmenu='false'>";} }
                if(_this.toolbarLoad == "leaf") { if(last){ div += " d-contextmenu='true'>"; } else { div += " d-contextmenu='false'>";} }
            } else { div += " d-contextmenu='false'>"; }
        } else { div += " d-contextmenu='false'>"; }

        var hideClass = "";
        var lineClass = "";
        if(hide){hideClass = NAV_HIDE;}
        var li = ["<li " + "class='"+LI_CLICK_CHECKBAR+" "+LI_NAV_ITEM+" "+hideClass+" "+lineClass+"'" + "data-id='"+treeId+"'" + "data-pid='"+(flag == "root" ? ((typeof parentId !== undefined && parentId != "") ? parentId : "-1") : parentId)+"'" + "dtree-id='"+rootId+"'" + "data-index='"+level+"'" + "dtree-hide='"+hide+"'" +">" +
        div ,
            dom.fnode(),
            dom.node(),
            dom.checkbox(),
            dom.text(),
            "</div>", dom.ul(), "</li>"].join("");

        return li;
    };

    // 初始化節點，用於資料回顯
    DTree.prototype.dataInit = function(chooseId){
        var _this = this;
        var $div = _this.obj.find("div[data-id='"+chooseId+"']");
        _this.getNodeDom($div).parentLi().find("."+NAV_THIS).removeClass(NAV_THIS);
        _this.getNodeDom($div).parentLi().find("."+_this.style.itemThis).removeClass(_this.style.itemThis);
        $div.addClass(NAV_THIS);
        $div.addClass(_this.style.itemThis);
        _this.setNodeParam($div);
        // 將該節點的父節點全部展開
        var $li_parents = $div.parents("."+LI_NAV_ITEM);
        $li_parents.children("ul").addClass(NAV_SHOW);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).addClass(_this.usefontStyle.fnode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).removeClass(_this.usefontStyle.fnode.node.close);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).addClass(_this.usefontStyle.snode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).removeClass(_this.usefontStyle.snode.node.close);
        return _this.getNowParam();
    };
    
    // 基於備份的Html資料回滾
    DTree.prototype.rollbackHtml = function(chooseId){
    	var _this = this;
    	if(_this.bak) {
    		_this.obj.html(_this.bak);
    		// 取消全部選取狀態
    		_this.cancelNavThis();
    		if(_this.checkbar) {
    			_this.cancelCheckedNode();
    			_this.chooseDataInit(chooseId);
    		} else {
    			_this.dataInit(chooseId);
    		}
    		
    		_this.bak = _this.obj.html();
    	}
    };

    
    /******************** 基礎事件區域 ********************/
    // 資料格式化
    DTree.prototype.escape = function(html){
        return event.escape(html);
    };

    // 格式化資料轉回正常資料
    DTree.prototype.unescape = function(str){
        return event.unescape(str);
    };

    // 取消選取div
    DTree.prototype.cancelNavThis = function(){
        var _this = this;
        _this.obj.find("div[data-id]").parent().find("."+NAV_THIS).removeClass(NAV_THIS);
        _this.obj.find("div[data-id]").parent().find("."+_this.style.itemThis).removeClass(_this.style.itemThis);
    }

    // 選中div
    DTree.prototype.navThis = function(id){
        var _this = this;
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null) {
            _this.cancelNavThis();
            $div.addClass(NAV_THIS);
            $div.addClass(_this.style.itemThis);
        }
    }

    // 手風琴模式操作其他節點
    DTree.prototype.accordionUL = function($ul) {
        var _this = this;
        if(_this.accordion) {
            $ul.closest("li[data-index]").siblings("li[data-index]").children("ul[data-id]").removeClass(NAV_SHOW);
            var $divs = $ul.closest("li[data-index]").siblings("li[data-index]").children("ul[data-id]").prev("div");
            if($divs.length && $divs.length > 0) {
                for (var i=0; i<$divs.length; i++) {
                    var $div = $($divs[i]);
                    var $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode();
                    if($i_spread.attr("data-spread") != 'last'){
                        _this.operateIcon($i_spread, $i_node).close();
                    }
                }
            }

        }
    };

    // 展開或隱藏節點 作用點： div
    DTree.prototype.clickSpread = function($div) {
        var _this = this;
        var $i_spread = _this.getNodeDom($div).fnode(),
            $i_node = _this.getNodeDom($div).snode(),
            $cite = _this.getNodeDom($div).cite(),
            spread = $i_spread.attr("data-spread"),
            $ul = $div.next("ul");

        if ($ul.length > 0) {
            if (spread == "close") {
                if (_this.type=="load") {	//增加載入
                    if (_this.cache) {	//開啟快取
                        if ($ul.html()) {
                            $ul.addClass(NAV_SHOW);
                            _this.accordionUL($ul);
                        } else {	//載入節點
                            _this.getChild($div);
                            _this.accordionUL($ul);
                        }
                    }else {	//每次取新的資料
                        $ul.html("");
                        _this.getChild($div);
                        _this.accordionUL($ul);
                    }
                } else {	// 全量加載
                    $ul.addClass(NAV_SHOW);
                    _this.accordionUL($ul);
                }
                _this.operateIcon($i_spread, $i_node).open();
            } else if (spread == "open") {
                $ul.removeClass(NAV_SHOW);
                _this.operateIcon($i_spread, $i_node).close();
            }
        }
    };

    // 設定節點為disabled
    DTree.prototype.setDisabledNodes = function(disabledIds){
        var _this = this;
        var disabledId = disabledIds.split(",");
        for (var i=0; i<disabledId.length; i++) {
            var $div = _this.getNodeDom(disabledId[i]).div();
            var $i = $div.children("div."+LI_DIV_CHECKBAR).children("i[data-par]");
            var $cite = $div.children("cite[data-leaf]");
            if($div != null && $div.attr("dtree-disabled") != "true") {
                $div.attr("dtree-disabled", "true");
                $i.attr("dtree-disabled", "true");
                $i.addClass(NAV_DIS);
                $cite.attr("dtree-disabled", "true");
                $cite.addClass(NAV_DIS);
            }
        }
    };
    
    // 設定全部節點為disabled
    DTree.prototype.setDisabledAllNodes = function(){
    	var _this = this;
    	_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"']").each(function(){
    		var $div = $(this);
    		var $i = $div.children("div."+LI_DIV_CHECKBAR).children("i[data-par]");
    		var $cite = $div.children("cite[data-leaf]");
    		if($div != null && $div.attr("dtree-disabled") != "true") {
    			$div.attr("dtree-disabled", "true");
    			$i.attr("dtree-disabled", "true");
    			$i.addClass(NAV_DIS);
    			$cite.attr("dtree-disabled", "true");
    			$cite.addClass(NAV_DIS);
    		}
    	});
    };

    // 將節點的disabled取消
    DTree.prototype.cancelDisabledNodes = function(disabledIds){
        var _this = this;
        var disabledId = disabledIds.split(",");
        for (var i=0; i<disabledId.length; i++) {
            var $div = _this.getNodeDom(disabledId[i]).div();
            var $i = $div.children("div."+LI_DIV_CHECKBAR).children("i[data-par]");
            var $cite = $div.children("cite[data-leaf]");
            if($div != null && $div.attr("dtree-disabled") == "true") {
                $div.attr("dtree-disabled", "false");
                $i.attr("dtree-disabled", "false");
                $i.removeClass(NAV_DIS);
                $cite.attr("dtree-disabled", "false");
                $cite.removeClass(NAV_DIS);
            }
        }
    };

    // 取得指定disabled節點的值
    DTree.prototype.getDisabledNodesParam = function(disabledIds){
        var _this = this;
        var disabledId = disabledIds.split(",");
        var disabledNodes = [];
        for (var i=0; i<disabledId.length; i++) {
            var $div = _this.getNodeDom(disabledId[i]).div();
            if($div != null && $div.attr("dtree-disabled") == "true") {
                disabledNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
            }
        }
        return disabledNodes;
    };

    // 取得全部disabled節點的值
    DTree.prototype.getAllDisabledNodesParam = function(){
        var _this = this;
        var disabledNodes = [];
        _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='true']").each(function(){
            var $div = $(this);
            disabledNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
        });
        return disabledNodes;
    };

    // 設定節點為hide
    DTree.prototype.setHideNodes = function(hideIds){
        var _this = this;
        var hideId = hideIds.split(",");
        for (var i=0; i<hideId.length; i++) {
            var $div = _this.getNodeDom(hideId[i]).div();
            var $li = $div.parent("li[dtree-hide]");
            if($div != null && $div.attr("dtree-hide") != "true") {
                $div.attr("dtree-hide", "true");
                $li.attr("dtree-hide", "true");
                $li.addClass(NAV_HIDE);
            }
        }
    };
    // 將節點的hide取消
    DTree.prototype.cancelHideNodes = function(hideIds){
        var _this = this;
        var hideId = hideIds.split(",");
        for (var i=0; i<hideId.length; i++) {
            var $div = _this.getNodeDom(hideId[i]).div();
            var $li = $div.parent("li[dtree-hide]");
            if($div != null && $div.attr("dtree-hide") == "true") {
                $div.attr("dtree-hide", "false");
                $li.attr("dtree-hide", "false");
                $li.removeClass(NAV_HIDE);
            }
        }
    };

    // 取得指定hide節點的值
    DTree.prototype.getHideNodesParam = function(hideIds){
        var _this = this;
        var hideId = hideIds.split(",");
        var hideNodes = [];
        for (var i=0; i<hideId.length; i++) {
            var $div = _this.getNodeDom(hideId[i]).div();
            if($div != null && $div.attr("dtree-hide") == "true") {
                hideNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
            }
        }
        return hideNodes;
    };

    // 取得全部hide節點的值
    DTree.prototype.getAllHideNodesParam = function(){
        var _this = this;
        var hideNodes = [];
        _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][dtree-hide='true']").each(function(){
            var $div = $(this);
            hideNodes.push(_this.getRequestParam(_this.getTempNodeParam($div)));
        });
        return hideNodes;
    };

    // 重新整理樹
    DTree.prototype.refreshTree = function(){
        var _this = this;
        _this.obj.html("");	// 清空樹狀結構
        _this.initNodeParam(); // 清空參數
        _this.init(); //執行初始化方法
    }

    // 局部重新整理樹--新增子節點時
    DTree.prototype.partialRefreshAdd = function($div, data){
        var _this = this;
        $ul = $div.next("ul");

        // 判斷目前點擊的節點是否為最後一級節點，如果是，則需要修改節點的樣式
        var $icon_i = $div.find("i[data-spread]");
        if ($icon_i.eq(0).attr("data-spread") == "last") {
            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).openWithLeaf();
        } else {	//如果不是，也要修改節點樣式
            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).open();
        }
        $ul.addClass(NAV_SHOW);	//展開UL
        _this.accordionUL($ul);

        if(data) {
            if(data.length && data.length > 0) {
                _this.getChild($div, data);
            } else {
                var parseData = _this.parseData(data);

                if(parseData.treeId()){
                    var level = parseInt($div.parent("li").attr("data-index"))+1;
                    $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(0), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), "item"));

                    // 建造完畢後，選取該DIV
                    $thisDiv = $ul.find("div[data-id='"+parseData.treeId()+"']");
                    _this.setNodeParam($thisDiv);

                    _this.showLine($ul.find("li"));
                } else {
                    layer.msg("新增失敗,節點ID為undefined！",{icon:5});
                    // 重新賦值
                    _this.setNodeParam($div);
                }
            }
        } else {
            _this.getChild($div);
        }
    }

    // 局部重新整理樹--編輯目前節點選取節點時
    DTree.prototype.partialRefreshEdit = function($div, data){
        var _this = this;
        $ul = $div.next("ul"),
        $p_li = $div.parent("li");

        if(data) {
            if(typeof data === 'object') {
                var parseData = _this.parseData(data);

                if(parseData.treeId()){
                    var replaceDom = _this.replaceDom($div, parseData.treeId(), parseData.last(0), parseData.spread(), parseData.disabled(), parseData.hide());
                    replaceDom.div();
                    replaceDom.node(parseData.iconClass());
                    replaceDom.checkbox(parseData.checkArr());
                    replaceDom.text(parseData.title());
                    replaceDom.ul();
                    replaceDom.basicData(parseData.basicData());
                    replaceDom.recordData(parseData.recordData());
                    
                    var parentId = parseData.parentId();
                    var oldParentId = $p_li.attr("data-pid");
                    if(parentId && parentId != oldParentId) {
                    	// 變更了父節點
                    	$p_li = replaceDom.p_li(parentId);
                    	
                    	// 根據parentId找到下掛節點的ul
                    	var $goto_div = _this.getNodeDom(parentId).div(), 
                    		$goto_ul = _this.getNodeDom(parentId).nextUl();
                    	// 判斷父級ul中是否還存在li,如果不存在，則需要修改節點的樣式
                        if($goto_ul.children("li").length == 0){
                            var $icon_i = $goto_div.find("i[data-spread]");
                            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).openWithLeaf();
                            $goto_ul.addClass(NAV_SHOW);
                        }
                    	$goto_ul.append($p_li);
                    } else {
                    	replaceDom.p_li();
                    }
                    _this.setNodeParam($div);
                } else {
                    layer.msg("編輯失敗,節點ID為undefined！",{icon:5});
                    // 重新賦值
                    _this.setNodeParam($div);
                }
            } else {
                _this.getNodeDom($div).cite().html(data);
            }
        }
    }

    // 局部重新整理樹--當前節點選取被刪除時
    DTree.prototype.partialRefreshDel = function($div){
        var _this = this;
        $p_li = $div.parent("li");
        $p_ul = _this.getNodeDom($div).parentUl();
        $p_div = _this.getNodeDom($div).parentDiv();

        $p_li.remove();
        _this.showLine($p_ul.find("li"));
        // 判斷父級ul中是否還存在li,如果不存在，則需要修改節點的樣式
        if($p_ul.children("li").length == 0){
            var $icon_i = $p_div.find("i[data-spread]");
            _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).closeWithLeaf();
        }
        _this.initNodeParam();
    }

    /******************** 複選框區域 ********************/
    // 初始化複選框的值
    DTree.prototype.chooseDataInit = function(chooseIds){
        var _this = this;
        var chooseId = chooseIds.split(",");
        for (var i=0; i<chooseId.length; i++) {
            _this.obj.find("i[dtree-click='"+eventName.checkNodeClick+"']").each(function(){
                if ($(this).attr("data-id") == chooseId[i]) {
                    _this.checkStatus($(this)).check();
                }
            });
        }
        // 展開選取節點的父節點
        var $li_parents = _this.obj.find("i[dtree-click='"+eventName.checkNodeClick+"'][data-checked='1']").parents("."+LI_NAV_ITEM);
        $li_parents.children("ul").addClass(NAV_SHOW);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).addClass(_this.usefontStyle.fnode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.fnode.node.close)).removeClass(_this.usefontStyle.fnode.node.close);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).addClass(_this.usefontStyle.snode.node.open);
        $li_parents.children("."+LI_DIV_ITEM).children("i[data-spread]."+event.trimToDot(_this.usefontStyle.snode.node.close)).removeClass(_this.usefontStyle.snode.node.close);
        return _this.getCheckbarNodesParam();
    };

    //實作複選框點擊，子集選取父級也選取
    DTree.prototype.checkAllOrNot =  function($i) {
        var _this = this;
        //$i 當前點擊的checkbox
        var dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//當前checkbox的上級li節點
            $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
            $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

        if ($i.attr("data-checked") == "1") {
            // 處理目前節點的選取狀態
            _this.checkStatus($i).noCheck();

            // 處理子級節點的選取狀態
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).noCheck();

            // 處理父級節點的選取狀態
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var flag = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                if (flag == 0) {
                    //把父級去掉選中
                    var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                    _this.checkStatus($item_i).noCheck();
                }
            }
        } else {
            // 處理目前節點的選取狀態
            _this.checkStatus($i).check();

            // 處理子級節點的選取狀態
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).check();

            // 處理父級節點的選取狀態
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                //把父級選中
                _this.checkStatus($item_i).check();
            }
        }
    };

    //實作複選框點擊， no-all 子集選中父級半選中，子集全選父級選中
    DTree.prototype.checkAllOrNoallOrNot =  function($i) {
        var _this = this;
        //$i 當前點擊的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//當前checkbox的上級li節點
            $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
            $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

        if ($i.attr("data-checked") == "1") {	//目前複選框為選取狀態，點擊後變成未選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).noCheck();

            // 處理子級節點的選取狀態
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).noCheck();

            // 處理父級節點的選取狀態
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var flag = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                if (flag == 0) {
                    //把父級去掉選中
                    _this.checkStatus($item_i).noCheck();
                } else {
                    //把父級半選
                    _this.checkStatus($item_i).noallCheck();
                }
            }
        } else {		//目前複選框為未選取狀態，點擊後變為選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).check();

            // 處理子級節點的選取狀態
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).check();

            // 處理父級節點的選取狀態
            for (var i = 1, item = $parent_li; i < item.length; i++) {
                var flag1 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                var flag2 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']").length;
                var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                if (flag1 != flag2) {
                    // 父級複選框半選
                    _this.checkStatus($item_i).noallCheck();
                } else {
                    // 父級複選框全選
                    _this.checkStatus($item_i).check();
                }
            }
        }
    };

    //實現複選框點擊，p-casc：父級選中子集全選，子集無法改變父級選中狀態
    DTree.prototype.checkAllOrPcascOrNot = function($i) {
        var _this = this;
        //$i 當前點擊的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//當前checkbox的上級li節點
            $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
            $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

        if ($i.attr("data-checked") == "1") {	//目前複選框為選取狀態，點擊後變成未選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).noCheck();

            // 處理子級節點的選取狀態
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).noCheck();

        } else {		//目前複選框為未選取狀態，點擊後變為選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).check();

            // 處理子級節點的選取狀態
            var $child_li_i = $child_li.find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
            _this.checkStatus($child_li_i).check();
        }
    };

    //實作複選框點擊，self：各自選取互不影響
    DTree.prototype.checkOrNot = function($i) {
        var _this = this;
        //$i 當前點擊的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//當前checkbox的上級li節點
            $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
            $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

        if ($i.attr("data-checked") == "1") {	//目前複選框為選取狀態，點擊後變成未選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).noCheck();
        } else {		//目前複選框為未選取狀態，點擊後變為選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).check();
        }
    };

    //實現複選框點擊，only：只能選取1個複選框
    DTree.prototype.checkOnly = function($i) {
        var _this = this;
        //$i 當前點擊的checkbox
        var $div = $i.closest("."+LI_DIV_ITEM),
            dataPar = $i.attr("data-par"),
            dataType = $i.attr("data-type"),
            $li = $i.closest(dataPar),		//當前checkbox的上級li節點
            $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
            $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

        var checked = $i.attr("data-checked");
        // 將全部節點全部設為未選取狀態
        var $all_i = _this.obj.find("i[data-checked]");
        _this.checkStatus($all_i).noCheck();

        if (checked != "1") {	//目前複選框為未選取狀態，點擊後變為選取狀態
            // 處理目前節點的選取狀態
            _this.checkStatus($i).check();
        }
    };

    //實現複選框點擊
    DTree.prototype.changeCheck = function($i) {
        var _this = this;
        var temp = _this.temp;
        if(typeof $i === 'undefined') {
            $i = temp[0];
        }
        // 複選框選取事件
        if (_this.checkbarType == "all") {
            _this.checkAllOrNot($i);
        } else if(_this.checkbarType == "no-all") {
            _this.checkAllOrNoallOrNot($i);
        } else if(_this.checkbarType == "p-casc") {
            _this.checkAllOrPcascOrNot($i);
        } else if(_this.checkbarType == "self") {
            _this.checkOrNot($i);
        } else if(_this.checkbarType == "only") {
            _this.checkOnly($i);
        } else {
            _this.checkAllOrNot($i);
        }

        if(_this.select) {
        	// 設定複選框模式中的下拉樹的值
        	_this.selectCheckboxVal();
        }
        
        // 取得複選框選取節點的內容
        var checkbarNodes = _this.setAndGetCheckbarNodesParam(true);
        
        // 使用者自訂想做的事
        _this.checkbarFun.chooseDone(checkbarNodes);
        layui.event.call(this, MOD_NAME, "chooseDone("+$(_this.obj)[0].id+")", {"checkbarParams": checkbarNodes});
        _this.temp = [];
    };

    //複選框半選狀態初始化設定
    DTree.prototype.initNoAllCheck = function(){
        var _this = this;
        //1.取得所有選取節點
        var $is = _this.obj.find("i[data-checked='1']");
        if($is.length > 0){
            for ( var key = 0; key < $is.length; key++) {
                var $i = $($is[key]),
                    dataPar = $i.attr("data-par"),
                    dataType = $i.attr("data-type"),
                    $li = $i.closest(dataPar),		//當前checkbox的上級li節點
                    $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
                    $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

                // 處理父級節點的選取狀態
                for (var i = 1, item = $parent_li; i < item.length; i++) {
                    var flag1 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"'][data-checked='1']").length;
                    var flag2 = item.eq(i).find(">."+LI_NAV_CHILD+" ."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']").length;
                    var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                    if (flag1 != flag2) {
                        // 父級複選框半選
                        _this.checkStatus($item_i).noallCheck();
                    } else {
                        // 父級複選框全選
                        _this.checkStatus($item_i).check();
                    }
                }
            }
        }
    };

    //複選框選取狀態初始化設定
    DTree.prototype.initAllCheck = function(){
        var _this = this;
        //1.取得所有選取節點
        var $is = _this.obj.find("i[data-checked='1']");
        if($is.length > 0){
            for ( var key = 0; key < $is.length; key++) {
                var $i = $($is[key]),
                    dataPar = $i.attr("data-par"),
                    dataType = $i.attr("data-type"),
                    $li = $i.closest(dataPar),		//當前checkbox的上級li節點
                    $parent_li = $i.parents(dataPar),		//目前checkbox的所有父級li節點
                    $child_li = $li.find(dataPar);	//目前checkbox的上級li節點下的所有子級li節點

                // 處理父級節點的選取狀態
                for (var i = 1, item = $parent_li; i < item.length; i++) {
                    var $item_i = item.eq(i).find(">."+LI_DIV_ITEM+">."+LI_DIV_CHECKBAR+">i[data-type='"+dataType+"']");
                    // 父級複選框全選
                    _this.checkStatus($item_i).check();
                }
            }
        }
    };

    // 設定複選框選取/未選取/半選  _this.checkStatus($i).check();  _this.checkStatus($i).noCheck();   _this.checkStatus($i).noallCheck();
    DTree.prototype.checkStatus = function($i) {
        var _this = this;
        return {
            check: function(){
                $i.removeClass(_this.usefontStyle.checkbox.out);
                $i.removeClass(_this.usefontStyle.checkbox.noall);
                $i.addClass(_this.usefontStyle.checkbox.on);
                $i.addClass(_this.style.chs);
                $i.attr("data-checked","1");
            },
            noCheck: function(){
                $i.removeClass(_this.usefontStyle.checkbox.noall);
                $i.removeClass(_this.usefontStyle.checkbox.on);
                $i.removeClass(_this.style.chs);
                $i.addClass(_this.usefontStyle.checkbox.out);
                $i.attr("data-checked","0");
            },
            noallCheck: function(){
                $i.removeClass(_this.usefontStyle.checkbox.out);
                $i.removeClass(_this.usefontStyle.checkbox.on);
                $i.addClass(_this.usefontStyle.checkbox.noall);
                $i.addClass(_this.style.chs);
                $i.attr("data-checked","2");
            }
        }
    };

    // 設定樹的複選框操作值的全部參數,並取得
    DTree.prototype.setAndGetCheckbarNodesParam = function(requestParamFlag) {
        var _this = this;
        //操作前先清空
        _this.checkbarNode = [];
        // 選擇所有複選框節點
        if (_this.checkbarData == "change"){	//記錄變更資料
            _this.obj.find("i[data-par][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if ($i.attr("data-checked") != $i.attr("data-initchecked")) {
                	if(requestParamFlag) {
                		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
                	} else {
                		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
                	}
                }
            });
        } else if (_this.checkbarData == "all"){	//記錄全部資料
            _this.obj.find("i[data-par][data-checked][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
        } else if (_this.checkbarData == "choose"){	//記錄選取資料
            _this.obj.find("i[data-par][data-checked='1'][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
        } else if (_this.checkbarData == "halfChoose"){	//記錄選中和半選資料
            _this.obj.find("i[data-par][data-checked='1'][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
            _this.obj.find("i[data-par][data-checked='2'][dtree-disabled='false']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);
                if(requestParamFlag) {
            		_this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            	} else {
            		_this.checkbarNode.push(_this.getCheckbarNodeParam($div, $i));
            	}
            });
        }
        return _this.checkbarNode;
    };

    // 取得樹的複選框操作值的全部參數
    DTree.prototype.getCheckbarNodesParam = function() {
        var _this = this;
        return _this.setAndGetCheckbarNodesParam(true);
    };

    // 取得樹的一個複選框的參數
    DTree.prototype.getCheckbarNodeParam = function($div, $i){
        var _this = this;
        var temp_node = {};
        temp_node.nodeId = $div.attr("data-id");
        temp_node.parentId = _this.getNodeDom($div).parentLi().attr("data-pid");
        temp_node.context = (typeof _this.formatter.title === 'function') ? _this.getNodeDom($div).cite().attr("data-title") : _this.getNodeDom($div).cite().text();
        temp_node.leaf = _this.getNodeDom($div).cite().attr("data-leaf") == "leaf" ? true : false;
        temp_node.level = _this.getNodeDom($div).parentLi().attr("data-index");
        temp_node.spread = _this.getNodeDom($div).fnode().attr("data-spread") == "open" ? true : false;
        
        var basicData = $div.attr("data-basic");
        if(basicData) {
        	basicData = JSON.parse(event.unescape(basicData));
        }
        temp_node.basicData = basicData;
        var recordData = $div.attr("data-record");
        if(recordData) {
        	recordData = JSON.parse(event.unescape(recordData));
        }
        temp_node.recordData = recordData;
        
        temp_node.dataType = $i.attr("data-type");
        temp_node.checked = $i.attr("data-checked");
        temp_node.initchecked = $i.attr("data-initchecked");
        return temp_node;
    };
    
    // 取得基於傳回參數的樹的複選框參數
    DTree.prototype.getCheckbarJsonArrParam = function(){
    	var _this = this;
    	var checkbarJsonArr = {
			nodeId: [],		//節點ID
            parentId: [],	//父節點ID
            context: [],	//節點內容
            leaf: [],		//是否葉子節點
            level: [],		//層級
            spread: [],		//節點展開狀態
            dataType: [],	//節點標記
            checked: [],	//節點複選框選取狀態
            initchecked: [],	//節點複選框初始狀態
            basicData: [],		//用戶自訂的記錄節點資料
            recordData: [],		//當前data資料（排除basicData和children欄位）
    	};
    	// 取得全部複選框選取節點
    	var params = _this.setAndGetCheckbarNodesParam(false);
    	if(params && params.length > 0) {
    		for(var i=0; i<params.length; i++) { 
    			var param = params[i];
    			console.log(param);
    			checkbarJsonArr["nodeId"].push(param["nodeId"]);
    			checkbarJsonArr["parentId"].push(param["parentId"]);
    			checkbarJsonArr["context"].push(param["context"]);
    			checkbarJsonArr["leaf"].push(param["leaf"]);
    			checkbarJsonArr["level"].push(param["level"]);
    			checkbarJsonArr["spread"].push(param["spread"]);
    			checkbarJsonArr["dataType"].push(param["dataType"]);
    			checkbarJsonArr["checked"].push(param["checked"]);
    			checkbarJsonArr["initchecked"].push(param["initchecked"]);
    			checkbarJsonArr["basicData"].push(param["basicData"]);
    			checkbarJsonArr["recordData"].push(param["recordData"]);
    		}
    	}
    	
    	checkbarJsonArr = _this.getRequestParam(checkbarJsonArr);
    	console.log(checkbarJsonArr);
    	return checkbarJsonArr;
    };

    //判斷複選框是否發生變更
    DTree.prototype.changeCheckbarNodes = function(){
        var flag = false;
        var _this = this;
        _this.obj.find("i[data-par]").each(function(){
            var $i = $(this);
            $div = $i.closest("."+LI_DIV_ITEM);

            if ($i.attr("data-checked") != $i.attr("data-initchecked")) {
                flag = true;
                return true;
            }
        });
        return flag;
    };
    
    //點選節點選取/不選 複選框
    DTree.prototype.clickNodeCheckbar = function(nodeId){
    	var _this = this;
    	var $checkbar = _this.getNodeDom(nodeId).checkbox();
    	_this.temp = [$checkbar];
		_this.changeCheck();
    }
    
    //複選框全選
    DTree.prototype.checkAllNode = function(nodeId){
    	var _this = this;
    	 var $i = _this.obj.find("i[data-par][data-checked!='1']");
         if($i.length > 0) { _this.checkStatus($i).check(); }
    }
    
    //取消全部複選框選取
    DTree.prototype.cancelCheckedNode = function(nodeId){
    	var _this = this;
    	var $i = _this.obj.find("i[data-par][data-checked!='0']");
    	if($i.length > 0) { _this.checkStatus($i).noCheck(); }
    }
    
    //反選複選框
    DTree.prototype.invertCheckedNode = function(nodeId){
    	var _this = this;
    	if(_this.obj.find("i[data-par]").length > 0) {
            var b = false;
            _this.obj.find("i[data-par]").each(function(){
                var $i = $(this);
                if($i.attr("data-checked") == '2'){
                    b = true;
                }else if($i.attr("data-checked") == '0') {
                    _this.checkStatus($i).check();
                }else if($i.attr("data-checked") == '1') {
                    _this.checkStatus($i).noCheck();
                }
            });

            if(b) {
                _this.initNoAllCheck();
            } else {
                _this.initAllCheck();
            }
        }
    }
    
    //刪除選取節點
    DTree.prototype.removeCheckedNode = function(nodeId){
    	var _this = this;
    	var len = _this.obj.find("i[data-par][data-checked='1']").length;
        if(len == 0){
            layer.msg("請至少選取一個節點",{icon:2});
        }else{
            //操作前先清空
            _this.checkbarNode = [];
            // 選擇所有複選框節點
            var i_node = {};
            _this.obj.find("i[data-par][data-checked='1']").each(function(){
                var $i = $(this), $div = $i.closest("."+LI_DIV_ITEM);

                _this.checkbarNode.push(_this.getRequestParam(_this.getCheckbarNodeParam($div, $i)));
            });

            layer.confirm('确定要刪除選取節點？', {icon: 3, title:'刪除選取節點'}, function(index1){
                var flag = _this.menubarFun.remove(_this.checkbarNode);
                if(flag){
                    _this.obj.find("i[data-par][data-checked='1']").closest("."+LI_DIV_ITEM).next("ul").remove();
                    _this.obj.find("i[data-par][data-checked='1']").closest("."+LI_DIV_ITEM).remove();
                    _this.checkbarNode=[];
                }

                layer.close(index1);
            });
        }
    }

    /******************** 工具列及選單列區域 ********************/
    // 初始化選單列和工具列的div
    DTree.prototype.initTreePlus = function(){
        var _this = this;
        // 初始化選單列和工具列的div
        _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).remove();
        _this.toolbarMenu = {};
        if(_this.menubar && _this.menubarTips.group && _this.menubarTips.group.length > 0) _this.obj.before("<div class='"+LI_DIV_MENUBAR+"' id='dtree_menubar_"+_this.obj[0].id+"'><div class='layui-btn-group'></div></div>");
        if(_this.toolbar){
            if(_this.toolbarWay == "contextmenu") {
                _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).remove();
                _this.obj.before("<div class='"+LI_DIV_TOOLBAR+" layui-nav' id='dtree_toolbar_"+_this.obj[0].id+"'><div class='layui-nav-item'><dl class='layui-nav-child layui-anim'></dl></div></div>");
            }
        }

    };

    // 開啟工具列與功能表列
    DTree.prototype.openTreePlus = function(){
        var _this = this;
        // 先對工具列做處理，因為功能表列可能會與工具列產生關聯。
        var ggMenu = [];
        if(_this.toolbar) _this.getToolbarDom();

        if(_this.menubar) {
            var menubarTips = _this.menubarTips,
                mtbar = menubarTips.toolbar,
                group = menubarTips.group,
                freedom = menubarTips.freedom;
            if(mtbar && mtbar.length > 0){
                // 選單列吸附工具列上
                for(var i=0; i<mtbar.length; i++){
                    var mt = mtbar[i];
                    if(typeof mt === 'string'){
                        _this.getMenubarToolDom(mt);
                    }
                    if(typeof mt === 'object'){
                        _this.getExtMenubarToolDom(mt);
                    }
                }
            }
            if(group && group.length > 0){
                // 選單列吸附在上方的按鈕組div中
                for(var i=0; i<group.length; i++){
                    var gg = group[i];
                    if(typeof gg === 'string'){
                        ggMenu.push(_this.getMenubarDom(gg));
                    }
                    if(typeof gg === 'object'){
                        ggMenu.push(_this.getExtMenubarDom(gg));
                    }
                }
                _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).children('div.layui-btn-group').append(ggMenu.join(""));

            }
        }
    };


    /******************** 選單列區域 ********************/
    // 取得選單列
    DTree.prototype.getMenubarDom = function(menu){
        var _this = this;
        var rootId = _this.obj[0].id;
        var gg = "";
        switch (menu) {
            case defaultMenu.moveDown:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.moveDown+"' title='展開全部節點'><i class='"+_this.usefontStyle.menubar.movedown+"'></i></button>";
                break;
            case defaultMenu.moveUp:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.moveUp+"' title='收縮全部節點'><i class='"+_this.usefontStyle.menubar.moveup+"'></i></button>";
                break;
            case defaultMenu.refresh:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.refresh+"' title='重新整理'><i class='"+_this.usefontStyle.menubar.refresh+"'></i></button>";
                break;
            case defaultMenu.checkAll:
                gg = (_this.checkbar && _this.checkbarType != 'only') ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.checkAll+"' title='全選節點'><i class='"+_this.usefontStyle.menubar.checkAll+"'></i></button>" : "";
                break;
            case defaultMenu.unCheckAll:
                gg = (_this.checkbar && _this.checkbarType != 'only') ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.unCheckAll+"' title='全不選節點'><i class='"+_this.usefontStyle.menubar.unCheckAll+"'></i></button>" : "";
                break;
            case defaultMenu.invertAll:
                gg = (_this.checkbar && _this.checkbarType != 'only') ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.invertAll+"' title='反選節點'><i class='"+_this.usefontStyle.menubar.invertAll+"'></i></button>" : "";
                break;
            case defaultMenu.remove:
                gg = (_this.checkbar) ? "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.remove+"' title='刪除選取節點'><i class='"+_this.usefontStyle.menubar.remove+"'></i></button>" : "";
                break;
            case defaultMenu.searchNode:
                gg = "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+rootId+"' d-menu='"+defaultMenu.searchNode+"' title='查詢節點'><i class='"+_this.usefontStyle.menubar.search+"'></i></button>";
                break;
        }
        return gg;
    };

    // 取得擴充功能表列
    DTree.prototype.getExtMenubarDom = function(menu){
        var _this = this;
        return "<button type='button' class='layui-btn layui-btn-sm layui-btn-primary' dtree-id='"+_this.obj[0].id+"' d-menu='"+menu.menubarId+"' title='"+menu.title+"'><i class='"+_this.usefontStyle.menubarExt+" "+menu.icon+"'></i></button>";
    };

    // 取得依附在工具列的選單列
    DTree.prototype.getMenubarToolDom = function(menu){
        var _this = this;
        var rootId = _this.obj[0].id;
        switch (menu) {
            case defaultMenu.moveDown:
                _this.toolbarMenu[defaultMenu.moveDown] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.moveDown, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.movedown, "展開全部");
                break;
            case defaultMenu.moveUp:
                _this.toolbarMenu[defaultMenu.moveUp] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.moveUp, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.moveup, "收縮全部");
                break;
            case defaultMenu.refresh:
                _this.toolbarMenu[defaultMenu.refresh] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.refresh, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.refresh, "重新整理");
                break;
            case defaultMenu.checkAll:
                if(_this.checkbar && _this.checkbarType != 'only')
                    _this.toolbarMenu[defaultMenu.checkAll] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.checkAll, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.checkAll, "全選節點");
                break;
            case defaultMenu.unCheckAll:
                if(_this.checkbar && _this.checkbarType != 'only')
                    _this.toolbarMenu[defaultMenu.unCheckAll] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.unCheckAll, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.unCheckAll, "全不選節點");
                break;
            case defaultMenu.invertAll:
                if(_this.checkbar && _this.checkbarType != 'only')
                    _this.toolbarMenu[defaultMenu.invertAll] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.invertAll, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.invertAll, "反選節點");
                break;
            case defaultMenu.remove:
                if(_this.checkbar)
                    _this.toolbarMenu[defaultMenu.remove] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.remove, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.remove, "刪除選取");
                break;
            case defaultMenu.searchNode:
                _this.toolbarMenu[defaultMenu.searchNode] = _this.setToolbarDom().setMenuToolbarOption(defaultMenu.searchNode, _this.toolbarStyle.title, _this.usefontStyle.toolbar.menubar.searchNode, "查詢");
                break;
        }
    };

    // 取得依附在工具列的擴充功能表列
    DTree.prototype.getExtMenubarToolDom = function(menu){
        var _this = this;
        _this.toolbarMenu[menu.menubarId] = _this.setToolbarDom().setMenuToolbarOption(menu.menubarId, menu.title, _this.usefontStyle.toolbar.menubarExt+" "+menu.icon, "");
    };

    // menubar內建方法
    DTree.prototype.menubarMethod = function(){
        var _this = this;
        return {
            openAllNode: function(obj){  // 展開所有節點
                var $ulNode = obj || _this.obj.children("li").children("ul");
                // 遍歷所有ul子節點
                for (var i = 0; i < $ulNode.length; i++) {
                    // 取得目前節點的資訊
                    var $ul = $($ulNode[i]),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    if (leaf == "leaf") { continue;	}	// 說明是葉子了，則繼續循環下一個

                    if (spread == "open") {
                        // 說明該節點已經展開了，則進行子節點循環
                    } else {
                        if (_this.type=="load") {	//是否全量加載
                            if (_this.cache) {	//是否開啟快取
                                if ($ul.html()) {
                                    $ul.addClass(NAV_SHOW);
                                } else {	//載入節點
                                    _this.getChild($div);
                                }
                            }else {	//每次取新的資料
                                $ul.html("");
                                _this.getChild($div);
                            }
                        } else {	// 全量加載
                            $ul.addClass(NAV_SHOW);
                        }
                        _this.operateIcon($i_spread, $i_node).open();

                    }
                    var $childUl = $ul.children("li").children("ul");
                    _this.menubarMethod().openAllNode($childUl);
                }
            },
            closeAllNode: function(){ //收縮所有節點
                _this.obj.find("."+LI_NAV_CHILD).each(function(){
                    // 取得目前節點的資訊
                    var $ul = $(this),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    $ul.removeClass(NAV_SHOW);
                    _this.operateIcon($i_spread, $i_node).close();
                });
            },
            refreshTree: function(){// 重新整理樹
                _this.refreshTree();
            },
            checkAll: function(){ // 全選節點
            	_this.checkAllNode();
            },
            unCheckAll: function(){ // 全不選節點
                _this.cancelCheckedNode();
            },
            invertAll: function(){ // 反選節點
            	_this.invertCheckedNode();
            },
            remove: function(){// 刪除選取節點
            	_this.removeCheckedNode();
            },
            searchNode: function(){//模糊查詢該值，展開該值節點
                layer.prompt({
                    formType: 0,
                    value: "",
                    title: '查詢節點'
                }, function(value, index1, elem){
                    if (value) {
                        var flag = _this.searchNode(value);
                        if (!flag) {
                            layer.msg("該名稱節點不存在！", {icon:5});
                        }
                    } else {
                        layer.msg("未指定查詢節點名稱", {icon:5});
                    }
                    layer.close(index1);
                });
            },
            extMethod: function(menuId, $div, flag){
                if(_this.menubar && _this.menubarTips.group && _this.menubarTips.group.length > 0 && flag == "group"){
                    for(var i=0; i<_this.menubarTips.group.length; i++){
                        var ext = _this.menubarTips.group[i];
                        if (menuId == ext.menubarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div), $div));
                            break;
                        }
                    }
                }
                if(_this.menubar && _this.menubarTips.toolbar && _this.menubarTips.toolbar.length > 0 && flag == "toolbar"){
                    for(var i=0; i<_this.menubarTips.toolbar.length; i++){
                        var ext = _this.menubarTips.toolbar[i];
                        if (menuId == ext.menubarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div), $div));
                            break;
                        }
                    }
                }
                if(_this.menubar && _this.menubarTips.freedom && _this.menubarTips.freedom.length > 0 && flag == "freedom"){
                    for(var i=0; i<_this.menubarTips.freedom.length; i++){
                        var ext = _this.menubarTips.freedom[i];
                        if (menuId == ext.menubarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div), $div));
                            break;
                        }
                    }
                }
            }
        };
    };

    // menubar監聽方法
    DTree.prototype.menubarListener = function(menuId, flag){
        var _this = this;
        var $div = _this.getNodeDom().nowDiv();
        switch (menuId) {
            case defaultMenu.moveDown:	// 展開全部節點
                _this.menubarMethod().openAllNode();
                break;
            case defaultMenu.moveUp:	// 收縮全部節點
                _this.menubarMethod().closeAllNode();
                break;
            case defaultMenu.refresh:
                _this.menubarMethod().refreshTree(); // 重新整理樹
                break;
            case defaultMenu.checkAll:
                _this.menubarMethod().checkAll();
                break;
            case defaultMenu.unCheckAll:
                _this.menubarMethod().unCheckAll();
                break;
            case defaultMenu.invertAll:
                _this.menubarMethod().invertAll();
                break;
            case defaultMenu.remove:
                _this.menubarMethod().remove();
                break;
            case defaultMenu.searchNode:
                _this.menubarMethod().searchNode();
                break;
            default:
                _this.menubarMethod().extMethod(menuId, $div, flag);
                break;
        }
    };

    //模糊查詢該值，展開該值節點
    DTree.prototype.searchNode = function(value){
        var _this = this;
        var b = false;
        var $lis = [];
        _this.obj.find("cite[data-leaf]").each(function(){
            var $nthis = $(this);
            var html = $nthis.html();
            if(html.indexOf(value) > -1){
                if($nthis.attr("data-leaf") == "leaf") {
                    // 葉子節點提供包含父節點的所有資訊
                    var title = "";
                    $nthis.parents("li").each(function(){
                        title = "-" + $(this).find("cite[data-leaf]").html() + title;
                    });
                    title = title.substring(1, title.length);
                    $nthis.attr("title", title);
                }
                // 儲存目前cite所在的li及父li包含該值，則只保留父的
                var i = 0;
                $nthis.parents("li").each(function(){
                    var html2 = $(this).find("cite[data-leaf]").html();
                    if(html2.indexOf(value) > -1){
                        i++;
                    }
                    if(i >= 2){
                        return true;
                    }
                });
                if (i < 2){
                    $lis.push($nthis.closest("li").prop("outerHTML"));
                }
            }
        });
        if($lis.length > 0) {
            b = true;
            // 1.將樹節點清空
            _this.obj.html("");
            // 2.遍歷所有cite節點，展開目前cite節點
            for(var i=0; i<$lis.length; i++){
                _this.obj.append($lis[i]);
            }
        }
        return b;
    };


    /******************** 工具列區域 ********************/
    // 取得工具列
    DTree.prototype.getToolbarDom = function(){
        var _this = this;
        var toolbarShow = _this.toolbarShow,
            toolbarExt = _this.toolbarExt,
            toolbarWay = _this.toolbarWay;

        if(toolbarShow.length > 0){
            for(var i=0; i<toolbarShow.length; i++){
                var show = toolbarShow[i];
                if(show == "pulldown"){
                    _this.toolbarMenu[defaultTool.pulldown] = _this.setToolbarDom().setToolbarOption(defaultTool.pulldown, _this.toolbarStyle.title, _this.usefontStyle.toolbar.pulldown, "展開");
                }
                if(show == "pullup"){
                    _this.toolbarMenu[defaultTool.pullup] = _this.setToolbarDom().setToolbarOption(defaultTool.pullup, _this.toolbarStyle.title, _this.usefontStyle.toolbar.pullup, "收縮");
                }
                if(show == "add"){
                    _this.toolbarMenu[defaultTool.addTool] = _this.setToolbarDom().setToolbarOption(defaultTool.addTool, _this.toolbarStyle.title, _this.usefontStyle.toolbar.add, "新增");
                }
                if(show == "edit"){
                    _this.toolbarMenu[defaultTool.editTool] = _this.setToolbarDom().setToolbarOption(defaultTool.editTool, _this.toolbarStyle.title, _this.usefontStyle.toolbar.edit, "編輯");
                }
                if(show == "delete"){
                    _this.toolbarMenu[defaultTool.delTool] = _this.setToolbarDom().setToolbarOption(defaultTool.delTool, _this.toolbarStyle.title, _this.usefontStyle.toolbar.del, "刪除");
                }
            }
        }
        if(toolbarExt.length > 0){
            for(var i=0; i<toolbarExt.length; i++){
                var ext = toolbarExt[i];
                _this.toolbarMenu[ext.toolbarId] = _this.setToolbarDom().setToolbarOption(ext.toolbarId, ext.title, _this.usefontStyle.toolbarExt+" "+ext.icon, "");
            }
        }
    };

    // 設定工具列按鈕
    DTree.prototype.setToolbarDom = function(){
        var _this = this;
        var toolbarWay = _this.toolbarWay;

        return {
            setToolbarOption: function(toolbarId, title, classId, other){
                if(toolbarWay == "contextmenu") {
                    return "<dd><a dtree-tool='"+toolbarId+"'><i class='"+classId+"'></i>&nbsp;"+other +title+"</a></dd>";
                } else if(toolbarWay == "fixed" || toolbarWay == "follow") {
                    return "<a dtree-tool='"+toolbarId+"' title='"+other + title+"'><i class='"+classId+"'></i></a>";
                }
            },
            setMenuToolbarOption: function(menubarId, title, classId, other){
                var rootId = _this.obj[0].id;
                if(toolbarWay == "contextmenu") {
                    return "<dd><a dtree-id='"+rootId+"' d-menu='"+menubarId+"'><i class='"+classId+"'></i>&nbsp;"+other +title+"</a></dd>";
                } else if(toolbarWay == "fixed" || toolbarWay == "follow") {
                    return "<a dtree-id='"+rootId+"' d-menu='"+menubarId+"' title='"+other + title+"'><i class='"+classId+"'></i></a>";
                }
            },
            setToolbarPlace: function(toolbarMenu){
                if(toolbarWay == "contextmenu") {
                    if(toolbarMenu){
                        _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).find('div.layui-nav-item>dl.layui-nav-child').html("");
                        for(var key in toolbarMenu){
                            _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).find('div.layui-nav-item>dl.layui-nav-child').append(toolbarMenu[key]);
                        }
                    }
                } else if(toolbarWay == "fixed" || toolbarWay == "follow") {
                    _this.obj.find("cite[data-leaf][dtree-disabled='false']").each(function(){
                        var $cite = $(this);
                        _this.dynamicToolbarDom($cite);
                    });
                }
            }
        }
    };

    // 在節點後動態綁定fixed和follow條件的工具列
    DTree.prototype.dynamicToolbarDom = function($cite){
        var _this = this;
        var toolbarWay = _this.toolbarWay;
        if($cite.next("em."+TOOLBAR_TOOL_EM).length == 0) {
            var $div = $cite.parent("div");
            var param = _this.getRequestParam(_this.getTempNodeParam($div));
            var toolbarMenus = _this.toolbarFun.loadToolbarBefore(event.cloneObj(_this.toolbarMenu), param, $div);
            var hideCls = (toolbarWay == "follow") ? NAV_HIDE : "";
            var em = ["<em class='"+TOOLBAR_TOOL_EM+" "+hideCls+"'>"];
            if(toolbarMenus){
                for(var key in toolbarMenus){
                    em.push(toolbarMenus[key]);
                }
            }
            em.push("</em>");
            $cite.after(em.join(''));
        }
    }

    // 隱藏toolbar
    DTree.prototype.toolbarHide = function() {
        var _this = this;
        if(_this.toolbar && _this.toolbarWay == "contextmenu") {
            var $toolBarDiv = _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id);
            $toolBarDiv.find(".layui-nav-child").removeClass('layui-anim-fadein layui-show');
        }
    }

    // toolbar內建方法
    DTree.prototype.toolbarMethod = function(){
        var _this = this;
        return {
            pulldown: function(obj){ // 展開目前點擊節點的下面全部節點
                if(!obj) return;
                var $ulNode = obj;
                // 遍歷所有ul子節點
                for (var i = 0; i < $ulNode.length; i++) {
                    // 取得目前節點的資訊
                    var $ul = $($ulNode[i]),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    if (leaf == "leaf") { continue;	}	// 說明是葉子了，則繼續循環下一個

                    if (spread == "open") {
                        // 說明該節點已經展開了，則進行子節點循環
                    } else {
                        if (_this.type=="load") {	//是否全量加載
                            if (_this.cache) {	//是否開啟快取
                                if ($ul.html()) {
                                    $ul.addClass(NAV_SHOW);
                                } else {	//載入節點
                                    _this.getChild($div);
                                }
                            }else {	//每次取新的資料
                                $ul.html("");
                                _this.getChild($div);
                            }
                        } else {	// 全量加載
                            $ul.addClass(NAV_SHOW);
                        }
                        _this.operateIcon($i_spread, $i_node).open();

                    }
                    var $childUl = $ul.children("li").children("ul");
                    _this.toolbarMethod().pulldown($childUl);
                }
            },
            pullup: function($li){ // 收縮目前點擊節點的下面全部節點
                $li.find("."+LI_NAV_CHILD).each(function(){
                    // 取得目前節點的資訊
                    var $ul = $(this),
                        $div = $ul.prev("div"),
                        $i_spread = _this.getNodeDom($div).fnode(),
                        $i_node = _this.getNodeDom($div).snode(),
                        $cite = _this.getNodeDom($div).cite(),
                        spread = $i_spread.attr("data-spread"),
                        leaf = $cite.attr("data-leaf");

                    $ul.removeClass(NAV_SHOW);
                    _this.operateIcon($i_spread, $i_node).close();
                });
            }
        }
    };

    // toolbar監聽方法
    DTree.prototype.toolbarListener = function(tool, $div) {
        var _this = this;
        var $cite = $div.children("cite[data-leaf]"),
            $ul = $div.next("ul"),
            $p_li = $div.parent("li[data-index]"),	//目前選取節點的頂層li節點
            $p_ul = $p_li.parent("ul"),	//目前選取節點的頂層li節點的父級ul
            $p_div = $p_ul.prev("div"), //目前選取節點的頂層li節點的父級ul的前一個div
            title = $cite.html();
        switch (tool) {
            case defaultTool.pulldown:
                _this.toolbarMethod().pulldown($ul);
                break;
            case defaultTool.pullup:
                _this.toolbarMethod().pullup($p_li);
                break;
            case defaultTool.addTool:
                var content = _this.loadToolBar(title, defaultTool.addTool);

                layer.open({
                    title: "新增"+_this.toolbarStyle.title,
                    type: 1,
                    area: _this.toolbarStyle.area,
                    content: content,
                    success: function(layero, index){
                        form.render();
                        form.on("submit(dtree_addNode_form)",function(data){
                            var data = data.field;
                            var parentId = $div.attr("data-id"),
                                id = $div.attr("data-id")+"_node_"+$ul[0].childNodes.length,
                                leaf = true,
                                checked = "0",
                                level = parseInt($p_li.attr("data-index"))+1;

                            // 建立子節點的DOM，新增子節點
                            var checkArr = [];
                            if (_this.checkArrLen > 0) {
                                for (var i = 0; i < _this.checkArrLen; i++) {
                                    checkArr.push({"type":i,"checked":"0"});
                                }
                            }

                            $ul.append(_this.getLiItemDom(id, parentId, data.addNodeName, data.addNodeName, true, "", "", checkArr, level, false, false, false, "", "", "item"));
                            // 先將li節點隱藏
                            $ul.find("li[data-id='"+id+"']").hide();
                            // 重新賦值
                            var $addDiv = $ul.find("div[data-id='"+id+"']");
                            node = _this.getNodeParam($addDiv);

                            //取得組裝後的requestNode,組合參數
                            var requestNode = _this.getRequestParam(node);
                            requestNode = $.extend(requestNode, data);

                            _this.temp = [id, $ul, $div, level];
                            // 使用者自訂想做的事
                            _this.toolbarFun.addTreeNode(requestNode, $div);

                            layer.close(index);
                            return false;
                        });
                    }
                });
                break;
            case defaultTool.editTool:
                var content = _this.loadToolBar(title, defaultTool.editTool);

                layer.open({
                    title: "編輯"+_this.toolbarStyle.title,
                    type: 1,
                    area: _this.toolbarStyle.area,
                    content: content,
                    success: function(layero, index){
                        _this.toolbarFun.editTreeLoad(_this.getRequestParam(_this.getNodeParam($div)));
                        form.render();
                        form.on("submit(dtree_editNode_form)",function(data){
                            var data = data.field;
                            $cite.html(data.editNodeName);
                            node = _this.getNodeParam($div);
                            var requestNode = _this.getRequestParam(node);
                            requestNode = $.extend(requestNode, data);
                            _this.temp = [$cite, $div, title, $p_div];
                            _this.toolbarFun.editTreeNode(requestNode, $div);

                            layer.close(index);
                        });
                    }
                });
                break;
            case defaultTool.delTool:
                layer.confirm('确定要刪除该'+_this.toolbarStyle.title+'？', {icon: 3, title:'刪除'+_this.toolbarStyle.title}, function(index){
                    var node = _this.getNodeParam($div);
                    _this.temp = [$p_li, $p_div];
                    _this.toolbarFun.delTreeNode(_this.getRequestParam(_this.getNodeParam($div)), $div);

                    layer.close(index);
                });
                break;
            default:
                if(_this.toolbarExt.length > 0){
                    for(var i=0; i<_this.toolbarExt.length; i++){
                        var ext = _this.toolbarExt[i];
                        if (tool == ext.toolbarId){
                            ext.handler(_this.getRequestParam(_this.getNodeParam($div)), $div);
                            break;
                        }
                    }
                }
                break;
        }
    }


    // 載入toolBar中的內容
    DTree.prototype.loadToolBar = function(title, name){
        var _this = this;
        var toolbarShow = _this.toolbarShow;
        var nodeBarContents = _this.toolbarBtn;

        var html = "";
        switch (name) {
            case defaultTool.addTool:
                var addNodeBarDef = [{"label": "目前選取", "name": "nodeTitle", "type": "text", "value": title, "defElem": "nowChoose", "readonly": true},
                    {"label": "新增"+_this.toolbarStyle.title, "name": "addNodeName", "type": "text", "value": "", "defElem": "nowChange", "verify": "required"},
                    {"type": "submit", "value": "確認新增", "defElem": "btn", "filter": "dtree_addNode_form"}];

                //2. 用戶自訂的節點內容
                var addNodeBar = ['<div class="'+TOOLBAR_TOOL+'"><form class="layui-form layui-form-pane" lay-filter="dtree_addNode_form">'];

                if(nodeBarContents != null && nodeBarContents.length > 0){
                    if(nodeBarContents[0] != null && nodeBarContents[0] != undefined && nodeBarContents[0].length > 0){
                        var addNodeBarContents = nodeBarContents[0];
                        // 1. 檢查是否包含了now、newly、btn這三個預設項目,將其他元素依序排列，將特殊元素至於棧頂
                        for(var i=0; i<addNodeBarContents.length; i++){
                            var defElem = addNodeBarContents[i].defElem;
                            if(defElem == "nowChoose") {
                                $.extend(addNodeBarDef[0], addNodeBarContents[i]);
                            } else if(defElem == "nowChange") {
                                $.extend(addNodeBarDef[1], addNodeBarContents[i]);
                            } else if(defElem == "btn") {
                                $.extend(addNodeBarDef[2], addNodeBarContents[i]);
                            } else {
                                addNodeBarDef.push(addNodeBarContents[i]);
                            }
                        }
                    }
                }

                // 2. 遍歷產生全部表單標籤
                for(var j=0; j<addNodeBarDef.length; j++){
                    var type = addNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "text":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).text());
                            break;
                        case "textarea":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).textarea());
                            break;
                        case "select":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).select());
                            break;
                        case "hidden":
                            addNodeBar.push(_this.loadToolBarDetail(addNodeBarDef[j]).hidden());
                            break;

                    }
                }

                var addBtn = ['<div class="layui-form-item">', '<div class="layui-input-block" style="margin-left:0px;text-align:center;">'];
                // 3.遍歷產生按鈕
                for(var j=0; j<addNodeBarDef.length; j++){
                    var type = addNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "submit":
                            addBtn.push(_this.loadToolBarDetail(addNodeBarDef[j]).submit());
                            break;
                        case "button":
                            addBtn.push(_this.loadToolBarDetail(addNodeBarDef[j]).button());
                            break;
                        case "reset":
                            addBtn.push(_this.loadToolBarDetail(addNodeBarDef[j]).reset());
                            break;

                    }
                }
                addBtn.push('</div></div>');
                addNodeBar.push(addBtn.join(''));
                addNodeBar.push('</form></div>');
                html = addNodeBar.join('');
                break;

            case defaultTool.editTool:
                var editNodeBarDef = [{"label": "目前選取", "name": "nodeTitle", "type": "text", "value": title, "defElem": "nowChoose", "readonly": true},
                    {"label": "編輯"+_this.toolbarStyle.title, "name": "editNodeName", "type": "text", "value": "", "defElem": "nowChange", "verify": "required"},
                    {"type": "submit", "value": "確認編輯", "defElem": "btn", "filter": "dtree_editNode_form"}];

                var editNodeBar = ['<div class="'+TOOLBAR_TOOL+'"><form class="layui-form layui-form-pane" lay-filter="dtree_editNode_form">'];
                //2. 用戶自訂的節點內容
                if(nodeBarContents != null && nodeBarContents.length > 0){

                    if(nodeBarContents[1] != null && nodeBarContents[1] != undefined && nodeBarContents[1].length > 0){
                        var editNodeBarContents = nodeBarContents[1];
                        // 1. 檢查是否包含了now、newly、btn這三個預設項目,將其他元素依序排列，將特殊元素至於棧頂
                        for(var i=0; i<editNodeBarContents.length; i++){
                            var defElem = editNodeBarContents[i].defElem;
                            if(defElem == "nowChoose") {
                                $.extend(editNodeBarDef[0], editNodeBarContents[i]);
                            } else if(defElem == "nowChange") {
                                $.extend(editNodeBarDef[1], editNodeBarContents[i]);
                            } else if(defElem == "btn") {
                                $.extend(editNodeBarDef[2], editNodeBarContents[i]);
                            } else {
                                editNodeBarDef.push(editNodeBarContents[i]);
                            }
                        }

                    }
                }
                // 2. 遍歷產生全部表單標籤
                for(var j=0; j<editNodeBarDef.length; j++){
                    var type = editNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "text":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).text());
                            break;
                        case "textarea":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).textarea());
                            break;
                        case "select":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).select());
                            break;
                        case "hidden":
                            editNodeBar.push(_this.loadToolBarDetail(editNodeBarDef[j]).hidden());
                            break;
                    }
                }

                var editBtn = ['<div class="layui-form-item">', '<div class="layui-input-block" style="margin-left:0px;text-align:center;">'];
                // 3.遍歷產生按鈕
                for(var j=0; j<editNodeBarDef.length; j++){
                    var type = editNodeBarDef[j].type;
                    if(!type){type = "text";}
                    switch (type) {
                        case "submit":
                            editBtn.push(_this.loadToolBarDetail(editNodeBarDef[j]).submit());
                            break;
                        case "button":
                            editBtn.push(_this.loadToolBarDetail(editNodeBarDef[j]).button());
                            break;
                        case "reset":
                            editBtn.push(_this.loadToolBarDetail(editNodeBarDef[j]).reset());
                            break;

                    }
                }
                editBtn.push('</div></div>');
                editNodeBar.push(editBtn.join(''));
                editNodeBar.push('</form></div>');
                html = editNodeBar.join('');
                break;
        }
        return html;
    };

    // 取得toolbar詳細的標籤資訊
    DTree.prototype.loadToolBarDetail = function(nodeBarContents){
        var _this = this;
        var readonly = (typeof (nodeBarContents.readonly) === "boolean") ? nodeBarContents.readonly : false;
        var disabled = (typeof (nodeBarContents.disabled) === "boolean") ? nodeBarContents.disabled : false;
        var id = nodeBarContents.id ? nodeBarContents.id : "";
        var name = nodeBarContents.name ? nodeBarContents.name : "";
        var val = nodeBarContents.value ? nodeBarContents.value : "";
        var verify = nodeBarContents.verify ? nodeBarContents.verify : "";
        var placeholder = nodeBarContents.placeholder ? nodeBarContents.placeholder : val;
        return{
            text: function(){
                return ['<div class="layui-form-item">',
                    '<label class="layui-form-label" title="'+nodeBarContents.label+'">'+nodeBarContents.label+'：</label>',
                    '<div class="layui-input-block f-input-par">',
                    '<input type="text" class="layui-input f-input" value="'+val+'" placeholder="'+placeholder+'" lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '/>',
                    '</div>',
                    '</div>'].join('');
            },
            textarea: function(){
                return ['<div class="layui-form-item layui-form-text">',
                    '<label class="layui-form-label" title="'+nodeBarContents.label+'">'+nodeBarContents.label+'：</label>',
                    '<div class="layui-input-block f-input-par">',
                    '<textarea class="layui-textarea f-input" value="'+val+'" placeholder="'+placeholder+'" lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '>'+val+'</textarea>',
                    '</div>',
                    '</div>'].join('');
            },
            hidden: function(){
                return ['<input type="hidden" class="layui-input f-input" value="'+val+'" lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '/>'].join('');
            },
            select: function(){
                var optionsData = (typeof nodeBarContents.optionsData === 'object') ? nodeBarContents.optionsData : nodeBarContents.optionsData();
                var options = "";
                for(var key in optionsData){
                    if(val == optionsData[key]){
                        options += "<option value='"+key+"' selected>"+optionsData[key]+"</option>";
                    } else {
                        options += "<option value='"+key+"'>"+optionsData[key]+"</option>";
                    }
                }
                return ['<div class="layui-form-item">',
                    '<label class="layui-form-label" title="'+nodeBarContents.label+'">'+nodeBarContents.label+'：</label>',
                    '<div class="layui-input-block f-input-par">',
                    '<select lay-verify="'+verify+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    (readonly ? 'readonly ' : ''),
                    (disabled ? 'disabled ' : ''),
                    '>',
                    options,
                    '</select>', '</div>', '</div>'].join('');
            },
            submit: function(){
                var filter = nodeBarContents.filter;
                return ['<button type="button" class="layui-btn layui-btn-normal btn-w100" lay-submit lay-filter="'+filter+'" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    '>'+val+'</button>'].join('');
            },
            button: function(){
                return ['<button type="button" class="layui-btn layui-btn-normal btn-w100" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    ' >'+val+'</button>'].join('');
            },
            reset: function(){
                return ['<button type="reset" class="layui-btn layui-btn-primary btn-w100" ',
                    (id != "" ? 'id="'+id+'" ' : ''),
                    (name != "" ? 'name="'+name+'" ' : ''),
                    '>'+val+'</button>'].join('');
            }
        }
    };

    // 新增節點後改變節點內容
    DTree.prototype.changeTreeNodeAdd = function(returnID){
        var _this = this;
        var temp = _this.temp;
        var id = temp[0], $ul = temp[1], $div = temp[2], level = temp[3];
        var flag = false;
        if(returnID){
            var $thisDiv = _this.obj.find("[data-id='"+id+"']");
            if(typeof returnID === "object"){
                // 如果是JSON格式數據，則將目前DIV刪除，重新建造DIV
                $thisDiv.remove();
                var parseData = _this.parseData(returnID);

                if(parseData.treeId()){
                    $ul.append(_this.getLiItemDom(parseData.treeId(), parseData.parentId(), parseData.title(), parseData.fmtTitle(), parseData.last(0), parseData.ficonClass(), parseData.iconClass(), parseData.checkArr(), level, parseData.spread(), parseData.disabled(), parseData.hide(), parseData.basicData(), parseData.recordData(), "item"));

                    // 建造完畢後，選取該DIV
                    $thisDiv = $ul.find("div[data-id='"+parseData.treeId()+"']");
                    _this.setNodeParam($thisDiv)
                } else {
                    layer.msg("新增失敗,節點ID為undefined！",{icon:5});
                    // 將li節點刪除
                    $ul.find("li[data-id='"+id+"']").remove();
                    // 重新賦值
                    _this.setNodeParam($div);
                    // 暫存變數制空
                    _this.temp = [];
                    return ;
                }
            }else if(returnID == 'refresh'){
                // 如果是設定為refresh參數，則向後台發送請求，取得新增節點下的真實參數，局部重新整理樹。
                flag = true;
            } else if(typeof returnID === "string" || typeof returnID === 'number' || returnID == true){
                $thisDiv.attr("data-id", returnID);
                // 將li節點展示
                $ul.find("li[data-id='"+returnID+"']").show();
                _this.setNodeParam($thisDiv)
            }

            // 判斷目前點擊的節點是否為最後一級節點，如果是，則需要修改節點的樣式
            var $icon_i = $div.find("i[data-spread]");
            if ($icon_i.eq(0).attr("data-spread") == "last") {
                _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).openWithLeaf();
            } else {	//如果不是，也要修改節點樣式
                _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).open();
            }
            $ul.addClass(NAV_SHOW);	//展開UL
            _this.accordionUL($ul);
            if(flag) {
                _this.getChild($div);
            } else {
                //		_this.showLine();
                _this.showLine($ul.find("li"));
                // 這種情況下需要在新增節點後對節點新增工具列
                if(_this.toolbar && _this.toolbarWay != 'contextmenu') {
                    _this.dynamicToolbarDom($thisDiv.find("cite[data-leaf]"));
                }
            }

        } else {
            // 將li節點刪除
            $ul.find("li[data-id='"+id+"']").remove();
            // 重新賦值
            _this.setNodeParam($div);
        }

        _this.temp = []; // 暫存變數制空

    };

    // 編輯頁開啟後顯示編輯頁內容
    DTree.prototype.changeTreeNodeDone = function(param){
        var _this = this;
        form.val('dtree_editNode_form', param);
        form.render();
    };

    // 修改節點後改變節點內容
    DTree.prototype.changeTreeNodeEdit = function(returnID){
        var _this = this;
        var temp = _this.temp;
        var $cite = temp[0], $div = temp[1], title = temp[2], $p_div = temp[3];
        var flag = false;
        if(returnID){
            if(typeof returnID === "object"){
                var parseData = _this.parseData(data);

                if(parseData.treeId()){
                    var replaceDom = _this.replaceDom($div, parseData.treeId(), parseData.last(0), parseData.spread(), parseData.disabled(), parseData.hide());
                    replaceDom.node(parseData.iconClass());
                    replaceDom.checkbox(parseData.checkArr());
                    replaceDom.text(parseData.title());
                    replaceDom.ul();
                    replaceDom.basicData(parseData.basicData());
                    replaceDom.recordData(parseData.recordData());
                    _this.setNodeParam($div);
                } else {
                    layer.msg("編輯失敗,節點ID為undefined！",{icon:5});
                    // 重新賦值
                    _this.setNodeParam($div);
                }
            }
        } else {
            $cite.html(title);
            _this.getNodeParam($div);
        }

        _this.temp = []; // 暫存變數制空
    };

    // 刪除節點後改變節點內容
    DTree.prototype.changeTreeNodeDel = function(flag){
        var _this = this;
        var temp = _this.temp;
        var $p_li = temp[0],
            $p_ul = $p_li.parent("ul"),
            $p_div = temp[1];

        if(flag){
            $p_li.remove();
            _this.showLine($p_ul.find("li"));
            // 判斷父級ul中是否還存在li,如果不存在，則需要修改節點的樣式
            if($p_ul.children("li").length == 0){
                var $icon_i = $p_div.find("i[data-spread]");
                _this.operateIcon($icon_i.eq(0), $icon_i.eq(1)).closeWithLeaf();
            }
            _this.initNodeParam();
        }

        _this.temp = []; // 暫存變數制空
    };

    /******************** iframe區域 ********************/
    // 載入iframe
    DTree.prototype.loadIframe = function($div, iframeParam) {
        var _this = this;
        var $cite = _this.getNodeDom($div).cite();
        if (!_this.useIframe) {		// 啟用iframe
            return false;
        }
        var iframeElem = _this.iframeElem,
            iframeUrl = _this.iframeUrl,
            iframeLoad = _this.iframeLoad;

        var flag = iframeLoad == "leaf" ? (($cite.attr("data-leaf") == "leaf") ? true : false) : true;

        if (flag) {
            if ($(iframeElem).length > 0) {		//iframe存在
                if (!iframeUrl) {
                    layer.msg("資料請求異常，iframeUrl參數未指定", {icon:5});
                    return false;
                }
                var param = AjaxHelper.serialize(iframeParam);
                if(iframeUrl.indexOf("?")> -1){
                    param = "&"+param.substring(1, param.length);
                }
                var url = iframeUrl + param;
                $(iframeElem).attr("src", url);
            } else {
                layer.msg("iframe綁定異常，請確認頁面中是否有iframe頁對應的容器", {icon:5});
                return false;
            }
        }
        return flag;
    };

    // 取得傳遞出去的參數，根據iframe.iframeDefaultRequest、iframe.iframeRequest和node拼出發出請求的參數
    DTree.prototype.getIframeRequestParam = function(nodes){
        var _this = this;
        var request = _this.iframeRequest,
            defaultRequestNames = _this.iframeDefaultRequest,
            node = nodes || _this.node,
            requestParam = {};

        // 先拼用戶自訂的，在拼樹生成的，這樣的話用戶可以自訂當樹未生成時的節點的初始值
        for ( var key in request) {
            requestParam[key] = request[key];
        }
        for ( var key in defaultRequestNames) {
            var paramName = defaultRequestNames[key];
            var paramValue = node[key];
            if(typeof paramValue === "boolean"){
                requestParam[paramName] = paramValue;
            }else {
                if(paramValue){
                    requestParam[paramName] = paramValue;
                }
            }
        }

        // 解決傳遞中文的亂碼問題
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;	//正規匹配中文
        for(var key in requestParam){
            if(reg.test(requestParam[key])) {
                var str = requestParam[key];
                requestParam[key] = encodeURI(encodeURI(str));
            }
        }

        return requestParam;
    };

    /******************** 資料回呼區域 ********************/
    // 根據具體的id取得基於當前id的div以及對應的其他dom元素
    DTree.prototype.getNodeDom = function(id){
        var _this = this;
        // 取得目前div，如果id就是一個dom，則就是這個，如果不是則進行選擇。如果選不中則為null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        return {
            div: function(){	// 取得當前div
                return $div;
            },
            fnode: function(){	// 取得一級圖示元素
                return ($div == null) ? null : $div.find("i[data-spread]").eq(0);
            },
            snode: function(){	// 取得二級圖示元素
                return ($div == null) ? null : $div.find("i[data-spread]").eq(1);
            },
            checkbox: function(){		// 取得複選框元素
                return ($div == null) ? null : $div.find("i[data-par]");
            },
            cite: function(){	// 取得cite元素
                return ($div == null) ? null : $div.find("cite[data-leaf]");
            },
            nextUl: function(){	// 取得相鄰的ul元素
                return ($div == null) ? null : $div.next("ul");
            },
            parentLi: function(){	// 取得父級li元素
                return ($div == null) ? null : $div.parent("li");
            },
            parentUl: function(){	// 取得基於目前$div的上級$ul
                return ($div == null) ? null : $div.parent("li").parent("ul");
            },
            parentDiv: function(){  // 取得基於目前$div的上級$div
                return ($div == null) ? null : $div.parent("li").parent("ul").prev("div");
            },
            nowDiv: function(){		// 取得目前選取節點，沒有則回傳null
                return (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS);
            },
            nowOrRootDiv: function(){	// 取得目前選取節點，沒有則回傳根節點下的第一個div
                return (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).length == 0) ? _this.obj.children("li").eq(0).children("div").eq(0) : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS);
            },
            nowOrRootUl: function(){	// 取得目前選取節點下一個UL 或根節點。為了將新節點放入ul下
                return (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).length == 0) ? _this.obj : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id]").parent().find("."+NAV_THIS).next("ul");
            }
        }
    };

    // 取得目前選取節點下一個UL 或根節點。為了將新節點放入ul下
    DTree.prototype.getNowNodeUl =  function() {
        var _this = this;
        return _this.getNodeDom().nowOrRootUl();
    };

    // 取得目前選取節點 或第一個根節點。
    DTree.prototype.getNowNode =  function() {
        var _this = this;
        return _this.getNodeDom().nowOrRootDiv();
    };

    // 取得目前選取節點 無則回傳null。
    DTree.prototype.getNowNodeOrNull =  function() {
        var _this = this;
        return _this.getNodeDom().nowDiv();
    };

    // 取得指定節點。
    DTree.prototype.getNode =  function(id) {
        var _this = this;
        return _this.getNodeDom(id).div();
    };

    // 設定目前選取節點的全部參數
    DTree.prototype.setNodeParam = function($div) {
        var _this = this;
        _this.node.nodeId = $div.attr("data-id");
        _this.node.parentId = _this.getNodeDom($div).parentLi().attr("data-pid");
        _this.node.context = (typeof _this.formatter.title === 'function') ? _this.getNodeDom($div).cite().attr("data-title") : _this.getNodeDom($div).cite().text();
        _this.node.leaf = _this.getNodeDom($div).cite().attr("data-leaf") == "leaf" ? true : false;
        _this.node.level = _this.getNodeDom($div).parentLi().attr("data-index");
        _this.node.spread = _this.getNodeDom($div).fnode().attr("data-spread") == "open" ? true : false;

        var basicData = $div.attr("data-basic");
        if(basicData) {
        	basicData = JSON.parse(event.unescape(basicData));
        }
        _this.node.basicData = basicData;
        
        var recordData = $div.attr("data-record");
        if(recordData) {
        	recordData = JSON.parse(event.unescape(recordData));
        }
        _this.node.recordData = recordData;
        
        if (_this.getNodeDom($div).checkbox()) {
            var dataTypes = "", checkeds = "", initcheckeds = "";
            _this.getNodeDom($div).checkbox().each(function(){
                dataTypes += $(this).attr("data-type") + ",";
                checkeds += $(this).attr("data-checked") + ",";
                initcheckeds += $(this).attr("data-initchecked") + ",";
            });
            dataTypes = dataTypes.substring(0, dataTypes.length-1);
            checkeds = checkeds.substring(0, checkeds.length-1);
            initcheckeds = initcheckeds.substring(0, initcheckeds.length-1);

            _this.node.dataType = dataTypes;
            _this.node.checked = checkeds;
            _this.node.initchecked = initcheckeds;
        }
    };

    // 取得目前選取節點的全部參數
    DTree.prototype.getNodeParam = function($div) {
        var _this = this;
        if ($div) {
            _this.setNodeParam($div);
        } else {
            if(_this.obj.find("div[data-id]").parent().find("."+NAV_THIS).length == 0){
                _this.initNodeParam();
            }
        }
        return this.node;
    };

    // 取得一個暫時的node參數
    DTree.prototype.getTempNodeParam = function($div) {
        var _this = this;
        var temp_node = {};
        temp_node.nodeId = $div.attr("data-id");
        temp_node.parentId = _this.getNodeDom($div).parentLi().attr("data-pid");
        temp_node.context = (typeof _this.formatter.title === 'function') ? _this.getNodeDom($div).cite().attr("data-title") : _this.getNodeDom($div).cite().text();
        temp_node.leaf = _this.getNodeDom($div).cite().attr("data-leaf") == "leaf" ? true : false;
        temp_node.level = _this.getNodeDom($div).parentLi().attr("data-index");
        temp_node.spread = _this.getNodeDom($div).fnode().attr("data-spread") == "open" ? true : false;
        
        var basicData = $div.attr("data-basic");
        if(basicData) {
        	basicData = JSON.parse(event.unescape(basicData));
        }
        temp_node.basicData = basicData;
        var recordData = $div.attr("data-record");
        if(recordData) {
        	recordData = JSON.parse(event.unescape(recordData));
        }
        temp_node.recordData = recordData;
        
        if (_this.getNodeDom($div).checkbox()) {
            var dataTypes = "", checkeds = "", initcheckeds = "";
            _this.getNodeDom($div).checkbox().each(function(){
                dataTypes += $(this).attr("data-type") + ",";
                checkeds += $(this).attr("data-checked") + ",";
                initcheckeds += $(this).attr("data-initchecked") + ",";
            });
            dataTypes = dataTypes.substring(0, dataTypes.length-1);
            checkeds = checkeds.substring(0, checkeds.length-1);
            initcheckeds = initcheckeds.substring(0, initcheckeds.length-1);

            temp_node.dataType = dataTypes;
            temp_node.checked = checkeds;
            temp_node.initchecked = initcheckeds;
        }
        return temp_node;
    };

    // 重置參數
    DTree.prototype.initNodeParam = function(){
        var _this = this;
        _this.node.nodeId = "";
        _this.node.parentId = "";
        _this.node.context = "";
        _this.node.leaf = "";
        _this.node.level = "";
        _this.node.spread = "";
        _this.node.dataType = "";
        _this.node.checked = "";
        _this.node.initchecked = "";
        _this.node.basicData = "";
        _this.node.recordData = "";
        
        if(_this.select) {
             _this.selectResetVal();
        }
    };

    // 取得傳遞出去的參數，根據defaultRequest、request和node拼出發出請求的參數
    DTree.prototype.getRequestParam = function(nodes){
        var _this = this;
        var request = _this.request,
            defaultRequestNames = _this.defaultRequest,
            node = nodes || _this.node,
            requestParam = {};

        // 先拼用戶自訂的，在拼樹生成的，這樣的話用戶可以自訂當樹未生成時的節點的初始值
        for ( var key in request) {
            requestParam[key] = request[key];
        }
        for ( var key in defaultRequestNames) {
            var paramName = defaultRequestNames[key];
            var paramValue = node[key];
            if(typeof paramValue === "boolean"){
                requestParam[paramName] = paramValue;
            }else {
                if(paramValue){
                    requestParam[paramName] = paramValue;
                }
            }

        }
        return requestParam;
    };

    // 取得filterParam過濾後的requestParam
    DTree.prototype.getFilterRequestParam = function(requestParam){
        var _this = this;
        var filterRequest = _this.filterRequest;
        return event.cloneObj(requestParam, filterRequest);
    };

    // 取得目前選取值
    DTree.prototype.getNowParam = function(){
        var _this = this;

        return _this.getRequestParam(_this.getNodeParam());
    };

    // 取得指定節點選取值
    DTree.prototype.getParam = function(id){
        var _this = this;

        // 取得目前div，如果id就是一個dom，則就是這個，如果不是則進行選擇。如果選不中則為null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null){ return _this.callbackData().node(_this.getTempNodeParam($div)); } else { return {}; }
    };

    // 取得參數的上級節點
    DTree.prototype.getParentParam = function(id){
        var _this = this;
        // 取得目前div，如果id就是一個dom，則就是這個，如果不是則進行選擇。如果選不中則為null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null){ return _this.callbackData().parentNode($div); } else { return {}; }
    };

    // 取得參數的全部上級節點
    DTree.prototype.getAllParentParam = function(id){
        var _this = this;
        // 取得目前div，如果id就是一個dom，則就是這個，如果不是則進行選擇。如果選不中則為null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        var arr = [];
        if($div != null){
            var level = _this.getTempNodeParam($div).level;
            for(var i=1; i<level; i++){  // 從1開始遍歷，如果level等於1說明是根節點
                arr.unshift(_this.callbackData().parentNode($div));
                $div = _this.getNodeDom($div).parentDiv();
            }
        }
        return arr;
    };

    // 取得參數的下級節點
    DTree.prototype.getChildParam = function(id){
        var _this = this;
        // 取得目前div，如果id就是一個dom，則就是這個，如果不是則進行選擇。如果選不中則為null
        var $div = (typeof id === 'object') ? id : (_this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']").length == 0) ? null : _this.obj.find("div[dtree-click='"+eventName.itemNodeClick+"'][data-id='"+id+"']");
        if($div != null){ return _this.callbackData().childNode($div); } else { return []; }
    };

    // 取得回呼資料
    DTree.prototype.callbackData = function(){
        var _this = this;
        return {
            dom: function($dom){  // 獲取dom
                return $dom;
            },
            node: function(node){	// 取得當前節點值
                return _this.getRequestParam(node);
            },
            childNode: function($div){	// 取得下級節點值
                var $childDivs = $div.next("ul").find("li."+LI_NAV_ITEM+" div."+LI_DIV_ITEM);
                var childNode = [];
                if($childDivs && $childDivs.length > 0){
                    $childDivs.each(function(){
                        var $cDiv = $(this);
                        childNode.push(_this.getRequestParam(_this.getTempNodeParam($cDiv)));
                    });
                }
                return childNode;
            },
            parentNode: function($div){	// 取得上級節點值
                var pId = _this.getNodeDom($div).parentLi().attr("data-pid");
                var $pdiv = _this.obj.find("div[data-id='"+pId+"']");
                if($pdiv.length > 0) {return _this.getRequestParam(_this.getTempNodeParam($pdiv));} else {return {};}

            }
        }
    };

    /******************** 事件回呼區域 ********************/
    // 綁定瀏覽器事件
    DTree.prototype.bindBrowserEvent = function(){
        var _this = this;
        var rootId = _this.obj[0].id;

        // 綁定資料夾展開/收縮的圖示的點擊事件，點擊時為目前節點的div新增選取class
        _this.obj.on("click", "i[data-spread]", function(event) {
            event.stopPropagation();
            var $i = $(this),
                $div = $i.parent("div"),
                node = _this.getNodeParam($div);

            _this.toolbarHide();
            _this.navThis($div);
            _this.clickSpread($div);	// 展開或隱藏節點

            // 樹狀態改變後，使用者自訂想做的事
            layui.event.call(this, MOD_NAME, "changeTree("+$(_this.obj)[0].id+")",  {
                dom: _this.callbackData().dom($i),
                param: _this.callbackData().node(node),
                show: _this.callbackData().dom($i).attr("data-spread") == "open" ? true : false
            });
        });

        // 綁定所有子節點div的點擊事件，點擊時觸發載入iframe或使用者自訂想做的事情
        _this.obj.on("click", "div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='false']", function(event) {
            event.stopPropagation();
            var $div = $(this),
                $cite = $div.find("cite"),
                node = _this.getNodeParam($div);
            _this.toolbarHide();
            _this.navThis($div);
            
            if(_this.select) {
                _this.selectVal(node.nodeId);
                $("div[dtree-id='" + rootId + "'][dtree-select='"+_this.selectDiv+"']").click();
            }

            if (_this.useIframe) {
                var iframeParam = _this.getFilterRequestParam(_this.getIframeRequestParam(node));
                var flag = _this.loadIframe($div, iframeParam);	// 載入iframe
                if (flag) {
                    // iframe載入完畢後，使用者自訂想做的事情
                    _this.iframeFun.iframeDone(iframeParam);

                    layui.event.call(this, MOD_NAME, "iframeDone("+$(_this.obj)[0].id+")",  {
                        "iframeParam": iframeParam,
                        dom: _this.callbackData().dom($div)
                    });
                }
            } else {
                // 點選事件執行完畢後，使用者自訂想做的事
                layui.event.call(this, MOD_NAME, "node("+$(_this.obj)[0].id+")", {
                    param: _this.callbackData().node(node),
                    childParams: _this.callbackData().childNode($div),
                    parentParam: _this.callbackData().parentNode($div),
                    dom: _this.callbackData().dom($div)
                });
            }
        });

        // 綁定所有子節點div的雙擊事件，暴露on給使用者自訂
        _this.obj.on("dblclick", "div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='false']", function(event) {
            event.stopPropagation();
            var $div = $(this),
                $cite = $div.find("cite"),
                node = _this.getNodeParam($div);
            _this.toolbarHide();
            _this.navThis($div);

            if(_this.select) {
                _this.selectVal(node.nodeId);
                $("div[dtree-id='" + rootId + "'][dtree-select='"+_this.selectDiv+"']").click();
            }

            // 雙擊事件執行完畢後，使用者自訂想做的事
            layui.event.call(this, MOD_NAME, "nodedblclick("+$(_this.obj)[0].id+")",  {
                param: _this.callbackData().node(node),
                childParams: _this.callbackData().childNode($div),
                parentParam: _this.callbackData().parentNode($div),
                dom: _this.callbackData().dom($div)
            });
        });

        if(_this.checkbar) {
            // 綁定cheboxbar的節點複選框
            _this.obj.on("click", "i[dtree-click='"+eventName.checkNodeClick+"'][dtree-disabled='false']", function(event) {
                _this.toolbarHide();
                var $i = $(this),
                    $div = $i.closest("div[dtree-click='"+eventName.itemNodeClick+"']"),
                    node = _this.getNodeParam($div);
                // 複選框選取前的回呼
                var flag = _this.checkbarFun.chooseBefore($i, _this.getRequestParam(node));
                _this.temp = [$i];
                if(flag){_this.changeCheck();}
                
                event.stopPropagation();
            });
        }

        if(_this.menubar) {
            // 綁定menubar的點擊事件
            _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).on("click", "button[d-menu]", function(event) {
                event.stopPropagation();
                _this.toolbarHide();
                _this.menubarListener($(this).attr("d-menu"), "group");
            });

            // 綁定menubar的點擊事件
            _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).on("click", "a[d-menu]", function(event) {
                event.stopPropagation();
                _this.toolbarHide();
                _this.menubarListener($(this).attr("d-menu"), "toolbar");
            });

            // 綁定menubar的點擊按鈕事件
            _this.obj.closest('body').find("*[dtree-id='"+_this.obj[0].id+"'][dtree-menu]").on("click", function(event) {
                event.stopPropagation();
                _this.toolbarHide();
                _this.menubarListener($(this).attr("dtree-menu"), "freedom");
            });
        }

        if(_this.toolbar) {
            if(_this.toolbarWay == "contextmenu") {
                //綁定所有子節點div的右鍵點擊事件，用於顯示toolbar
                _this.obj.on("contextmenu", "div[dtree-click='"+eventName.itemNodeClick+"'][d-contextmenu='true'][dtree-disabled='false']", function(e){
                    var $div = $(this),
                        node = _this.getNodeParam($div);

                    _this.toolbarHide();
                    // toolbar載入前執行的方法，執行完畢之後建立按鈕
                    _this.setToolbarDom().setToolbarPlace(_this.toolbarFun.loadToolbarBefore(event.cloneObj(_this.toolbarMenu), _this.getRequestParam(node), $div));

                    var e = e || window.event,
                        mx = e.pageX - $div.offset().left +45 ,
                        my = $div.offset().top - _this.obj.closest(_this.scroll).offset().top +15;

                    _this.navThis($div);
                    var $toolBarDiv = _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id);
                    $toolBarDiv.find(".layui-nav-child").addClass('layui-anim-fadein layui-show');
                    $toolBarDiv.css({'left':mx+'px','top':my+'px'});

                    e.stopPropagation();
                    return false;
                });

                // 綁定裝載樹的上層出現捲軸的容器，讓toolbar隱藏
                _this.obj.closest(_this.scroll).scroll(function() {
                    _this.toolbarHide();
                });

                // 綁定toolbar的點擊事件
                _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).on("click", "a[dtree-tool]", function(event) {
                    event.stopPropagation();
                    var $div = _this.getNodeDom().nowOrRootDiv(),
                        node = _this.getNodeParam($div);
                    _this.toolbarHide();
                    var tool = $(this).attr("dtree-tool");
                    _this.toolbarListener(tool, $div);
                });
            } else if(_this.toolbarWay == "fixed") {
                // 綁定toolbar的點擊事件
                _this.obj.on("click", "a[dtree-tool]", function(event) {
                    event.stopPropagation();
                    var $a = $(this),
                        $cite = $a.parent("em."+TOOLBAR_TOOL_EM).prev("cite"),	//目前選取節點的text
                        $div = $cite.parent("div"),
                        node = _this.getNodeParam($div);
                    var tool = $a.attr("dtree-tool");

                    _this.toolbarHide();
                    _this.navThis($div);
                    _this.toolbarListener(tool, $div);
                });
            } else if(_this.toolbarWay == "follow") {
                //綁定所有子節點div的mouseover mouseout事件，用於顯示或隱藏toolbar
                _this.obj.on("mouseover mouseout", "div[dtree-click='"+eventName.itemNodeClick+"'][dtree-disabled='false']", function(event){
                    var $div = $(this),
                        $toolBarEm = $div.children("em."+TOOLBAR_TOOL_EM);
                    if(event.type == "mouseover"){
                        $toolBarEm.removeClass(NAV_HIDE);
                        event.stopPropagation();
                    } else if(event.type == "mouseout"){
                        $toolBarEm.addClass(NAV_HIDE);
                        event.stopPropagation();
                    }
                });

                // 綁定toolbar的點擊事件
                _this.obj.on("click", "a[dtree-tool]", function(event) {
                    event.stopPropagation();
                    var $a = $(this),
                        $cite = $a.parent("em."+TOOLBAR_TOOL_EM).prev("cite"),	//目前選取節點的text
                        $div = $cite.parent("div"),
                        node = _this.getNodeParam($div);
                    var tool = $a.attr("dtree-tool");

                    _this.toolbarHide();
                    _this.navThis($div);
                    _this.toolbarListener(tool, $div);
                });
            }
        }

        if(_this.select) {
            // 綁定select的點擊事件
            $("div[dtree-id='" + rootId + "'][dtree-select='"+_this.selectDiv+"']").on("click", function(event){
                event.stopPropagation();
                $(this).toggleClass("layui-form-selected");
                $("div[dtree-id='" + rootId + "'][dtree-card='"+_this.selectCardDiv+"']").toggleClass("dtree-select-show layui-anim layui-anim-upbit");
            
                // 下拉樹面板開閉狀態改變後，使用者自訂想做的事情
                layui.event.call(this, MOD_NAME, "changeSelect("+$(_this.obj)[0].id+")",  {
                	show: $(this).hasClass("layui-form-selected"),
                    param: _this.selectVal()
                });
            });

        }
    };

    // 綁定body的單擊，讓本頁面所有的toolbar隱藏
    $BODY.on("click", function(event){
        $("div."+LI_DIV_TOOLBAR).find(".layui-show").removeClass('layui-anim-fadein layui-show');
       // $("div[dtree-id][dtree-select]").removeClass("layui-form-selected");
       // $("div[dtree-id][dtree-card]").removeClass("dtree-select-show layui-anim layui-anim-upbit");
        
    });

    // 解綁瀏覽器事件
    DTree.prototype.unbindBrowserEvent = function(){
        var _this = this;

        // 本身事件解綁
        _this.obj.unbind();
        // 選單列解綁
        if(_this.menubar){
            _this.obj.prevAll('div#dtree_menubar_'+_this.obj[0].id).unbind();
            if(_this.obj.closest('body').find("*[dtree-id='"+_this.obj[0].id+"'][dtree-menu]").length > 0){
                _this.obj.closest('body').find("*[dtree-id='"+_this.obj[0].id+"'][dtree-menu]").unbind();
            }
        }

        // 工具列解綁
        if(_this.toolbar){
            if(_this.toolbarWay == "contextmenu") {
                _this.obj.prevAll('div#dtree_toolbar_'+_this.obj[0].id).unbind();
                if(_this.obj.closest(_this.scroll).length > 0){
                    _this.obj.closest(_this.scroll).unbind();
                }
            }
        }
        
        // 下拉樹解綁
        if(_this.select) {
            // 解綁select的點擊事件
        	$("div[dtree-id='" + _this.obj[0].id + "'][dtree-select='"+_this.selectDiv+"']").removeClass("layui-form-selected");
            $("div[dtree-id='" + _this.obj[0].id + "'][dtree-card='"+_this.selectCardDiv+"']").removeClass("dtree-select-show layui-anim layui-anim-upbit");
            $("div[dtree-id='" + _this.obj[0].id + "'][dtree-select='"+_this.selectDiv+"']").unbind();
        }
    };


    /** 外部存取 **/
    var dtree = {
        set: function(options){ //設定全域屬性
            if(typeof options !== 'undefined') {
                $.extend(OPTIONS, options);
            }
        },
        render: function(options){	// 初始化樹
            var dTree = null;
            var id = event.getElemId(options);
            if(id == "") {
                layer.msg("頁面中未找到綁定id", {icon:5});
            } else {
                dTree = DTrees[id];
                if(typeof dTree === 'object'){
                    dTree.unbindBrowserEvent();
                }
                // 創建樹
                dTree = new DTree(options);
                // 加入到樹數組去
                DTrees[id] = dTree;
                dTree.initTreePlus();
                dTree.openTreePlus();
                dTree.init();
                dTree.bindBrowserEvent();
            }

            return dTree;
        },
        renderSelect: function(options){ 	// 初始化下拉樹
            var dTree = null;
            var id = event.getElemId(options);
            if(id == "") {
                layer.msg("頁面中未找到綁定id", {icon:5});
            } else {
                dTree = DTrees[id];
                if(typeof dTree === 'object'){
                    dTree.unbindBrowserEvent();
                }
                // 建立下拉樹
                dTree = new DTree(options);
                dTree.selectSetting();
                // 加入到樹數組去
                DTrees[id] = dTree;
                dTree.initTreePlus();
                dTree.openTreePlus();
                dTree.init();
                dTree.bindBrowserEvent();
            }

            return dTree;
        },
        reload: function(dTree, options){  // 重新載入樹
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            dTree.reloadSetting(options);
            dTree.initTreePlus();
            dTree.openTreePlus();
            dTree.initNodeParam();
            dTree.init();
            dTree.unbindBrowserEvent();
            dTree.bindBrowserEvent();
        },
        on: function(events, callback) {	// 綁定事件
            if(events.indexOf("'") > 0){
                events = events.replace(/'/g,"");
            }
            if(events.indexOf('"') > 0) {
                events = events.replace(/"/g,"");
            }
            return layui.onevent.call(this, MOD_NAME, events, callback);
        },
        click: function(dTree, id) { // 模擬點選事件
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            $("div[dtree-click='"+eventName.itemNodeClick+"'][dtree-id='"+dTree.obj[0].id+"'][data-id='"+id+"']").click();
        },
        getNowParam: function(dTree){  // 取得目前選取值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.getNowParam();	// 取得目前選取值
        },
        getParam: function(dTree, id){  // 取得指定節點值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.getParam(id);	// 取得指定節點值
        },
        getParentParam: function(dTree, id){  // 取得參數的上級節點
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.getParentParam(id);
        },
        getAllParentParam: function(dTree, id){  // 取得參數的全部上級節點
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.getAllParentParam(id);
        },
        getChildParam: function(dTree, id){  // 取得參數的全部下級節點
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.getChildParam(id);
        },
        getCheckbarNodesParam: function(dTree){  // 取得複選框選取值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return {};
            }
            return dTree.getCheckbarNodesParam();	// 取得複選框選取值
        },
        dataInit: function(dTree, chooseId){  // 初始化選取樹，針對資料反選
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            if(chooseId){
                return dTree.dataInit(chooseId);
            }
        },
        chooseDataInit: function(dTree, chooseIds){	// 初始化複選框選中，針對資料反選
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            if(chooseIds){
                return dTree.chooseDataInit(chooseIds);
            }
        },
        changeCheckbarNodes: function(dTree){	//判斷複選框是否發生變更
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.changeCheckbarNodes();
        },
        initNoAllCheck: function(dTree) { //複選框半選狀態初始化設定
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.initNoAllCheck();
        },
        initAllCheck: function(dTree){ // 複選框選取狀態初始化設定
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.initAllCheck();
        },
        selectVal: function(dTree, param){  // select模式設定輸入框選取值
            if(typeof dTree === "string"){
                dTree = DTrees[dTree];
            }
            if(typeof dTree === "undefined"){
                layer.msg("方法取得失敗，請檢查ID或物件傳遞是否正確",{icon:2});
                return ;
            }
            return dTree.selectVal(param);	// select模式設定輸入框選取值
        },
        escape: function(html){  // 字串格式化
            return event.escape(html);
        },
        unescape: function(str){  // 字串反格式化
            return event.unescape(str);
        },
        version: function(){  //取得版本號碼
            return VERSION;
        }
    };

    exports('dtree', dtree);
});