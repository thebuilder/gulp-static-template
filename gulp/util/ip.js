var os = require('os');

/**
 * Get the local IP addresses of this machine.
 * Can be used to configure LiveReload with ip: <script src="http://192.168.0.1:35729/livereload.js?snipver=1"></script>
 * @returns {String}
 */
module.exports = function() {
    var interfaces = os.networkInterfaces();
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family == 'IPv4' && !address.internal) {
                //Return the first found IP address. Might not be the one you expect.
                return address.address;
            }
        }
    }

    return "";
};
