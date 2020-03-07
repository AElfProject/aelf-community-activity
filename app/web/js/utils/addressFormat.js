import {
  ADDRESS_INFO
} from '../constant/constant';

export default function addressFormat(address) {
  return `${ADDRESS_INFO.prefix}_${address}_${ADDRESS_INFO.suffix}`;
}
