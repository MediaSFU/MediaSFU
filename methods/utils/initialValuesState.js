export const initialValuesState = {

    // The following are the initial values 


    roomName: "",
    member: '',
    adminPasscode: '',
    islevel: '0',
    coHost: "",
    coHostResponsibility: [
        { name: 'participants', value: false, dedicated: false },
        { name: 'media', value: false, dedicated: false },
        { name: 'waiting', value: false, dedicated: false },
        { name: 'chat', value: false, dedicated: false },
    ],
    youAreCoHost: false,
    youAreHost: false,
    confirmedToRecord: false,
    meetingDisplayType: 'media',
    meetingVideoOptimized: false,
    eventType: 'webinar',
    participants: [],
    filteredParticipants: [],
    participantsCounter: 0,
    participantsFilter: '',

    consume_sockets: [],
    rtpCapabilities: null,
    roomRecvIPs: [],
    meetingRoomParams: null,
    itemPageLimit: 4,
    audioOnlyRoom: false,
    addForBasic: false,
    screenPageLimit: 4,
    shareScreenStarted: false,
    shared: false,
    targetOrientation: 'landscape',
    vidCons: [],
    frameRate: 5,
    hParams: null,
    vParams: null,
    screenParams: null,
    aParams: null,
    recordingAudioPausesLimit: 0,
    recordingAudioPausesCount: 0,
    recordingAudioSupport: false,
    recordingAudioPeopleLimit: 0,
    recordingAudioParticipantsTimeLimit: 0,
    recordingVideoPausesCount: 0,
    recordingVideoPausesLimit: 0,
    recordingVideoSupport: false,
    recordingVideoPeopleLimit: 0,
    recordingVideoParticipantsTimeLimit: 0,
    recordingAllParticipantsSupport: false,
    recordingVideoParticipantsSupport: false,
    recordingAllParticipantsFullRoomSupport: false,
    recordingVideoParticipantsFullRoomSupport: false,
    recordingPreferredOrientation: 'landscape',
    recordingSupportForOtherOrientation: false,
    recordingMultiFormatsSupport: false,

    firstAll: false,
    updateMainWindow: false,
    first_round: false,
    landScaped: false,
    lock_screen: false,
    screenId: null,
    allVideoStreams: [],
    newLimitedStreams: [],
    newLimitedStreamsIDs: [],
    activeSounds: [],
    screenShareIDStream: null,
    screenShareNameStream: null,
    adminIDStream: null,
    adminNameStream: null,
    youYouStream: null,
    youYouStreamIDs: [],
    localStream: null,
    recordStarted: false,
    recordResumed: false,
    recordPaused: false,
    recordStopped: false,
    adminRestrictSetting: false,
    videoRequestState: 'none',
    videoRequestTime: 0,
    videoAction: '',
    localStreamVideo: null,
    userDefaultVideoInputDevice: null,
    currentFacingMode: 'user',
    prevFacingMode: 'user',
    defVideoID: null,
    allowed: false,
    dispActiveNames: [],
    p_dispActiveNames: [],
    activeNames: [],
    prevActiveNames: [],
    p_activeNames: [],
    membersReceived: false,
    deferScreenReceived: false,
    hostFirstSwitch: false,
    micAction: false,
    screenAction: false,
    chatAction: false,
    audioRequestState: 'none',
    screenRequestState: 'none',
    chatRequestState: 'none',
    audioRequestTime: 0,
    screenRequestTime: 0,
    chatRequestTime: 0,
    updateRequestIntervalSeconds: 240,
    oldSoundIds: [],
    HostLabel: 'Host',
    mainScreenFilled: false,
    localStreamScreen: null,
    screenAlreadyOn: false,
    chatAlreadyOn: false,
    oldAllStreams: [],
    adminVidID: null,
    streamNames: [],
    non_alVideoStreams: [],
    sortAudioLoudness: false,
    audioDecibels: [],
    mixed_alVideoStreams: [],
    non_alVideoStreams_muted: [],
    paginatedStreams: [],
    localStreamAudio: null,
    defAudioID: null,
    userDefaultAudioInputDevice: null,
    userDefaultAudioOutputDevice: null,
    prevAudioInputDevice: null,
    prevVideoInputDevice: null,
    audioPaused: false,
    mainScreenPerson: null,
    adminOnMainScreen: false,

    updateDateState: null,
    lastUpdate: null,
    nForReadjustRecord: 0,
    fixedPageLimit: 4,
    removeAltGrid: false,
    nForReadjust: 0,
    reOrderInterval: 30000,
    fastReOrderInterval: 10000,
    lastReOrderTime: 0,
    audStreamNames: [],
    currentUserPage: 0,
    isWideScreen: false,
    isMediumScreen: false,
    isSmallScreen: false,
    addGrid: false,
    addAltGrid: false,
    gridRows: 0,
    gridCols: 0,
    altGridRows: 0,
    altGridCols: 0,
    numberPages: 0,
    currentStreams: [],
    showMiniView: false,
    nStream: 0,
    defer_receive: false,
    allAudioStreams: [],
    remoteScreenStream: [],
    screenProducer: null,
    gotAllVids: false,
    paginationHeightWidth: 40,
    paginationDirection: 'horizontal',
    screenForceFullDisplay: false,
    mainGridStream: [],
    otherGridStreams: [[], []],
    audioOnlyStreams: [],
    videoInputs: [],
    audioInputs: [],
    meetingProgressTime: '00:00:00',
    meetingElapsedTime: 0,

    transportCreated: false,
    transportCreatedVideo: false,
    transportCreatedAudio: false,
    transportCreatedScreen: false,
    producerTransport: null,
    videoProducer: null,
    params: null,
    videoParams: null,
    audioParams: null,
    audioProducer: null,
    consumerTransports: [],
    consumingTransports: [],

    recordingMediaOptions: 'video',
    recordingAudioOptions: 'all',
    recordingVideoOptions: 'all',
    recordingVideoType: 'fullDisplay',
    recordingVideoOptimized: false,
    recordingDisplayType: 'media',
    recordingAddHLS: true,
    recordingNameTags: true,
    recordingBackgroundColor: '#83c0e9',
    recordingNameTagsColor: '#ffffff',
    recordingOrientationVideo: 'landscape',
    clearedToResume: true,
    clearedToRecord: true,
    recordState: 'green',
    showRecordButtons: false,
    recordingProgressTime: '00:00:00',
    audioSwitching: false,
    videoSwitching: false,

    videoAlreadyOn: false,
    audioAlreadyOn: false,

    canLaunchRecord : true,
    stopLaunchRecord : false,
    recordStartTime : null,
    canRecord:false,
    startReport: false,
    endReport: false,
    recordTimerInterval: null,
    recordStartTime: null,
    recordElapsedTime: 0,
    isTimerRunning: false,
    canPauseResume: false,
    pauseLimit: 0,
    pauseRecordCount: 0,

}
