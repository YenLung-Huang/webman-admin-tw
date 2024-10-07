<?php

namespace plugin\admin\app\model;


/**
 * @property integer $id 主鍵(主鍵)
 * @property string $name 角色名
 * @property string $rules 權限
 * @property string $created_at 創建時間
 * @property string $updated_at 更新時間
 * @property integer $pid 上級id
 */
class Role extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_roles';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * @return mixed
     */
    public function getRuleIds()
    {
        return $this->rules ? explode(',', $this->rules) : [];
    }

}
