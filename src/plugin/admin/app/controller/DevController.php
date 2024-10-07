<?php

namespace plugin\admin\app\controller;

use support\Request;
use support\Response;
use Throwable;

/**
 * 開發輔助相關
 */
class DevController
{
    /**
     * 表單建置
     * @return Response
     * @throws Throwable
     */
    public function formBuild()
    {
        return raw_view('dev/form-build');
    }

}
