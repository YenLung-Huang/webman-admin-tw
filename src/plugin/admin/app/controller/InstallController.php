<?php

namespace plugin\admin\app\controller;

use Illuminate\Database\Capsule\Manager;
use plugin\admin\app\common\Util;
use plugin\admin\app\model\Admin;
use support\exception\BusinessException;
use support\Request;
use support\Response;
use Webman\Captcha\CaptchaBuilder;

/**
 * 安裝
 */
class InstallController extends Base
{
    /**
     * 不需要登入的方法
     * @var string[]
     */
    protected $noNeedLogin = ['step1', 'step2'];

    /**
     * 設定資料庫
     * @param Request $request
     * @return Response
     * @throws BusinessException|\Throwable
     */
    public function step1(Request $request): Response
    {
        $database_config_file = base_path() . '/plugin/admin/config/database.php';
        clearstatcache();
        if (is_file($database_config_file)) {
            return $this->json(1, '管理後台已經安裝！如需重新安裝，請刪除該外掛程式資料庫設定檔並重新啟動');
        }

        if (!class_exists(CaptchaBuilder::class) || !class_exists(Manager::class)) {
            return $this->json(1, '請執行 composer require -W illuminate/database 安裝illuminate/database元件並重新啟動');
        }

        $user = $request->post('user');
        $password = $request->post('password');
        $database = $request->post('database');
        $host = $request->post('host');
        $port = (int)$request->post('port') ?: 3306;
        $overwrite = $request->post('overwrite');

        try {
            $db = $this->getPdo($host, $user, $password, $port);
            $smt = $db->query("show databases like '$database'");
            if (empty($smt->fetchAll())) {
                $db->exec("create database $database");
            }
            $db->exec("use $database");
            $smt = $db->query("show tables");
            $tables = $smt->fetchAll();
        } catch (\Throwable $e) {
            if (stripos($e, 'Access denied for user')) {
                return $this->json(1, '資料庫使用者名稱或密碼錯誤');
            }
            if (stripos($e, 'Connection refused')) {
                return $this->json(1, 'Connection refused. 請確認資料庫IP連接埠是否正確，資料庫已啟動');
            }
            if (stripos($e, 'timed out')) {
                return $this->json(1, '資料庫連線逾時，請確認資料庫IP連接埠是否正確，安全群組及防火牆已放行連接埠');
            }
            throw $e;
        }

        $tables_to_install = [
            'wa_admins',
            'wa_admin_roles',
            'wa_roles',
            'wa_rules',
            'wa_options',
            'wa_users',
            'wa_uploads',
        ];

        $tables_exist = [];
        foreach ($tables as $table) {
            $tables_exist[] = current($table);
        }
        $tables_conflict = array_intersect($tables_to_install, $tables_exist);
        if (!$overwrite) {
            if ($tables_conflict) {
                return $this->json(1, '以下表' . implode(',', $tables_conflict) . '已經存在，如需覆蓋請選擇強制覆蓋');
            }
        } else {
            foreach ($tables_conflict as $table) {
                $db->exec("DROP TABLE `$table`");
            }
        }

        $sql_file = base_path() . '/plugin/admin/install.sql';
        if (!is_file($sql_file)) {
            return $this->json(1, '資料庫SQL檔案不存在');
        }

        $sql_query = file_get_contents($sql_file);
        $sql_query = $this->removeComments($sql_query);
        $sql_query = $this->splitSqlFile($sql_query, ';');
        foreach ($sql_query as $sql) {
            $db->exec($sql);
        }

        // 導入選單
        $menus = include base_path() . '/plugin/admin/config/menu.php';
        // 安裝过程中没有数据库配置，无法使用api\Menu::import()方法
        $this->importMenu($menus, $db);

        $config_content = <<<EOF
<?php
return  [
    'default' => 'mysql',
    'connections' => [
        'mysql' => [
            'driver'      => 'mysql',
            'host'        => '$host',
            'port'        => '$port',
            'database'    => '$database',
            'username'    => '$user',
            'password'    => '$password',
            'charset'     => 'utf8mb4',
            'collation'   => 'utf8mb4_general_ci',
            'prefix'      => '',
            'strict'      => true,
            'engine'      => null,
        ],
    ],
];
EOF;

        file_put_contents($database_config_file, $config_content);

        $think_orm_config = <<<EOF
<?php
return [
    'default' => 'mysql',
    'connections' => [
        'mysql' => [
            // 資料庫類型
            'type' => 'mysql',
            // 伺服器位址
            'hostname' => '$host',
            // 資料庫名稱
            'database' => '$database',
            // 資料庫使用者名稱
            'username' => '$user',
            // 資料庫密碼
            'password' => '$password',
            // 資料庫連線連接埠
            'hostport' => $port,
            // 資料庫連線參數
            'params' => [
                // 連線逾時3秒
                \PDO::ATTR_TIMEOUT => 3,
            ],
            // 資料庫編碼預設採用utf8
            'charset' => 'utf8mb4',
            // 資料庫表前綴
            'prefix' => '',
            // 斷線重連
            'break_reconnect' => true,
            // 關閉SQL監聽日誌
            'trigger_sql' => true,
            // 自訂分頁類
            'bootstrap' =>  ''
        ],
    ],
];
EOF;
        file_put_contents(base_path() . '/plugin/admin/config/thinkorm.php', $think_orm_config);


        // 嘗試reload
        if (function_exists('posix_kill')) {
            set_error_handler(function () {});
            posix_kill(posix_getppid(), SIGUSR1);
            restore_error_handler();
        }

        return $this->json(0);
    }

    /**
     * 設定管理員
     * @param Request $request
     * @return Response
     * @throws BusinessException
     */
    public function step2(Request $request): Response
    {
        $username = $request->post('username');
        $password = $request->post('password');
        $password_confirm = $request->post('password_confirm');
        if ($password != $password_confirm) {
            return $this->json(1, '兩次密碼不一致');
        }
        if (!is_file($config_file = base_path() . '/plugin/admin/config/database.php')) {
            return $this->json(1, '請先完成第一步資料庫配置');
        }
        $config = include $config_file;
        $connection = $config['connections']['mysql'];
        $pdo = $this->getPdo($connection['host'], $connection['username'], $connection['password'], $connection['port'], $connection['database']);

        if ($pdo->query('select * from `wa_admins`')->fetchAll()) {
            return $this->json(1, '後台已經安裝完畢，無法透過此頁面建立管理員');
        }

        $smt = $pdo->prepare("insert into `wa_admins` (`username`, `password`, `nickname`, `created_at`, `updated_at`) values (:username, :password, :nickname, :created_at, :updated_at)");
        $time = date('Y-m-d H:i:s');
        $data = [
            'username' => $username,
            'password' => Util::passwordHash($password),
            'nickname' => '超級管理員',
            'created_at' => $time,
            'updated_at' => $time
        ];
        foreach ($data as $key => $value) {
            $smt->bindValue($key, $value);
        }
        $smt->execute();
        $admin_id = $pdo->lastInsertId();

        $smt = $pdo->prepare("insert into `wa_admin_roles` (`role_id`, `admin_id`) values (:role_id, :admin_id)");
        $smt->bindValue('role_id', 1);
        $smt->bindValue('admin_id', $admin_id);
        $smt->execute();

        $request->session()->flush();
        return $this->json(0);
    }

    /**
     * 新增選單
     * @param array $menu
     * @param \PDO $pdo
     * @return int
     */
    protected function addMenu(array $menu, \PDO $pdo): int
    {
        $allow_columns = ['title', 'key', 'icon', 'href', 'pid', 'weight', 'type'];
        $data = [];
        foreach ($allow_columns as $column) {
            if (isset($menu[$column])) {
                $data[$column] = $menu[$column];
            }
        }
        $time = date('Y-m-d H:i:s');
        $data['created_at'] = $data['updated_at'] = $time;
        $values = [];
        foreach ($data as $k => $v) {
            $values[] = ":$k";
        }
        $columns = array_keys($data);
        foreach ($columns as $k => $column) {
            $columns[$k] = "`$column`";
        }
        $sql = "insert into wa_rules (" .implode(',', $columns). ") values (" . implode(',', $values) . ")";
        $smt = $pdo->prepare($sql);
        foreach ($data as $key => $value) {
            $smt->bindValue($key, $value);
        }
        $smt->execute();
        return $pdo->lastInsertId();
    }

    /**
     * 導入選單
     * @param array $menu_tree
     * @param \PDO $pdo
     * @return void
     */
    protected function importMenu(array $menu_tree, \PDO $pdo)
    {
        if (is_numeric(key($menu_tree)) && !isset($menu_tree['key'])) {
            foreach ($menu_tree as $item) {
                $this->importMenu($item, $pdo);
            }
            return;
        }
        $children = $menu_tree['children'] ?? [];
        unset($menu_tree['children']);
        $smt = $pdo->prepare("select * from wa_rules where `key`=:key limit 1");
        $smt->execute(['key' => $menu_tree['key']]);
        $old_menu = $smt->fetch();
        if ($old_menu) {
            $pid = $old_menu['id'];
            $params = [
                'title' => $menu_tree['title'],
                'icon' => $menu_tree['icon'] ?? '',
                'key' => $menu_tree['key'],
            ];
            $sql = "update wa_rules set title=:title, icon=:icon where `key`=:key";
            $smt = $pdo->prepare($sql);
            $smt->execute($params);
        } else {
            $pid = $this->addMenu($menu_tree, $pdo);
        }
        foreach ($children as $menu) {
            $menu['pid'] = $pid;
            $this->importMenu($menu, $pdo);
        }
    }

    /**
     * 去除sql檔案中的註解
     * @param $sql
     * @return string
     */
    protected function removeComments($sql): string
    {
        return preg_replace("/(\n--[^\n]*)/","", $sql);
    }

    /**
     * 分割sql檔案
     * @param $sql
     * @param $delimiter
     * @return array
     */
    function splitSqlFile($sql, $delimiter): array
    {
        $tokens = explode($delimiter, $sql);
        $output = array();
        $matches = array();
        $token_count = count($tokens);
        for ($i = 0; $i < $token_count; $i++) {
            if (($i != ($token_count - 1)) || (strlen($tokens[$i] > 0))) {
                $total_quotes = preg_match_all("/'/", $tokens[$i], $matches);
                $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$i], $matches);
                $unescaped_quotes = $total_quotes - $escaped_quotes;

                if (($unescaped_quotes % 2) == 0) {
                    $output[] = $tokens[$i];
                    $tokens[$i] = "";
                } else {
                    $temp = $tokens[$i] . $delimiter;
                    $tokens[$i] = "";

                    $complete_stmt = false;
                    for ($j = $i + 1; (!$complete_stmt && ($j < $token_count)); $j++) {
                        $total_quotes = preg_match_all("/'/", $tokens[$j], $matches);
                        $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$j], $matches);
                        $unescaped_quotes = $total_quotes - $escaped_quotes;
                        if (($unescaped_quotes % 2) == 1) {
                            $output[] = $temp . $tokens[$j];
                            $tokens[$j] = "";
                            $temp = "";
                            $complete_stmt = true;
                            $i = $j;
                        } else {
                            $temp .= $tokens[$j] . $delimiter;
                            $tokens[$j] = "";
                        }

                    }
                }
            }
        }

        return $output;
    }

    /**
     * 取得pdo連線
     * @param $host
     * @param $username
     * @param $password
     * @param $port
     * @param $database
     * @return \PDO
     */
    protected function getPdo($host, $username, $password, $port, $database = null): \PDO
    {
        $dsn = "mysql:host=$host;port=$port;";
        if ($database) {
            $dsn .= "dbname=$database";
        }
        $params = [
            \PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8mb4",
            \PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
            \PDO::ATTR_EMULATE_PREPARES => false,
            \PDO::ATTR_TIMEOUT => 5,
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        ];
        return new \PDO($dsn, $username, $password, $params);
    }

}
