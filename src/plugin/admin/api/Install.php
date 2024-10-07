<?php

namespace plugin\admin\api;

class Install
{
    /**
     * 安裝
     *
     * @param $version
     * @return void
     */
    public static function install($version)
    {
        // 導入選單
        Menu::import(static::getMenus());
    }

    /**
     * 解除安裝
     *
     * @param $version
     * @return void
     */
    public static function uninstall($version)
    {
        // 刪除選單
        foreach (static::getMenus() as $menu) {
            Menu::delete($menu['name']);
        }
    }

    /**
     * 更新
     *
     * @param $from_version
     * @param $to_version
     * @param $context
     * @return void
     */
    public static function update($from_version, $to_version, $context = null)
    {
        // 刪除不用的選單
        if (isset($context['previous_menus'])) {
            static::removeUnnecessaryMenus($context['previous_menus']);
        }
        // 匯入新選單
        Menu::import(static::getMenus());
    }

    /**
     * 更新前資料收集等
     *
     * @param $from_version
     * @param $to_version
     * @return array|array[]
     */
    public static function beforeUpdate($from_version, $to_version)
    {
        // 在更新前取得舊選單，透過context傳遞給 update
        return ['previous_menus' => static::getMenus()];
    }

    /**
     * 取得選單
     *
     * @return array|mixed
     */
    public static function getMenus()
    {
        clearstatcache();
        if (is_file($menu_file = __DIR__ . '/../config/menu.php')) {
            $menus = include $menu_file;
            return $menus ?: [];
        }
        return [];
    }

    /**
     * 刪除不需要的選單
     *
     * @param $previous_menus
     * @return void
     */
    public static function removeUnnecessaryMenus($previous_menus)
    {
        $menus_to_remove = array_diff(Menu::column($previous_menus, 'name'), Menu::column(static::getMenus(), 'name'));
        foreach ($menus_to_remove as $name) {
            Menu::delete($name);
        }
    }

}