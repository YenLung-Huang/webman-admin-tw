<?php

namespace plugin\admin\app\model;

use plugin\admin\app\model\Base;

/**
 * @property integer $id 主鍵(主鍵)
 * @property string $name 名稱
 * @property string $url url
 * @property integer $admin_id 管理者
 * @property integer $user_id 用戶
 * @property integer $file_size 檔案大小
 * @property string $mime_type mime類型
 * @property integer $image_width 圖片寬度
 * @property integer $image_height 圖片高度
 * @property string $ext 副檔名
 * @property string $storage 存放位置
 * @property string $created_at 上傳時間
 * @property string $category 類別
 * @property string $updated_at 更新時間
 */
class Upload extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wa_uploads';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';
    
    
    
    
}
