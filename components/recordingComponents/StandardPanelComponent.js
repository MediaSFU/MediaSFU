import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

/**
 * StandardPanelComponent - A React Native component for rendering a standard panel with picker inputs.
 * @param {Object} props - The props passed to the StandardPanelComponent.
 * @param {Object} props.parameters - The parameters for configuring the panel.
 * @param {string} props.parameters.recordingMediaOptions - The selected recording media options.
 * @param {string} props.parameters.recordingAudioOptions - The selected recording audio options.
 * @param {string} props.parameters.recordingVideoOptions - The selected recording video options.
 * @param {boolean} props.parameters.recordingAddHLS - The selected recording HLS option.
 * @param {Function} props.parameters.updateRecordingMediaOptions - Callback to update the recording media options.
 * @param {Function} props.parameters.updateRecordingAudioOptions - Callback to update the recording audio options.
 * @param {Function} props.parameters.updateRecordingVideoOptions - Callback to update the recording video options.
 * @param {Function} props.parameters.updateRecordingAddHLS - Callback to update the recording HLS option.
 * @returns {React.Component} - The StandardPanelComponent.
 */
const StandardPanelComponent = ({ parameters }) => {
  const {
    recordingMediaOptions,
    recordingAudioOptions,
    recordingVideoOptions,
    recordingAddHLS,
    updateRecordingMediaOptions,
    updateRecordingAudioOptions,
    updateRecordingVideoOptions,
    updateRecordingAddHLS,
    eventType,
  } = parameters;

  // Styles for the picker input
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'black',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
    },
  });

  return (
    <View>
      {/* Media Options */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Media Options:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingMediaOptions}
          onValueChange={(value) => updateRecordingMediaOptions(value)}
          items={[
            { label: 'Record Video', value: 'video' },
            { label: 'Record Audio Only', value: 'audio' },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />

      {eventType != 'broadcast' && (
      <>
      {/* Specific Audios */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Specific Audios:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingAudioOptions}
          onValueChange={(value) => updateRecordingAudioOptions(value)}
          items={[
            { label: 'Add All', value: 'all' },
            { label: 'Add All On Screen', value: 'onScreen' },
            { label: 'Add Host Only', value: 'host' },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />

      {/* Specific Videos */}
      <View style={styles.formGroup} id="conditionalConference">
        <Text style={styles.label}>Specific Videos:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingVideoOptions}
          onValueChange={(value) => updateRecordingVideoOptions(value)}
          items={[
            { label: 'Add All', value: 'all' },
            { label: 'Big Screen Only (includes screenshare)', value: 'mainScreen' },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />
      </>
      )}

      {/* Add HLS */}
      <View style={styles.formGroup} id="addHLSPart">
        <Text style={styles.label}>Add HLS:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingAddHLS}
          onValueChange={(value) => updateRecordingAddHLS(value)}
          items={[
            { label: 'True', value: true },
            { label: 'False', value: false },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />

      {/* Separator */}
      <View style={styles.hr} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 10,
  },
  label: {
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  sep: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 3,
  },
});

export default StandardPanelComponent;

