//% weight=20 color=#0855AA icon="O" block="PCT2075"
namespace PCT2075 {

    const PCT2075_ADDR = 0x37
    const PCT2075_TEMP_REG = 0

    //% blockId="PCT2075_TEMP" block="Ermittle Temperatur"
    export function getTemp (): number {
        pins.i2cWriteNumber(PCT2075_ADDR, PCT2075_TEMP_REG, NumberFormat.UInt8LE, true)
        let buffer = pins.i2cReadBuffer(PCT2075_ADDR, 2, false)
        let temp = (buffer[0] << 8) | buffer[1];
        return temp / 256.0;
    }
}