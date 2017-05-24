[![Release State](https://img.shields.io/badge/state-pre--alpha-red.svg)](https://img.shields.io/badge/state-pre--alpha-red.svg)
[![Build Status](https://travis-ci.org/dfst/deepforge-caffe.svg?branch=master)](https://travis-ci.org/dfst/deepforge-caffe)
[![Stories in Ready](https://badge.waffle.io/dfst/deepforge-caffe.png?label=ready&title=Ready)](https://waffle.io/dfst/deepforge-caffe)

**Deprecated**: DeepForge-Caffe is no longer maintained. Please check out [DeepForge](https://github.com/deepforge-dev/deepforge), a significantly more sophisticated and robust development environment environment for deep learning.
# DeepForge-Caffe

[![Join the chat at https://gitter.im/dfst/deepforge-caffe](https://badges.gitter.im/dfst/deepforge-caffe.svg)](https://gitter.im/dfst/deepforge-caffe?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
DeepForge is an open-source visual development environment for deep learning. Currently, it supports Convolutional Neural Networks but we are planning on supporting additional deep learning classifiers such as RNNs and LSTMs. Additional features include real-time collaborative editing and version control.

DeepForge-Caffe is a variant of DeepForge which uses Caffe as for training and testing the models.

## Recommended Environment
- node v4.x.x
- npm v2.x.x
- mongodb v3.2.3
- git-lfs (just for initial clone)

## Quick Setup
First, install [git-lfs](https://git-lfs.github.com/) and clone the repo. After cloning the repo, run

```
npm install && npm start
```

Now, navigate to `localhost:8080` in a browser and create a new project. Select `Minimal` as the seed and start creating your neural nets!

There are examples in the `Examples` directory.

## Interested in contributing?
Contributions are welcome! Either fork the project and submit some PR's or shoot me an email about getting more involved!
