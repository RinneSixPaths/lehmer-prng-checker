class PRNG {
    constructor (seed) {
        
        this.m = Math.floor(Math.random() * (10 ** 101));
        this.a = Math.floor(Math.random() * (10 ** 90));
        if (seed % 1 === 0) {
            this.seed = seed % this.m;
            if (this.seed <= 0) {
                this.seed += this.m;
            }
        } else {
            throw new Error('Seed value must be an integer.');
        }
    }

    next () {
        return this.seed = this.seed * this.a % this.m;
    }

    nextFloat () {
        return (this.next() - 1) / this.m;
    }
}

const seed = Math.floor(Math.random() * (10 ** 100));
const randomNumberGenerator = new PRNG(seed);
const AMOUNT_OF_RANDOM_NUMBERS = 10000000;
const generateAmountOfValues = (
    amountV = 1,
    randomGenerator = {
        nextFloat: () => Date.now(),
    },
) => {
    const mockArrayOfRandomNumbers = new Array(amountV);
    return mockArrayOfRandomNumbers.fill(0).map(() => randomGenerator.nextFloat());
}

const getPeriodLength = (Xv = 1, arrayOfRandomNumbers = []) => {
    const i2 = arrayOfRandomNumbers.findIndex(randomNumber => randomNumber == Xv);
    arrayOfRandomNumbers.splice((arrayOfRandomNumbers.length - 1), 1);
    const i1 = arrayOfRandomNumbers.findIndex(randomNumber => randomNumber == Xv);
    console.log(i2);
    console.log(i1);
    return (i2 - i1) || arrayOfRandomNumbers.length;
}

const arrayOfRandomNumbers = generateAmountOfValues(AMOUNT_OF_RANDOM_NUMBERS, randomNumberGenerator);
const Xv = arrayOfRandomNumbers[arrayOfRandomNumbers.length - 1];
const periodLength = getPeriodLength(
    Xv,
    arrayOfRandomNumbers,
);

console.log(periodLength);

const checkByIndirectEvidence = (amounOfNumbers = 1) => {
    const pairs = [];
    for (let index = 0; index < amounOfNumbers; index++) {
        if ((index + 1)%2 === 0) {
            pairs.push([arrayOfRandomNumbers[index - 1], arrayOfRandomNumbers[index]]);
        }
    }

    const filtered = pairs.filter((twoValArray) => (
        twoValArray[0]**2 + twoValArray[1]**2 < 1
    ));
    const isPlaneNumbers = 2 * filtered.length / amounOfNumbers;
    console.log(isPlaneNumbers);
    console.log(Math.PI / 4);
    return isPlaneNumbers;
}

checkByIndirectEvidence(AMOUNT_OF_RANDOM_NUMBERS);

const getAperiodicLength = (arrayOfRandomNumbers = [], periodLength = 1) => {
    const minimalIndex = arrayOfRandomNumbers.findIndex(randomValue => randomValue === randomValue + periodLength);
    return (minimalIndex + 1 + periodLength);
}

const aperiodicLength = getAperiodicLength(arrayOfRandomNumbers, periodLength);
console.log(aperiodicLength);

const printHistogram = (x = []) => {
    var trace = {
        x: x,
        type: 'histogram',
    };
    var data = [trace];
    Plotly.newPlot('myDiv', data);
}

printHistogram(arrayOfRandomNumbers);