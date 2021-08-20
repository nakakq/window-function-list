: compile script for windows
: run this on emsdk console
@echo off
emcc fftsg.c -O3 -s EXPORTED_FUNCTIONS="['_cdft','_rdft','_malloc','_free']" -o fftsg.js
