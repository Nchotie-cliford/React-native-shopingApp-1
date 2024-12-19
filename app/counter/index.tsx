/* eslint-disable prettier/prettier */
import {
  Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions,

} from "react-native";
import * as Notifcation from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { theme } from "../../theme";
import { useEffect, useState, useRef } from "react";
import { Duration, isBefore, intervalToDuration, set } from "date-fns";
import { TimeSegment } from "../../component/TimerSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";


//2 weeks  from now
const frequency = 14 * 24 * 60 * 60 * 1000;

export const CountdownStorageKey = "taskly-countdown";

export type PersistedCountdownState = {
  currentNotifcationId: string | undefined;
  completedAtTimestamp: number[];
};


type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [isLoading, setIsloading] = useState(true);
  const confettiRef = useRef<any>();
  const [countdownState, setCountdwonState] = useState<PersistedCountdownState>();

  const [status, setStatus] = useState<CountdownStatus>({


    isOverdue: false,
    distance: {},
  });

  const lastCompletedTimestamp = countdownState?.completedAtTimestamp[0]

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(CountdownStorageKey);
      setCountdwonState(value);
    };
    init();
  }, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now();
      if (lastCompletedTimestamp) {
        setIsloading(false);
      }
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : {
            start: Date.now(),
            end: timestamp,
          },
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedTimestamp]);



  const scheduleNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiRef?.current?.start();
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifcation.scheduleNotificationAsync({
        content: {
          title: "the thing is due",
        },
        trigger: {
          seconds: frequency / 1000,
        },
      });

    } else {
      Alert.alert(
        "You need to enable permission to send notification, go to settings and enable it",
      );
    }
    if (countdownState?.currentNotifcationId) {
      await Notifcation.cancelScheduledNotificationAsync(countdownState?.currentNotifcationId,
      );
    }
    const newCountdownState: PersistedCountdownState = {
      currentNotifcationId: pushNotificationId,
      completedAtTimestamp: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamp]
        : [Date.now()],
    };
    setCountdwonState(newCountdownState);
    await saveToStorage(CountdownStorageKey, newCountdownState);
  };


  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, status.isOverdue ? styles.contianerLate : undefined,
    ]}>
      {status.isOverdue ? (
        <Text style={[styles.heading]}>Time is up</Text>
      ) : (<Text style={[styles.heading, styles.whiteText]}> Things due ...</Text>
      )}

      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverdue ?
            styles.whiteText : undefined}
        />
        <TimeSegment
          unit="hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverdue ?
            styles.whiteText : undefined} />
        <TimeSegment
          unit="Minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverdue ?
            styles.whiteText : undefined} />
        <TimeSegment
          unit="Seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined} />
      </View>

      <TouchableOpacity
        onPress={scheduleNotification}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Schedule notification</Text>
      </TouchableOpacity>
      <ConfettiCannon ref={confettiRef}
        count={50}
        origin={{ x: Dimensions.get("window").width / 2, y: -30 }}
        autoStart={false}
        fadeOut={true}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  contianerLate: {
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  whiteText: {
    color: theme.colorWhite,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite
  },


});
