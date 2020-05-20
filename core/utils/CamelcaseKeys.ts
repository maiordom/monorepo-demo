import camelcaseKeysPackage from 'camelcase-keys';

export default function camelcaseKeys<T>(
  data: any,
  stopPaths: string[] = []
): T {
  if (data) {
    return camelcaseKeysPackage(data, { deep: true, stopPaths }) as any;
  }

  return data;
}
