#!/bin/bash

set -e

cd notesite/static
jixen main.js main_out.js
sass stylesheet.scss:stylesheet.css
