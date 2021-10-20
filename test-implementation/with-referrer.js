import { StickyParameters, ReferrerParameters } from '../src';
import config from './default-config.js';

const relevantParameters = ['akttyp', 'med', 'aktnr', 'wnr'];

const indexParameter = 'akttyp';

const getReferrerParameterValues = (referrerString) => {
    let processOtherFields = false;

    if (/^https?:\/\/(www\.)?google\.[a-z]+/.test(referrerString)) {
        referrerString = 'google';
        processOtherFields = true;
    } else if (/^https?:\/\/(www\.)?bing\.[a-z]+/.test(referrerString)) {
        referrerString = 'bing';
        processOtherFields = true;
    } else if (
        /^https?:\/\/(\w+\.)?search\.yahoo\.[a-z]/.test(referrerString)
    ) {
        referrerString = 'yahoo search';
        processOtherFields = true;
    } else if (/^https?:\/\/(www\.)?ecosia\.org/.test(referrerString)) {
        referrerString = 'ecosia';
        processOtherFields = true;
    } else if (/^https?:\/\/(www\.)?duckduckgo\.com/.test(referrerString)) {
        referrerString = 'duckduckgo';
        processOtherFields = true;
    }

    if (processOtherFields) {
        return [
            {
                name: 'akttyp',
                value: 'organic search',
            },
            {
                name: 'med',
                value: referrerString,
            },
            {
                name: 'aktnr',
                value: '123',
            },
            {
                name: 'wnr',
                value: '456',
            },
        ];
    } else {
        return [
            {
                name: 'med',
                value: referrerString,
            },
        ];
    }
};

const directParameters = [
    {
        name: 'akttyp',
        value: 'direkt',
    },
    {
        name: 'aktnr',
        value: '789',
    },
    {
        name: 'wnr',
        value: '000111',
    },
];

const sp = new StickyParameters(...config);
new ReferrerParameters(
    sp,
    indexParameter,
    relevantParameters,
    getReferrerParameterValues,
    directParameters
);
