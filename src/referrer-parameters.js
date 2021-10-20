import { StickyParameters } from './sticky-parameters.js';
import Uri from 'jsuri';

const DEFAULT_RELEVANT_PARAMETERS = ['akttyp', 'med', 'aktnr', 'wnr'];

const DEFAULT_INDEX_PARAMETER = 'akttyp';

const getDefaultReferrerParameterValues = (refstring) => {
    let processOtherFields = false;

    if (/^https?:\/\/(www\.)?google\.[a-z]+/.test(refstring)) {
        refstring = 'google';
        processOtherFields = true;
    } else if (/^https?:\/\/(www\.)?bing\.[a-z]+/.test(refstring)) {
        refstring = 'bing';
        processOtherFields = true;
    } else if (/^https?:\/\/(\w+\.)?search\.yahoo\.[a-z]/.test(refstring)) {
        refstring = 'yahoo search';
        processOtherFields = true;
    } else if (/^https?:\/\/(www\.)?ecosia\.org/.test(refstring)) {
        refstring = 'ecosia';
        processOtherFields = true;
    } else if (/^https?:\/\/(www\.)?duckduckgo\.com/.test(refstring)) {
        refstring = 'duckduckgo';
        processOtherFields = true;
    }

    if (processOtherFields) {
        return [
            {
                name: 'akttyp',
                value: 'organische suche',
            },
            {
                name: 'med',
                value: refstring,
            },
            {
                name: 'aktnr',
                value: '84834',
            },
            {
                name: 'wnr',
                value: '04393672',
            },
        ];
    } else {
        return [
            {
                name: 'med',
                value: refstring,
            },
        ];
    }
};

export class ReferrerParameters {
    constructor(
        spToRunWhenInitialized,
        indexParameter = DEFAULT_INDEX_PARAMETER,
        relevantParamters = DEFAULT_RELEVANT_PARAMETERS,
        getReferrerParameterValues = getDefaultReferrerParameterValues
    ) {
        this.url = new Uri(window.location.href);
        this.getReferrerParameterValues = getReferrerParameterValues;

        const params = StickyParameters.parseParameters(
            this.url,
            relevantParamters
        );

        if (!params.find((el) => el.name === indexParameter)) {
            this.updateParameters();
        }

        spToRunWhenInitialized.run(this.url);
    }

    updateParameters() {
        const ref = new Uri(document.referrer);

        let paramsToBeSet = [];

        if (document.referrer && ref.host() !== this.url.host()) {
            paramsToBeSet = this.getReferrerParameterValues(document.referrer);
        } else {
            paramsToBeSet = [
                {
                    name: 'akttyp',
                    value: 'direkt',
                },
                {
                    name: 'aktnr',
                    value: '84834',
                },
                {
                    name: 'wnr',
                    value: '04393689',
                },
            ];
        }

        paramsToBeSet.forEach((param) => {
            this.url.addQueryParam(param.name, param.value);
        });

        // ~~in case there's a form on the current page~~, update the current location
        // results in a race condition; reading the referrer from out of the
        // scripts would be safer...
        if (
            // document.querySelector('[data-eloqua-formid]')?.length &&
            window.history &&
            window.history.replaceState
        ) {
            window.history.replaceState({}, '', this.url.toString());
        }
    }
}
