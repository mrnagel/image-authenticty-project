#!/bin/bash

FILE=$(ls /saved_photo | head -1)

exec python trufor_model.py -in "/saved_photo/$FILE" -out /model_outputs/trufor/results.npz -exp trufor_ph3 --save_np TEST.MODEL_FILE weights/trufor.pth.tar 