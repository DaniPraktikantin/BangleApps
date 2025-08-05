function setupFonts() {
  Graphics.prototype.setFontNummeralByLERegular = function() {
    return this.setFontCustom(
      E.toString(require('heatshrink').decompress(atob('ABUCAwv+AokP/AGEv/gAocH/4MEn4TEgP/4AgEE4t/+ATFGhcfKpcHAokBJww6Ej4MEg5AEHIOAM5IYLgBmFn5fEh/8MpYYEgFwZLP/AAQ3Bh4GDFYIFDHAIMEIoN/AwfggYTFj4FDOQIME4DjBAAR5Bn47ENIIWBGIOAAQQQBGgSWCGgYMBEgI0BRQU/GgSwBEgI0CRwQ0CEAV/GgRsBEgQPCEgYPBGkwTBCAJpEv6eqAAY0CaYgTEc4oMBDQhLBAH4A/ACN8AokP+AGEVwQACaYIMEn7jBAAS4BCYkPcYIADv4nEgbJFj7TFAoYdBGgIACGIL0E8DtEDQMPfYt/CYg0BAAY0FE4IgFCYgMBE4hSEABMHKIRzCAQI9BIIMP/BeCPQJEBJQXABQIMCC4KeBNYXwNIPBNIn+IYRpC+AgCNIWDNIn8j/4v5pC8H/4Y0E/0fGgnwGgoiBGgYiBGggiBGgj4CGgb4CGgQiBGgj4CGgYkBGl6cCGgYABGgacCGgacCGgYABGgb5CGgYABGgggBGgQTC4E/8DyEfYQAMnEAmEAuEAg/wgfAh4gCEoI4BwA0BgY0DT2o0wj40FaoI0Dw40Fn40E8I0FcgI0Ev40E4Y0WdwTcCcAIACGgQADegYABGgQADGgQACGgQGD+ATFgAnEBgIAMJ4JMBAwQnBFYIABEAQ/BBgZTBDIgaDNIRnBAAJpCCYRBDBgQTCE43AAwRnDAAZaFPAJPDDYI0DIYQ0CF4YgEaIRkEGgatBGn40FUoYbCfYgMFEQIMEGwL0E4AlBCYirCfYQgEGwITEEAInEPAgAJOoKDBjhID+EDEAnAn/gGgZ/BwD0C/kfDgN/AwPgAIIPBAAJFBEAf4n5pE4JpE/0PNIX8n/wv5pC8P/wY0Dh40E/F/GgnDGgn+j40E+A0Fw40/GiwABGgbnDGgTICGgSgCGgbcCGgJGBfYUH/i0Cc4XAE4WAgF8bgQMBABruCJwMAEoRBCBghVBBghpCAwfwNIIADwA/CCYYME8AgEE4JnCLgRpBHYieEPoKeEGgTTDGgLTDGgTTDGgTTCGgTTDGgTTDGn40GTwY0BTwg0BTwmHTwg0BTwg0BTwZGC/40BIwITCdwIcBBgcDbgYMBACc8AYUcEAQFBgIDBn/AAwMf4EDGAIQBHAKcBAwM/AYJRBBgXAg4TCn5VDBgXwNIOABIIDBTgMAQAIDBTgICBEAIwCBgItBGgQMBDoIwCBgQ0CBgY0BSIIMBGgS+CgA0BBgJsCaIQwBJYQMEGgIMDGgPfBgY4BWARsCWAg0BBgjRCXoZMBBgbKGj56CGgafCGgYMEGgIMDGgIMEGgJtBGgbGCGgYMEh4MEE4IMEgBtCDQYFEAChwBAALGCAoRyCBgZFBBgiGBTwQAB+CeCCYaeCAAJzBEAngTwQACTwQ7EB4N/CAPAGgMD/EfGgQEB4A0D4H+CAI0BAgPwn40CAgOBGgeB/hFBGgIEBF4I0/GgienAAY0CaYgTEc4oMBDQnAAwIASLgIeBv0AJAX4g5BBNIR4B8BpDCAJpD/ieDAwPhNIqeDE4SeDAAPDNIn+aYk/+CeD4P/w7TDh40E+F/GgmDGgn8j40E8A0Fg40/GgzTDTwi0CTwYABegqeEdwSeCfYbTCAAI0CAAeACYggBE4mADQnwgAAbgQCB4AGCnkAh4FCgYrBN4IABj5FB8AGCBQM/AoQKBgJOBAAMeBAJOBAANAHJIA=='))),
      46,
      atob("DhAqKykpKSkpKyoqDA=="),
      53|65536
    );
  };
}
const currentFont = "NummeralByLERegular";

const colors = {
  bg: "#000000",
  fg: "#FFFFFF",
  fg2: "#757575"
};

// App state. Includes swipe logic, timers, current view, etc.
let state = {
  wischfunktion: 1,     // which main screen is shown (0=date, 1=time, etc)
  wischfunktionZ: 1,    // which overlay/modal (battery, flashlight, etc)
  window: 1,
  windowZ: 1,
  swipeDone: false,
  loongpress: false,
  touchStartTime: 0,
  frequenz: "WAITING FOR BPM",
  zeitanzeigen: true,
  interval: null,
  drawInterval: null,
};

let lastHRMSave = 0;

// Helper for formatting timestamps as ISO strings
function formatTimestamp(ts) {
  return new Date(ts).toISOString();
}

// Step counter offset (resets every day)
let dailyStepOffset = 0;
let dailyStepDate = null;
function resetDailyStepsIfNeeded() {
  let todayStr = (new Date()).toISOString().slice(0,10);
  if (dailyStepDate !== todayStr) {
    dailyStepOffset = Bangle.getStepCount();
    dailyStepDate = todayStr;
  }
}

// For sport session mode: collect HRM (heart rate) data
let sportSessionActive = false;
let hrmSessionData = [];
let sessionStartTime = null;

// Canvas/display settings (cache centerX/centerY for easier positioning)
const display = {
  width: g.getWidth(),
  height: g.getHeight(),
  centerX: g.getWidth() / 2,
  centerY: g.getHeight() / 2,
};

// ============= DRAW FUNCTIONS =============

// Draw current date in large font
function drawDate() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);
  g.setFont(currentFont, 2);
  g.setFontAlign(-1, 0);
  const date = new Date();
  const dateStr = ("0" + date.getDate()).slice(-2);
  const monthStr = ("0" + (date.getMonth() + 1)).slice(-2);
  const tagWidth = g.stringWidth(dateStr);
  const startX = display.centerX - (tagWidth / 2);
  let y = display.centerY - 35 - 8;
  g.setColor(colors.fg);
  g.drawString(dateStr, startX, y);
  g.setFontAlign(0, 0);
  g.setColor(colors.fg2);
  g.drawString(monthStr, display.centerX, y + 87);
}

// Draw current time: hours/minutes
function drawTime() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);
  g.setFontAlign(0, 0).setFont(currentFont, 2);
  const date = new Date();
  const hStr = ("0" + date.getHours()).substr(-2);
  const mStr = ("0" + date.getMinutes()).substr(-2);
  let x = display.centerX, y = display.centerY - 35;
  y -= 8;
  g.setColor(colors.fg);
  g.drawString(hStr, x, y);
  y += 87;
  g.setColor(colors.fg2);
  g.drawString(mStr, x, y);
}

// Draw current time: minutes/seconds
function drawSeconds() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);
  g.setFontAlign(0, 0).setFont(currentFont, 2);
  const date = new Date();
  const mStr = ("0" + date.getMinutes()).substr(-2);
  const sStr = ("0" + date.getSeconds()).substr(-2);
  let x = display.centerX, y = display.centerY - 35;
  y -= 8;
  g.setColor(colors.fg);
  g.drawString(mStr, x, y);
  y += 87;
  g.setColor(colors.fg2);
  g.drawString(sStr, x, y);
}

// Draw step count (with dynamic font size)
function drawSteps() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);

  resetDailyStepsIfNeeded();
  const stepCount = Math.max(0, Bangle.getStepCount() - dailyStepOffset).toString();

  let fontSize = 46;
  g.setFont("Vector", fontSize);
  let w = g.stringWidth(stepCount);
  // Shrink font to fit display
  while (w > display.width - 24 && fontSize > 20) {
    fontSize -= 2;
    g.setFont("Vector", fontSize);
    w = g.stringWidth(stepCount);
  }

  g.setColor(colors.fg);
  g.setFontAlign(0, 0);
  g.drawString(stepCount, display.centerX, display.centerY - 18);

  g.setFont("Vector", 44);
  g.setColor("#FFFFFF");
  g.setFontAlign(0, 0);
  g.drawString("STEPS", display.centerX, display.centerY + 44);
}

// Heart rate mode – starts HRM sensor, draws BPM or 'WAITING'
function drawHeartRate() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);

  // Start HRM sensor if needed
  if (!drawHeartRate.hrmActive) {
    Bangle.setHRMPower(true);
    Bangle.removeAllListeners("HRM");
    Bangle.on("HRM", function(hrm) {
      if (hrm && hrm.bpm && hrm.bpm > 0) {
        state.frequenz = hrm.bpm + " BPM";
      } else {
        state.frequenz = "WAITING FOR BPM";
      }
      draw();
    });
    drawHeartRate.hrmActive = true;
  }

  if (typeof state.frequenz === "string" && state.frequenz.indexOf("WAITING") === 0) {
    // Waiting for HRM value
    g.setFont("Vector", 30);
    g.setColor(colors.fg);
    g.setFontAlign(0, 0);
    g.drawString("WAITING", display.centerX, display.centerY - 20);
    g.drawString("FOR BPM", display.centerX, display.centerY + 20);
  } else if (typeof state.frequenz === "string" && state.frequenz.endsWith("BPM")) {
    // Show BPM
    let bpm = state.frequenz.split(" ")[0];

    let fontSize = 46;
    g.setFont("Vector", fontSize);
    let w = g.stringWidth(bpm);
    while (w > display.width - 24 && fontSize > 20) {
      fontSize -= 2;
      g.setFont("Vector", fontSize);
      w = g.stringWidth(bpm);
    }

    g.setColor(colors.fg);
    g.setFontAlign(0, 0);
    g.drawString(bpm, display.centerX, display.centerY - 28);
    g.setFont("Vector", 44);
    g.setColor("#FFFFFF");
    g.setFontAlign(0, 0);
    g.drawString("BPM", display.centerX, display.centerY + 32);
  }
}

// ===============================
//      SPORT-SESSION-MODUS
// ===============================
// Draws the Sport-Session mode: start/stop button, BPM/minute display
function drawSportSession() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);

  const btnWidth = 120;
  const btnHeight = 60;
  const buttonCenterY = display.height * 2 / 3;
  const btn = {
    x1: display.centerX - btnWidth / 2,
    y1: buttonCenterY - btnHeight / 2,
    x2: display.centerX + btnWidth / 2,
    y2: buttonCenterY + btnHeight / 2
  };

  g.setColor("#fff");
  g.drawRect(btn.x1, btn.y1, btn.x2, btn.y2);

  g.setFontAlign(0, 0);

  if (!sportSessionActive) {
    // Draw start button
    g.setFont("Vector", 24);
    g.drawString("START", display.centerX, buttonCenterY);
    g.setFont("Vector", 24);
    g.drawString("Sport-Session", display.centerX, btn.y1 - 38);
  } else {
    // During session: BPM/min display and stop button
    g.setFont("Vector", 24);
    let bpmStr = (hrmSessionData.length > 0)
      ? (hrmSessionData[hrmSessionData.length - 1].bpm + " BPM")
      : "-- BPM";
    let minutes = Math.floor((Date.now() - sessionStartTime) / 60000);
    let minStr = minutes + " min";
    let textY = btn.y1 - 42;
    g.drawString(bpmStr, display.centerX, textY);
    g.drawString(minStr, display.centerX, textY + 26);

    // STOP-Button
    g.setFont("Vector", 24);
    g.drawString("STOP", display.centerX, buttonCenterY);
  }

  drawSportSession.btn = btn;
}

// Handler for incoming HRM data during sport session
function onSessionHRM(hrm) {
  const now = Date.now();
  if (
    sportSessionActive &&
    hrm && hrm.bpm && hrm.bpm > 0 &&
    (now - lastHRMSave >= 5000) // NEU: nur wenn mind. 5 Sek vergangen sind
  ) {
    hrmSessionData.push({
      bpm: hrm.bpm,
      time: now
    });
    lastHRMSave = now; // NEU: Zeitpunkt merken
    drawSportSession();
  }
}

// Shows a white screen as flashlight (brightness max)
function drawFlashlight() {
  g.clear();
  Bangle.setLCDTimeout(0);
  g.setColor(1, 1, 1);
  g.fillRect(0, 0, display.width, display.height);
  Bangle.setLCDBrightness(1.0);
}

// Draw battery level with bar
function drawBattery() {
  g.clear();
  g.setColor(colors.bg);
  g.fillRect(0, 0, display.width, display.height);

  let percent = E.getBattery ? E.getBattery() : 91;

  let bx = display.centerX - 36, by = display.centerY - 42;
  let bw = 72, bh = 30;
  g.setColor("#FFFFFF");
  g.drawRect(bx, by, bx + bw, by + bh);
  g.fillRect(bx + bw + 2, by + 8, bx + bw + 8, by + bh - 8);

  let fillW = Math.round((bw - 6) * percent / 100);
  g.setColor(percent > 25 ? "#FFFFFF" : "#FF0000");
  g.fillRect(bx + 3, by + 3, bx + 3 + fillW, by + bh - 3);

  g.setColor("#FFFFFF");
  g.setFont("Vector", 46);
  g.setFontAlign(0, 0);
  g.drawString(percent + "%", display.centerX, display.centerY + 38);

  // Dim LCD again after 3s
  Bangle.setLCDBrightness(0.5);
  setTimeout(function() {
    Bangle.setLCDBrightness(0.5);
    state.wischfunktionZ = 1;
    state.windowZ = 1;
    draw();
  }, 3000);
}

// Draw main or overlay view, depending on swipe state
function draw() {
  switch (state.wischfunktion) {
    case 0: drawDate(); break;
    case 1: drawTime(); break;
    case 2: drawSeconds(); break;
    case 3: drawSteps(); break;
    case 4: drawHeartRate(); break;
    case 5: drawSportSession(); break;
  }
  switch (state.wischfunktionZ) {
    case 0: drawBattery(); break;
    case 2: drawFlashlight(); break;
  }
}

// Helper to update display every second, if enabled
function setUpdateInterval(set) {
  if (state.interval) clearInterval(state.interval);
  if (set) state.interval = setInterval(draw, 1000);
}

// =========== TOUCH/SWIPE HANDLERS ===========

let touchStartX = 0;
let touchStartY = 0;
Bangle.on('touch', (button, xy) => {
  // Remember start time/position for gestures
  if (state.touchStartTime === 0) {
    state.touchStartTime = getTime();
    touchStartX = xy.x;
    touchStartY = xy.y;
  }

  // Sport-Session-Touch (only in mode 5)
  if (state.wischfunktion === 5) {
    const btn = drawSportSession.btn;
    if (xy.x > btn.x1 && xy.x < btn.x2 && xy.y > btn.y1 && xy.y < btn.y2) {
      if (!sportSessionActive) {
        // START session
        sportSessionActive = true;
        hrmSessionData = [];
        sessionStartTime = Date.now();
        Bangle.setHRMPower(true);
        Bangle.on("HRM", onSessionHRM);
        drawSportSession();
      } else {
        // STOP session, export data via Bluetooth
        sportSessionActive = false;
        Bangle.setHRMPower(false);
        Bangle.removeListener("HRM", onSessionHRM);

        let sessionEndTime = Date.now();
        let sessionDuration = sessionEndTime - sessionStartTime;

        Bluetooth.println(JSON.stringify({
          start: sessionStartTime,
          start_str: formatTimestamp(sessionStartTime),
          end: sessionEndTime,
          end_str: formatTimestamp(sessionEndTime),
          hrm: hrmSessionData.map(item => ({
            bpm: item.bpm,
            time: item.time,
            time_str: formatTimestamp(item.time)
          })),
          duration: Math.floor(sessionDuration / 60000)
        }));

        drawSportSession();
      }
    }
  }
});
Bangle.on('touch_end', () => {
  state.touchStartTime = 0;
});

// Drag handler for up/down swipe overlays (battery, flashlight, etc)
Bangle.on('drag', function(e) {
  if (e.b === 1 && !state.swipeDone) {
    if (e.dy < -40 && Math.abs(e.dy) > Math.abs(e.dx)) {
      state.windowZ++;
      state.swipeDone = true;
    } else if (e.dy > 40 && Math.abs(e.dy) > Math.abs(e.dx)) {
      state.windowZ--;
      state.swipeDone = true;
    }
    if (state.wischfunktionZ !== 99) {
      state.windowZ = Math.max(0, Math.min(3, state.windowZ));
      state.wischfunktionZ = state.windowZ;
      draw();
    }
  }
  if (e.b === 0) {
    state.swipeDone = false;
  }
});

// Left/right swipe between main screens
Bangle.on('swipe', function(dir) {
  if (dir === -1) {
    state.window++;
  } else if (dir === 1) {
    state.window--;
  }
  if (state.wischfunktion !== 99) {
    state.window = Math.max(0, Math.min(5, state.window));
    state.wischfunktion = state.window;
    draw();
  }
});

// Redraw when display turns on/off, manage interval
Bangle.on('lcdPower', on => {
  if (on) {
    draw();
    setUpdateInterval(1);
  } else {
    if (state.interval) clearInterval(state.interval);
    state.interval = undefined;
  }
});

// Init: set up font, clear, disable HRM, set default UI, etc.
function init() {
  setupFonts();
  g.clear(1);
  Bangle.setUI("clock");
  if (state.wischfunktion !== 4) {
    Bangle.setHRMPower(false);
    Bangle.removeAllListeners("HRM");
    drawHeartRate.hrmActive = false;
  }
  resetDailyStepsIfNeeded();
  setUpdateInterval(1);
  draw();
}

init();
Bangle.setLCDTimeout(10);
