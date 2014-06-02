(function(){

    // These are control codes that I use for
    // various parts of the TCP communication,
    // as well as the Spotimote signalling.

    module.exports = {

        'NUL': '\x00',
        'SOH': '\x01',
        'STX': '\x02',
        'ETX': '\x03',
        'EOT': '\x04',
        'ENQ': '\x05',
        'ACK': '\x06',
        'SYN': '\x16',
        'BEL': '\x07',
        'BS':  '\x08',
        'DLE': '\x10',
        'DC2': '\x12',
        'RS':  '\x1E',
        'ETB': '\x17',
        'EM':  '\x19',
        'SI':  '\x0F',
        'DLE': '\x10',
        'SUB': '\x1A',
        'x80': '\x80',

        concat: function() {
            var out = '';
            for (var i = 0; i < arguments.length; i++) {
                out += this[arguments[i]];
            }
            return out;
        },

        strip: function(str) {
            return str.replace(/[\x00-\x1f]/g, '');
        }

    }

}).call(this);