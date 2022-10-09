export const isPrime = (num: number): boolean => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++)
    if(num % i === 0) return false;
  return num > 1;
}

export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) ) + min;
}
