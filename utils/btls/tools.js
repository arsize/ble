function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        fn({
            ...args || {},
            success: res => resolve(res),
            fail: err => reject(err)
        });
    });

}

module.exports = {
    promisify: promisify
}