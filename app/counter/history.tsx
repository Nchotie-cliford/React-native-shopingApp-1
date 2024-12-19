/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from 'react';
import { PersistedCountdownState, CountdownStorageKey } from "./index";
import { getFromStorage } from "../../utils/storage";
import { theme } from "../../theme";
import { format } from "date-fns";


const fullDateFormat = `LLL d yyyy, h:mm aaa`;


export default function HistoryScreen() {
    const [countdownState, setCountdownState] =
        useState<PersistedCountdownState>();

    useEffect(() => {
        const init = async () => {
            const value = await getFromStorage(CountdownStorageKey);
            setCountdownState(value);
        };
        init();
    }, []);

    return (
        <FlatList
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            data={countdownState?.completedAtTimestamp}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <Text style={styles.listItemText}>
                        {format(item, fullDateFormat)}
                    </Text>
                </View>
            )}
            ListEmptyComponent={
                < View style={styles.listEmptyContainer} >
                    <Text>Your shopping list is empty</Text>
                </View >
            }
        />
    );
}


const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: theme.colorWhite,
    },
    contentContainer: {
        marginTop: 8,
    },
    listEmptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 18,
    },
    listItem: {
        marginHorizontal: 8,
        marginBottom: 8,
        alignItems: "center",
        backgroundColor: theme.colorLightGrey,
        padding: 12,
        borderRadius: 6,
    },
    listItemText: {
        fontSize: 18,
    },


});

