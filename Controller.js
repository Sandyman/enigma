class Controller {
    constructor() {
        this.stack = [];
    }

    use(...fns) {
        let i = fns.length;
        while (i--) {
            const fn = fns[i];
            if (Array.isArray(fn)) return this.use(...fn);
            if ('function' === typeof fn) this.stack.unshift(fn);
        }
    };

    run(args, done) {
        let i = this.stack.length;
        const next = (err = null, fin) => {
            if (err || fin || i === 0) {
                if ('function' === typeof done) done(err);
                return;
            }
            this.stack[--i].apply(null, [...args, next]);
        };
        next();
    }
}

module.exports = Controller;
