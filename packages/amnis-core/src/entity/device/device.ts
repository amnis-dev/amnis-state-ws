import { uid } from '../../uid.js';
import type { Device, DeviceBase, DeviceCreator } from './device.types.js';

export const deviceKey = 'device';

export const deviceBase: DeviceBase = {
  ip: '127.0.0.1',
  name: 'Unknown Device',
  publicKey: '',
};

export const deviceCreator = (
  device: DeviceCreator,
): Device => ({
  ...deviceBase,
  ...device,
  $id: uid(deviceKey),
});
