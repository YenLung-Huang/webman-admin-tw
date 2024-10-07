<?php

return [
    [
        'title' => '資料庫',
        'key' => 'database',
        'icon' => 'layui-icon-template-1',
        'weight' => 1000,
        'type' => 0,
        'children' => [
            [
                'title' => '所有表格',
                'key' => 'plugin\\admin\\app\\controller\\TableController',
                'href' => '/app/admin/table/index',
                'type' => 1,
                'weight' => 800,
            ]
        ]
    ],
    [
        'title' => '權限管理',
        'key' => 'auth',
        'icon' => 'layui-icon-vercode',
        'weight' => 900,
        'type' => 0,
        'children' => [
            [
                'title' => '帳戶管理',
                'key' => 'plugin\\admin\\app\\controller\\AdminController',
                'href' => '/app/admin/admin/index',
                'type' => 1,
                'weight' => 1000,
            ],
            [
                'title' => '角色管理',
                'key' => 'plugin\\admin\\app\\controller\\RoleController',
                'href' => '/app/admin/role/index',
                'type' => 1,
                'weight' => 900,
            ],
            [
                'title' => '選單管理',
                'key' => 'plugin\\admin\\app\\controller\\RuleController',
                'href' => '/app/admin/rule/index',
                'type' => 1,
                'weight' => 800,
            ],
        ]
    ],
    [
        'title' => '會員管理',
        'key' => 'user',
        'icon' => 'layui-icon-username',
        'weight' => 800,
        'type' => 0,
        'children' => [
            [
                'title' => '用戶',
                'key' => 'plugin\\admin\\app\\controller\\UserController',
                'href' => '/app/admin/user/index',
                'type' => 1,
                'weight' => 800,
            ]
        ]
    ],
    [
        'title' => '通用設定',
        'key' => 'common',
        'icon' => 'layui-icon-set',
        'weight' => 700,
        'type' => 0,
        'children' => [
            [
                'title' => '個人資料',
                'key' => 'plugin\\admin\\app\\controller\\AccountController',
                'href' => '/app/admin/account/index',
                'type' => 1,
                'weight' => 800,
            ],
            [
                'title' => '附件管理',
                'key' => 'plugin\\admin\\app\\controller\\UploadController',
                'href' => '/app/admin/upload/index',
                'type' => 1,
                'weight' => 700,
            ],
            [
                'title' => '字典設定',
                'key' => 'plugin\\admin\\app\\controller\\DictController',
                'href' => '/app/admin/dict/index',
                'type' => 1,
                'weight' => 600,
            ],
            [
                'title' => '系統設定',
                'key' => 'plugin\\admin\\app\\controller\\ConfigController',
                'href' => '/app/admin/config/index',
                'type' => 1,
                'weight' => 500,
            ],
        ]
    ],
    [
        'title' => '外掛程式管理',
        'key' => 'plugin',
        'icon' => 'layui-icon-app',
        'weight' => 600,
        'type' => 0,
        'children' => [
            [
                'title' => '應用程式插件',
                'key' => 'plugin\\admin\\app\\controller\\PluginController',
                'href' => '/app/admin/plugin/index',
                'weight' => 800,
                'type' => 1,
            ]
        ]
    ],
    [
        'title' => '開發輔助',
        'key' => 'dev',
        'icon' => 'layui-icon-fonts-code',
        'weight' => 500,
        'type' => 0,
        'children' => [
            [
                'title' => '表單建置',
                'key' => 'plugin\\admin\\app\\controller\\DevController',
                'href' => '/app/admin/dev/form-build',
                'weight' => 800,
                'type' => 1,
            ],
        ]
    ],
    [
        'title' => '範例頁面',
        'key' => 'demos',
        'icon' => 'layui-icon-templeate-1',
        'weight' => 400,
        'type' => 0,
        'children' => [
            [
                'key' => 'demo1',
                'title' => '工作空間',
                'type' => 0,
                'icon' => 'layui-icon-console',
                'href' => '',
                'children' => [
                    [
                        'key' => 'demo10',
                        'title' => '控制後台',
                        'icon' => 'layui-icon-console',
                        'type' => 1,
                        'href' => '/app/admin/demos/console/console1.html'
                    ], [
                        'key' => 'demo13',
                        'title' => '數據分析',
                        'icon' => 'layui-icon-console',
                        'type' => 1,
                        'href' => '/app/admin/demos/console/console2.html'
                    ], [
                        'key' => 'demo14',
                        'title' => '百度一下',
                        'icon' => 'layui-icon-console',
                        'type' => 1,
                        'href' => 'http://www.baidu.com'
                    ], [
                        'key' => 'demo15',
                        'title' => '主題預覽',
                        'icon' => 'layui-icon-console',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/theme.html'
                    ]
                ]
            ],
            [
                'key' => 'demo20',
                'title' => '常用組件',
                'icon' => 'layui-icon-component',
                'type' => 0,
                'href' => '',
                'children' => [
                    [
                        'key' => 'demo2011',
                        'title' => '功能按鈕',
                        'icon' => 'layui-icon-face-smile',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/button.html'
                    ], [
                        'key' => 'demo2014',
                        'title' => '表單集合',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/form.html'
                    ], [
                        'key' => 'demo2010',
                        'title' => '字體圖示',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/icon.html'
                    ], [
                        'key' => 'demo2012',
                        'title' => '多選下拉',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/select.html'
                    ], [
                        'key' => 'demo2013',
                        'title' => '動態標籤',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/tag.html'
                    ], [
                        'key' => 'demo2031',
                        'title' => '資料表格',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/table.html'
                    ], [
                        'key' => 'demo2032',
                        'title' => '分佈表單',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/step.html'
                    ], [
                        'key' => 'demo2033',
                        'title' => '樹狀表格',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/treetable.html'
                    ], [
                        'key' => 'demo2034',
                        'title' => '樹狀結構',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/dtree.html'
                    ], [
                        'key' => 'demo2035',
                        'title' => '文字編輯',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/tinymce.html'
                    ], [
                        'key' => 'demo2036',
                        'title' => '卡片組件',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/card.html'
                    ], [
                        'key' => 'demo2021',
                        'title' => '抽屜組件',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/drawer.html'
                    ], [
                        'key' => 'demo2022',
                        'title' => '訊息通知',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/notice.html'
                    ], [
                        'key' => 'demo2024',
                        'title' => '載入元件',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/loading.html'
                    ], [
                        'key' => 'demo2023',
                        'title' => '彈層組件',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/popup.html'
                    ], [
                        'key' => 'demo60131',
                        'title' => '多選項卡',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/tab.html'
                    ], [
                        'key' => 'demo60132',
                        'title' => '資料選單',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/menu.html'
                    ], [
                        'key' => 'demo2041',
                        'title' => '哈希加密',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/encrypt.html'
                    ], [
                        'key' => 'demo2042',
                        'title' => '圖示選擇',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/iconPicker.html'
                    ], [
                        'key' => 'demo2043',
                        'title' => '省市級聯',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/area.html'
                    ], [
                        'key' => 'demo2044',
                        'title' => '數字滾動',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/count.html'
                    ], [
                        'key' => 'demo2045',
                        'title' => '頂部返回',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/document/topBar.html'
                    ]
                ]
            ],
            [
                'key' => 'demo666',
                'title' => '結果頁面',
                'icon' => 'layui-icon-auz',
                'type' => 0,
                'href' => '',
                'children' => [
                    [
                        'key' => 'demo667',
                        'title' => '成功',
                        'icon' => 'layui-icon-face-smile',
                        'type' => 1,
                        'href' => '/app/admin/demos/result/success.html'
                    ], [
                        'key' => 'demo668',
                        'title' => '失敗',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/result/error.html'
                    ]
                ]
            ],
            [
                'key' => 'demo-error',
                'title' => '錯誤頁面',
                'icon' => 'layui-icon-face-cry',
                'type' => 0,
                'href' => '',
                'children' => [
                    [
                        'key' => 'demo403',
                        'title' => '403',
                        'icon' => 'layui-icon-face-smile',
                        'type' => 1,
                        'href' => '/app/admin/demos/error/403.html'
                    ], [
                        'key' => 'demo404',
                        'title' => '404',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/error/404.html'
                    ], [
                        'key' => 'demo500',
                        'title' => '500',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/error/500.html'
                    ]

                ]
            ],
            [
                'key' => 'demo-system',
                'title' => '系統管理',
                'icon' => 'layui-icon-set-fill',
                'type' => 0,
                'href' => '',
                'children' => [
                    [
                        'key' => 'demo601',
                        'title' => '用戶管理',
                        'icon' => 'layui-icon-face-smile',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/user.html'
                    ], [
                        'key' => 'demo602',
                        'title' => '角色管理',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/role.html'
                    ], [
                        'key' => 'demo603',
                        'title' => '權限管理',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/power.html'
                    ], [
                        'key' => 'demo604',
                        'title' => '部門管理',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/deptment.html'
                    ], [
                        'key' => 'demo605',
                        'title' => '行為日誌',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/log.html'
                    ], [
                        'key' => 'demo606',
                        'title' => '資料字典',
                        'icon' => 'layui-icon-face-cry',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/dict.html'
                    ]
                ]
            ],
            [
                'key' => 'demo-common',
                'title' => '常用頁面',
                'icon' => 'layui-icon-template-1',
                'type' => 0,
                'href' => '',
                'children' => [
                    [
                        'key' => 'demo702',
                        'title' => '空白頁',
                        'icon' => 'layui-icon-face-smile',
                        'type' => 1,
                        'href' => '/app/admin/demos/system/space.html'
                    ]
                ]
            ]
        ]
    ]
];
