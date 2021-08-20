// wrapper for ./fft/fftsg.js

function setFloat64(pointer, array) {
    if (pointer == null)
        return;
    Module.HEAPF64.set(array, pointer / Float64Array.BYTES_PER_ELEMENT);
}
function setInt32(pointer, array) {
    if (pointer == null)
        return;
    Module.HEAP32.set(array, pointer / Int32Array.BYTES_PER_ELEMENT);
}

function getFloat64(pointer, length) {
    if (pointer == null)
        return new Float64Array();
    return new Float64Array(HEAPF64.buffer, pointer, length);
}
function getInt32(pointer, length) {
    if (pointer == null)
        return new Int32Array();
    return new Int32Array(HEAP32.buffer, pointer, length);
}

function allocateZeroFloat64(length) {
    let pointer = Module._malloc(Float64Array.BYTES_PER_ELEMENT * length);
    setFloat64(pointer, new Float64Array(length));
    return pointer;
}
function allocateZeroInt32(length) {
    let pointer = Module._malloc(Int32Array.BYTES_PER_ELEMENT * length);
    setInt32(pointer, new Int32Array(length));
    return pointer;
}

function free(pointer) {
    if (pointer != null)
        Module._free(pointer);
}

let FFT = {
    fftsize: 0,
    x: null,
    ip: null,
    w: null,
    init: function (fftsize) {
        free(this.x);
        free(this.ip);
        free(this.w);

        this.fftsize = fftsize;
        this.x = allocateZeroFloat64(fftsize * 2);
        this.ip = allocateZeroInt32(fftsize);
        this.w = allocateZeroFloat64(fftsize);
        Module._cdft(2 * this.fftsize, 1, this.x, this.ip, this.w);
    },
    calculateDecibelSpectrum: function (x) {
        if (!x || x.length == 0)
            return { freq: [], spec: [] };

        let result = this.fft(x, new Float64Array(x.length));
        if (result.re.length == 0)
            return { freq: [], spec: [] };

        let numbins = this.fftsize / 2 + 1;
        let freq = new Float64Array(numbins);
        let spec = new Float64Array(numbins);
        let max = -999;
        for (let i = 0; i < numbins; i++) {
            freq[i] = i / this.fftsize;
            spec[i] = 10 * Math.log10(result.re[2 * i + 0] ** 2 + result.im[2 * i + 1] ** 2);
            if (spec[i] > max)
                max = spec[i];
        }
        spec = spec.map(x => x - max);
        return { freq: freq, spec: spec };
    },
    fft: function (re, im) {
        if (this.fftsize == 0) {
            console.error("please run FFT.init(fftsize) before calling FFT.fft");
            return { re: [], im: [] };
        }

        if (re.length != this.fftsize || im.length != this.fftsize)
            return new Float64Array();

        let x = new Float64Array(this.fftsize * 2);
        for (let i = 0; i < this.fftsize; i++) {
            x[2 * i + 0] = re[i];
            x[2 * i + 1] = im[i];
        }
        setFloat64(this.x, x);

        Module._cdft(2 * this.fftsize, 1, this.x, this.ip, this.w);

        let result = getFloat64(this.x, this.fftsize * 2);
        let re_out = new Float64Array(this.fftsize);
        let im_out = new Float64Array(this.fftsize);
        for (let i = 0; i < this.fftsize; i++) {
            re_out[i] = result[2 * i + 0];
            im_out[i] = result[2 * i + 1];
        }
        return { re: re_out, im: im_out };
    },
    ifft: function (re, im) {
        if (this.fftsize == 0) {
            console.error("please run FFT.init(fftsize) before calling FFT.ifft");
            return { re: [], im: [] };
        }

        if (re.length != this.fftsize || im.length != this.fftsize)
            return new Float64Array();

        let x = new Float64Array(this.fftsize * 2);
        for (let i = 0; i < this.fftsize; i++) {
            x[2 * i + 0] = re[i];
            x[2 * i + 1] = im[i];
        }
        setFloat64(this.x, x);

        Module._cdft(2 * this.fftsize, -1, this.x, this.ip, this.w);

        let result = getFloat64(this.x, this.fftsize * 2);
        let re_out = new Float64Array(this.fftsize);
        let im_out = new Float64Array(this.fftsize);
        for (let i = 0; i < this.fftsize; i++) {
            re_out[i] = result[2 * i + 0] / this.fftsize;
            im_out[i] = result[2 * i + 1] / this.fftsize;
        }
        return { re: re_out, im: im_out };
    },
};
