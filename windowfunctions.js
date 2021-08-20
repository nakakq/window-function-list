
function clamp01(x) {
    if (x > 1.0) return 1.0;
    if (x < -1.0) return -1.0;
    return x;
}

function createAxis(length) {
    // creates [-1, +1] array
    return Array.from({ length: length }, (_, i) => 2 * i / (length - 1) - 1);
}

function createFrequencyAxis(length) {
    // creates [0, 1] array
    return Array.from({ length: length }, (_, i) => i / (length - 1));
}

function createWindowArray(f, length) {
    return createAxis(length).map(f);
}

const windowList = {
    "": {
        name: "None",
        f: (length, params) => [],
        defaultParams: {},
    },
    "rect": {
        name: "Rectangular (Boxcar)",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                return (xx > -1.0 && xx < 1.0) ? 1.0 : 0.0;
            }
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "hann": {
        name: "Hann",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.5 + 0.5 * Math.cos(omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "hamming": {
        name: "Hamming",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                if (params.truncate.value > 0.5 && (xx <= -1.0 || xx >= 1.0)) return 0.0;
                let omega = Math.PI * clamp01(xx);
                return 0.54 + 0.46 * Math.cos(omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            truncate: {
                name: "Truncate?",
                value: 1,
                min: 0,
                max: 1,
                step: 1,
            }
        },
    },
    "hamming-exact": {
        name: "Hamming (Exact)",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                if (params.truncate.value > 0.5 && (xx <= -1.0 || xx >= 1.0)) return 0.0;
                let omega = Math.PI * clamp01(xx);
                return 0.53836 + 0.46164 * Math.cos(omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            truncate: {
                name: "Truncate?",
                value: 1,
                min: 0,
                max: 1,
                step: 1,
            }
        },
    },
    "blackman": {
        name: "Blackman",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                let a = params.alpha.value;
                // 0.42, 0.5, 0.08 when a = 0.16
                return ((1 - a) + Math.cos(omega) + a * Math.cos(2 * omega)) / 2;
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            alpha: {
                name: "Alpha",
                value: 0.16,
                min: 0.0,
                max: 0.5,
                step: 0.01,
            },
        },
    },
    "blackman-exact": {
        name: "Blackman (Exact)",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return (7938 + 9240 * Math.cos(omega) + 1430 * Math.cos(2 * omega)) / 18608;
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "nuttall": {
        name: "Nuttall",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.355768 + 0.487396 * Math.cos(omega) + 0.144232 * Math.cos(2 * omega) + 0.012604 * Math.cos(3 * omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "blackman-nuttall": {
        name: "Blackman–Nuttall",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.3635819 + 0.4891775 * Math.cos(omega) + 0.1365995 * Math.cos(2 * omega) + 0.0106411 * Math.cos(3 * omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "blackman-harris": {
        name: "Blackman–Harris",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.35875 + 0.48829 * Math.cos(omega) + 0.14128 * Math.cos(2 * omega) + 0.01168 * Math.cos(3 * omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "kawahara-five": {
        name: "Kawahara five-term",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.2940462892 + 0.4539870314 * Math.cos(omega) + 0.2022629686 * Math.cos(2 * omega) + 0.0460129686 * Math.cos(3 * omega) + 0.0036907422 * Math.cos(4 * omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "kawahara-six": {
        name: "Kawahara six-term",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.2624710164 + 0.4265335164 * Math.cos(omega) + 0.2250165621 * Math.cos(2 * omega) + 0.0726831633 * Math.cos(3 * omega) + 0.0125124215 * Math.cos(4 * omega) + 0.0007833203 * Math.cos(5 * omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "flattop": {
        name: "Flat top",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI * clamp01(xx);
                return 0.215578950 + 0.416631580 * Math.cos(omega) + 0.277263158 * Math.cos(2 * omega) + 0.083578947 * Math.cos(3 * omega) + 0.006947368 * Math.cos(4 * omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
        },
    },
    "cospn": {
        name: "cos^n",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let omega = Math.PI / 2 * clamp01(xx);
                let truncator = (xx > -1.0 && xx < 1.0) ? 1.0 : 0.0;
                return Math.pow(Math.cos(omega), params.n.value) * truncator;
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            n: {
                name: "n",
                value: 1.0,
                min: 1.0,
                max: 16.0,
                step: 0.01,
            },
        },
    },
    "kaiser": {
        name: "Kaiser",
        f: (length, params) => {
            let alpha = params.alpha.value;
            let beta = Math.PI * alpha;
            let denom = BESSEL.besseli(beta, 0);
            let w = (x) => {
                let xx = x / params.timeScale.value;
                if (xx <= -1.0 || xx >= 1.0) return 0.0;
                return BESSEL.besseli(beta * Math.sqrt(1 - xx * xx), 0) / denom;
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            alpha: {
                name: "α",
                value: 3.0,
                min: 2.5,
                max: 32.0,
                step: 0.01,
            },
        },
    },
    "gaussian": {
        name: "Gaussian",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                if (params.truncate.value > 0.5 && (xx <= -1.0 || xx >= 1.0)) return 0.0;
                return Math.exp(- 0.5 * (xx * xx) / (params.sigma.value * params.sigma.value));
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            sigma: {
                name: "σ",
                value: 0.25,
                min: 0.01,
                max: 0.5,
                step: 0.01,
            },
            truncate: {
                name: "Truncate?",
                value: 1,
                min: 0,
                max: 1,
                step: 1,
            }
        },
    },
    "tukey": {
        name: "Tukey",
        f: (length, params) => {
            let w = (x) => {
                let xx = x / params.timeScale.value;
                let width = params.width.value;
                if (Math.abs(xx) < width)
                    return 1.0;
                else if (Math.abs(xx) >= 1.0)
                    return 0.0;
                let omega = Math.PI * clamp01((Math.abs(xx) - width) / (1 - width));
                return 0.5 + 0.5 * Math.cos(omega);
            };
            return createWindowArray(w, length);
        },
        defaultParams: {
            timeScale: {
                name: "Time scale",
                value: 1.0,
                min: 0.01,
                max: 1.0,
                step: 0.01,
            },
            width: {
                name: "Width",
                value: 0.5,
                min: 0.0,
                max: 1.0,
                step: 0.01,
            },
        },
    },
};
