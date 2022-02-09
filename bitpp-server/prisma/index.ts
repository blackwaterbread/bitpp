import { PrismaClient } from "@prisma/client";
import { SYMBOL_BTCUSD, SYMBOL_ETHUSD } from "../src/lib/constants";
const prisma = new PrismaClient();
const CONCERNED_SYMBOLS = [SYMBOL_BTCUSD, SYMBOL_ETHUSD];

async function main() {
    try {
        //
    }
    catch (e) {
        console.error(e);
    }
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export default main;