# Sticky Parameters
## with Referrer Parameters

_Forward certain URL parameters to allowlisted or non-denylisted links on the current site._

---

A utility script to make URL parameters "sticky" across pages / domains.
Works by appending allowlisted parameters to anchor elements on the the current 
page linking to allowed domains.

#### Before
```html
<a href="https://example.com/test?param=true">Link</a>
<a href="https://my-site.com/test?param=true">Link</a>
<a href="https://example.net/test?param=true">Link</a>
```

#### Request
`https://my-site.com/with/sticky/parameters?id=123&color=blue&email=gh@example.com`

#### Config

```yaml
allowedDomains: 
  - example.com
allowedParameters:
  - id
  - email
applyToExternalLinks:
  true
```

#### Result

```html
<a href="https://example.com/test?param=true&id=123&email=gh@example.com">Link</a>
<a href="https://my-site.com/test?param=true&id=123&email=gh@example.com">Link</a>
<a href="https://example.net/test?param=true">Link</a>
```


## Installation

```shell
> npm i @gebruederheitz/sticky-parameters
```


## Usage

### TL;DR: ES modules

```js
import { StickyParameters } from '@gebruederheitz/sticky-parameters';

const sp = new StickyParameters(
    ['allowed', 'parameters'],
    ['allowed', 'domains.com'],
    false   // pass to external links
);

sp.run();
```

### Configuration

The Sticky Parameters class expects three configuration parameters:

| Type | Description | Default |
| --- | --- | --- |
| String / String[] | A list of parameters that may be passed to qualifying links | [] |
| String / String[] | A list of domains that may receive the allowed parameters | [] |
| bool | Whether to allow modifying external links (true) or internal links only | false |

### UMD builds

UMD builds can be found in `/dist/sticky-parameters.umd.js`.

```html
<script src="/node_modules/@gebruederheitz/sticky-parameters/dist/sticky-parameters.umd.js"></script>

<script>
    const sp = new stickyParameters.StickyParameters(params, domains, false);
    window.addEventListener('load', () => {
        sp.run();
    });
</script>
```


## Referrer Parameters

This special module allows to set further parameters depending on the `document.referrer`
provided in order to measure SEO performance.

### Usage

```js
import { StickyParameters, ReferrerParameters } from '@gebruederheitz/sticky-parameters';

const sp = new StickyParameters(params, domains, true);
new ReferrerParameters(
    // RP will call .run() on the provided SP at the right time:
    sp,
    // If this parameter is set, processing will be skipped:
    'indexParameter',
    // Only these parameters will be parsed from the current URL:
    ['indexParameter', 'utm_id', 'source'],  
    // When a referrer is set, this callback will allow you to set your parameters
    // to the appropriate values based on the referrer string:
    (referrerString) => [
        {name: 'source', value: referrerString}
    ],
    // These parameters will be set when the indexParameter is not set and no
    // referrer string could be read from the browser:
    [
        {name: 'source', value: 'direct'},
    ]
); 
```

#### UMD / CommonJS

```html
<head>
    <script src="/node_modules/@gebruederheitz/sticky-parameters/dist/sticky-parameters.umd.js"></script>
</head>
<body>

<!-- ... -->

    <script>
        const sp = new stickyParameters.StickyParameters(params, domains, false);
        new stickyParameters.ReferrerParameters(sp, indexP, parsedPs, getPsByRef, directPs);
    </script>
</body>
```


## Development

Take a look at the `Makefile` for an overview of the most common tasks needed
during development. To quickly get the project up and running use

```shell
# Install dependencies, run a watch task and host demo at localhost:5000:
$> make
# or, more explicitly:
$> make dev
```

To publish a new release you can use `release-it` with

```shell
$> make release
# or
$> npm run release
```
