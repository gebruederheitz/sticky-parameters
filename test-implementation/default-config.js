export default [
    /**
     * List of allowed parameters. Can be a comma-separated string or a plain array.
     * @type String | Array
     */
    [
        'purl',
        'akttyp',
        'med',
        'aktnr',
        'wnr',
        'trs',
        'chorid',
        'campaign',
        'adword',
        'newsletter',
        'cmp',
    ],
    /**
     * List of allowed domains. Domains not listed here will not have parameters passed.
     * @type String | Array
     */
    [
        'haufe-eloqua-tests.ghdev.de',
        'umantis.dev.ghdev2.de',
        'umantis-test.haufe.com',
        'umantis.com',
        'www.umantis.com',
        'shop.haufe.de',
        'whitepaper.haufe.de',
        'haufe-online-training.de',
        'www.haufe-online-training.de',
        'onlinetraining.haufe.de',
        'elq.haufe.com',
        'customer.umantis.com',
        'utm.stage.t3p.adns.de',
        'utm.gh.dev.t3p.adns.de',
        'localhost',
        'suite.haufe.de',
        'compliance.haufe.de',
        'arbeitszeugnis.haufe.de',
        'www.myonboarding.de',
    ],
    /**
     * Pass parameters externally (to other domains than the current one if whitelisted)
     * @type boolean
     * @default false
     */
    true,
];
