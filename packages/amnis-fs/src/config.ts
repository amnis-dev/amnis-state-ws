let FS_MAX_IMAGE_SIZE = 2048;

try {
  if (process?.env) {
    if (process.env.AMNIS_FS_MAX_IMAGE_SIZE) {
      FS_MAX_IMAGE_SIZE = parseInt(process.env.AMNIS_FS_MAX_IMAGE_SIZE, 10);
    }
  }
} catch (error) {
  /**
   * A catch means we're running in an environment other than node.
   */
}

export const fsConfig = {
  FS_MAX_IMAGE_SIZE,
};

export type FsConfig = typeof fsConfig;

export function fsConfigure(config: Partial<FsConfig>) {
  Object.keys(config).forEach((key) => {
    const confKey = key as keyof FsConfig;
    if (fsConfig[confKey] !== undefined) {
      fsConfig[confKey] = config[confKey] as number;
    }
  });
}
