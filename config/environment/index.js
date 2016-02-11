

var all = {
    // Server environment
    env: process.env.NODE_ENV || 'development',

    // Server port
    port: process.env.PORT || 3000,

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'simple-secret'
    }
}

var config = require('./' + all.env);

module.exports = function(_){
    return _.merge(all, config);
};
