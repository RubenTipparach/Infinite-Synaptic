let math = require('mathjs'); //http://mathjs.org/docs/reference/

/*
 * summary:
 *  This contains the libary for nueral network statistic analysis.
 */
module.exports =
class NeuronMath {

    /*
     * summary:
     *  This method normalizes a dataset.
     * parameters:
     *  value - the current value.
     *  mean - the average from a column of floats.
     *  std - the standard deviation.
     */
    static getZScore(value, mean, std) {
        return (value - mean) / std;
    }

    /*
     * summary:
     *  This returns the mean value.
     * parameters:
     *  colname - the column name that you want to find the mean for.
     *  dataset - the dataset to extract the column from
     */
    static getMean(colname, dataset) {
        let vals = [];

        for (let i = 0; i < dataset.length; i++) {
            vals.push(dataset[i][colname]);
        }

        return math.mean(vals);
    }

    /*
     * summary:
     *  This returns standard deviation.
     * parameters:
     *  colname - the column name that you want to find the mean for.
     *  dataset - the dataset to extract the column from
     */
    static getStd(colname, dataset) {
        let vals = [];

        for (let i = 0; i < dataset.length; i++) {
            vals.push(dataset[i][colname]);
        }

        return math.std(vals);
    }
}