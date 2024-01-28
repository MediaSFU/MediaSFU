/**
 * Display size constraints for video capture.
 */

// Landscape display sizes
let QnHDCons = { width: { ideal: 320 }, height: { ideal: 180 } }
let sdCons = { width: { ideal: 640 }, height: { ideal: 360 } }
let hdCons = { width: { ideal: 1280 }, height: { ideal: 720 } }

// Portrait display sizes
let QnHDConsPort = { width: { ideal: 180 }, height: { ideal: 320 } }
let sdConsPort = { width: { ideal: 360 }, height: { ideal: 640 } }
let hdConsPort = { width: { ideal: 720 }, height: { ideal: 1280 } }

// Neutral (Square) display sizes
let QnHDConsNeu = { width: { ideal: 240 }, height: { ideal: 240 } }
let sdConsNeu = { width: { ideal: 480 }, height: { ideal: 480 } }
let hdConsNeu = { width: { ideal: 960 }, height: { ideal: 960 } }

//frameRates for video capture
let QnHDFrameRate = 5
let sdFrameRate = 10
let hdFrameRate = 15
let screenFrameRate = 30

export {
    QnHDCons,
    sdCons,
    hdCons,
    QnHDConsPort,
    sdConsPort,
    hdConsPort,
    QnHDConsNeu,
    sdConsNeu,
    hdConsNeu,
    QnHDFrameRate,
    sdFrameRate,
    hdFrameRate,
    screenFrameRate
};
