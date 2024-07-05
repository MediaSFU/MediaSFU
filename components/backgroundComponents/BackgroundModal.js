import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, Button, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

/**
 * Represents a background modal component in React Native.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isVisible - Indicates whether the modal is visible or not.
 * @param {Function} props.onClose - The function to be called when the modal is closed.
 * @param {Object} props.parameters - The parameters object containing various properties and functions.
 * @param {string} [props.position='topLeft'] - The position of the modal.
 * @param {string} [props.backgroundColor='#f5f5f5'] - The background color of the modal.
 * @returns {JSX.Element} The background modal component.
 */
const BackgroundModal = ({
    isVisible,
    onClose,
    parameters,
    position = 'topLeft',
    backgroundColor = '#f5f5f5',
}) => {
    let {
        customImage,
        selectedImage,
        segmentVideo,
        selfieSegmentation,
        pauseSegmentation,
        processedStream,
        keepBackground,
        backgroundHasChanged,
        virtualStream,
        mainCanvas,
        prevKeepBackground,
        appliedBackground,
        videoAlreadyOn,
        audioOnlyRoom,
        islevel,
        recordStarted,
        recordResumed,
        recordPaused,
        recordStopped,
        recordingMediaOptions,
        mediaDevices,
        showAlert,
        localStreamVideo,
        vidCons,
        frameRate,
        updateCustomImage,
        updateSelectedImage,
        updateSegmentVideo,
        updateSelfieSegmentation,
        updatePauseSegmentation,
        updateProcessedStream,
        updateKeepBackground,
        updateBackgroundHasChanged,
        updateVirtualStream,
        updateMainCanvas,
        updatePrevKeepBackground,
        updateAppliedBackground,
        videoProducer,
        transportCreated,
        videoParams,
        updateVideoParams,
        autoClickBackground,
        updateAutoClickBackground,
        createSendTransport,
        connectSendTransportVideo,
        disconnectSendTransportVideo,
        onScreenChanges,
        sleep,
    } = parameters;

    const defaultImagesContainerRef = useRef(null);
    const uploadImageInputRef = useRef(null);
    const backgroundCanvasRef = useRef(null);
    const videoPreviewRef = useRef(null);
    const captureVideoRef = useRef(null);
    const loadingOverlayRef = useRef(null);
    const applyBackgroundButtonRef = useRef(null);
    const saveBackgroundButtonRef = useRef(null);
    const mainCanvasRef = useRef(null);

    const screenWidth = Dimensions.get('window').width;
    let modalWidth = 0.8 * screenWidth;
    if (modalWidth > 500) {
        modalWidth = 500;
    }

    useEffect(() => {
        if (isVisible) {
            if (!selfieSegmentation) {
                preloadModel().catch(err => console.log('Error preloading model:'));
            }
            renderDefaultImages();
            if (selectedImage) {
                loadImageToCanvas(selectedImage, selectedImage);
            } else {
                clearCanvas();
            }
            saveBackgroundButtonRef.current.setNativeProps({ style: styles.dNone });
            saveBackgroundButtonRef.current.setNativeProps({ disabled: true });
            applyBackgroundButtonRef.current.setNativeProps({ style: styles.dBlock });
            applyBackgroundButtonRef.current.setNativeProps({ disabled: false });

            if (processedStream && (prevKeepBackground == keepBackground) && keepBackground && appliedBackground) {
                applyBackgroundButtonRef.current.setNativeProps({ text: 'Apply Background' });
            } else {
                applyBackgroundButtonRef.current.setNativeProps({ text: 'Preview Background' });
            }

            if (autoClickBackground) {
                applyBackground().then(async () => {
                    await saveBackground();
                    autoClickBackground = false;
                    updateAutoClickBackground(autoClickBackground);
                });
            }
        } else {
            try {
                if (!appliedBackground || (appliedBackground && !keepBackground) || (appliedBackground && !videoAlreadyOn)) {
                    const refVideo = captureVideoRef.current;
                    pauseSegmentation = true;
                    updatePauseSegmentation(true);
                    if (!videoAlreadyOn) {
                        try {
                            if (refVideo) {
                                refVideo.srcObject.getTracks().forEach(track => track.stop());
                                refVideo.srcObject = null;
                            }
                            if (segmentVideo) {
                                segmentVideo.getTracks().forEach(track => track.stop());
                                segmentVideo = null;
                            }
                            if (virtualStream) {
                                virtualStream.getTracks().forEach(track => track.stop());
                                virtualStream = null;
                            }
                            updateSegmentVideo(segmentVideo);
                            updateVirtualStream(virtualStream);
                        } catch (error) {}
                    }
                }
                videoPreviewRef.current.setNativeProps({ style: styles.dNone });
                backgroundCanvasRef.current.setNativeProps({ style: styles.dBlock });
            } catch (error) {}
        }
    }, [isVisible]);

    const renderDefaultImages = () => {
        const defaultImages = [
            { full: '../../assets/images/backgrounds/wall.png', thumb: '../../assets/images/backgrounds/wall_thumbnail.png', small: '../../assets/images/backgrounds/wall_small.png' },
            { full: '../../assets/images/backgrounds/shelf.png', thumb: '../../assets/images/backgrounds/shelf_thumbnail.png', small: '../../assets/images/backgrounds/shelf_small.png' },
            { full: '../../assets/images/backgrounds/clock.png', thumb: '../../assets/images/backgrounds/clock_thumbnail.png', small: '../../assets/images/backgrounds/clock_small.png' },
            { full: '../../assets/images/backgrounds/desert.jpg', thumb: '../../assets/images/backgrounds/desert_thumbnail.jpg', small: '../../assets/images/backgrounds/desert_small.jpg' },
            { full: '../../assets/images/backgrounds/flower.jpg', thumb: '../../assets/images/backgrounds/flower_thumbnail.jpg', small: '../../assets/images/backgrounds/flower_small.jpg' },
        ];

        defaultImagesContainerRef.current.setNativeProps({ children: defaultImages.map(({ thumb }, index) => (
            <TouchableOpacity key={index} onPress={() => loadImageToCanvas(thumb, thumb)}>
                <Image source={{ uri: thumb }} style={styles.thumbnail} />
            </TouchableOpacity>
        )) });

        const noBackgroundImg = (
            <TouchableOpacity style={styles.noBackgroundImg} onPress={() => {
                selectedImage = null;
                updateSelectedImage(selectedImage);
                updateCustomImage(null);
                showLoading();
                videoPreviewRef.current.setNativeProps({ style: styles.dNone });
                backgroundCanvasRef.current.setNativeProps({ style: styles.dBlock });
                clearCanvas();
                hideLoading();
            }}>
                <Text style={styles.noBackgroundText}>None</Text>
            </TouchableOpacity>
        );
        defaultImagesContainerRef.current.setNativeProps({ children: [...defaultImagesContainerRef.current.props.children, noBackgroundImg] });

        if (customImage) {
            const customImageElem = (
                <TouchableOpacity onPress={() => loadImageToCanvas(customImage, customImage)}>
                    <Image source={{ uri: customImage }} style={styles.thumbnail} />
                </TouchableOpacity>
            );
            defaultImagesContainerRef.current.setNativeProps({ children: [...defaultImagesContainerRef.current.props.children, customImageElem] });
        }
    };

    async function preloadModel() {
        selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });

        selfieSegmentation.setOptions({
            modelSelection: 1,
            selfieMode: false,
        });

        await selfieSegmentation.initialize();
        updateSelfieSegmentation(selfieSegmentation);
    }

    const showLoading = () => {
        loadingOverlayRef.current.setNativeProps({ style: styles.dBlock });
    };

    const hideLoading = () => {
        loadingOverlayRef.current.setNativeProps({ style: styles.dNone });
    };

    const clearCanvas = () => {
        const ctx = backgroundCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, backgroundCanvasRef.current.width, backgroundCanvasRef.current.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No Background', backgroundCanvasRef.current.width / 2, backgroundCanvasRef.current.height / 2);

        saveBackgroundButtonRef.current.setNativeProps({ style: styles.dNone });
        applyBackgroundButtonRef.current.setNativeProps({ style: styles.dBlock });
        applyBackgroundButtonRef.current.setNativeProps({ disabled: false });
        if (processedStream && (prevKeepBackground === keepBackground) && keepBackground && appliedBackground) {
            applyBackgroundButtonRef.current.setNativeProps({ text: 'Apply Background' });
        } else {
            applyBackgroundButtonRef.current.setNativeProps({ text: 'Preview Background' });
        }
    };

    const handleImageUpload = (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 2048 * 2048) {
                    showAlert({ message: 'File size must be less than 2MB.', type: 'danger' });
                    return;
                }
                const img = new Image();
                img.onload = () => {
                    if (img.width !== 1280 || img.height !== 1280) {
                        showAlert({ message: 'Image dimensions must be 1280x1280.', type: 'danger' });
                        return;
                    }
                    customImage = img.src;
                    updateCustomImage(customImage);
                    loadImageToCanvas(img.src, img.src);
                };
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {}
    };

    const loadImageToCanvas = async (src, fullSrc) => {
        showLoading();
        backgroundCanvasRef.current.setNativeProps({ style: styles.dBlock });
        videoPreviewRef.current.setNativeProps({ style: styles.dNone });

        const img = await new Image();
        img.onload = async () => {
            const ctx = await backgroundCanvasRef.current.getContext('2d');
            backgroundCanvasRef.current.width = img.width;
            backgroundCanvasRef.current.height = img.height;
            await ctx.drawImage(img, 0, 0);
            await removeBackground(img);
            hideLoading();
        };
        img.src = await src;
        selectedImage = await fullSrc;
        updateSelectedImage(selectedImage);

        saveBackgroundButtonRef.current.setNativeProps({ style: styles.dNone });
        saveBackgroundButtonRef.current.setNativeProps({ disabled: true });
        applyBackgroundButtonRef.current.setNativeProps({ style: styles.dBlock });
        applyBackgroundButtonRef.current.setNativeProps({ disabled: false });

        if (processedStream && (prevKeepBackground === keepBackground) && keepBackground && appliedBackground) {
            applyBackgroundButtonRef.current.setNativeProps({ text: 'Apply Background' });
        } else {
            applyBackgroundButtonRef.current.setNativeProps({ text: 'Preview Background' });
        }
    };

    const removeBackground = (img) => {
        const ctx = backgroundCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, backgroundCanvasRef.current.width, backgroundCanvasRef.current.height);
        ctx.drawImage(img, 0, 0);
    };

    async function stopSegmentation() {
        if (processedStream) {
            const tracks = await processedStream.getVideoTracks();
            await tracks.forEach(track => track.stop());
            processedStream.srcObject = null;
            processedStream = null;
            updateProcessedStream(null);
        }
    }

    const applyBackground = async () => {
        try {
            if (audioOnlyRoom) {
                showAlert({ message: 'You cannot use a background in an audio only event.', type: 'danger' });
                return;
            }
            showLoading();
            videoPreviewRef.current.setNativeProps({ style: styles.dBlock });
            backgroundCanvasRef.current.setNativeProps({ style: styles.dNone });

            const doSegmentation = selectedImage ? true : false;
            pauseSegmentation = false;
            updatePauseSegmentation(false);
            await selfieSegmentationPreview(doSegmentation);
            hideLoading();

            applyBackgroundButtonRef.current.setNativeProps({ style: styles.dNone });
            applyBackgroundButtonRef.current.setNativeProps({ disabled: true });

            if (processedStream && (prevKeepBackground === keepBackground) && keepBackground && appliedBackground) {
                saveBackgroundButtonRef.current.setNativeProps({ style: styles.dNone });
                saveBackgroundButtonRef.current.setNativeProps({ disabled: true });
            } else {
                saveBackgroundButtonRef.current.setNativeProps({ style: styles.dBlock });
                saveBackgroundButtonRef.current.setNativeProps({ disabled: false });
            }
        } catch (error) {}
    };

    const selfieSegmentationPreview = async (doSegmentation) => {
        const refVideo = captureVideoRef.current;
        const previewVideo = videoPreviewRef.current;
        const virtualImage = await new Image();
        virtualImage.src = selectedImage;

        if (!mainCanvas) {
            mainCanvas = mainCanvasRef.current;
        }

        let mediaCanvas = mainCanvas;
        mediaCanvas.width = refVideo.videoWidth;
        mediaCanvas.height = refVideo.videoHeight;
        let ctx = mediaCanvas.getContext("2d");

        backgroundHasChanged = true;
        updateBackgroundHasChanged(true);
        prevKeepBackground = keepBackground;
        updatePrevKeepBackground(keepBackground);
        if (!doSegmentation) {
            const tracks = await processedStream.getVideoTracks();
            await tracks.forEach(track => track.stop());
            processedStream = null;
            keepBackground = false;
            updateProcessedStream(null);
            updateKeepBackground(false);
            previewVideo.setNativeProps({ style: styles.dBlock });
        }

        const segmentImage = (videoElement) => {
            try {
                const processFrame = () => {
                    if (!selfieSegmentation || pauseSegmentation || !videoElement || videoElement.videoWidth == 0 || videoElement.videoHeight == 0) {
                        return;
                    }
                    selfieSegmentation.send({ image: videoElement });
                    requestAnimationFrame(processFrame);
                };

                videoElement.onloadeddata = () => {
                    processFrame();
                };

                processedStream = mediaCanvas.captureStream(frameRate || 5);
                updateProcessedStream(processedStream);
                previewVideo.srcObject = processedStream;
                previewVideo.setNativeProps({ style: styles.dBlock });
                keepBackground = true;
                updateKeepBackground(keepBackground);
            } catch (error) {}
        };

        if (videoAlreadyOn) {
            if (clonedTrack.current && clonedTrack.current.readyState === 'live' && localStreamVideo.getVideoTracks()[0].label === clonedTrack.current.label) {} else {
                const localTracks = await localStreamVideo.getVideoTracks()[0];
                clonedTrack.current = await localTracks.clone();
                clonedStream.current = new MediaStream([clonedTrack.current]);
                segmentVideo = await clonedStream.current;
            }
            updateSegmentVideo(segmentVideo);
            refVideo.srcObject = await segmentVideo;
            refVideo.width = await segmentVideo.getVideoTracks()[0].getSettings().width;
            refVideo.height = await segmentVideo.getVideoTracks()[0].getSettings().height;
            mediaCanvas.width = refVideo.width;
            mediaCanvas.height = refVideo.height;
            ctx = mediaCanvas.getContext("2d");

            try {
                doSegmentation ? await segmentImage(refVideo) : previewVideo.srcObject = clonedStream.current ? clonedStream.current : localStreamVideo;
            } catch (error) {
                console.log('Error segmenting image:', error);
            }
        } else {
            if (segmentVideo && segmentVideo.getVideoTracks()[0].readyState === 'live') {} else {
                await mediaDevices.getUserMedia(
                    { video: { ...vidCons, frameRate: { ideal: frameRate } }, audio: false }
                ).then(async (stream) => {
                    segmentVideo = await stream;
                    updateSegmentVideo(segmentVideo);
                    refVideo.srcObject = await segmentVideo;
                }).catch((error) => {
                    console.log('Error getting user media:', error);
                });

                refVideo.width = await segmentVideo.getVideoTracks()[0].getSettings().width;
                refVideo.height = await segmentVideo.getVideoTracks()[0].getSettings().height;
                mediaCanvas.width = await refVideo.width;
                mediaCanvas.height = await refVideo.height;
                ctx = await mediaCanvas.getContext("2d");
            }

            try {
                doSegmentation ? await segmentImage(refVideo) : previewVideo.srcObject = refVideo.srcObject;
            } catch (error) {}
        }

        const onResults = (results) => {
            try {
                if (!pauseSegmentation && mediaCanvas && mediaCanvas.width > 0 && mediaCanvas.height > 0 && virtualImage && virtualImage.width > 0 && virtualImage.height > 0) {
                    ctx.save();
                    ctx.clearRect(0, 0, mediaCanvas.width, mediaCanvas.height);
                    ctx.drawImage(results.segmentationMask, 0, 0, mediaCanvas.width, mediaCanvas.height);

                    ctx.globalCompositeOperation = "source-out";
                    const pat = ctx.createPattern(virtualImage, 'no-repeat');
                    ctx.fillStyle = pat;
                    ctx.fillRect(0, 0, mediaCanvas.width, mediaCanvas.height);

                    ctx.globalCompositeOperation = "destination-atop";
                    ctx.drawImage(results.image, 0, 0, mediaCanvas.width, mediaCanvas.height);

                    ctx.restore();
                }
            } catch (error) {}
        };

        if (!selfieSegmentation) {
            await preloadModel().catch(err => console.log('Error preloading model: '));
        }

        try {
            selfieSegmentation.onResults(onResults);
        } catch (error) {}
    };

    const saveBackground = async () => {
        if (audioOnlyRoom) {
            showAlert({ message: 'You cannot use a background in an audio only event.', type: 'danger' });
            return;
        } else if (backgroundHasChanged) {
            if (videoAlreadyOn) {
                if (islevel === '2' && ((recordStarted || recordResumed))) {
                    if (!(recordPaused || recordStopped)) {
                        if (recordingMediaOptions === 'video') {
                            showAlert({ message: 'Please pause the recording before changing the background.', type: 'danger' });
                            return;
                        }
                    }
                }
                if (keepBackground && selectedImage && processedStream) {
                    virtualStream = processedStream;
                    updateVirtualStream(virtualStream);
                    videoParams = { track: virtualStream.getVideoTracks()[0] };
                    updateVideoParams(videoParams);
                } else {
                    if (localStreamVideo && localStreamVideo.getVideoTracks()[0] && localStreamVideo.getVideoTracks()[0].readyState === 'live') {
                        videoParams = { track: localStreamVideo.getVideoTracks()[0] };
                        updateVideoParams(videoParams);
                    } else {
                        try {
                            if (localStreamVideo && localStreamVideo.getVideoTracks()[0] && localStreamVideo.getVideoTracks()[0].readyState !== 'live') {
                                localStreamVideo.removeTrack(localStreamVideo.getVideoTracks()[0]);
                                localStreamVideo.addTrack(segmentVideo.getVideoTracks()[0].clone());
                            }
                        } catch (error) {
                            console.log('Error handling local stream video:', error);
                        }

                        videoParams = { track: clonedStream.current.getVideoTracks()[0] };
                        updateVideoParams(videoParams);
                    }
                }

                if (keepBackground) {
                    appliedBackground = true;
                    updateAppliedBackground(appliedBackground);
                } else {
                    appliedBackground = false;
                    updateAppliedBackground(appliedBackground);
                }

                if (!transportCreated) {
                    await createSendTransport({ option: 'video', parameters: { ...parameters, videoParams } });
                } else {
                    try {
                        if (videoProducer && videoProducer.id) {
                            if (videoProducer.track.id != videoParams.track.id) {
                                await disconnectSendTransportVideo({ parameters });
                                await sleep(500);
                            }
                        }
                        await connectSendTransportVideo({ videoParams, parameters });
                    } catch (error) {}
                }
                await onScreenChanges({ changed: true, parameters });
            }
        }

        if (keepBackground) {
            appliedBackground = true;
            updateAppliedBackground(appliedBackground);
        } else {
            appliedBackground = false;
            updateAppliedBackground(appliedBackground);
        }

        saveBackgroundButtonRef.current.setNativeProps({ style: styles.dNone });
        saveBackgroundButtonRef.current.setNativeProps({ disabled: true });
    };

    const Spinner = () => {
        return <ActivityIndicator size="large" color="#fff" />;
    };

    return (
        <Modal transparent={true} animationType="slide" visible={isVisible} onRequestClose={onClose}>
            <View style={[styles.modalContainer, getModalPosition(position)]}>
                <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Background Settings</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="times" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.hr} />
                    <ScrollView>
                        <View ref={defaultImagesContainerRef} style={styles.defaultImagesContainer}></View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Upload Custom Image</Text>
                            <TextInput style={styles.input} ref={uploadImageInputRef} onChange={handleImageUpload} />
                        </View>
                        <canvas id="mainCanvas" ref={mainCanvasRef} className="d-none"></canvas>
                        <canvas id="backgroundCanvas" ref={backgroundCanvasRef} style={styles.dNone}></canvas>
                        <video id="captureVideo" ref={captureVideoRef} className="d-none" autoPlay playsInline></video>
                        <video id="previewVideo" ref={videoPreviewRef} className="d-none" autoPlay playsInline></video>
                        <View ref={loadingOverlayRef} style={[styles.loadingOverlay, styles.dNone]}>
                            <Spinner />
                        </View>
                        <Button ref={applyBackgroundButtonRef} title="Preview Background" onPress={applyBackground} />
                        <Button ref={saveBackgroundButtonRef} title="Save Background" onPress={saveBackground} style={styles.dNone} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderRadius: 10,
        padding: 10,
        maxHeight: '75%',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 'x-large',
        fontWeight: 'bold',
        color: 'black',
    },
    closeButton: {
        border: 'none',
        backgroundColor: 'none',
        cursor: 'pointer',
    },
    hr: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
    },
    defaultImagesContainer: {
        maxWidth: '95%',
        overflowX: 'auto',
    },
    formGroup: {
        maxWidth: '70%',
        overflowX: 'auto',
    },
    label: {
        fontSize: 14,
        color: 'black',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 20,
        backgroundColor: 'white',
    },
    dNone: {
        display: 'none',
    },
    dBlock: {
        display: 'block',
    },
    thumbnail: {
        width: 80,
        height: 80,
        margin: 1,
        cursor: 'pointer',
    },
    noBackgroundImg: {
        width: 76,
        minHeight: 60,
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    noBackgroundText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        color: '#000',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default BackgroundModal;
