/**
 * React component representing a menu item.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.icon - The name of the FontAwesome icon to be displayed.
 * @param {string} props.name - The text to be displayed as the menu item name.
 * @param {Function} props.onPress - The callback function to be invoked when the menu item is pressed.
 * @returns {React.ReactNode} - The rendered MenuItemComponent.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const MenuItemComponent = ({ icon, name, onPress }) => {
  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      {icon && <FontAwesome name={icon} style={styles.listIcon} />}
      {name && <Text style={styles.listText}>{name}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 16,
    paddingLeft: 0,
    marginLeft: 0,
    marginBottom: 10,
  },

  listIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#ffffff',
  },

  listText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default MenuItemComponent;
