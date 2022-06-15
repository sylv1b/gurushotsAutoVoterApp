import { View, Text, FlatList, TouchableOpacity, RefreshControl, Appearance, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChallengesAndVote, getActiveChallenges } from '../utils/gurushotsApi'
import ChallengeCard from '../components/ChallengeCard'
import { useSelector, useDispatch } from 'react-redux'
import colors from '../styles/colors'
import {
    TextField,
    Button
} from '../components/shared'

export default function Home() {
    const { user } = useSelector(state => state.auth)
    const [challenges, setChallenges] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [voting, setVoting] = useState(false)
    const colorScheme = Appearance.getColorScheme();
    const [forceRefresh, setForceRefresh] = useState(false)
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        if (!challenges.challenges || forceRefresh) {
            getActiveChallenges(user)
                .then(challenges => {
                    setChallenges(challenges)
                    setLoading(false)
                    setRefreshing(false)
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

    const header = (
        <View style={{ paddingHorizontal: 8, marginVertical: 12 }}>
            <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-between', alignItems: 'center', }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? 'white' : 'black' }}>
                    {`Active Challenge${challenges?.challenges?.length > 1 ? 's' : ''}`}
                </Text>
            </View>
        </View>
    )

    const footer_ = !loading && (<TouchableOpacity
        style={{ marginVertical: 20, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: loading ? 'grey' : 'coral' }}
        onPress={() => voteToAllChallenges()}
        disabled={loading || refreshing}
    >
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
            Vote to all challenges
        </Text>
    </TouchableOpacity>)

    const footer = (
        <Button
            text={voting ? 'Voting...' : 'Vote to all challenges'}
            onPress={() => voteToAllChallenges()}
            color={loading || refreshing ? colors.mistyRose : colors.vividTangerine}
            disabled={loading || refreshing}
        />
    )

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.isabelline,
        }}>
            <FlatList
                data={challenges.challenges ? challenges.challenges.sort((a, b) => a.close_time - b.close_time) : []}
                renderItem={({ item }) => <ChallengeCard challenge={item} forceRefresh={(b) => setForceRefresh(b)} />}
                keyExtractor={item => item.id}
                //ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: colors.polishedPine }} />}
                //ListHeaderComponent={header}
                ListFooterComponent={footer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                    getActiveChallenges(user).then((challenges) => {
                        setChallenges(challenges)
                        setRefreshing(false)
                    }), setRefreshing(true)
                }} />}
            />
        </View>
    )
}