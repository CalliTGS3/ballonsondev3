function Senden () {
    radio.sendString("LZ:" + Laufzeit)
    radio.sendString("UZ:" + Uhrzeit)
    radio.sendString("LA:" + Laenge)
    radio.sendString("BR:" + Breite)
    radio.sendString("HO:" + Hoehe)
    radio.sendString("TE:" + Temperatur)
    radio.sendString("LU:" + Luftdruck)
    radio.sendString("LF:" + Luftfeuchte)
    radio.sendString("LI:" + Lichtstaerke)
    radio.sendString("UV:" + Ultraviolett)
    radio.sendString("IR:" + Infrarot)
}
function Messen () {
    Laufzeit = input.runningTime() / 1000
    Uhrzeit = NEO6M_GPS.getGPSTime()
    Breite = NEO6M_GPS.getGPSLatitude()
    Laenge = NEO6M_GPS.getGPSLongitude()
    Hoehe = NEO6M_GPS.getAltitude()
    Temperatur = PCT2075.getTemp()
    Luftdruck = BME280.pressure(BME280_P.Pa)
    Luftfeuchte = BME280.humidity()
    Lichtstaerke = SI1145.readLight()
    Ultraviolett = VEML6070.getUVI()
    Infrarot = SI1145.readInfraRed()
}
function initFlightMode () {
    let buf: Buffer = pins.createBuffer(44);
buf.fill(0)
buf[0] = 181
    buf[1] = 98
    buf[2] = 6
    buf[3] = 36
    buf[4] = 36
    buf[6] = 255
    buf[7] = 255
    buf[8] = 6
    buf[9] = 3
    buf[14] = 16
    buf[15] = 39
    buf[18] = 5
    buf[20] = 250
    buf[22] = 250
    buf[24] = 100
    buf[26] = 44
    buf[27] = 1
    buf[42] = 22
    buf[43] = 220
    NEO6M_GPS.writeConfig(buf, 44)
}
function Speichern () {
    Qwiic_Openlog.writeString(Laufzeit.toString())
    Qwiic_Openlog.writeString(";" + Uhrzeit.substr(0, 6))
    Qwiic_Openlog.writeString(";" + Laenge)
    Qwiic_Openlog.writeString(";" + Breite)
    Qwiic_Openlog.writeString(";" + Hoehe)
    Qwiic_Openlog.writeString(";" + Temperatur.toString())
    Qwiic_Openlog.writeString(";" + Luftdruck.toString())
    Qwiic_Openlog.writeString(";" + Luftfeuchte.toString())
    Qwiic_Openlog.writeString(";" + Lichtstaerke.toString())
    Qwiic_Openlog.writeString(";" + Ultraviolett.toString())
    Qwiic_Openlog.writeLine(";" + Infrarot.toString())
}
let Hoehe = ""
let Breite = ""
let Laenge = ""
let Uhrzeit = ""
let Infrarot = 0
let Ultraviolett = 0
let Lichtstaerke = 0
let Luftfeuchte = 0
let Luftdruck = 0
let Temperatur = 0
let Laufzeit = 0
radio.setGroup(1)
VEML6070.Init()
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
BME280.PowerOn()
NEO6M_GPS.initGPS(SerialPin.C17, SerialPin.C16, BaudRate.BaudRate9600)
NEO6M_GPS.setGPSFormat(GPS_Format.DEG_DEC)
initFlightMode()
Qwiic_Openlog.createFile("SondeV3.log")
Qwiic_Openlog.openFile("SondeV3.log")
let Arbeiten = true
for (let Warten = 0; Warten <= 9; Warten++) {
    basic.showNumber(9 - Warten)
    basic.pause(1000)
}
Qwiic_Openlog.writeString("Laufzeit;Uhrzeit;Laenge;Breite;Hoehe;")
Qwiic_Openlog.writeString("Temperatur;Luftdruck;Luftfeuchte;")
Qwiic_Openlog.writeLine("Helligkeit;Ultraviolett;Infrarot")
while (true) {
    if (Arbeiten) {
        Messen()
        Speichern()
        Senden()
        basic.pause(800)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
        basic.pause(200)
        basic.clearScreen()
    }
}
