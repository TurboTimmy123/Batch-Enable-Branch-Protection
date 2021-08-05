var request = require('request');

// Fetch token from settings -> Personal access token, requires [repo] permission
key = 'token ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

async function GetRepos(org) {
        let options = {
            'url' : 'https://api.github.com/users/'+org+'/repos',
            headers: {
                'User-Agent': 'nola-guilds-github',
                'Authorization': key,
                'Accept': 'application/vnd.github.loki-preview+json'
            },
            json: true
        }

        request.get(options, function (error, response, body) {
            console.log("Status code:", response.statusCode, "Errors:", error)
            console.log('Repos found:')
            for (i in body) {
                console.log(body[i].name)
                ApplyProtection(org, body[i].name,'master')
                ApplyProtection(org, body[i].name,'main')
            }
        });
}

async function ApplyProtection(org, repo, branch) {
        let options = {
            'url' : 'https://api.github.com/repos/'+org+'/'+repo+'/branches/'+branch+'/protection',
            headers: {
                'User-Agent': 'nola-guilds-github',
                'Authorization': key,
                'Accept': 'application/vnd.github.loki-preview+json'
            },
            body: {
                'required_status_checks' : {
                    'include_admins' : false,
                    'strict' : true,
                    'contexts' : ['default']
                },
                'required_pull_request_reviews' : {
                    'include_admins' : false,
                    'require_code_owner_reviews' : true
                },
                'restrictions' : null,
                'enforce_admins' : false
            },
            json: true
        }

        await request.put(options, function (error, response, body) {
            //console.error('error:', error);
            console.log('statusCode:', response && response.statusCode);
            //console.log('body:', body);
        });
}

// Modify with your username or organisation
GetRepos('user/org')
