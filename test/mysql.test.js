const { checkNomor,saveNomor } = require("../src/middleware/db-command");
const dotenv = require('dotenv');
const uniqid = require('uniqid'); 
dotenv.config();
const numberTesting = process.env.HPMASTER;
jest.setTimeout(10000);


describe('Mysql Function Testing', () => {
    test("[CheckNomor] Return Must be an true", async () => {
        let arr = await checkNomor(numberTesting);
        expect(arr.valid).toBe(true)
    });

    test("[CheckNomor] Return Must be an false", async () => {
        let arr = await checkNomor('xxx');
        expect(arr.valid).toBe(false)
    });

    test("[saveNomor] Return must be an true", async () => {
        let id = uniqid();
        let arr = await saveNomor(`000-${id}`,"testing");
        expect(arr.valid).toBe(true);
    });

    test("[saveNomor] Return must be an id of integer", async () => {
        let id = uniqid();
        let arr = await saveNomor(`000-${id}`,"testing");
        expect(typeof arr.data.id).toBe("number");
    });

    test("[saveNomor] Return must be an true", async () => {
        let arr = await saveNomor(`${numberTesting}`,"testing");
        expect(arr.valid).toBe(false);
    });
});

