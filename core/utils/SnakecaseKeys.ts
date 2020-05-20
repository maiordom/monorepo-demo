import snakecaseKeys from 'snakecase-keys';

export default function<T>(params): T {
  return snakecaseKeys(params) as any;
}
