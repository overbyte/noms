export default {
    TOUCH_RADIUS: '80',
    MAX_COUNTDOWN: 3,
    MIN_TOUCHPOINTS: 2,
    SVG_NS: 'http://www.w3.org/2000/svg',
    COLOURS: [
        '#ff0000',
        '#ff7700',
        '#ffff00',
        '#77ff00',
        '#00ff00',
        '#00ff77',
        '#00ffff',
        '#0077ff',
        '#0000ff',
        '#7700ff',
        '#ff00ff',
        '#ff0077',
    ],
    generateColour() {
        return this.COLOURS[Math.ceil(Math.random() * this.COLOURS.length) - 1];
    }
};

