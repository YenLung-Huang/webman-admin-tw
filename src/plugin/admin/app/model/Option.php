<?php

namespace plugin\admin\app\model;


/**
 * @property integer $id (主鍵)
 * @property string $name 键
 * @property mixed $value 值
 * @property string $created_at 創建時間
 * @property string $updated_at 更新時間
 */
class Option extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_options';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

}
