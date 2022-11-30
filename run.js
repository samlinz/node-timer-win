/*
    alarm1 - https://freesound.org/people/bone666138/sounds/198841/
*/

import fs from "fs";

import { dirname } from "path";
import { fileURLToPath } from "url";

import soundPlayer from "sound-play";
import { ArgumentParser } from "argparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import notifier from "node-notifier";
import path from "path";

const log = (...args) => console.log(...[`[${Date.now()}]`, ...args]);

const getShowNotification =
  ({ notifier, fnAck, log, fileIcon }) =>
  ({ message, title }) => {
    return () => {
      notifier.notify({
        title,
        message,
        sound: true,
        icon: fileIcon,
        wait: true,
      });
      notifier.on("click", function (notifierObject, options, event) {
        log("Clicked");
        fnAck();
      });
    };
  };

const _getPlaySound =
  ({ fnPlaySound, log }) =>
  ({ filename }) => {
    const fileExists = fs.existsSync(filename);
    if (!fileExists) {
      throw new Error(`File not found: ${filename}`);
    }

    return () => {
      log(`Playing sound: ${filename}`);
      fnPlaySound(filename);
    };
  };

const getPlaySound = _getPlaySound({
  fnPlaySound: soundPlayer.play,
  log,
});

const initAlarm = ({
  log,
  notifier,
  getShowNotification,
  getPlaySound,
  config: { sound, icon, noNotification, noSound, single },
}) => {
  let ack = false;
  let logInterval = null;
  let alarmInterval = null;

  const acknowledge = () => {
    log("Acknowledged");
    ack = true;
    clearTimeout(logInterval);
    clearTimeout(alarmInterval);
    process.exit(0);
  };

  const fileIcon = path.join(__dirname, "files", icon || "icon.png");
  const fileAlarm = path.join(__dirname, "files", sound || "alarm1.wav");

  const showNotification = getShowNotification({
    fnAck: acknowledge,
    log,
    notifier,
    fileIcon,
  });

  const playSound = getPlaySound({
    filename: fileAlarm,
  });

  const getDoAlarm =
    ({ log, fnPlayAlertSound, fnShowNotification }) =>
    () => {
      log("Alarm!");
      if (!noSound) fnPlayAlertSound();
      if (!noNotification) fnShowNotification();
    };

  return ({ timeout, message: { title, message } }) => {
    const sTimeout = timeout.toString();
    const timeoutSymbol = (timeout[timeout.length - 1] || "").toLowerCase();
    const isMinutes = timeoutSymbol === "m";
    const isHours = timeoutSymbol === "h";
    const isDefault = !isMinutes && !isHours;
    const isSeconds = timeoutSymbol === "s" || isDefault;

    const timeoutNumeric = sTimeout.replace(/\D+/, "");
    const iTimeoutNumeric = parseInt(timeoutNumeric, 10);
    const isTimeoutValid = !isNaN(iTimeoutNumeric);

    if (!isTimeoutValid) {
      throw new Error(`Invalid timeout value: ${timeout}`);
    }

    let msTimeout = 0;
    if (isSeconds) msTimeout = iTimeoutNumeric * 1000;
    if (isMinutes) msTimeout = iTimeoutNumeric * 1000 * 60;
    if (isHours) msTimeout = iTimeoutNumeric * 1000 * 60 * 60;

    if (msTimeout <= 0) {
      throw new Error(`Invalid timeout value: ${timeout}, ms: ${msTimeout}`);
    }

    log(
      `Starting alarm for ${timeout} = ${msTimeout}ms = ${Math.floor(
        msTimeout / 1000
      )}s`
    );

    const start = Date.now();
    const LOG_INTERVAL = 1000;

    const getTimeElapsed = () => Date.now() - start;
    const getTimeLeft = () => msTimeout - getTimeElapsed();

    const fnLogInterval = () => {
      const timeElapsed = Math.floor(getTimeElapsed() / 1000);
      const timeLeft = Math.floor(getTimeLeft() / 1000) + 1;
      log(`Time elapsed: ${timeElapsed}s, time left ${timeLeft}s`);
      if (!ack) {
        logInterval = setTimeout(fnLogInterval, LOG_INTERVAL);
      }
    };
    logInterval = setTimeout(fnLogInterval, LOG_INTERVAL);

    const alarm = getDoAlarm({
      fnPlayAlertSound: playSound,
      fnShowNotification: showNotification({
        title: title || "Alarm",
        message: message || "Time's up!",
      }),
      log,
    });

    const fnEnd = () => {
      clearTimeout(logInterval);
      let i = 0;
      const doAlarm = () => {
        if (i > 0) {
          log("Reminder alarm!");
        }
        alarm();
        if (!single) {
          alarmInterval = setTimeout(doAlarm, 10000);
        }
        i++;
      };
      doAlarm();
    };
    setTimeout(fnEnd, msTimeout);
  };
};

const parser = new ArgumentParser({
  description: "Node timer",
});
parser.add_argument("-ti", "--title", {
  action: "store",
  help: "Message title",
});
parser.add_argument("-m", "--message", {
  action: "store",
  help: "Message to show",
});
parser.add_argument("-t", "--timeout", {
  action: "store",
  required: true,
  help: "Timeout until alarm",
});
parser.add_argument("-s", "--sound", {
  action: "store",
  help: "Sound file",
});
parser.add_argument("-i", "--icon", {
  action: "store",
  help: "Icon file",
});
parser.add_argument("--no-sound", {
  action: "store_true",
  help: "Don't play alarm sound",
});
parser.add_argument("--no-notification", {
  action: "store_true",
  help: "Don't show notification",
});
parser.add_argument("--single", {
  action: "store_true",
  help: "Don't repeat alarm until acknowledged",
});

const args = parser.parse_args();

const {
  title,
  message,
  timeout,
  no_sound: noSound,
  no_notification: noNotification,
  sound,
  icon,
  single,
} = args;

if (!timeout) throw new Error("Timeout is required");

initAlarm({
  getPlaySound,
  getShowNotification,
  log,
  notifier,
  config: {
    sound,
    icon,
    noNotification,
    noSound,
    single,
  },
})({
  timeout,
  message: {
    message,
    title,
  },
});
