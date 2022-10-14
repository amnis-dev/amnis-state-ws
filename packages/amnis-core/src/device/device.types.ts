/* eslint-disable no-shadow */
/**
 * Unique symbol for a serialized device string;
 */
enum DeviceBrand { _ = '' }

/**
 * A string that represents a device.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DeviceString = DeviceBrand & string;

export interface Device {
  /**
   * IP address of the device.
   */
  ip: string;

  /**
   * System of the device.
   */
  system: string;
}
