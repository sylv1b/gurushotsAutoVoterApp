import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChallengesAndVote, getActiveChallenges } from '../utils/gurushotsApi'
import ChallengeCard from '../components/ChallengeCard'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../styles/colors'
import {
    Button
} from '../components/shared'
import LoadingOverlay from '../components/shared/LoadingOverlay/LoadingOverlay'

export default function Home() {
    const { user } = useSelector(state => state.auth)
    const [challenges, setChallenges] = useState({})
    const [hasFetched, setHasFetched] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [voting, setVoting] = useState(false)
    const [forceRefresh, setForceRefresh] = useState(false)

    useEffect(() => {
        if (!challenges.challenges || forceRefresh) {
            getActiveChallenges(user)
                .then(challenges => {
                    setChallenges(challenges)
                    setLoading(false)
                    setRefreshing(false)
                    setHasFetched(true)
                })
            setForceRefresh(false)
        }
    }, [challenges, forceRefresh])

    const voteToAllChallenges = async () => {
        setVoting(true)
        setLoading(true)
        fetchChallengesAndVote(user).then(res => {
            getActiveChallenges(user).then((challenges) => {
                setChallenges(challenges)
                setLoading(false)
                setVoting(false)
            })
        })
    }

    const footer = (
        <View style={{ marginBottom: 40 }} />
    )

    if (!hasFetched) {
        return (
            <LoadingOverlay text='Loading challenges...' />
        )
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'black',
        }}>
            {challenges.challenges ?
                <><FlatList
                    data={challenges.challenges ? challenges.challenges.sort((a, b) => a.close_time - b.close_time) : []}
                    renderItem={({ item }) => <ChallengeCard challenge={item} forceRefresh={(b) => setForceRefresh(b)} />}
                    keyExtractor={item => item.id}
                    ListFooterComponent={footer}
                    refreshControl={<RefreshControl refreshing={refreshing} tintColor={'white'} onRefresh={() => {
                        getActiveChallenges(user).then((challenges) => {
                            setChallenges(challenges)
                            setRefreshing(false)
                        }), setRefreshing(true)
                    }} />}
                />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            width: 90,
                            height: 90,
                            backgroundColor: 'rgb(0,0,0)',
                            borderRadius: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: 'white',
                            borderWidth: 2
                        }}
                        onPress={() => voteToAllChallenges()}
                        disabled={loading || refreshing}
                    >
                        {!voting ?
                            <>
                                <Icon name='vote-outline' size={40} color='white' />
                                <Text style={{ color: 'white', fontSize: 10 }}>{voting ? 'Voting...' : `Vote to all`}</Text>
                            </>
                            : <ActivityIndicator />}
                    </TouchableOpacity>
                </>
                : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                        No Active Challenges
                    </Text>
                    <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
                        Go to GS app to enroll to challenges, then come back here to vote.
                    </Text>
                </View>}
        </View>
    )
}