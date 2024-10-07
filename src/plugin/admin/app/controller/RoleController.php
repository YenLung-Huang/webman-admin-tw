<?php

namespace plugin\admin\app\controller;

use plugin\admin\app\common\Auth;
use plugin\admin\app\common\Tree;
use plugin\admin\app\model\Role;
use plugin\admin\app\model\Rule;
use support\exception\BusinessException;
use support\Request;
use support\Response;
use Throwable;

/**
 * 角色管理
 */
class RoleController extends Crud
{
    /**
     * 不需要鑑權的方法
     * @var array
     */
    protected $noNeedAuth = ['select'];

    /**
     * @var Role
     */
    protected $model = null;

    /**
     * 建構子
     */
    public function __construct()
    {
        $this->model = new Role;
    }

    /**
     * 瀏覽
     * @return Response
     * @throws Throwable
     */
    public function index(): Response
    {
        return raw_view('role/index');
    }

    /**
     * 查詢
     * @param Request $request
     * @return Response
     * @throws BusinessException
     */
    public function select(Request $request): Response
    {
        $id = $request->get('id');
        [$where, $format, $limit, $field, $order] = $this->selectInput($request);
        $limit = 100000;
        $role_ids = Auth::getScopeRoleIds(true);
        if (!$id) {
            $where['id'] = ['in', $role_ids];
        } elseif (!in_array($id, $role_ids)) {
            throw new BusinessException('無權限');
        }
        $query = $this->doSelect($where, $field, $order);
        return $this->doFormat($query, $format, $limit);
    }

    /**
     * 插入
     * @param Request $request
     * @return Response
     * @throws BusinessException
     * @throws Throwable
     */
    public function insert(Request $request): Response
    {
        if ($request->method() === 'POST') {
            $data = $this->insertInput($request);
            $pid = $data['pid'] ?? null;
            if (!$pid) {
                return $this->json(1, '請選擇父級角色組');
            }
            if (!Auth::isSuperAdmin() && !in_array($pid, Auth::getScopeRoleIds(true))) {
                return $this->json(1, '父級角色群組超出權限範圍');
            }
            $this->checkRules($pid, $data['rules'] ?? '');

            $id = $this->doInsert($data);
            return $this->json(0, 'ok', ['id' => $id]);
        }
        return raw_view('role/insert');
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
            return raw_view('role/update');
        }
        [$id, $data] = $this->updateInput($request);
        $is_supper_admin = Auth::isSuperAdmin();
        $descendant_role_ids = Auth::getScopeRoleIds();
        if (!$is_supper_admin && !in_array($id, $descendant_role_ids)) {
            return $this->json(1, '無資料權限');
        }

        $role = Role::find($id);
        if (!$role) {
            return $this->json(1, '資料不存在');
        }
        $is_supper_role = $role->rules === '*';

        // 超級角色群組不允許更改rules pid 欄位
        if ($is_supper_role) {
            unset($data['rules'], $data['pid']);
        }

        if (key_exists('pid', $data)) {
            $pid = $data['pid'];
            if (!$pid) {
                return $this->json(1, '請選擇父級角色組');
            }
            if ($pid == $id) {
                return $this->json(1, '父級不能是自己');
            }
            if (!$is_supper_admin && !in_array($pid, Auth::getScopeRoleIds(true))) {
                return $this->json(1, '父級超出權限範圍');
            }
        } else {
            $pid = $role->pid;
        }

        if (!$is_supper_role) {
            $this->checkRules($pid, $data['rules'] ?? '');
        }

        $this->doUpdate($id, $data);

        // 刪除所有子角色群組中已經不存在的權限
        if (!$is_supper_role) {
            $tree = new Tree(Role::select(['id', 'pid'])->get());
            $descendant_roles = $tree->getDescendant([$id]);
            $descendant_role_ids = array_column($descendant_roles, 'id');
            $rule_ids = $data['rules'] ? explode(',', $data['rules']) : [];
            foreach ($descendant_role_ids as $role_id) {
                $tmp_role = Role::find($role_id);
                $tmp_rule_ids = $role->getRuleIds();
                $tmp_rule_ids = array_intersect(explode(',',$tmp_role->rules), $tmp_rule_ids);
                $tmp_role->rules = implode(',', $tmp_rule_ids);
                $tmp_role->save();
            }
        }

        return $this->json(0);
    }

    /**
     * 刪除
     * @param Request $request
     * @return Response
     * @throws BusinessException
     */
    public function delete(Request $request): Response
    {
        $ids = $this->deleteInput($request);
        if (in_array(1, $ids)) {
            return $this->json(1, '無法刪除超級管理員角色');
        }
        if (!Auth::isSuperAdmin() && array_diff($ids, Auth::getScopeRoleIds())) {
            return $this->json(1, '無刪除權限');
        }
        $tree = new Tree(Role::get());
        $descendants = $tree->getDescendant($ids);
        if ($descendants) {
            $ids = array_merge($ids, array_column($descendants, 'id'));
        }
        $this->doDelete($ids);
        return $this->json(0);
    }

    /**
     * 取得角色權限
     * @param Request $request
     * @return Response
     */
    public function rules(Request $request): Response
    {
        $role_id = $request->get('id');
        if (empty($role_id)) {
            return $this->json(0, 'ok', []);
        }
        if (!Auth::isSuperAdmin() && !in_array($role_id, Auth::getScopeRoleIds(true))) {
            return $this->json(1, '角色群組超出權限範圍');
        }
        $rule_id_string = Role::where('id', $role_id)->value('rules');
        if ($rule_id_string === '') {
            return $this->json(0, 'ok', []);
        }
        $rules = Rule::get();
        $include = [];
        if ($rule_id_string !== '*') {
            $include = explode(',', $rule_id_string);
        }
        $items = [];
        foreach ($rules as $item) {
            $items[] = [
                'name' => $item->title ?? $item->name ?? $item->id,
                'value' => (string)$item->id,
                'id' => $item->id,
                'pid' => $item->pid,
            ];
        }
        $tree = new Tree($items);
        return $this->json(0, 'ok', $tree->getTree($include));
    }

    /**
     * 檢查權限字典是否合法
     * @param int $role_id
     * @param $rule_ids
     * @return void
     * @throws BusinessException
     */
    protected function checkRules(int $role_id, $rule_ids)
    {
        if ($rule_ids) {
            $rule_ids = explode(',', $rule_ids);
            if (in_array('*', $rule_ids)) {
                throw new BusinessException('非法資料');
            }
            $rule_exists = Rule::whereIn('id', $rule_ids)->pluck('id');
            if (count($rule_exists) != count($rule_ids)) {
                throw new BusinessException('權限不存在');
            }
            $rule_id_string = Role::where('id', $role_id)->value('rules');
            if ($rule_id_string === '') {
                throw new BusinessException('資料超出權限範圍');
            }
            if ($rule_id_string === '*') {
                return;
            }
            $legal_rule_ids = explode(',', $rule_id_string);
            if (array_diff($rule_ids, $legal_rule_ids)) {
                throw new BusinessException('資料超出權限範圍');
            }
        }
    }


}
