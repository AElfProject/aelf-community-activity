import NightElfCheckTemp from './NightElfCheck';
import AelfBridgeCheck from '../aelfBridge/AelfBridgeCheck';
import isMobile from 'ismobilejs';

const isPhone = isMobile(window.navigator).phone;

export const NightElfCheck = isPhone ? AelfBridgeCheck : NightElfCheckTemp;
