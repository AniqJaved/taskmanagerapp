var MailChimpAPI = require('mailchimp').MailChimpAPI;

const mailchimpAPIKey = '34V3r6kt1JL7aL86_YtErQ'

try {
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}