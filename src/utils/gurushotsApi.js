import axios from 'axios'

let user = {
    user_name: 'sthlmshooter',
    action: 'signin',
    token: '1e291aaec1967d51a2889091663edf69b763ed7c1694fdc73962adfbdda1942c5468fe6c7fd82fa94f8e44af22856e65',
    admin_token: null,
    member_id: '1078d1c4679a0df5b050fd991baf8b87',
    is_signup: false,
    success: true
}

export const login = async (user, password) => {
    console.log('start login')
    const data = `login=${encodeURIComponent(user)}&password=${password}`;

    const config = {
        method: 'post',
        url: 'https://api.gurushots.com/rest_mobile/signup',
        headers: {
            'host': 'api.gurushots.com',
            'accept': '*/*',
            'x-device': 'iPhone',
            'x-requested-with': 'XMLHttpRequest',
            'x-model': 'iPhone X',
            'accept-encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
            'accept-language': 'fr-SE;q=1.0, en-SE;q=0.9, sv-SE;q=0.8, es-SE;q=0.7',
            'x-api-version': '20',
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'x-env': 'IOS',
            'user-agent': 'GuruShotsIOS/2.11.3 (com.gurushots.app; build:507; iOS 15.3.0) Alamofire/5.0.0-rc.2',
            'content-length': '50',
            'x-app-version': '2.11.3',
            'connection': 'keep-alive',
            'x-brand': 'Apple',
            'cookie': '_clck=av9mgm|1|f0a|0; _fbp=fb.1.1648914330061.2139166727; _uetvid=ecada8d0b29b11ec9459df91e6b99083; _ga=GA1.2.2079901456.1648914330; _ga_PSTKC2YRVK=GS1.1.1648914329.1.0.1648914329.60; mp_web_PoU9JZO1jl_mixpanel=%7B%22distinct_id%22%3A%20%2217feaf3f019ac0-01728b3cf9cec6-744c1451-4a574-17feaf3f01aac2%22%2C%22%24device_id%22%3A%20%2217feaf3f019ac0-01728b3cf9cec6-744c1451-4a574-17feaf3f01aac2%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; _gcl_au=1.1.254784595.1648914329; _hjSessionUser_2610047=eyJpZCI6IjFjODU1Mzk3LWY5YzMtNWU0Mi1iYzBjLTFlNTdiNjJkZTU0MyIsImNyZWF0ZWQiOjE2NDg5MTQzMjg3MTAsImV4aXN0aW5nIjpmYWxzZX0=',
            'x-postman-captr': '4102221'
        },
        data: data
    };

    return await axios(config)
        .then(function (response) {
            console.log('login successful')
            return response.data
        })
        .catch(function (error) {
            console.error('login error')
            console.error(error);
        });
}


export const getActiveChallenges = async () => {
    console.log('getting active challenges')
    var config = {
        method: 'post',
        url: 'https://api.gurushots.com/rest_mobile/get_my_active_challenges',
        headers: {
            'host': 'api.gurushots.com',
            'x-device': 'iPhone',
            'x-requested-with': 'XMLHttpRequest',
            'x-model': 'iPhone X',
            'accept-encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
            'x-token': user.token,
            'x-api-version': '20',
            'accept-language': 'fr-SE;q=1.0, en-SE;q=0.9, sv-SE;q=0.8, es-SE;q=0.7',
            'x-env': 'IOS',
            'user-agent': 'GuruShotsIOS/2.11.3 (com.gurushots.app; build:507; iOS 15.3.0) Alamofire/5.0.0-rc.2',
            'content-length': '0',
            'x-app-version': '2.11.3',
            'connection': 'keep-alive',
            'accept': '*/*',
            'x-brand': 'Apple',
        }
    };

    return await axios(config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error('getting active challenges error')
            console.error(error);
        });
}

export const getVoteImages = async (challenge) => {
    console.log(`getting vote image of challenge ${challenge.title} ${challenge.url}`)
    var axios = require('axios');
    var data = `limit=100&url=${challenge.url}`;


    var config = {
        method: 'post',
        url: 'https://api.gurushots.com/rest_mobile/get_vote_images',
        headers: {
            'host': 'api.gurushots.com',
            'accept': '*/*',
            'x-device': 'iPhone',
            'x-requested-with': 'XMLHttpRequest',
            'x-model': 'iPhone X',
            'x-token': user.token,
            'accept-language': 'fr-SE;q=1.0, en-SE;q=0.9, sv-SE;q=0.8, es-SE;q=0.7',
            'x-api-version': '20',
            'accept-encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
            'x-env': 'IOS',
            'user-agent': 'GuruShotsIOS/2.11.3 (com.gurushots.app; build:507; iOS 15.3.0) Alamofire/5.0.0-rc.2',
            'content-length': data.length,
            'x-app-version': '2.11.3',
            'connection': 'keep-alive',
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'x-brand': 'Apple',
        },
        data: data
    };

    return await axios(config)
        .then(function (response) {
            console.log('get vote image success')
            return response.data
        })
        .catch(function (error) {
            console.error('get vote image failed')
            console.error(error);
        });

}

export const submitVotes = async (voteImages) => {
    const { challenge, voting, images } = voteImages;
    const id = `c_id=${challenge.id}`
    let votedImages = ''

    const viewdImages = images.reduce((prev, curr) => prev + '&' + encodeURIComponent('viewed_image_ids[]') + '=' + curr.id, '')

    let { exposure_factor } = voting.exposure


    while (exposure_factor < 100) {
        const randomItem = images[Math.floor(Math.random() * images.length)];
        if (!votedImages.includes(randomItem.id)) {
            votedImages += '&' + encodeURIComponent('image_ids[]') + '=' + randomItem.id;
            exposure_factor += randomItem.ratio;
        }
    }

    const data = `${id}${votedImages}&layout=scroll${viewdImages}`
    var axios = require('axios');

    var config = {
        method: 'post',
        url: 'https://api.gurushots.com/rest_mobile/submit_vote',
        headers: {
            'host': 'api.gurushots.com',
            'accept': '*/*',
            'x-device': 'iPhone',
            'x-requested-with': 'XMLHttpRequest',
            'x-model': 'iPhone X',
            'x-token': user.token,
            'accept-language': 'fr-SE;q=1.0, en-SE;q=0.9, sv-SE;q=0.8, es-SE;q=0.7',
            'x-api-version': '20',
            'accept-encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
            'x-env': 'IOS',
            'user-agent': 'GuruShotsIOS/2.11.3 (com.gurushots.app; build:507; iOS 15.3.0) Alamofire/5.0.0-rc.2',
            'content-length': data.length,
            'x-app-version': '2.11.3',
            'connection': 'keep-alive',
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'x-brand': 'Apple',
        },
        data: data
    };


    return await axios(config)
        .then(function (response) {
            console.log('submit votes success')
            return {
                data,
                response: response.data
            }
        })
        .catch(function (error) {
            console.error('submit votes failed')
            console.error(error);
        });
}


export const fetchChallengesAndVote = async () => {
    if (!user.token) {
        const userLogin = await login('sbro@me.com', '4gJhnojcBH7EDnmqf7aby')
        user = userLogin
    }
    const activesChallenges = await getActiveChallenges()
    const { challenges } = activesChallenges
    for (challenge of challenges) {
        console.log(challenge.member.ranking.exposure.exposure_factor)
        if (challenge.member.ranking.exposure.exposure_factor < 100) {
            const voteImages = await getVoteImages(challenge)
            const vote = await submitVotes(voteImages)
        }
    }
    return 'done'
}