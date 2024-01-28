import React from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from @expo/vector-icons
import { generatePageContent } from '../../consumers/generatePageContent';

const Pagination = ({
  totalPages,
  currentUserPage,
  handlePageChange,
  position = 'middle',
  location = 'bottom',
  direction = 'horizontal',
  buttonsContainerStyle,
  alternateIconComponent,
  iconComponent,
  activePageStyle = { backgroundColor: '#2c678f' },
  inactivePageStyle,
  backgroundColor = '#ffffff',
  paginationHeight = 40,
  showAspect= true,
    parameters,
}) => {

  let { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams()


  const data = Array.from({ length: totalPages + 1 }, (_, index) => index); // Increase the length by 1

  const getAlignmentStyle = () => {
    let alignmentStyle = {};

    if (position === 'left' || position === 'right' || position === 'middle') {
      alignmentStyle.justifyContent =
        position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';
    }

    if (location === 'top' || location === 'bottom' || location === 'center') {
      alignmentStyle.alignItems = location === 'top' ? 'flex-start' : location === 'bottom' ? 'flex-end' : 'center';
    }

    if (direction === 'vertical') {
      alignmentStyle.flexDirection = 'column';
      alignmentStyle.maxWidth = paginationHeight;
    } else {
      alignmentStyle.flexDirection = 'row';
      alignmentStyle.maxHeight = paginationHeight;
    }

    return alignmentStyle;
  };

  const renderItem = ({ item }) => {
    const isActive = item === currentUserPage;
    const pageStyle = isActive ? activePageStyle : inactivePageStyle;

    const handleClick = () => {
      if (!isActive) {
        handlePageChange(item);
      }
    };



    async function handlePageChange(page) {
        // Generate the content for the current page
        await generatePageContent({ page,parameters});
      }

    return (
      <Pressable
        style={[
          styles.pageButton,
          pageStyle,
          buttonsContainerStyle,
        ]}
        onPress={handleClick}
      >
        {item === 0 ? (
          <FontAwesome name="star" size={18} color={isActive ? 'yellow' : 'gray'} />
        ) : (
          <Text style={styles.pageText}>{item}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
    data={data}
    keyExtractor={(item) => `${item}`}
    horizontal={direction === 'horizontal'}
    renderItem={renderItem}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={[
      styles.paginationContainer,
      { backgroundColor },
      getAlignmentStyle(),
      { justifyContent: 'space-evenly' },
 
    ]}
      style={{display: showAspect ? 'flex' : 'none'}}
    />
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexGrow: 1,
    padding:0,
    margin:0,

  },
  pageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  pageText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Pagination;
