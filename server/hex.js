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
        'DC2': '\x12',
        'RS':  '\x1E',
        'EM':  '\x19',
        'SI':  '\x0F',
        'DLE': '\x10',
        'SUB': '\x1A',
        'x80': '\x80'

    }

}).call(this);