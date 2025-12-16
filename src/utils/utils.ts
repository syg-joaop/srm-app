//returns YYYY-MM-DD
export function dataAtualPrimeiroDiaMes(): string {
  const date = new Date();
  date.setMonth(date.getMonth());
  date.setDate(1);
  return date.toISOString().split("T")[0];
}

//format YYYY-MM-DD
export function dataAtualUltimoDiaMes(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.toISOString().split("T")[0];
}
