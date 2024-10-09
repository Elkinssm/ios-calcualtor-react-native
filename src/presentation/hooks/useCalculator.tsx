import {useRef, useState} from 'react';

enum Operator {
  sum,
  substract,
  multiply,
  divide,
}

export const useCalculator = () => {
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');

  const lastOperation = useRef<Operator>();

  const buildNumber = (numberString: string) => {
    if (number.includes('.') && numberString === '.') {
      return;
    }
    if (number.startsWith('0') || number.startsWith('-0')) {
      //Punto decimal
      if (numberString === '.') {
        setNumber(number + numberString);
        return;
      }

      //Evaluar si es otro cero y hay un punto
      if (numberString === '0' && number.includes('.')) {
        setNumber(number + numberString);
        return;
      }

      //Evaluar si es diferente de cero y no tiene punto
      if (numberString !== '0' && !number.includes('.')) {
        setNumber(numberString);
        return;
      }

      //Evitar 0000.0
      if (numberString === '0' && !number.includes('.')) {
        return;
      }
    }

    return setNumber(number + numberString);
  };

  const clear = () => {
    setNumber('0');
    setPrevNumber('0');
  };

  const deleteOperation = () => {
    let currentSign = '';
    let temporalNumber = number;

    if (number.includes('-')) {
      currentSign = '-';
      temporalNumber = number.substring(1);
    }
    if (temporalNumber.length > 1) {
      return setNumber(currentSign + temporalNumber.slice(0, -1));
    }
    setNumber('0');
  };

  const toggleSign = () => {
    if (number.includes('-')) {
      setNumber(number.replace('-', ''));
    } else {
      setNumber('-' + number);
    }
  };

  const setLastNumber = () => {
    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }
    setNumber('0');
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const sumOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.sum;
  };

  const substractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.substract;
  };

  const calculateResult = () => {
    const num1 = Number(number);
    const num2 = Number(prevNumber);

    switch (lastOperation.current) {
      case Operator.sum:
        setNumber(`${num1 + num2}`);
        break;
      case Operator.substract:
        setNumber(`${num2 - num1}`);
        break;
      case Operator.multiply:
        setNumber(`${num1 * num2}`);
        break;
      case Operator.divide:
        setNumber(`${num2 / num1}`);
        break;
      default:
        throw new Error('Operación not implemented');
    }
    setPrevNumber('0');
  };

  return {
    //Properties
    number,
    buildNumber,
    prevNumber,
    //Methods
    clear,
    toggleSign,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    sumOperation,
    substractOperation,
    calculateResult,
  };
};
