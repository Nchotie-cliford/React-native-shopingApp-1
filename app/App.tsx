import { StyleSheet, View } from "react-native";
import { ShoppingListItem } from "../component/ShoppingListItem";
import { theme } from "../theme";

export default function App() {
  return (
    <View style={styles.container}>
      <ShoppingListItem name="Coffee" />
      <ShoppingListItem name="Tee" isCompleted />
      <ShoppingListItem name="Sugar" isCompleted/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
