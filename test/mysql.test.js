const { checkNomor } = require("../src/middleware/db-command");
const dotenv = require('dotenv');
dotenv.config();

const numberTesting = process.env.HPMASTER;


describe('Mysql Function Testing', () => {
    test("[CheckNomor] Return Must be an true", async () => {
        let arr = await checkNomor(numberTesting);
        expect(arr.valid).toBe(true)
    });

    test("[CheckNomor] Return Must be an false", async () => {
        let arr = await checkNomor('xxx');
        expect(arr.valid).toBe(false)
    });
});

