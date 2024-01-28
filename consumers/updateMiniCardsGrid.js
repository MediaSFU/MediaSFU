/**
 * Updates the mini cards grid based on the specified rows and columns.
 *
 * @param {object} options - The function parameters.
 * @param {number} options.rows - The number of rows in the grid.
 * @param {number} options.cols - The number of columns in the grid.
 * @param {boolean} options.defal - Flag indicating whether to update the default grid or an alternative grid.
 * @param {number} options.actualRows - The actual number of rows in the grid.
 * @param {number} options.ind - The index parameter.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {function} options.parameters.updateGridRows - Function to update the grid rows.
 * @param {function} options.parameters.updateGridCols - Function to update the grid columns.
 * @param {function} options.parameters.updateAltGridRows - Function to update the alternative grid rows.
 * @param {function} options.parameters.updateAltGridCols - Function to update the alternative grid columns.
 * @param {function} options.parameters.updateGridSizes - Function to update the grid sizes.
 * @param {object} options.parameters.gridSizes - Object containing grid width and height.
 * @param {string} options.parameters.paginationDirection - The direction of pagination ('horizontal' or 'vertical').
 * @param {number} options.parameters.paginationHeightWidth - The height or width of pagination.
 * @param {boolean} options.parameters.doPaginate - Flag indicating whether pagination is enabled.
 * @param {object} options.parameters.componentSizes - Object containing container width and height.
 * @param {string} options.parameters.eventType - The type of event ('chat', etc.).
 */

export async function updateMiniCardsGrid({ rows, cols, defal = true, actualRows = 2, ind = 0, parameters }) {

    let { getUpdatedAllParams } = parameters;


    parameters = await getUpdatedAllParams()


    let {
        updateGridRows,
        updateGridCols,
        updateAltGridRows,
        updateAltGridCols,
        updateGridSizes,

        gridSizes,
        paginationDirection,
        paginationHeightWidth,
        doPaginate,
        componentSizes,
        eventType,


    } = parameters;


    let containerWidth = await componentSizes.otherWidth
    let containerHeight = await componentSizes.otherHeight

    if (doPaginate) {
        //if pagination is enabled and direction is horizontal
        if (paginationDirection == 'horizontal') {
            containerHeight = containerHeight - paginationHeightWidth
        } else {
            containerWidth = containerWidth - paginationHeightWidth
        }
    }


    let cardSpacing = 3; // 3px margin between cards
    if (eventType == 'chat') {
        cardSpacing = 0
    }
    let totalSpacingHorizontal = (cols - 1) * cardSpacing;
    let totalSpacingVertical = (actualRows - 1) * cardSpacing;
    let cardWidth
    let cardHeight
    if (cols == 0 || actualRows == 0) {
        cardWidth = 0;
        cardHeight = 0;
    }else{
        
     cardWidth = await Math.floor((containerWidth - totalSpacingHorizontal) / cols);
     cardHeight = await Math.floor(((containerHeight - totalSpacingVertical) / actualRows));
    }

  
    if (defal) {
        updateGridRows(rows)
        updateGridCols(cols)

        gridSizes = { ...gridSizes, gridWidth: cardWidth, gridHeight: cardHeight }
        await updateGridSizes(gridSizes)
    
    } else {
        updateAltGridRows(rows)
        updateAltGridCols(cols)

        gridSizes = { ...gridSizes, altGridWidth: cardWidth, altGridHeight: cardHeight }
        await updateGridSizes(gridSizes)
    
    }

}
