<?php

namespace plugin\admin\app\model;

use plugin\admin\app\model\Base;

/**
 * @property integer $id ID(主鍵)
 * @property string $username 使用者名稱
 * @property string $nickname 暱稱
 * @property string $password 密碼
 * @property string $avatar 頭像
 * @property string $email 信箱
 * @property string $mobile 智慧型手機
 * @property string $created_at 創建時間
 * @property string $updated_at 更新時間
 * @property string $login_at 登入時間
 * @property string $roles 角色
 * @property integer $status 狀態 0正常 1禁用
 */
class Admin extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_admins';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';
    
    
    
    
}
