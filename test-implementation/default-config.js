export default [
    /**
     * List of allowed parameters. Can be a comma-separated string or a plain array.
     * @type String | Array
     */
    [
        'purl',
        'med',
        'campaign',
        'adword',
        'cmp',
        'utm_id'
    ],
    /**
     * List of allowed domains. Domains not listed here will not have parameters passed.
     * @type String | Array
     */
    [
        'localhost',
        'example.net',
    ],
    /**
     * Pass parameters externally (to other domains than the current one if whitelisted)
     * @type boolean
     * @default false
     */
    true,
];
