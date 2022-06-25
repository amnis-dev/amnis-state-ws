/**
 * Unique symbol for a serialized device string;
 */
declare const deviceSymbol: unique symbol;

/**
 * A string that represents a device.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DeviceString = string & {[deviceSymbol]: never};

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
