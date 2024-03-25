import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Button, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

/**
 * AdvancedPanelComponent - A React Native component for rendering an advanced panel with various configuration options.
 * @param {Object} props - The props passed to the AdvancedPanelComponent.
 * @param {Object} props.parameters - The parameters for configuring the panel.
 * @param {string} props.parameters.recordingVideoType - The selected recording video type.
 * @param {string} props.parameters.recordingDisplayType - The selected recording display type.
 * @param {string} props.parameters.recordingBackgroundColor - The selected recording background color.
 * @param {string} props.parameters.recordingNameTagsColor - The selected recording name tags color.
 * @param {string} props.parameters.recordingOrientationVideo - The selected recording video orientation.
 * @param {boolean} props.parameters.recordingNameTags - The selected recording name tags option.
 * @param {Function} props.parameters.recordingAddText - The selected recording add text option.
 * @param {string} props.parameters.recordingCustomText - The selected recording custom text.
 * @param {string} props.parameters.recordingCustomTextPosition - The selected recording custom text position.
 * @param {string} props.parameters.recordingCustomTextColor - The selected recording custom text color.
 * @param {Function} props.parameters.updateRecordingVideoType - Callback to update the recording video type.
 * @param {Function} props.parameters.updateRecordingDisplayType - Callback to update the recording display type.
 * @param {Function} props.parameters.updateRecordingBackgroundColor - Callback to update the recording background color.
 * @param {Function} props.parameters.updateRecordingNameTagsColor - Callback to update the recording name tags color.
 * @param {Function} props.parameters.updateRecordingOrientationVideo - Callback to update the recording video orientation.
 * @param {Function} props.parameters.updateRecordingNameTags - Callback to update the recording name tags option.
 * @param {Function} props.parameters.updateRecordingAddText - Callback to update the recording add text option.
 * @param {Function} props.parameters.updateRecordingCustomText - Callback to update the recording custom text.
 * @param {Function} props.parameters.updateRecordingCustomTextPosition - Callback to update the recording custom text position.
 * @param {Function} props.parameters.updateRecordingCustomTextColor - Callback to update the recording custom text color.
 * @returns {React.Component} - The AdvancedPanelComponent.
 */
const AdvancedPanelComponent = ({ parameters }) => {
  let {
    recordingVideoType,
    recordingDisplayType,
    recordingBackgroundColor,
    recordingNameTagsColor,
    recordingOrientationVideo,
    recordingNameTags,
    recordingAddText,
    recordingCustomText,
    recordingCustomTextPosition,
    recordingCustomTextColor,
    updateRecordingVideoType,
    updateRecordingDisplayType,
    updateRecordingBackgroundColor,
    updateRecordingNameTagsColor,
    updateRecordingOrientationVideo,
    updateRecordingNameTags,
    updateRecordingAddText,
    updateRecordingCustomText,
    updateRecordingCustomTextPosition,
    updateRecordingCustomTextColor,
    eventType
  } = parameters;

  // State for selected orientation video
  const [selectedOrientationVideo, setSelectedOrientationVideo] = useState('landscape');

  // State for color picker modal visibility
  const [showBackgroundColorModal, setShowBackgroundColorModal] = useState(false);
  const [showNameTagsColorModal, setShowNameTagsColorModal] = useState(false);
  const [showCustomTextColorModal, setShowCustomTextColorModal] = useState(false);

  // State for selected color type (background color or name tags color)
  const [selectedColorType, setSelectedColorType] = useState('');

  //recording text 
  const [recordingText, setRecordingText] = useState(recordingAddText);
  const [customText, setCustomText] = useState(recordingCustomText);
  
  function validateTextInput(input) {
    // Regular expression to match alphanumeric characters and spaces, with a maximum length of 40 characters
    const regex = /^[a-zA-Z0-9\s]{1,40}$/;

    // Test the input against the regular expression
    return regex.test(input);
 }

  // Handle text input change
  const onChangeTextHandler = (text) => {
    if (text && text.length > 0) {
      if (!validateTextInput(text)) {
        return;
      }
    }

    updateRecordingCustomText(text);
    setCustomText(text);
  };

  useEffect(() => {
    setSelectedOrientationVideo(recordingOrientationVideo);
  }, [recordingOrientationVideo]);

  // Handle color selection in the color picker
  const onSelectColor = ({ hex }) => {

    try {
      if (showBackgroundColorModal) {
        setSelectedColorType('backgroundColor');
      } else if (showCustomTextColorModal) {
        setSelectedColorType('customTextColor');
      } else if (showNameTagsColorModal) {
        setSelectedColorType('nameTagsColor');
      }
      handleColorChange(hex);
    } catch (error) {
      
    }
   
  };

  // Update the corresponding state based on the selected color type
  const handleColorChange = (color) => {

    try {
      if (selectedColorType === 'backgroundColor') {
        updateRecordingBackgroundColor(color);
      } else if (selectedColorType === 'customTextColor') {
        updateRecordingCustomTextColor(color);
      } else if (selectedColorType === 'nameTagsColor') {
        updateRecordingNameTagsColor(color);
      }
    } catch (error) {
      
    }

  };

  // Handle text change
  const handleTextChange = (value) => {
    setRecordingText(value == 'true' || value == true);
    updateRecordingAddText(value == 'true' || value == true);
  };

  // Toggle color picker modal visibility based on color type
  const toggleColorPicker = (colorType) => {

    try {
      setSelectedColorType(colorType);
      if (colorType === 'backgroundColor') {
        setShowBackgroundColorModal(true);
        setShowNameTagsColorModal(false);
        setShowCustomTextColorModal(false);
      } else if (colorType === 'customTextColor') {
        setShowCustomTextColorModal(true);
        setShowBackgroundColorModal(false);
        setShowNameTagsColorModal(false);
      } else if (colorType === 'nameTagsColor') {
        setShowNameTagsColorModal(true);
        setShowBackgroundColorModal(false);
        setShowCustomTextColorModal(false);
      }
    } catch (error) {
      
    }
   
  };

  return (
    <View>
      {/* Video Type */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Video Type:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingVideoType}
          onValueChange={(value) => updateRecordingVideoType(value)}
          items={[
            { label: 'Full Display (no background)', value: 'fullDisplay' },
            { label: 'Full Video', value: 'bestDisplay' },
            { label: 'All', value: 'all' },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />
      
           {/* Display Type */}
      {eventType != 'broadcast' && (
      <View style={styles.formGroup}>
        <Text style={styles.label}>Display Type:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingDisplayType}
          onValueChange={(value) => updateRecordingDisplayType(value)}
          items={[
            { label: 'Only Video Participants', value: 'video' },
            { label: 'Only Video Participants (optimized)', value: 'videoOpt' },
            { label: 'Participants with media', value: 'media' },
            { label: 'All Participants', value: 'all' },
          ]}
          placeholder={{}}
        />
      </View>
      )}
      <View style={styles.sep} />

      {/* Background Color */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Background Color:</Text>
        <Pressable
          onPress={() => toggleColorPicker('backgroundColor')}
          style={[
            styles.inputContainer,
            {
              backgroundColor: recordingBackgroundColor,
            },
          ]}
        >
          <Text style={{ color: 'white' }}>{recordingBackgroundColor}</Text>
        </Pressable>
        {/* Color Picker Modal for Background Color */}
        <Modal
          visible={showBackgroundColorModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowBackgroundColorModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Color Picker Component */}
              <ColorPicker style={{ width: '100%', height: '60%' }} value={recordingBackgroundColor} onComplete={onSelectColor}>
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
                <Button title="Ok" onPress={() => setShowBackgroundColorModal(false)} />
              </ColorPicker>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.sep} />

      {/* Add Text or not */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Add Text:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingText}
          onValueChange={handleTextChange}
          items={[
            { label: 'True', value: true },
            { label: 'False', value: false },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />
      {/* Custom Text */}
      {recordingText && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Custom Text:</Text>
          <TextInput
            style={styles.input} // Define your custom input styles here
            value={customText}
            onChangeText={onChangeTextHandler}
            placeholder="Enter custom text"
          />
        </View>
      )}
      {recordingText && (
      <View style={styles.sep} />
      )}

      {/* Custom Text Position */}
      {recordingText && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Custom Text Position:</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            value={recordingCustomTextPosition}
            onValueChange={(value) => updateRecordingCustomTextPosition(value)}
            items={[
              { label: 'Top', value: 'top' },
              { label: 'Middle', value: 'middle' },
              { label: 'Bottom', value: 'bottom' },
            ]}
            placeholder={{}}
          />
        </View>
      )}
      {recordingText && (
      <View style={styles.sep} />
      )}

      {/* Custom Text Color */}
      {recordingText && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Custom Text Color:</Text>
          <Pressable
            onPress={() => toggleColorPicker('customTextColor')}
            style={[
              styles.inputContainer,
              {
                backgroundColor: recordingCustomTextColor,
              },
            ]}
          >
            <Text style={{ color: 'white' }}>{recordingCustomTextColor}</Text>
          </Pressable>
          {/* Color Picker Modal for Custom Text Color */}
          <Modal
            visible={showCustomTextColorModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowCustomTextColorModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Color Picker Component */}
                <ColorPicker style={{ width: '100%', height: '60%' }} value={recordingCustomTextColor} onComplete={onSelectColor}>
                  <Preview />
                  <Panel1 />
                  <HueSlider />
                  <OpacitySlider />
                  <Swatches />
                  <Button title="Ok" onPress={() => setShowCustomTextColorModal(false)} />
                </ColorPicker>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {recordingText && (
      <View style={styles.sep} />
      )}
      


      {/* Add name tags or not */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Add Name Tags:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={recordingNameTags}
          onValueChange={(value) => updateRecordingNameTags(value)}
          items={[
            { label: 'True', value: true },
            { label: 'False', value: false },
          ]}
          placeholder={{}}
        />
      </View>
      <View style={styles.sep} />


      {/* Name Tags Color */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name Tags Color:</Text>
        <Pressable
          onPress={() => toggleColorPicker('nameTagsColor')}
          style={[
            styles.inputContainer,
            {
              backgroundColor: recordingNameTagsColor,
            },
          ]}
        >
          <Text style={{ color: 'white' }}>{recordingNameTagsColor}</Text>
        </Pressable>
        {/* Color Picker Modal for Name Tags Color */}
        <Modal
          visible={showNameTagsColorModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowNameTagsColorModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Color Picker Component */}
              <ColorPicker style={{ width: '100%', height: '60%' }} value={recordingNameTagsColor} onComplete={onSelectColor}>
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
                <Button title="Ok" onPress={() => setShowNameTagsColorModal(false)} />
              </ColorPicker>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.sep} />

      {/* Orientation (Video) */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Orientation (Video):</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={selectedOrientationVideo}
          onValueChange={(value) => {
            updateRecordingOrientationVideo(value);
            setSelectedOrientationVideo(value);
          }}
          items={[
            { label: 'Landscape', value: 'landscape' },
            { label: 'Portrait', value: 'portrait' },
            { label: 'All', value: 'all' },
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
  inputContainer: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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

// Styles for the picker input
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    width: '100%',
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    textAlign: 'left', // Align the text to the left
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 0.5,
    width: '100%',
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 20,
    textAlign: 'left', // Align the text to the left
  },
  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default AdvancedPanelComponent;
