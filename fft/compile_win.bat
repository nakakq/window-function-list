: compile script for windows
: run this on emsdk console
@echo off
emcc fftsg.c -O3 -s WASM=1 -s ALLOW_TABLE_GROWTH=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_cdft','_rdft','_malloc','_free']" -o fftsg.js
