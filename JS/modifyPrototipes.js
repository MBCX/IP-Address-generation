if (undefined == Array.prototype.shuffle) {
    /**
     * Shuffles the contents of a given
     * array.
     */
    Array.prototype.shuffle = function () {
        let e;
        let t;
        let n = this.length;
        if (0 !== n) {
            for (; --n; ) {
                e = Math.floor(Math.random() * (n + 1));
                t = this[n];
                this[n] = this[e];
                this[e] = t;
            }
        }
    };
}
