'use strict';

module.exports = {

    'mongodb' : {
        'url' : 'mongodb://localhost:27017/app-demo'
    },

    'facebookAuth' : {
        'clientID'      : 'your-client-ID-here', // your App ID
        'clientSecret'  : 'your-client-secrect-here', // your App Secret
        'callbackURL'   : '/auth/facebook/callback'
    },

    'weiboAuth' : {
        'appKey'        : 'your-appKey-here', // your weibo App Key
        'appSecret'     : 'your-appSecrect-here', // your weibo App Secret
        'callbackURL'   : '/auth/weibo/callback' // your weibo auth callback
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here', // your twitter consumer key
        'consumerSecret'    : 'your-client-secret-here', //your twitter consumer secret
        'callbackURL'       : '/auth/twitter/callback' // your twitter auth callback
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your google client ID
        'clientSecret'  : 'your-client-secret-here', // your google client secret
        'callbackURL'   : '/auth/google/callback' // your google auth callback
    }

};
