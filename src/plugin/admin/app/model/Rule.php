<?php

namespace plugin\admin\app\model;

use plugin\admin\app\model\Base;

/**
 * @property integer $id 主鍵(主鍵)
 * @property string $title 標題
 * @property string $icon 圖示
 * @property string $key 標識
 * @property integer $pid 上級選單
 * @property string $created_at 創建時間
 * @property string $updated_at 更新時間
 * @property string $href url
 * @property integer $type 類型
 * @property integer $weight 排序
 */
class Rule extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_rules';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';
    
    
    
    
}
