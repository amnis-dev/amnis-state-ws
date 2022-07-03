export interface CoreConfig {
  /**
   * Max character length for name strings.
   */
  nameLength: number;

  /**
   * Max character length for title strings.
   */
  titleLength: number;

  /**
   * Maximum image size in bytes.
   */
  imageMaxSize: number;

  /**
   * Maximum image width in pixels.
   */
  imageMaxWidth: number;

  /**
   * Maximum image height in pixels.
   */
  imageMaxHeight: number;

  /**
   * Maximum autio size in bytes.
   */
  audioMaxSize: number;

  /**
   * Maximum video size in bytes.
   */
  videoMaxSize: number;
}

export const coreConfig: CoreConfig = {
  nameLength: 32,
  titleLength: 64,
  imageMaxSize: 10485760,
  imageMaxWidth: 4096,
  imageMaxHeight: 4096,
  audioMaxSize: 26214400,
  videoMaxSize: 52428800,
};

export function coreConfigure(config: Partial<CoreConfig>) {
  Object.keys(config).forEach((key) => {
    const confKey = key as keyof CoreConfig;
    if (coreConfig[confKey] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      coreConfig[confKey] = config[confKey];
    }
  });
}
