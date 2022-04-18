const axios = require('axios');
require('dotenv').config();

var appRouter = function (app) {

    app.get("/user-orgs-by-email", function (req, res) {
        const email = req.query.email;
        var options = {
            method: 'POST',
            url: 'https://samyapkowitz.us.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
            data: {
              grant_type: 'client_credentials',
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              audience: 'https://samyapkowitz.us.auth0.com/api/v2/'
            }
          };
        
        axios.request(options).then(function (response) {
            const token = response.data.access_token;
            axios.get(encodeURI('https://samyapkowitz.us.auth0.com/api/v2/users-by-email?email=' + email), {
            headers: {
                Authorization: 'Bearer ' + token
            },
        }).then((resp) => {
            const userId = resp.data[0].user_id;
            axios.get(encodeURI('https://samyapkowitz.us.auth0.com/api/v2/users/' + userId + '/organizations'), {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                }).then((resp) => {
                    res.status(200).send(resp.data);
                }).catch((err) => {
                    console.error(err);
                    res.status(500).send(err);
                });
            }).catch((err) => {
                console.error(err);
                res.status(500).send(err);
            }); 
        }).catch(function (error) {
            console.error(error);
        });
    });

    app.get("/org-by-id", function (req, res) {
        const org_id = req.query.org_id;
        var options = {
            method: 'POST',
            url: 'https://samyapkowitz.us.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
            data: {
              grant_type: 'client_credentials',
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              audience: 'https://samyapkowitz.us.auth0.com/api/v2/'
            }
          };
        
        axios.request(options).then(function (response) {
            const token = response.data.access_token;
            axios.get(encodeURI('https://samyapkowitz.us.auth0.com/api/v2/organizations/' + org_id), {
            headers: {
                Authorization: 'Bearer ' + token
            },
            }).then((resp) => {
                res.status(200).send(resp.data);
            }).catch(function (error) {
                console.error(error);
            });
        });
    });
}
  
module.exports = appRouter;