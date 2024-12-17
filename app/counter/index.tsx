/* eslint-disable prettier/prettier */
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Notifcation from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { theme } from "../../theme";
import { useEffect, useState } from "react";
import { Duration, isBefore, intervalToDuration, set } from "date-fns";
import { TimeSegment } from "../../component/TimerSegment";

const timestamp = Date.now() + 10 * 1000;

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  console.log(status);

  useEffect(() => {

    const intervalId = setInterval(() => {
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
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      await Notifcation.scheduleNotificationAsync({
        content: {
          title: "i am checking from your app",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      Alert.alert(
        "You need to enable permission to send notification, go to settings and enable it",
      );
    }
  };


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
    margingBottom: 24,
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


});
