<?php

namespace plugin\admin\app\model;

use plugin\admin\app\model\Base;

/**
 * @property integer $id 主鍵(主鍵)
 * @property string $username 使用者名稱
 * @property string $nickname 暱稱
 * @property string $password 密碼
 * @property string $sex 性別
 * @property string $avatar 頭像
 * @property string $email 信箱
 * @property string $mobile 智慧型手機
 * @property integer $level 等級
 * @property string $birthday 生日
 * @property integer $money 餘額
 * @property integer $score 積分
 * @property string $last_time 登入時間
 * @property string $last_ip 登入ip
 * @property string $join_time 註冊時間
 * @property string $join_ip 註冊ip
 * @property string $token token
 * @property string $created_at 創建時間
 * @property string $updated_at 更新時間
 * @property integer $role 角色
 * @property integer $status 禁用
 */
class User extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_users';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';
    
    
    
    
}
