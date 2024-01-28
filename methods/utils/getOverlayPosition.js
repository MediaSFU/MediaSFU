/**
 * Gets the style for positioning an overlay based on the specified position.
 * @function
 * @param {string} position - The desired position for the overlay ('topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @returns {Object} - The style object for positioning the overlay.
 */
export const getOverlayPosition = (position) => {
  switch (position) {
      case 'topLeft':
          return { top: 0, left: 0 };
      case 'topRight':
          return { top: 0, right: 0 };
      case 'bottomLeft':
          return { bottom: 0, left: 0 };
      case 'bottomRight':
          return { bottom: 0, right: 0 };
      default:
          return {};
  }
};
