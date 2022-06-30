import axios from 'axios'

let userAgent = 'GuruShotsIOS/2.11.6 (com.gurushots.app; build:519; iOS 15.5.0) Alamofire/5.0.0-rc.2';
let appVersion = '2.11.6'

export const login = async (user, password) => {
    const data = `login=${encodeURIComponent(user)}&password=${password}`;

    return await axios.post('signup', data, { headers: { 'content-length': data.length, } })
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error('login error')
            console.error(error);
        });
}


export const getActiveChallenges = async () => {
    return await axios.post(
        '/get_my_active_challenges',
        {},
        {
            headers: {
                'content-length': '0'
            }
        })
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error('getting active challenges error')
            console.error(error);
        });
}

export const getVoteImages = async (challenge) => {
    var data = `limit=100&url=${challenge.url}`;

    return await axios.post('get_vote_images', data, { headers: { 'content-length': data.length } })
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error('get vote image failed')
            console.error(error);
        });


}

export const submitVotes = async (voteImages) => {
    const { challenge, voting, images } = voteImages;
    if (!images.length) return;
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


    return await axios.post('submit_vote', data, { headers: { 'content-length': data.length } })
        .then(function (response) {
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
    const activesChallenges = await getActiveChallenges()
    const { challenges } = activesChallenges
    const now = Math.floor(Date.now() / 1000)
    for (challenge of challenges) {
        const { boost } = challenge.member
        if (boost.state === 'AVAILABLE' && boost.timeout) {
            console.log('Boost available for challenge ' + challenge.title)
        }
        if (challenge.member.ranking.exposure.exposure_factor < 100 && challenge.start_time < now) {
            const voteImages = await getVoteImages(challenge)
            const vote = await submitVotes(voteImages)
        }
    }
    return 'done'
}