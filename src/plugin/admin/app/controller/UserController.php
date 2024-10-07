<?php

namespace plugin\admin\app\controller;

use plugin\admin\app\controller\Base;
use plugin\admin\app\controller\Crud;
use plugin\admin\app\model\User;
use support\exception\BusinessException;
use support\Request;
use support\Response;
use Throwable;

/**
 * 用戶管理 
 */
class UserController extends Crud
{
    
    /**
     * @var User
     */
    protected $model = null;

    /**
     * 建構子
     * @return void
     */
    public function __construct()
    {
        $this->model = new User;
    }

    /**
     * 瀏覽
     * @return Response
     * @throws Throwable
     */
    public function index(): Response
    {
        return raw_view('user/index');
    }

    /**
     * 插入
     * @param Request $request
     * @return Response
     * @throws BusinessException|Throwable
     */
    public function insert(Request $request): Response
    {
        if ($request->method() === 'POST') {
            return parent::insert($request);
        }
        return raw_view('user/insert');
    }

    /**
     * 更新
     * @param Request $request
     * @return Response
     * @throws BusinessException|Throwable
     */
    public function update(Request $request): Response
    {
        if ($request->method() === 'POST') {
            return parent::update($request);
        }
        return raw_view('user/update');
    }

}
