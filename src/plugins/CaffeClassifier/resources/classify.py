import sys
# TODO: Change the next line
sys.path.append("/home/irishninja/projects/caffe/python");

import caffe

import numpy as np
import matplotlib.pyplot as plt
import os

# Get the values from cmd
if len(sys.argv) < 3:
    print("Not enough args")
    sys.exit(1);

MODEL_FILE = sys.argv[1]
PRETRAINED = sys.argv[2]

image_paths = []
images = []
for i in range(3, len(sys.argv)):
    input_image = caffe.io.load_image(sys.argv[i], color=False)
    image_paths.append(sys.argv[i])
    images.append(input_image)
    print("Adding ", sys.argv[i])

net = caffe.Classifier( MODEL_FILE, PRETRAINED )
result = net.predict(images, oversample=False)

# TODO: Get the label names

preds_file = open('predictions.txt', 'w')
for i in range(0, len(result)):
    # TODO: Write this to a file
    print("Predicting ", image_paths[i], " to be ", result[i].argmax())

    # Write the predictions to a file
    preds_file.write(str(image_paths[i]) + '\t' + str(result[i].argmax()) + '\n')

preds_file.close();
