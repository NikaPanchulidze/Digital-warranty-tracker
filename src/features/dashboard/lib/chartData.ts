export function hasChartData(data: Array<{ value: number }>) {
  return data.some((entry) => Number(entry.value) > 0);
}
