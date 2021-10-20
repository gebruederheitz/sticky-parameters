import { StickyParameters, ReferrerParameters } from '../src';
import config from './default-config.js';

const sp = new StickyParameters(...config);
export default new ReferrerParameters(sp);
