import { Alert, StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleCompleted: () => void;
}; 

export function ShoppingListItem({ name, isCompleted, onDelete, onToggleCompleted}: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to Delete ${name}?`,
      "It will be deleted for good",
      [
        {
          text: "Yes",
          onPress: () => onDelete(),
          style: "destructive",
        },

        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
      onPress={onToggleCompleted}
    >
      <Text
        style={[
          styles.itemText,
          isCompleted ? styles.completedText : undefined,
        ]}
      >
        {name}
      </Text>
      
      <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
        <AntDesign
         name="closecircle"
         size={24} 
         color={isCompleted ? theme.colorGrey :  theme.colorRed} />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  completedContainer: {
    backgroundColor: theme.colorLightGrey,
    borderBlockColor: theme.colorLightGrey,
  },

  completedText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGrey,
    color: theme.colorGrey,
  },

  itemText: {
    fontSize: 18,
    fontWeight: "200",
  },
});
