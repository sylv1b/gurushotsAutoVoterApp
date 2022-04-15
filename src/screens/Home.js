import { View, Text, FlatList, TouchableOpacity, RefreshControl, Appearance, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChallengesAndVote, getActiveChallenges } from '../utils/gurushotsApi'
import ChallengeCard from '../components/ChallengeCard'
import queue, { Worker } from 'react-native-job-queue'
import moment from 'moment'

export default function Home() {
    const [challenges, setChallenges] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [voting, setVoting] = useState(false)
    const [voteScheduleInterval, setVoteScheduleInterval] = useState(5 * 60 * 1000)
    const [recursionCounter, setRecursionCounter] = useState(0)
    const [isAutoVoteEnabled, setIsAutoVoteEnabled] = useState(false)
    const [nextVoteTimeStamp, setNextVoteTimeStamp] = useState(0)
    const colorScheme = Appearance.getColorScheme();
    const isDark = colorScheme === 'dark';


    useEffect(() => {
        queue.configure({
            onQueueFinish: (executedJobs) => {
                console.log("Queue stopped and executed", executedJobs)
            }
        });


        const registeredWorkers = queue.registeredWorkers;
        if (!registeredWorkers['do-autovote']) {
            queue.addWorker(new Worker("do-autovote", async (payload) => {
                return await new Promise((resolve) => {
                    setTimeout(() => {
                        voteToAllChallenges()
                        setIsAutoVoteEnabled(true)
                        setRecursionCounter(recursionCounter + 1)
                        queue.addJob('do-autovote', {});
                        setNextVoteTimeStamp(Date.now() + voteScheduleInterval)
                        resolve();
                    }, voteScheduleInterval);
                });
            }))
        }
    }, [])

    const startAutoVote = () => {
        setIsAutoVoteEnabled(true)
        setNextVoteTimeStamp(Date.now() + voteScheduleInterval)
        voteToAllChallenges()
        setRecursionCounter(recursionCounter + 1)
        queue.addJob('do-autovote', {})
        queue.start();
    }

    const stopAutoVote = () => {
        setIsAutoVoteEnabled(false)
        setRecursionCounter(0)
        queue.stop()
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

    const header = (
        <View style={{ paddingHorizontal: 8, marginVertical: 12 }}>
            <View>
                <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? 'white' : 'black' }}>
                        {loading || refreshing ? voting ? isAutoVoteEnabled ? 'Autovoting...' : 'Voting...' : 'Loading challenges...' : `Active Challenge${challenges.challenges.length > 1 ? 's' : ''}`}
                    </Text>
                    <TouchableOpacity onPress={() => isAutoVoteEnabled ? stopAutoVote() : startAutoVote()} style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 18, color: isAutoVoteEnabled ? 'red' : 'green', marginLeft: 4 }}>{isAutoVoteEnabled ? 'Stop' : 'Start'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: isAutoVoteEnabled ? 'green' : 'red' }}>Autovoter {isAutoVoteEnabled ? 'enabled' : 'disabled'} </Text>
                    <ActivityIndicator size='small' color='green' animating={isAutoVoteEnabled} />
                </View>
                {isAutoVoteEnabled && <View>
                    <Text style={{ color: isDark ? 'white' : 'black' }}>Voted {recursionCounter} times</Text>
                    <Text style={{ color: isDark ? 'white' : 'black' }}>Next vote at {moment(moment.unix(nextVoteTimeStamp / 1000)).local().format('HH:mm:ss')}</Text>
                </View>}
            </View>
        </View>
    )

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