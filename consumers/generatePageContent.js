/**
 * Generates and updates the content for a specific page on the UI.
 *
 * @param {Object} options - The options object.
 * @param {number} options.page - The page number for which to generate content.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @throws Throws an error if there is an issue during content generation.
 */
export async function generatePageContent({ page, parameters }) {
  try {
    // Destructure parameters
    let {
      paginatedStreams,
      currentUserPage,
      updateMainWindow,
      updatePaginatedStreams,
      updateCurrentUserPage,
      updateUpdateMainWindow,

      //mediasfu functions
      dispStreams,
    } = parameters;

    // Convert page to an integer
    page = parseInt(page);

    // Update current user page
    currentUserPage = page;
    updateCurrentUserPage(page);

    // Update main window flag
    updateMainWindow = true;
    updateUpdateMainWindow(updateMainWindow);

    // Display streams for the specified page
    await dispStreams({ lStreams: paginatedStreams[page], ind: page, parameters });

  } catch (error) {
    // Handle errors during content generation
    console.log('Error generating page content:', error.message);
  }
}
