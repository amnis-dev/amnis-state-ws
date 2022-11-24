/**
 * Key object  for storing cryptographic keys.
 */
export interface Key {
  /**
   * A unique id name that identifies this encryption.
   */
  id: string;

  /**
   * Human friendly name for the cyptographic key
   */
  name: string;

  /**
   * Type of encryption algorithm.
   */
  format: 'raw' | 'pkcs8' | 'spki' | 'jwk';

  /**
   * Determines if the key is wrapped.
   */
  wrapped: boolean;

  /**
   * The encoded value of the encryption key.
   */
  value: string;
}
