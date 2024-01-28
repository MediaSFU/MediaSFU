import React from 'react';
import { View, Pressable, StyleSheet, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const ShareButtonsComponent = ({ meetingID, shareButtons = [], eventType }) => {

  const shareName = eventType === 'chat' ? 'chat' : eventType === 'broadcast' ? 'broadcast' : 'meeting';

  const defaultShareButtons = [
    {
      icon: 'copy',
      action: async () => {
        // Action for the copy button
        await Clipboard.setStringAsync(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`);
        await Clipboard.getStringAsync();
      },
      show: true,
    },
    {
      icon: 'envelope',
      action: () => {
        // Action for the email button
        const emailUrl = `mailto:?subject=Join my meeting&body=Here's the link to the meeting: https://${shareName}.mediasfu.com/${shareName}/${meetingID}`;
        Linking.openURL(emailUrl);
      },
      show: true,
    },
    {
      icon: 'facebook',
      action: () => {
        // Action for the Facebook button
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`)}`;
        Linking.openURL(facebookUrl);
      },
      show: true,
    },
    {
      icon: 'whatsapp',
      action: () => {
        // Action for the WhatsApp button
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`)}`;
        Linking.openURL(whatsappUrl);
      },
      show: true,
    },
    {
      icon: 'telegram',
      action: () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://${shareName}.mediasfu.com/${shareName}/${meetingID}`)}`;
        Linking.openURL(telegramUrl);
      },
      show: true,
    },
  ];

  const filteredShareButtons = shareButtons.length > 0 ? shareButtons.filter(button => button.show) : defaultShareButtons.filter(button => button.show);

  return (
    <View style={styles.shareButtonsContainer}>
      {filteredShareButtons.map((button, index) => (
        <Pressable key={index} onPress={button.action} style={[styles.shareButton, { backgroundColor: button.color || 'black' }]} >
          <FontAwesome name={button.icon} style={[styles.shareIcon, { color: button.iconColor || '#ffffff' }]} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  shareButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#007BFF', // Example background color
  },
  shareIcon: {
    color: '#ffffff', // Example icon color
    fontSize: 24,
  },
});

export default ShareButtonsComponent;
