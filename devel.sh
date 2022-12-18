#!/bin/bash

set -e

function onsave {
  set +e
  CHECK=null
  while true; do
    RECHECK=$(stat -c %Y $1)
    if [ $RECHECK != $CHECK ]; then
      CHECK=$RECHECK
      bash -c "$2"
    fi
  done
}

onsave notesite/static/main.js         ./build.sh &
onsave notesite/static/stylesheet.scss ./build.sh &
flask --app notesite.__main__:app --debug run
