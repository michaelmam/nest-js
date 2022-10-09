import { getRndInteger, isPrime } from "./number";

describe('number utils', () => {
  it('should return integer number', () => {
    const randomNumber = getRndInteger(0, 100);
    expect(randomNumber).toBe(Math.round(randomNumber));
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(100);
  });
  it('should check number is prime or not', () => {
    expect(isPrime(10)).toBe(false);
    expect(isPrime(80)).toBe(false);
    expect(isPrime(11)).toBe(true);
    expect(isPrime(53)).toBe(true);
  });
});
