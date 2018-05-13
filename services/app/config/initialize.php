<?php


// determine root paths
$coreRoot = '{{#if cfg.core.root}}{{ cfg.core.root }}{{else}}{{ pkg.path }}/core{{/if}}';
$siteRoot = '{{#if cfg.site.root}}{{ cfg.site.root }}{{else}}{{ pkg.path }}/site{{/if}}';


// load bootstrap PHP code
require("${coreRoot}/bootstrap.inc.php");


// load core
Site::initialize($siteRoot, $_SERVER['HTTP_HOST'], [
    {{~#eachAlive bind.database.members as |member|~}}
        {{~#if @first}}
    'database' => [
        'host' => '{{member.sys.ip}}',
        'port' => '{{member.cfg.port}}',
        'username' => '{{member.cfg.username}}',
        'password' => '{{member.cfg.password}}',
        'database' => '{{../cfg.database.name}}'
    ]
        {{~/if~}}
    {{~/eachAlive}}
]);
