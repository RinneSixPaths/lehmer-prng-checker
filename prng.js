class PRNG {
    /**
     * Create a pseudo-random number generator. The seed must be an integer.
     *
     * Uses the Lehmer / Park-Miller PRNG
     * https://en.wikipedia.org/wiki/Lehmer_random_number_generator
     *
     *  Utilizes MINSTD parameters where:
     *  n = 2^31 − 1 = 2,147,483,647 (a Mersenne prime)
     *  g = 7^5 = 16,807 (a primitive root modulo)
     */
    constructor (seed) {
        
        this.m = Math.floor(Math.random() * (10 ** 101));
        this.a = Math.floor(Math.random() * (10 ** 90));
        // Verify that seed is an integer
        if (seed % 1 === 0) {
            // Initialize seed with a modulo by n
            this.seed = seed % this.m;
            if (this.seed <= 0) {
                // If seed is negative or zero, add n
                this.seed += this.m;
            }
        } else {
            throw new Error('Seed value must be an integer.');
        }
    }

    /** Return a pseudo-random value between 1 and n */
    next () {
        // x_k+1 = (g * x_k) % n
        return this.seed = this.seed * this.a % this.m;
    }

    /** Return a pseudo-random floating point number in range [0, 1] */
    nextFloat () {
        // We know that result of next() will be 1 to n (inclusive)
        return (this.next() - 1) / this.m;
    }
}

const seed = Math.floor(Math.random() * (10 ** 100));//Math.floor(Math.random() * (10 ** 12));
const randomNumberGenerator = new PRNG(seed);
const AMOUNT_OF_RANDOM_NUMBERS = 5000000;
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
    //TODO: SLICE ARRAY AFTER VALUE WAS FOUND
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

/*const pairs = arrayOfRandomNumbers.map((value, index, arr) => {
    if ((index + 1)%2 === 0) {
        return [arr[index], value];
    }
});*/
const pairs = [];
for (let index = 0; index < AMOUNT_OF_RANDOM_NUMBERS; index++) {
    if ((index + 1)%2 === 0) {
        pairs.push([arrayOfRandomNumbers[index - 1], arrayOfRandomNumbers[index]]);
    }
}

const filtered = pairs.filter((twoValArray) => (
    twoValArray[0]**2 + twoValArray[1]**2 < 1
));