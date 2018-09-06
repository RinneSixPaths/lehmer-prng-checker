class PRNG {
    constructor (seed) {
        
        this.m = +m.value || Math.floor(5678911 * (2 ** 32));
        this.a = +a.value || Math.floor(5678 * (2 ** 31));
        if (seed % 1 === 0) {
            this.seed = seed % this.m;
            if (this.seed <= 0) {
                this.seed += this.m;
            }
        } else {
            throw new Error('Initial value must be an integer.');
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
    arrayOfRandomNumbers.push(...slicedValue);
    return (i2 - i1) >= 0 ? (i2 - i1) : arrayOfRandomNumbers.length;
}

const checkByIndirectEvidence = (amounOfNumbers = 1, arrayOfRandomNumbers = []) => {
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
    return isPlaneNumbers;
}

const getAperiodicLength = (arrayOfRandomNumbers = [], periodLength = 1) => {
    let minimalIndex = arrayOfRandomNumbers.findIndex(randomValue => randomValue === randomValue + periodLength);
    if (!~minimalIndex) {
        minimalIndex++;
    }
    return (minimalIndex + periodLength);
}

const produceBorderValues = (range = 1, interval = 1) => {
    const onePiece = range / interval;
    const borderValues = new Array(interval);
    return borderValues.fill(0).map((_value, index) => ({
            min: +(index * onePiece).toFixed(2),
            max: +((index + 1) * onePiece).toFixed(2),
        })
    );
}

const getHitAmount = (range = {}, array = []) => (
    array.filter(randomValue => randomValue >= range.min && randomValue <= range.max).length
)

const getExpectedValue = (arr = [], amount = 1) => (
    arr.reduce((prev, curr) => prev + curr, 0) / amount
)

const getDispersion = (arr = [], amount = 1, expectedvalue = 1) => (
    arr.reduce((prev, curr) => (prev - expectedvalue) ** 2 + (curr - expectedvalue) ** 2, 0) / (amount - 1)
)

const printHistogram = (array = [], labels = []) => {
    const canvas = document.getElementById("myChart");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Histogram Point',
                data: array,
                borderWidth: 1,
                backgroundColor: '#FCD9B6'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
        }
    });
}

function compute() {
    const seed = +r0.value || Math.floor(56789 * (2 ** 23));
    const randomNumberGenerator = new PRNG(seed);
    const AMOUNT_OF_RANDOM_NUMBERS = 10000000;
    const arrayOfRandomNumbers = generateAmountOfValues(AMOUNT_OF_RANDOM_NUMBERS, randomNumberGenerator);
    const Xv = arrayOfRandomNumbers[arrayOfRandomNumbers.length - 1];
    const periodLength = getPeriodLength(Xv, arrayOfRandomNumbers);
    const plainNumbers = checkByIndirectEvidence(AMOUNT_OF_RANDOM_NUMBERS, arrayOfRandomNumbers);
    const aperiodicLength = getAperiodicLength(arrayOfRandomNumbers, periodLength);
    const maxRandomNumber = arrayOfRandomNumbers.reduce((prev, curr) => ( prev > curr ? prev : curr ));
    const minRandomNumber = arrayOfRandomNumbers.reduce((prev, curr) => ( prev < curr ? prev : curr ));
    const floatRange = maxRandomNumber - minRandomNumber;
    const INTERVAL_AMOUNT = 20;
    const intervalLength = floatRange / INTERVAL_AMOUNT;
    const borderValues = produceBorderValues(1, INTERVAL_AMOUNT);
    const hitsAmount = borderValues.map(range => getHitAmount(range, arrayOfRandomNumbers));
    const histogramPoints = hitsAmount.map(amount => amount / AMOUNT_OF_RANDOM_NUMBERS);
    const expectedvalue = getExpectedValue(arrayOfRandomNumbers, AMOUNT_OF_RANDOM_NUMBERS);
    const dispersion = getDispersion(arrayOfRandomNumbers, AMOUNT_OF_RANDOM_NUMBERS, expectedvalue);
    const meanSquareDeviation = Math.sqrt(dispersion);

    printHistogram(histogramPoints, hitsAmount);

    /*Logger part*/
    console.clear();
    console.log("Косвенное проверочное отношение ", plainNumbers);
    console.log("п / 4", Math.PI / 4);
    console.log("Длина периода ", periodLength);
    console.log("Длина апериодичности ", aperiodicLength);
    console.log("Математическое ожидание ", expectedvalue);
    console.log("Дисперсия ", dispersion);
    console.log("Среднее квадратичное отклонение ", meanSquareDeviation);

    /*Accessable values*/
    window.seed = seed;
    window.arrayOfRandomNumbers = arrayOfRandomNumbers;
    window.periodLength = periodLength;
    window.plainNumbers = plainNumbers;
    window.aperiodicLength = aperiodicLength;
    window.maxRandomNumber = maxRandomNumber;
    window.minRandomNumber = minRandomNumber;
    window.floatRange = floatRange;
    window.intervalLength = intervalLength;
    window.borderValues = borderValues;
    window.hitsAmount = hitsAmount;
    window.histogramPoints = histogramPoints;
    window.expectedvalue = expectedvalue;
    window.dispersion = dispersion;
    window.meanSquareDeviation = meanSquareDeviation;
}
