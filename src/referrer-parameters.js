import { StickyParameters } from './sticky-parameters.js';
import Uri from 'jsuri';

export class ReferrerParameters {
    /**
     * @typedef {{name: string, value: string}} ParameterDefinition
     *
     * @param {StickyParameters} spToRunWhenInitialized
     *
     * @param {string} indexParameter
     *        If this parameter is already present in the current URL, referrer
     *        parsing will be skipped.
     *
     * @param {string[]} relevantParameters
     *        Only the values of these parameters will be parsed.
     *
     * @param {(string) => ParameterDefinition[]} getReferrerParameterValues
     *        A callback that receives the page's referrer string and should
     *        return an array of parameter objects to be set on the current
     *        location.
     *
     * @param {ParameterDefinition[]} directParamsToSet
     *        An array of parameters to be set when the indexParameter is not
     *        present and no referrer is set.
     */
    constructor(
        spToRunWhenInitialized,
        indexParameter = 'parseReferrer',
        relevantParameters = ['parseReferrer'],
        getReferrerParameterValues = () => [],
        directParamsToSet = []
    ) {
        this.url = new Uri(window.location.href);
        this.directParamsToSet = directParamsToSet;
        this.getReferrerParameterValues = getReferrerParameterValues;

        const params = StickyParameters.parseParameters(
            this.url,
            relevantParameters
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
            paramsToBeSet = this.directParamsToSet;
        }

        paramsToBeSet.forEach((param) => {
            this.url.addQueryParam(param.name, param.value);
        });

        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', this.url.toString());
        }
    }
}
