<?php

namespace plugin\admin\app\controller;

use Exception;
use plugin\admin\app\common\Tree;
use plugin\admin\app\common\Util;
use plugin\admin\app\model\Role;
use plugin\admin\app\model\Rule;
use support\exception\BusinessException;
use support\Request;
use support\Response;
use Throwable;

/**
 * 權限選單
 */
class RuleController extends Crud
{
    /**
     * 不需要權限的方法
     *
     * @var string[]
     */
    protected $noNeedAuth = ['get', 'permission'];

    /**
     * @var Rule
     */
    protected $model = null;

    /**
     * 建構子
     */
    public function __construct()
    {
        $this->model = new Rule;
    }

    /**
     * 瀏覽
     * @return Response
     * @throws Throwable
     */
    public function index(): Response
    {
        return raw_view('rule/index');
    }

    /**
     * 查詢
     * @param Request $request
     * @return Response
     * @throws BusinessException
     */
    public function select(Request $request): Response
    {
        $this->syncRules();
        return parent::select($request);
    }

    /**
     * 取得選單
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    function get(Request $request): Response
    {
        $rules = $this->getRules(admin('roles'));
        $types = $request->get('type', '0,1');
        $types = is_string($types) ? explode(',', $types) : [0, 1];
        $items = Rule::orderBy('weight', 'desc')->get()->toArray();

        $formatted_items = [];
        foreach ($items as $item) {
            $item['pid'] = (int)$item['pid'];
            $item['name'] = $item['title'];
            $item['value'] = $item['id'];
            $item['icon'] = $item['icon'] ? "layui-icon {$item['icon']}" : '';
            $formatted_items[] = $item;
        }

        $tree = new Tree($formatted_items);
        $tree_items = $tree->getTree();
        // 超級管理員權限為 *
        if (!in_array('*', $rules)) {
            $this->removeNotContain($tree_items, 'id', $rules);
        }
        $this->removeNotContain($tree_items, 'type', $types);
        $menus = $this->empty_filter(Tree::arrayValues($tree_items));
        return $this->json(0, 'ok', $menus);
    }

    private function empty_filter($menus)
    {
        return array_map(
            function ($menu) {
                if (isset($menu['children'])) {
                    $menu['children'] = $this->empty_filter($menu['children']);
                }
                return $menu;
            },
            array_values(array_filter(
                $menus,
                function ($menu) {
                    return $menu['type'] != 0 || isset($menu['children']) && count($this->empty_filter($menu['children'])) > 0;
                }
            ))
        );
    }

    /**
     * 取得權限
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    public function permission(Request $request): Response
    {
        $rules = $this->getRules(admin('roles'));
        // 超級管理員
        if (in_array('*', $rules)) {
            return $this->json(0, 'ok', ['*']);
        }
        $keys = Rule::whereIn('id', $rules)->pluck('key');
        $permissions = [];
        foreach ($keys as $key) {
            if (!$key = Util::controllerToUrlPath($key)) {
                continue;
            }
            $code = str_replace('/', '.', trim($key, '/'));
            $permissions[] = $code;
        }
        return $this->json(0, 'ok', $permissions);
    }

    /**
     * 根據類別同步規則到資料庫
     * @return void
     */
    protected function syncRules()
    {
        $items = $this->model->where('key', 'like', '%\\\\%')->get()->keyBy('key');
        $methods_in_db = [];
        $methods_in_files = [];
        foreach ($items as $item) {
            $class = $item->key;
            if (strpos($class, '@')) {
                $methods_in_db[$class] = $class;
                continue;
            }
            if (class_exists($class)) {
                $reflection = new \ReflectionClass($class);
                $properties = $reflection->getDefaultProperties();
                $no_need_auth = array_merge($properties['noNeedLogin'] ?? [], $properties['noNeedAuth'] ?? []);
                $class = $reflection->getName();
                $pid = $item->id;
                $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);
                foreach ($methods as $method) {
                    $method_name = $method->getName();
                    if (strtolower($method_name) === 'index' || strpos($method_name, '__') === 0 || in_array($method_name, $no_need_auth)) {
                        continue;
                    }
                    $name = "$class@$method_name";

                    $methods_in_files[$name] = $name;
                    $title = Util::getCommentFirstLine($method->getDocComment()) ?: $method_name;
                    $menu = $items[$name] ?? [];
                    if ($menu) {
                        if ($menu->title != $title) {
                            Rule::where('key', $name)->update(['title' => $title]);
                        }
                        continue;
                    }
                    $menu = new Rule;
                    $menu->pid = $pid;
                    $menu->key = $name;
                    $menu->title = $title;
                    $menu->type = 2;
                    $menu->save();
                }
            }
        }
        // 從資料庫中刪除已經不存在的方法
        $menu_names_to_del = array_diff($methods_in_db, $methods_in_files);
        if ($menu_names_to_del) {
            //Rule::whereIn('key', $menu_names_to_del)->delete();
        }
    }

    /**
     * 查詢前置方法
     * @param Request $request
     * @return array
     * @throws BusinessException
     */
    protected function selectInput(Request $request): array
    {
        [$where, $format, $limit, $field, $order] = parent::selectInput($request);
        // 允許透過type=0,1格式傳遞選單類型
        $types = $request->get('type');
        if ($types && is_string($types)) {
            $where['type'] = ['in', explode(',', $types)];
        }
        // 預設weight排序
        if (!$field) {
            $field = 'weight';
            $order = 'desc';
        }
        return [$where, $format, $limit, $field, $order];
    }

    /**
     * 添加
     * @param Request $request
     * @return Response
     * @throws BusinessException|Throwable
     */
    public function insert(Request $request): Response
    {
        if ($request->method() === 'GET') {
            return raw_view('rule/insert');
        }
        $data = $this->insertInput($request);
        if (empty($data['type'])) {
            $data['type'] = strpos($data['key'], '\\') ? 1 : 0;
        }
        $data['key'] = str_replace('\\\\', '\\', $data['key']);
        $key = $data['key'] ?? '';
        if ($this->model->where('key', $key)->first()) {
            return $this->json(1, "選單標識 $key 已經存在");
        }
        $data['pid'] = empty($data['pid']) ? 0 : $data['pid'];
        $this->doInsert($data);
        return $this->json(0);
    }

    /**
     * 更新
     * @param Request $request
     * @return Response
     * @throws BusinessException|Throwable
     */
    public function update(Request $request): Response
    {
        if ($request->method() === 'GET') {
            return raw_view('rule/update');
        }
        [$id, $data] = $this->updateInput($request);
        if (!$row = $this->model->find($id)) {
            return $this->json(2, '記錄不存在');
        }
        if (isset($data['pid'])) {
            $data['pid'] = $data['pid'] ?: 0;
            if ($data['pid'] == $row['id']) {
                return $this->json(2, '不能設定自己為上級選單');
            }
        }
        if (isset($data['key'])) {
            $data['key'] = str_replace('\\\\', '\\', $data['key']);
        }
        $this->doUpdate($id, $data);
        return $this->json(0);
    }
    
    /**
     * 刪除
     * @param Request $request
     * @return Response
     */
    public function delete(Request $request): Response
    {
        $ids = $this->deleteInput($request);
        // 子規則一起刪除
        $delete_ids = $children_ids = $ids;
        while($children_ids) {
            $children_ids = $this->model->whereIn('pid', $children_ids)->pluck('id')->toArray();
            $delete_ids = array_merge($delete_ids, $children_ids);
        }
        $this->doDelete($delete_ids);
        return $this->json(0);
    }

    /**
     * 移除不包含某些資料的陣列
     * @param $array
     * @param $key
     * @param $values
     * @return void
     */
    protected function removeNotContain(&$array, $key, $values)
    {
        foreach ($array as $k => &$item) {
            if (!is_array($item)) {
                continue;
            }
            if (!$this->arrayContain($item, $key, $values)) {
                unset($array[$k]);
            } else {
                if (!isset($item['children'])) {
                    continue;
                }
                $this->removeNotContain($item['children'], $key, $values);
            }
        }
    }

    /**
     * 判斷數組是否包含某些資料
     * @param $array
     * @param $key
     * @param $values
     * @return bool
     */
    protected function arrayContain(&$array, $key, $values): bool
    {
        if (!is_array($array)) {
            return false;
        }
        if (isset($array[$key]) && in_array($array[$key], $values)) {
            return true;
        }
        if (!isset($array['children'])) {
            return false;
        }
        foreach ($array['children'] as $item) {
            if ($this->arrayContain($item, $key, $values)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 取得權限規則
     * @param $roles
     * @return array
     */
    protected function getRules($roles): array
    {
        $rules_strings = $roles ? Role::whereIn('id', $roles)->pluck('rules') : [];
        $rules = [];
        foreach ($rules_strings as $rule_string) {
            if (!$rule_string) {
                continue;
            }
            $rules = array_merge($rules, explode(',', $rule_string));
        }
        return $rules;
    }

}
