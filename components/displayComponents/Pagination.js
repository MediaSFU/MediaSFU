/**
 * Renders a pagination component with customizable options.
 *
 * @param {Object} props - The component props.
 * @param {number} props.totalPages - The total number of pages.
 * @param {number} props.currentUserPage - The current user page.
 * @param {function} [props.handlePageChange=generatePageContent] - The function to handle page change.
 * @param {string} [props.position='middle'] - The position of the pagination component.
 * @param {string} [props.location='bottom'] - The location of the pagination component.
 * @param {string} [props.direction='horizontal'] - The direction of the pagination component.
 * @param {Object} [props.buttonsContainerStyle] - The style for the buttons container.
 * @param {React.Component} [props.alternateIconComponent] - The alternate icon component.
 * @param {React.Component} [props.iconComponent] - The icon component.
 * @param {Object} [props.activePageStyle={ backgroundColor: '#2c678f' }] - The style for the active page.
 * @param {Object} [props.inactivePageStyle] - The style for the inactive page.
 * @param {string} [props.backgroundColor='#ffffff'] - The background color of the pagination component.
 * @param {number} [props.paginationHeight=40] - The height of the pagination component.
 * @param {boolean} [props.showAspect=true] - Whether to show the pagination component.
 * @param {Object} props.parameters - The parameters object.
 * @returns {React.Component} The pagination component.
 */import React from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { generatePageContent } from '../../consumers/generatePageContent';


const Pagination = ({
  totalPages,
  currentUserPage,
  handlePageChange = generatePageContent,
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
  showAspect = true,
  parameters,
}) => {
  let { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  let {
    mainRoomsLength,
    memberRoom,
    breakOutRoomStarted,
    breakOutRoomEnded,
    member,
    breakoutRooms,
    hostNewRoom,
    roomName,
    islevel,
    showAlert,
    socket,
    //mediaSfu functions
    onScreenChanges,
  } = parameters;

  const data = Array.from({ length: totalPages + 1 }, (_, index) => index);

  const handleClick = async (page, offSet = mainRoomsLength) => {
    if (page == currentUserPage) {
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded && page != '0') {
      //check if you are part of the breakout room
      const roomMember = await breakoutRooms.find(r => r.find(p => p.name == member));
      const pageInt = parseInt(page) - offSet;
      let memberBreakRoom = -1;
      if (roomMember) {
        memberBreakRoom = await breakoutRooms.indexOf(roomMember);
      }

      if ((memberBreakRoom == -1 || memberBreakRoom != pageInt) && pageInt >= 0) {
        if (islevel != '2') {
          if (showAlert) {
            showAlert({ message: `You are not part of the breakout room ${pageInt + 1}.`, type: 'danger' });
          }
          return;
          //generate the page content for the memberBreakRoom
          if (memberBreakRoom != -1) {
            page = `${memberBreakRoom}`;
          } else {
            await handlePageChange({ page, parameters, breakRoom: pageInt, inBreakRoom: true });
            await onScreenChanges({ changed: true, parameters });
          }
          return;
        }

        await handlePageChange({ page, parameters, breakRoom: pageInt, inBreakRoom: true });
        if (hostNewRoom != pageInt) {
          //update the breakout room by moving the user to the breakout room  
          await socket.emit('updateHostBreakout', { newRoom: pageInt, roomName }, async (response) => { });
        }
      } else {
        await handlePageChange({ page, parameters, breakRoom: pageInt, inBreakRoom: pageInt >= 0 });
        //if host; update the breakout room for moving out
        if (islevel == '2' && hostNewRoom != -1) {
          await socket.emit('updateHostBreakout', { prevRoom: hostNewRoom, newRoom: -1, roomName }, async (response) => { });
        }
      }
    } else {
      await handlePageChange({ page, parameters, breakRoom: 0, inBreakRoom: false });
      //if host; update the breakout room for moving out
      if (islevel == '2' && hostNewRoom != -1) {
        await socket.emit('updateHostBreakout', { prevRoom: hostNewRoom, newRoom: -1, roomName }, async (response) => { });
      }
    }
  };

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
  const isActive = item == currentUserPage;
  const pageStyle = isActive ? activePageStyle : inactivePageStyle;

  let displayItem = item;
  const targetPage = memberRoom;
  if (breakOutRoomStarted && !breakOutRoomEnded && item >= mainRoomsLength) {
    const roomNumber = item - (mainRoomsLength - 1);

    if (targetPage + 1 != roomNumber) {
      if (islevel != '2') {
        displayItem = (
          <>
            Room {roomNumber} <FontAwesome name="lock" size={18} />
          </>
        );
      } else {
        displayItem = `Room ${roomNumber}`;
      }
    } else {
      displayItem = `Room ${roomNumber}`;
    }
  } else {
    displayItem = item;
  }

  return (
    <Pressable
      key={item}
      style={[
        styles.pageButton,
        pageStyle,
        buttonsContainerStyle,
      ]}
      onPress={async () => await handleClick(item)}
    >
      {item == 0 ? (
        <FontAwesome name="star" size={18} color={isActive ? 'yellow' : 'gray'} />
      ) : (
        <Text style={[styles.pageText, { color: isActive ? '#ffffff' : '#000000' }]}>{displayItem}</Text>
      )}
    </Pressable>
  );
};

return (
  <FlatList
    data={data}
    keyExtractor={(item) => `${item}`}
    horizontal={direction == 'horizontal'}
    renderItem={renderItem}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={[
      styles.paginationContainer,
      { backgroundColor },
      getAlignmentStyle(),
      { justifyContent: 'space-evenly' },
    ]}
    style={{ display: showAspect ? 'flex' : 'none' }}
  />
);
 };

const styles = StyleSheet.create({
  paginationContainer: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
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
