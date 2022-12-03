- From terminal, set up a timer on Windows or Mac which, when expired, shows notification and plays an alarm sound.
- Simple alarm that can be started from terminal, no fuss
- Works on Windows, MacOS
  - Linux not tested, might work with some tweaking, but have to check the dependencies

## Installing

`npm install -g node_terminal_timer`

`npx node_terminal_timer` <- run without install

## Usage

Only `-t` or `--timeout` is required, which can be either seconds, minutes or hours.

- `10s` 10 seconds
- `1m` 60 seconds / 1 minute
- `1h` 3600 seconds / 60 minutes / 1 hour

Timeout can also be full ISO-8601 date string e.g. `2022-01-01 14:00` or time e.g. `18:00`;

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

## Troubleshooting

* Notifications not displaying on Mac -> must give notification permissions for "terminal_notifier" from Accessiblity settings
  * On my machine this wasn't prompted automatically so I had to apply them manually