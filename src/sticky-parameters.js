/**
 * External Link Parameter - rewritten for node-ish
 *
 * @license http://www.gnu.org/licenses/gpl.txt
 */

import Uri from 'jsuri';

const SCHEMA_BLACKLIST = ['javascript:', 'tel:', 'mailto:', '#'];

export class StickyParameters {
    /**
     *
     * @param {Array} allowedParameters
     * @param {Array} domains
     * @param {Boolean} applyToExternalLinks
     *
     * @return StickyParameters
     */
    constructor(
        allowedParameters = [],
        domains = [],
        applyToExternalLinks = false
    ) {
        this.allowedParameters = allowedParameters;
        this.allowedDomains = domains;
        this.applyToExternalLinks = applyToExternalLinks;

        return this;
    }

    /**
     *
     * @param {Uri | null} url
     */
    run(url = null) {
        this.url = url || new Uri(window.location.href);

        this.parameters = StickyParameters.parseParameters(
            this.url,
            this.allowedParameters
        );
        if (this.parameters.length) {
            this.updateAnchorElements();
        }
    }

    /**
     * Check whether the url in the href attribute qualifies for parameter
     * modification.
     * Returns false for
     *    - empty href attribute
     *    - schemas / protocols that are blacklisted
     *    - external links if applyToExternalLinks is false
     *    - external links if there is a domain whitelist and the external domain
     *      is not whitelisted
     *
     * @param {Uri} uri
     * @param nodeValue
     * @returns {boolean}
     */
    hrefQualifies(uri, nodeValue) {
        // Do not process anchors with an empty href attribute, these are most
        // likely JS triggers
        if (!uri.path() && !uri.host()) {
            return false;
        }
        // Check if the schema is blacklisted
        // @NB not using uri.scheme() or uri.protocol() because it ignores
        // mailto, javascript and similar
        if (StickyParameters.isBlacklistedSchema(uri.uriParts.source)) {
            return false;
        }

        const isExternal = StickyParameters.isExternalDomain(uri);

        // Check if there is a domain restriction
        // if ((this.isInternalDomain(uri) && !this.applyToInternalLinks) ||
        if (isExternal && !this.applyToExternalLinks) {
            return false;
        }

        // Also check the original href.nodeValue, since browsers mangle values
        // like "#" to the fully qualified domain & path
        if (StickyParameters.isBlacklistedSchema(nodeValue)) {
            return false;
        }

        const isAllowedDomain = StickyParameters.inArray(
            uri.host(),
            this.allowedDomains
        );

        // Check if the external domain is white listed
        if (isExternal && !isAllowedDomain && this.allowedDomains.length > 0) {
            return false;
        }

        return true;
    }

    /**
     * Utility: Checks if an element is in an array
     *
     * @param {*}     needle    The element to look for
     * @param {Array} haystack  The array in which to search
     * @returns {boolean}
     */
    static inArray(needle, haystack) {
        const length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (haystack[i] === needle) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param {string} url
     * @returns {boolean}
     */
    static isBlacklistedSchema(url) {
        let isBlacklisted = false;
        for (let index in SCHEMA_BLACKLIST) {
            if (url.indexOf(SCHEMA_BLACKLIST[index]) === 0) {
                isBlacklisted = true;
            }
        }
        return isBlacklisted;
    }

    /**
     *
     * @param {Uri} uri
     * @returns {boolean}
     */
    static isExternalDomain(uri) {
        return (
            window.location.host !== uri.host() &&
            window.location.hostname !== uri.host()
        );
    }

    /**
     * Writes an array of all parameters in the query string that are also on
     * the list of allowed parameters to StickyParameters.parameters.
     * The parameters are returned as an object of the format
     * {name: "$parameterName", value: "$paramValue"}
     *
     * @param {Uri} url
     * @param {array} allowedParameters
     * @returns {array} parameters as an array of {name, value}
     */
    static parseParameters(url, allowedParameters) {
        let parameters = [];

        allowedParameters.forEach((parameter) => {
            if (url.getQueryParamValue(parameter)) {
                parameters.push({
                    name: parameter,
                    value: url.getQueryParamValue(parameter),
                });
            }
        });

        return parameters;
    }

    /**
     * Finds all <a /> element on the current site and runs updateSingleAnchor
     * on each.
     */
    updateAnchorElements() {
        const anchors = document.querySelectorAll('a');
        // we'll not use an Array.from po(l|n)yfill here, let's keep it "simple"
        // does babel transform for..of?
        for (let i = 0; i < anchors.length; i++) {
            this.updateSingleAnchor(anchors[i]);
        }
        // const anchorArray = arrayFrom(anchors);
        // anchorArray.forEach(anchor => {
        // 	this.updateSingleAnchor(anchor);
        // })
    }

    /**
     * Takes a single <a/> element and applies the updated href attribute to it
     *
     * @param {HTMLAnchorElement} element
     */
    updateSingleAnchor(element) {
        const originalHref = element.href || '';
        const originalHrefNodeValue =
            (element.attributes.href && element.attributes.href.nodeValue) ||
            '';
        const uri = new Uri(originalHref);

        const newHref = this.updateHref(uri, originalHrefNodeValue);

        if (newHref) {
            element.href = newHref;
        }
    }

    /**
     * Puts allowed query parameters on a url
     *
     * @param {Uri} uri
     * @param nodeValue
     * @returns {null|string}
     */
    updateHref(uri, nodeValue) {
        let updatedHref = null;
        if (this.hrefQualifies(uri, nodeValue)) {
            this.parameters.forEach((parameter) => {
                uri.replaceQueryParam(parameter.name, parameter.value);
            });
            updatedHref = uri.toString();
        }
        return updatedHref;
    }
}
