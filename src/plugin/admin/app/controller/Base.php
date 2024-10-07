<?php

namespace plugin\admin\app\controller;

use support\Model;
use support\Response;

/**
 * 基礎控制器
 */
class Base
{

    /**
     * @var Model
     */
    protected $model = null;

    /**
     * 無須登入及鑑權的方法
     * @var array
     */
    protected $noNeedLogin = [];

    /**
     * 需要登入無須鑑權的方法
     * @var array
     */
    protected $noNeedAuth = [];

    /**
     * 資料限制
     * null 不做限制，任何管理員都可以查看該表的所有資料
     * auth 管理員能看到自己以及自己的子管理員插入的資料
     * personal 管理員只能看到自己插入的資料
     * @var string
     */
    protected $dataLimit = null;

    /**
     * 資料限製字段
     */
    protected $dataLimitField = 'admin_id';

    /**
     * 返回格式化json資料
     *
     * @param int $code
     * @param string $msg
     * @param array $data
     * @return Response
     */
    protected function json(int $code, string $msg = 'ok', array $data = []): Response
    {
        return json(['code' => $code, 'data' => $data, 'msg' => $msg]);
    }

    protected function success(string $msg = '成功', array $data = []): Response
    {
        return $this->json(0, $msg, $data);
    }

    protected function fail(string $msg = '失敗', array $data = []): Response
    {
        return $this->json(1, $msg, $data);
    }
}
