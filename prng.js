class PRNG {
    constructor (seed) {
        
        this.m = Math.floor(5678911 * (2 ** 32));
        this.a = Math.floor(5678 * (2 ** 31));
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
    const i1 = arrayOfRandomNumbers.findIndex(randomNumber => randomNumber == Xv);
    const slicedValue = arrayOfRandomNumbers.splice(i1, 1);
    const i2 = arrayOfRandomNumbers.findIndex(randomNumber => randomNumber == Xv);
    console.log(i1);
    console.log(i2);
    arrayOfRandomNumbers.push(...slicedValue);
    return (i2 - i1) >= 0 ? (i2 - i1) : arrayOfRandomNumbers.length + 1;
}

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

const getAperiodicLength = (arrayOfRandomNumbers = [], periodLength = 1) => {
    let minimalIndex = arrayOfRandomNumbers.findIndex(randomValue => randomValue === randomValue + periodLength);
    if (!~minimalIndex) {
        minimalIndex++;
    }
    return (minimalIndex + periodLength);
}

const printHistogram = (array = []) => {
    const trace = {
        x: array,
        type: 'histogram',
        histnorm: 'probability',
    };
    const data = [trace];
    Plotly.newPlot('myDiv', data);
}

const seed = Math.floor(56789 * (2 ** 23));
const randomNumberGenerator = new PRNG(seed);
const AMOUNT_OF_RANDOM_NUMBERS = 10000000;
const arrayOfRandomNumbers = generateAmountOfValues(AMOUNT_OF_RANDOM_NUMBERS, randomNumberGenerator);
const Xv = arrayOfRandomNumbers[arrayOfRandomNumbers.length - 1];
const periodLength = getPeriodLength(Xv, arrayOfRandomNumbers);

console.log(periodLength);
checkByIndirectEvidence(AMOUNT_OF_RANDOM_NUMBERS);
const aperiodicLength = getAperiodicLength(arrayOfRandomNumbers, periodLength);
console.log("Апериодичная длина ", aperiodicLength);
//printHistogram(arrayOfRandomNumbers);
//HISTOGRAM COOKING
const maxRandomNumber = arrayOfRandomNumbers.reduce((prev, curr) => ( prev > curr ? prev : curr ));
const minRandomNumber = arrayOfRandomNumbers.reduce((prev, curr) => ( prev < curr ? prev : curr ));
const floatRange = maxRandomNumber - minRandomNumber;
const INTERVAL_AMOUNT = 20;
const intervalLength = floatRange / INTERVAL_AMOUNT;

const produceBorderValues = (range = 1, interval = 1) => {
    const onePiece = range / interval;
    const borderValues = new Array(interval);
    return borderValues.fill(0).map((_value, index) => ({
            min: +(index * onePiece).toFixed(2),
            max: +((index + 1) * onePiece).toFixed(2),
        })
    );
}

const borderValues = produceBorderValues(1, INTERVAL_AMOUNT);
const getHitAmount = (range = {}, array = []) => (
    array.filter(randomValue => randomValue >= range.min && randomValue <= range.max).length
)
const hitsAmount = borderValues.map(range => getHitAmount(range, arrayOfRandomNumbers));
const histogramPoints = hitsAmount.map(amount => amount / AMOUNT_OF_RANDOM_NUMBERS);
printHistogram(histogramPoints);
