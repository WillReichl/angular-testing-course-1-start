import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {
  // "specification", i.e. "test"
  it('should add two numbers', () => {
    const calculator = new CalculatorService(new LoggerService());

    const result = calculator.add(2, 2);

    expect(result).toBe(4, 'Unexpected addition result');
  });

  it('should subtract numbers', () => {
    const calculator = new CalculatorService(new LoggerService());

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'Unexpected subtraction result');
  });
});
