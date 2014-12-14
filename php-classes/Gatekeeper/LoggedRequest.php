<?php

namespace Gatekeeper;

class LoggedRequest extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'requests_log';
    public static $singularNoun = 'logged request';
    public static $pluralNoun = 'logged requests';

    public static $fields = [
        'CreatorID' => null,
        'EndpointID' => [
            'type' => 'uint',
            'index' => true
        ],
        'KeyID' => [
            'type' => 'uint',
            'notnull' => false,
            'index' => true
        ],
        'ClientIP' => 'uint',
        'Method',
        'Path',
        'Query' => 'clob',
        'ResponseTime' => [
            'type' => 'mediumint',
            'unsigned' => true
        ],
        'ResponseCode' => [
            'type' => 'smallint',
            'unsigned' => true
        ],
        'ResponseBytes' => [
            'type' => 'mediumint',
            'unsigned' => true
        ]
    ];

    public static $relationships = [
        'Endpoint' => [
            'type' => 'one-one',
            'class' => Endpoint::class
        ],
        'Key' => [
            'type' => 'one-one',
            'class' => Key::class
        ]
    ];
}
