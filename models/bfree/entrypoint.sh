#!/bin/bash

FILE=$(ls /saved_photo | head -1)

exec python bfree_main.py -i "/saved_photo/$FILE" -d cpu