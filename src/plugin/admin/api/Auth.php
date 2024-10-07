<?php
namespace plugin\admin\api;

use plugin\admin\app\model\Role;
use plugin\admin\app\model\Rule;
use support\exception\BusinessException;
use function admin;

/**
 * 對外提供的鑑權介面
 */
class Auth
{
    /**
     * 判斷權限
     * 如果沒有權限則拋出異常
     * @param string $controller
     * @param string $action
     * @return void
     * @throws \ReflectionException|BusinessException
     */
    public static function access(string $controller, string $action)
    {
        $code = 0;
        $msg = '';
        if (!static::canAccess($controller, $action, $code, $msg)) {
            throw new BusinessException($msg, $code);
        }
    }

    /**
     * 判斷是否有權限
     * @param string $controller
     * @param string $action
     * @param int $code
     * @param string $msg
     * @return bool
     * @throws \ReflectionException|BusinessException
     */
    public static function canAccess(string $controller, string $action, int &$code = 0, string &$msg = ''): bool
    {
        // 無控制器資訊說明是函數調用，函​​數不屬於任何控制器，鑑權操作應該在函數內部完成。
        if (!$controller) {
            return true;
        }
        // 取得控制器鑑權資訊
        $class = new \ReflectionClass($controller);
        $properties = $class->getDefaultProperties();
        $noNeedLogin = $properties['noNeedLogin'] ?? [];
        $noNeedAuth = $properties['noNeedAuth'] ?? [];

        // 不需要登入
        if (in_array($action, $noNeedLogin)) {
            return true;
        }

        // 取得登入資訊
        $admin = admin();
        if (!$admin) {
            $msg = '請登入';
            // 401是未登入固定的回傳碼
            $code = 401;
            return false;
        }

        // 不需要鑑權
        if (in_array($action, $noNeedAuth)) {
            return true;
        }

        // 目前管理者無角色
        $roles = $admin['roles'];
        if (!$roles) {
            $msg = '無權限';
            $code = 2;
            return false;
        }

        // 角色沒有規則
        $rules = Role::whereIn('id', $roles)->pluck('rules');
        $rule_ids = [];
        foreach ($rules as $rule_string) {
            if (!$rule_string) {
                continue;
            }
            $rule_ids = array_merge($rule_ids, explode(',', $rule_string));
        }
        if (!$rule_ids) {
            $msg = '無權限';
            $code = 2;
            return false;
        }

        // 超級管理員
        if (in_array('*', $rule_ids)){
            return true;
        }

        // 如果action為index，規則裡有任一個以$controller開頭的權限即可
        if (strtolower($action) === 'index') {
            $rule = Rule::where(function ($query) use ($controller, $action) {
                $controller_like = str_replace('\\', '\\\\', $controller);
                $query->where('key', 'like', "$controller_like@%")->orWhere('key', $controller);
            })->whereIn('id', $rule_ids)->first();
            if ($rule) {
                return true;
            }
            $msg = '無權限';
            $code = 2;
            return false;
        }

        // 查詢是否有目前控制器的規則
        $rule = Rule::where(function ($query) use ($controller, $action) {
            $query->where('key', "$controller@$action")->orWhere('key', $controller);
        })->whereIn('id', $rule_ids)->first();

        if (!$rule) {
            $msg = '無權限';
            $code = 2;
            return false;
        }

        return true;
    }

}