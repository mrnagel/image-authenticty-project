#!/bin/bash

FILE=$(ls /saved_photo | head -1)

exec python visualize.py --image "/saved_photo/$FILE" --output /model_outputs/trufor/results.npz --image_output /model_outputs/visualizer/visualize.png