import { regexIpv4v6 } from '../regex';
import type { Device, DeviceString } from './device.types';

/**
 * Verifies a device ip.
 */
export function deviceVerifyIp(ip: string): boolean {
  return regexIpv4v6.test(ip);
}

/**
 * Stringifies a device.
 */
export function deviceStringify(device: Device): DeviceString {
  return `${device.ip}:${device.system}` as DeviceString;
}

/**
 * Parses a device string into an object.
 */
export function deviceParse(deviceString: DeviceString): Device | undefined {
  const [ip, system] = deviceString.split(':');

  if (typeof ip !== 'string') {
    return undefined;
  }

  if (!deviceVerifyIp(ip)) {
    return undefined;
  }

  if (typeof system !== 'string') {
    return undefined;
  }

  return {
    ip,
    system,
  };
}
