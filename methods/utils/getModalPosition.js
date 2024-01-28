/**
 * Gets the style for positioning a modal based on the specified position.
 * @function
 * @param {string} position - The desired position for the modal ('center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @returns {Object} - The style object for positioning the modal.
 */
export const getModalPosition = (position) => {
  switch (position) {
      case 'center':
          return { justifyContent: 'center', alignItems: 'center' };
      case 'topLeft':
          return { justifyContent: 'flex-start', alignItems: 'flex-start' };
      case 'topRight':
          return { justifyContent: 'flex-start', alignItems: 'flex-end' };
      case 'bottomLeft':
          return { justifyContent: 'flex-end', alignItems: 'flex-start' };
      case 'bottomRight':
      default:
          return { justifyContent: 'flex-end', alignItems: 'flex-end' };
  }
};
