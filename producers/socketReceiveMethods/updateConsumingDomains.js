/**
 * Updates consuming domains based on the provided parameters.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string[]} params.domains - Array of main domains for consuming.
 * @param {Object} params.alt_domains - Object containing alternative domains for consuming.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {Object[]} params.participants - Array of participant objects.
 * @param {function} params.getDomains - Function to retrieve domains.
 * @param {Object} params.rtpCapabilities - Object containing RTP capabilities.
 * @param {string} params.apiUserName - API username for authentication.
 * @param {string} params.apiKey - API key for authentication.
 * @param {string} params.apiToken - API token for authentication.
 * @param {Object[]} params.consume_sockets - Array of consume sockets.
 * @param {function} params.connectIps - Function to connect to specified IPs.
 * @throws {Error} Throws an error if there is an issue updating consuming domains.
 */
export const updateConsumingDomains = async ({ domains, alt_domains, parameters }) => {
  // Function to update consuming domains

  let {
      participants,
      getDomains,
      rtpCapabilities,
      apiUserName,
      apiKey,
      apiToken,
      consume_sockets,
      ipsToConnect,

      //mediasfu functions
      connectIps,
  } = parameters;

  consume_sockets  =  await parameters.getUpdatedAllParams().consume_sockets    

  try {
      // Check if participants array is not empty
      if (participants.length > 0) {
          // Check if alt_domains has keys and remove duplicates
          if (Object.keys(alt_domains).length > 0) {
              await getDomains({ domains, alt_domains, parameters });
          } else {
              const [sockets_, ips_] = await connectIps({
                  consume_sockets: consume_sockets,
                  remIP: domains,
                  parameters: parameters,
                  apiUserName: apiUserName,
                  apiKey: apiKey,
                  apiToken: apiToken,
              });
          }
      }
  } catch (error) {
      console.log("Error in updateConsumingDomains: ", error);

  }
};
