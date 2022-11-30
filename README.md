# node-timer-win

* From terminal, set up a timer on Windows which, when expired, shows notification and plays an alarm sound.
* Simple alarm that can be started from terminal, no fuss

## Usage

Only `-t` or `--timeout` is required, which can be either seconds, minutes or hours.
* `10s` 10 seconds
* `1m` 60 seconds / 1 minute
* `1h` 3600 seconds / 60 minutes / 1 hour

If `--single` is not given, repeats alarm every 60s until notification is clicked.

Example `npm ./run.js -t 60s -m 'Do something'`

```
usage: run.js [-h] [-ti TITLE] [-m MESSAGE] -t TIMEOUT [-s SOUND] [-i ICON] [--no-sound] [--no-notification] [--single]

Node timer

optional arguments:
  -h, --help            show this help message and exit
  -ti TITLE, --title TITLE
                        Message title
  -m MESSAGE, --message MESSAGE
                        Message to show
  -t TIMEOUT, --timeout TIMEOUT
                        Timeout until alarm
  -s SOUND, --sound SOUND
                        Sound file
  -i ICON, --icon ICON  Icon file
  --no-sound            Don't play alarm sound
  --no-notification     Don't show notification
  --single              Don't repeat alarm until acknowledged
```
