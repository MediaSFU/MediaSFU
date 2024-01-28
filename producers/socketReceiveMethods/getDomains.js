/**
 * Retrieves domains based on the provided parameters.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string[]} params.domains - Array of main domains to retrieve.
 * @param {Object} params.alt_domains - Object containing alternative domains.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {string[]} params.roomRecvIPs - Array of room receiving IP addresses.
 * @param {Object} params.rtpCapabilities - Object containing RTP capabilities.
 * @param {string} params.apiUserName - API username for authentication.
 * @param {string} params.apiKey - API key for authentication.
 * @param {string} params.apiToken - API token for authentication.
 * @param {Object[]} params.consume_sockets - Array of consume sockets.
 * @param {function} params.connectIps - Function to connect to specified IPs.
 * @throws {Error} Throws an error if there is an issue retrieving domains.
 */
export const getDomains = async ({ domains, alt_domains, parameters }) => {
    // Function to retrieve domains

    let {
        roomRecvIPs,
        rtpCapabilities,
        apiUserName,
        apiKey,
        apiToken,
        consume_sockets,

        //mediasfu functions
        connectIps,
    } = parameters;

    const ipsToConnect = [];

    consume_sockets  =  await parameters.getUpdatedAllParams().consume_sockets    


    try {
        for (const domain of domains) {
            const ipToCheck = await alt_domains[domain] || domain;
            // Check if the IP is already in roomRecvIPs
            if (!roomRecvIPs.includes(ipToCheck)) {
                await ipsToConnect.push(ipToCheck);
            }
        }
        const [sockets_, ips_] = await connectIps({
            consume_sockets: consume_sockets,
            remIP: ipsToConnect,
            parameters: parameters,
            apiUserName: apiUserName,
            apiKey: apiKey,
            apiToken: apiToken,
        });
    } catch (error) {
        console.log("Error in getDomains: ", error);
        // throw new Error("Failed to retrieve domains.");
    }
};
