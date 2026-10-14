import { describe, it, expect } from 'vitest';
import { add } from '@tskata/01-string-calculator.ts';

describe('kata 01 — string calculator', () => {
  it('rule 1: empty, one and two numbers', () => {
    expect(add('')).toBe(0);
    expect(add('1')).toBe(1);
    expect(add('1,2')).toBe(3);
  });

  it('rule 2: any amount of numbers', () => {
    expect(add('1,2,3,4')).toBe(10);
    expect(add('10,20,30,40,50')).toBe(150);
  });

  it('rule 3: newlines are delimiters', () => {
    expect(add('1\n2,3')).toBe(6);
  });

  it('rule 4: custom single-char delimiter', () => {
    expect(add('//;\n1;2')).toBe(3);
    expect(add('//;\n1;2,3\n4')).toBe(10);
  });

  it('rule 5: negatives throw with every negative listed', () => {
    expect(() => add('-1')).toThrow('negatives not allowed: -1');
    expect(() => add('1,-2,3,-4')).toThrow('negatives not allowed: -2, -4');
  });

  it('rule 6: numbers above 1000 are ignored', () => {
    expect(add('2,1001')).toBe(2);
    expect(add('2,1000')).toBe(1002);
  });

  it('rule 7: multi-character delimiters', () => {
    expect(add('//[***]\n1***2***3')).toBe(6);
  });

  it('rule 8: several delimiters', () => {
    expect(add('//[*][%%]\n1*2%%3')).toBe(6);
  });

  it('treats delimiters as literal text, not regex', () => {
    expect(add('//[.]\n1.2')).toBe(3);
    expect(add('//[|]\n1|2|3')).toBe(6);
    expect(add('//$\n4$5')).toBe(9);
  });

  it('rejects malformed numbers', () => {
    expect(() => add('1,,2')).toThrow();
    expect(() => add('1,a')).toThrow();
  });
});
