import { View, Text, FlatList, TouchableOpacity, RefreshControl, Appearance, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChallengesAndVote, getActiveChallenges } from '../utils/gurushotsApi'
import ChallengeCard from '../components/ChallengeCard'
import BackgroundTimer from 'react-native-background-timer';

export default function Home() {
    const [challenges, setChallenges] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [voting, setVoting] = useState(false)
    const [voteScheduleInterval, setVoteScheduleInterval] = useState(15 * 60 * 1000)
    const [isAutoVoteEnabled, setIsAutoVoteEnabled] = useState(false)
    const colorScheme = Appearance.getColorScheme();
    const isDark = colorScheme === 'dark';

    const voteScheduler = BackgroundTimer;

    const enableVoteSchedule = () => {
        setIsAutoVoteEnabled(true)
        voteScheduler.runBackgroundTimer(() => {
            setIsAutoVoteEnabled(true)
            voteToAllChallenges()
        },
            voteScheduleInterval);
    }


    const disableVoteSchedule = () => {
        voteScheduler.stopBackgroundTimer();
        setIsAutoVoteEnabled(false)
    }

    useEffect(() => {
        if (!challenges.challenges) {
            getActiveChallenges()
                .then(challenges => {
                    setChallenges(challenges)
                    setLoading(false)
                    setRefreshing(false)
                })
        }
    }, [challenges])

    const voteToAllChallenges = async () => {
        setVoting(true)
        setLoading(true)
        fetchChallengesAndVote().then(res => {
            getActiveChallenges().then((challenges) => {
                setChallenges(challenges)
                setLoading(false)
                setVoting(false)
            })
        })
    }

    console.log(challenges)

    const header = (<View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? 'white' : 'black' }}>
            {loading || refreshing ? voting ? 'Voting...' : 'Loading challenges...' : `Active Challenge${challenges.challenges.length > 1 ? 's' : ''}`}
        </Text>
        <TouchableOpacity onPress={() => isAutoVoteEnabled ? disableVoteSchedule() : enableVoteSchedule()} style={{ flexDirection: 'row' }}>
            <ActivityIndicator size="small" color={isDark ? 'white' : 'black'} animating={isAutoVoteEnabled} />
            <Text style={{ fontSize: 18, color: isAutoVoteEnabled ? 'green' : 'red', marginLeft: 4 }}>{isAutoVoteEnabled ? 'Autovote on' : 'Stopped'}</Text>
        </TouchableOpacity>
    </View>)

    const footer = !loading && (<TouchableOpacity
        style={{ marginVertical: 20, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: loading ? 'grey' : 'coral' }}
        onPress={() => voteToAllChallenges()}
        disabled={loading || refreshing}
    >
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
            Vote to all challenges
        </Text>
    </TouchableOpacity>)

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={challenges.challenges ? challenges.challenges.sort((a, b) => a.close_time - b.close_time) : []}
                renderItem={({ item }) => <ChallengeCard challenge={item} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListHeaderComponent={header}
                ListFooterComponent={footer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                    getActiveChallenges().then((challenges) => {
                        setChallenges(challenges)
                        setRefreshing(false)
                    }), setRefreshing(true)
                }} />}
            />
        </View>
    )
}