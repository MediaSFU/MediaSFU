// // paused for now; might be removed or completed in future


// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Pressable, Dimensions, StyleSheet, ScrollView, Image, Button, TextInput, Modal, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import RNPickerSelect from 'react-native-picker-select';
// import ForwardedCanvas from './ForwardedCanvas'; // Adjust the path if necessary
// import { Asset } from 'expo-asset'; // If using Expo
// import { Image as CanvasImage } from 'react-native-canvas';



// const Whiteboard = ({ customWidth, customHeight, parameters, showAspect }) => {
//   let {
//     socket,
//     showAlert,
//     itemPageLimit,
//     islevel,
//     roomName,
//     eventType,
//     shareScreenStarted,
//     shared,
//     shapes,
//     useImageBackground,
//     redoStack,
//     undoStack,
//     canvasStream,
//     whiteboardStarted,
//     whiteboardEnded,
//     whiteboardUsers,
//     transportCreated,
//     screenProducer,
//     screenStream,
//     participants,
//     participantsAll,
//     screenId,
//     recordStarted,
//     recordStopped,
//     recordPaused,
//     recordResumed,
//     recordingMediaOptions,
//     member,
//     canvasWhiteboard,

//     updateShapes,
//     updateUseImageBackground,
//     updateRedoStack,
//     updateUndoStack,
//     updateCanvasStream,
//     updateWhiteboardStarted,
//     updateWhiteboardEnded,
//     updateWhiteboardUsers,
//     updateTransportCreatedScreen,
//     updateScreenProducer,
//     updateScreenStream,
//     updateParticipants,
//     updateParticipantsAll,
//     updateScreenId,
//     updateShareScreenStarted,
//     updateCanvasWhiteboard,

//     createSendTransport,
//     sleep,
//     connectSendTransportScreen,
//     disconnectSendTransportScreen,
//     onScreenChanges,
//     captureCanvasStream,
//   } = parameters;

//   const mode = useRef('pan');
//   const isDrawing = useRef(false);
//   const isPanning = useRef(false);
//   const isDragging = useRef(false);
//   const startX = useRef(0);
//   const startY = useRef(0);
//   const currentX = useRef(0);
//   const currentY = useRef(0);
//   const freehandDrawing = useRef([]);
//   const selectedShape = useRef(null);
//   const selectedHandle = useRef(null);
//   const movingShape = useRef(false);
//   const panX = useRef(0);
//   const panY = useRef(0);
//   const scale = useRef(1);
//   const minScale = useRef(0.25);
//   const maxScale = useRef(1.75);
//   const eraserThickness = useRef(10);
//   const brushThickness = useRef(6);
//   const lineThickness = useRef(6);
//   const lineType = useRef('solid');
//   const color = useRef('#000000');
//   const font = useRef('Arial');
//   const fontSize = useRef(20);
//   const shape = useRef(null);
//   const backgroundImage = useRef(null);
//   const toolbarVisible = useRef(true);
//   const dropdownOpen = useRef(null);

//   const [colorPickerVisible, setColorPickerVisible] = useState(false);

//   const updateLineType = (type) => {
//     lineType.current = type;
//   };

//   const updateColor = (newColor) => {
//     color.current = newColor;
//   };

//   const updateFont = (newFont) => {
//     font.current = newFont;
//   };

//   const updateFontSize = (newFontSize) => {
//     fontSize.current = newFontSize;
//   };

//   const updateShape = (newShape) => {
//     shape.current = newShape;
//   };

//   const updateLineThickness = (newThickness) => {
//     lineThickness.current = newThickness;
//   };

//   const updateBrushThickness = (newThickness) => {
//     brushThickness.current = newThickness;
//   };

//   const updateEraserThickness = (newThickness) => {
//     eraserThickness.current = newThickness;
//   };

//   const canvasRef = useRef(null);
//   const textInputRef = useRef(null);
//   const toggleBackgroundRef = useRef(null);
//   const downloadLinkRef = useRef(null);
//   const tempCanvasRef = useRef(null);
//   const imageBackgroundUrl = require('../../assets/images/svg/graph_paper.jpg'); // Change to the correct path for React Native

//   let canvas = canvasRef.current;
//   let ctx = canvas ? canvas.getContext('2d') : null;

//   useEffect(() => {
//     console.log('Whiteboard.js useEffect 1');
//     try {
//       const loadImage = async () => {
//         console.log('Whiteboard.js loadImage');
//         const imgAsset = Asset.fromModule(imageBackgroundUrl);
//         await imgAsset.downloadAsync();
//         const imgURI = imgAsset.localUri || imgAsset.uri;

//         console.log('imgURI', imgURI, 'canvasRef', canvasRef.current);
//         if (canvasRef.current) {
//           canvas = canvasRef.current;
//           console.log('canvas', canvas);
//           const ctx = canvasRef.current.getContext('2d');
//           const img = new CanvasImage(canvas);
//           img.src = imgURI;
//           img.addEventListener('load', () => {
//             backgroundImage.current = img;
//             drawShapes();
//           });

//         }

//       };
//       if (canvasRef.current) {
//         canvas = canvasRef.current;
//         // Set up canvas events
//         canvas.addEventListener('mousedown', startDrawing);
//         canvas.addEventListener('mousemove', draw);
//         canvas.addEventListener('mouseup', stopDrawing);
//         canvas.addEventListener('wheel', handleZoom);
//         canvas.addEventListener('click', handleCanvasClick);

//         // Touch events
//         canvas.addEventListener('touchstart', handleTouchStart);
//         canvas.addEventListener('touchmove', handleTouchMove);
//         canvas.addEventListener('touchend', handleTouchEnd);
//       }



//       loadImage();

//       return () => {
//         if (canvasRef.current) {
//           // Clean up canvas events
//           canvas = canvasRef.current;
//           canvas.removeEventListener('mousedown', startDrawing);
//           canvas.removeEventListener('mousemove', draw);
//           canvas.removeEventListener('mouseup', stopDrawing);
//           canvas.removeEventListener('wheel', handleZoom);
//           canvas.removeEventListener('click', handleCanvasClick);

//           // Clean up touch events
//           canvas.removeEventListener('touchstart', handleTouchStart);
//           canvas.removeEventListener('touchmove', handleTouchMove);
//           canvas.removeEventListener('touchend', handleTouchEnd);
//         }
//       };
//     } catch (error) {
//       console.log(error, 'Whiteboard.js useEffect');
//     }
//   }, [shapes, panX.current, panY.current, scale.current]);

//   useEffect(() => {

//     if (canvasRef.current) {
//       canvas = canvasRef.current;
//       console.log('Whiteboard.js useEffect 2');
//       canvas = canvasRef.current;
//       ctx = canvas.getContext('2d');
//       drawShapes();
//     }
//   }, [shapes]);

//   const handleTouchStart = (e) => {
//     e.preventDefault();
//     const touch = e.touches[0];
//     const mouseEvent = new MouseEvent('mousedown', {
//       clientX: touch.clientX,
//       clientY: touch.clientY,
//     });
//     canvas.dispatchEvent(mouseEvent);
//   };

//   const handleTouchMove = (e) => {
//     e.preventDefault();
//     const touch = e.touches[0];
//     const mouseEvent = new MouseEvent('mousemove', {
//       clientX: touch.clientX,
//       clientY: touch.clientY,
//     });
//     canvas.dispatchEvent(mouseEvent);
//   };

//   const handleTouchEnd = (e) => {
//     e.preventDefault();
//     const mouseEvent = new MouseEvent('mouseup', {});
//     canvas.dispatchEvent(mouseEvent);
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownOpen.current && !event.target.closest('.btn-group')) {
//       dropdownOpen.current = null;
//     }
//   };

//   const handleCanvasClick = (e) => {
//     if (mode.current === 'text') {
//       const textInput = textInputRef.current;
//       textInput.style.left = e.clientX + 'px';
//       textInput.style.top = e.clientY + 'px';
//       textInput.style.display = 'block';
//       textInput.focus();
//       textInput.addEventListener('keypress', function onEnter(event) {
//         if (event.key === 'Enter') {
//           const text = textInput.value;
//           textInput.style.display = 'none';
//           textInput.value = '';
//           shapes.push({
//             type: 'text',
//             text,
//             x: (e.offsetX - panX.current) / scale.current,
//             y: (e.offsetY - panY.current) / scale.current,
//             color: color.current,
//             font: font.current,
//             fontSize: fontSize.current,
//           });
//           drawShapes();
//           updateShapes(shapes);
//           textInput.removeEventListener('keypress', onEnter);
//           socket.emit(
//             'updateBoardAction',
//             {
//               action: 'text',
//               payload: {
//                 type: 'text',
//                 text,
//                 x: (e.offsetX - panX.current) / scale.current,
//                 y: (e.offsetY - panY.current) / scale.current,
//                 color: color.current,
//                 font: font.current,
//                 fontSize: fontSize.current,
//               },
//             },
//             handleServerResponse
//           );
//         }
//       });
//     }
//   };

//   const startDrawing = (e) => {
//     try {
//       isDrawing.current = true;
//       startX.current = (e.offsetX - panX.current) / scale.current;
//       startY.current = (e.offsetY - panY.current) / scale.current;

//       if (mode.current === 'erase') {
//         erase(startX.current, startY.current);
//       } else if (mode.current === 'draw' || mode.current === 'freehand') {
//         ctx.beginPath();
//         ctx.moveTo(startX.current, startY.current);
//         if (mode.current === 'freehand') {
//           freehandDrawing.current = [{ x: startX.current, y: startY.current }];
//         }
//       } else if (mode.current === 'pan') {
//         isPanning.current = true;
//         isDragging.current = false;
//       } else if (mode.current === 'select') {
//         selectedHandle.current = getHandleAtPosition(startX.current, startY.current);
//         if (selectedHandle.current) {
//           isDragging.current = true;
//           movingShape.current = selectedHandle.current.isCenter;
//         } else {
//           selectedShape.current = findShape(startX.current, startY.current);
//           if (selectedShape.current) {
//             drawShapes();
//             drawSelection(selectedShape.current);
//           }
//         }
//       }
//     } catch (error) {
//       // console.log(error, 'Whiteboard.js startDrawing');
//     }
//   };

//   const checkBoardAccess = () => {
//     if (whiteboardStarted && !whiteboardEnded) {
//       const user = whiteboardUsers.find((user) => user.name === member);
//       if ((!user || !user.useBoard) && islevel != '2') {
//         showAlert({
//           message: 'You are not allowed to use the whiteboard. Please ask the host to assign you.',
//           type: 'danger',
//         });
//         return false;
//       } else {
//         return true;
//       }
//     } else {
//       return true;
//     }
//   };

//   const changeMode = (newMode) => {
//     if (newMode !== 'pan' && !checkBoardAccess()) return;
//     mode.current = newMode;
//     console.log('mode', mode.current);
//     if (newMode === 'freehand' && freehandDrawing.current.length > 0) {
//       shapes.push({
//         type: 'freehand',
//         points: freehandDrawing.current,
//         color: color.current,
//         thickness: brushThickness.current,
//       });
//       updateShapes(shapes);
//       freehandDrawing.current = [];
//       saveState();
//     }
//   };

//   const draw = (e) => {
//     console.log('Whiteboard.js draw', isDrawing.current, ctx);
//     if (!isDrawing.current) return;
//     currentX.current = (e.offsetX - panX.current) / scale.current;
//     currentY.current = (e.offsetY - panY.current) / scale.current;

//     if (mode.current == 'draw' || mode.current == 'freehand' || mode.current == 'shape') {
//       if (currentX.current > 1280 || currentY.current > 720) {
//         return;
//       }
//     }

//     if (mode.current === 'erase') {
//       erase(currentX.current, currentY.current);
//     } else if (mode.current === 'draw') {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       drawShapes();
//       drawLine(
//         startX.current,
//         startY.current,
//         currentX.current,
//         currentY.current,
//         color.current,
//         lineThickness.current,
//         lineType.current
//       );
//     } else if (mode.current === 'freehand') {
//       ctx.lineTo(currentX.current, currentY.current);
//       ctx.strokeStyle = color.current;
//       ctx.lineWidth = brushThickness.current;
//       ctx.stroke();
//       freehandDrawing.current.push({ x: currentX.current, y: currentY.current });
//     } else if (mode.current === 'shape') {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       drawShapes();
//       drawShape(
//         shape.current,
//         startX.current,
//         startY.current,
//         currentX.current,
//         currentY.current,
//         color.current,
//         lineThickness.current,
//         lineType.current
//       );
//     } else if (mode.current === 'pan' && isPanning.current) {
//       isDragging.current = true;
//       const dx = e.clientX - startX.current;
//       const dy = e.clientY - startY.current;
//       panX.current += dx;
//       panY.current += dy;
//       startX.current = e.clientX;
//       startY.current = e.clientY;

//       ctx.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
//       drawShapes();
//     } else if (mode.current === 'select' && selectedShape.current) {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       if (movingShape.current) {
//         const dx = currentX.current - startX.current;
//         const dy = currentY.current - startY.current;
//         moveShape(selectedShape.current, dx, dy);
//         startX.current = currentX.current;
//         startY.current = currentY.current;
//       } else if (isDragging.current) {
//         resizeShape(selectedShape.current, selectedHandle.current, currentX.current, currentY.current);
//       }
//       drawShapes();
//       drawSelection(selectedShape.current);
//     }
//   };

//   const stopDrawing = (e) => {
//     isDrawing.current = false;
//     isPanning.current = false;
//     isDragging.current = false;

//     ctx.closePath();

//     if (mode.current === 'draw') {
//       shapes.push({
//         type: 'line',
//         x1: startX.current,
//         y1: startY.current,
//         x2: currentX.current,
//         y2: currentY.current,
//         color: color.current,
//         thickness: lineThickness.current,
//         lineType: lineType.current,
//       });
//       updateShapes(shapes);
//       saveState();
//       socket.emit(
//         'updateBoardAction',
//         {
//           action: 'draw',
//           payload: {
//             type: 'line',
//             x1: startX.current,
//             y1: startY.current,
//             x2: currentX.current,
//             y2: currentY.current,
//             color: color.current,
//             thickness: lineThickness.current,
//             lineType: lineType.current,
//           },
//         },
//         handleServerResponse
//       );
//     } else if (mode.current === 'freehand') {
//       shapes.push({
//         type: 'freehand',
//         points: freehandDrawing.current,
//         color: color.current,
//         thickness: brushThickness.current,
//       });
//       updateShapes(shapes);
//       socket.emit(
//         'updateBoardAction',
//         {
//           action: 'draw',
//           payload: {
//             type: 'freehand',
//             points: freehandDrawing.current,
//             color: color.current,
//             thickness: brushThickness.current,
//           },
//         },
//         handleServerResponse
//       );
//       freehandDrawing.current = [];
//       saveState();
//     } else if (mode.current === 'shape') {
//       shapes.push({
//         type: shape.current,
//         x1: startX.current,
//         y1: startY.current,
//         x2: currentX.current,
//         y2: currentY.current,
//         color: color.current,
//         thickness: lineThickness.current,
//         lineType: lineType.current,
//       });
//       updateShapes(shapes);
//       saveState();
//       socket.emit(
//         'updateBoardAction',
//         {
//           action: 'shape',
//           payload: {
//             type: shape.current,
//             x1: startX.current,
//             y1: startY.current,
//             x2: currentX.current,
//             y2: currentY.current,
//             color: color.current,
//             thickness: lineThickness.current,
//             lineType: lineType.current,
//           },
//         },
//         handleServerResponse
//       );
//     } else if (mode.current === 'select') {
//       if (selectedShape.current && !movingShape.current && !isDragging.current) {
//         const shapeFound = findShape(currentX.current, currentY.current);
//         if (shapeFound) {
//           selectedShape.current = shapeFound;
//           drawShapes();
//           drawSelection(shapeFound);
//         }
//       }
//       if (selectedShape.current) {
//         socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
//       }
//       saveState();
//     }
//   };

//   const erase = (x, y) => {
//     ctx.save();
//     ctx.globalCompositeOperation = 'destination-out';
//     ctx.beginPath();
//     ctx.arc(x, y, eraserThickness.current / 2, 0, Math.PI * 2, false);
//     ctx.fill();
//     ctx.restore();

//     let changeOccurred = false;
//     shapes = shapes
//       .map((shape) => {
//         if (shape.type === 'freehand') {
//           return {
//             ...shape,
//             points: shape.points.filter((point) => {
//               const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
//               if (distance <= eraserThickness.current / 2) {
//                 changeOccurred = true;
//                 return false;
//               }
//               return distance > eraserThickness.current / 2;
//             }),
//           };
//         } else if (shape.type === 'line') {
//           if (isPointNearLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2, eraserThickness.current / 2)) {
//             changeOccurred = true;
//             return null;
//           }
//         } else if (shape.type === 'text') {
//           const textWidth = ctx.measureText(shape.text).width;
//           if (x > shape.x && x < shape.x + textWidth && y > shape.y - shape.fontSize && y < shape.y) {
//             changeOccurred = true;
//             return null;
//           }
//         } else if (shape.type === 'image') {
//           if (x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2) {
//             changeOccurred = true;
//             return null;
//           }
//         } else {
//           if (x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2) {
//             changeOccurred = true;
//             return null;
//           }
//         }
//         return shape;
//       })
//       .filter((shape) => shape && (shape.type !== 'freehand' || shape.points.length > 0));
//     updateShapes(shapes);

//     drawShapes();
//     if (changeOccurred) {
//       socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
//     }
//   };

//   const isPointNearLine = (px, py, x1, y1, x2, y2, threshold) => {
//     const dx = x2 - x1;
//     const dy = y2 - y1;
//     const length = Math.sqrt(dx * dx + dy * dy);
//     const dot = ((px - x1) * dx + (py - y1) * dy) / (length * length);
//     const closestX = x1 + dot * dx;
//     const closestY = y1 + dot * dy;
//     const distance = Math.sqrt(Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2));
//     return distance <= threshold;
//   };

//   const zoomCanvas = (scaleFactor, event = { clientX: canvas.width / 2, clientY: canvas.height / 2 }) => {
//     if (scaleFactor === 10) {
//       scale.current = 1;
//       panX.current = 0;
//       panY.current = 0;
//     } else {
//       let newScale = scale.current * scaleFactor;
//       if (newScale < minScale.current) {
//         newScale = minScale.current;
//       } else if (newScale > maxScale.current) {
//         newScale = maxScale.current;
//       }

//       const rect = canvas.getBoundingClientRect();
//       const offsetX = (event.clientX - rect.left) / rect.width;
//       const offsetY = (event.clientY - rect.top) / rect.height;

//       const dx = (offsetX * canvas.width) * (1 - scaleFactor);
//       const dy = (offsetY * canvas.height) * (1 - scaleFactor);

//       scale.current = newScale;
//       panX.current = panX.current * scaleFactor + dx;
//       panY.current = panY.current * scaleFactor + dy;

//       const maxPanX = (canvas.width * (scale.current - 1)) / scale.current;
//       const maxPanY = (canvas.height * (scale.current - 1)) / scale.current;
//       panX.current = Math.min(Math.max(panX.current, -maxPanX), 0);
//       panY.current = Math.min(Math.max(panY.current, -maxPanY), 0);
//     }

//     ctx.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
//     drawShapes();
//   };

//   const handleZoom = (e) => {
//     e.preventDefault();
//     if (e.deltaY < 0) {
//       zoomCanvas(1.2, e);
//     } else {
//       zoomCanvas(0.8, e);
//     }
//   };

//   const drawEdgeMarkers = () => {
//     ctx.save();
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//     ctx.strokeStyle = 'red';
//     ctx.lineWidth = 5;

//     const markerLength = 20;
//     const topLeftX = panX.current;
//     const topLeftY = panY.current;
//     const bottomRightX = panX.current + 1280 * scale.current;
//     const bottomRightY = panY.current + 720 * scale.current;

//     ctx.beginPath();
//     ctx.moveTo(topLeftX, topLeftY + markerLength);
//     ctx.lineTo(topLeftX, topLeftY);
//     ctx.lineTo(topLeftX + markerLength, topLeftY);
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(bottomRightX - markerLength, topLeftY);
//     ctx.lineTo(bottomRightX, topLeftY);
//     ctx.lineTo(bottomRightX, topLeftY + markerLength);
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(bottomRightX, bottomRightY - markerLength);
//     ctx.lineTo(bottomRightX, bottomRightY);
//     ctx.lineTo(bottomRightX - markerLength, bottomRightY);
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(topLeftX + markerLength, bottomRightY);
//     ctx.lineTo(topLeftX, bottomRightY);
//     ctx.lineTo(topLeftX, bottomRightY - markerLength);
//     ctx.stroke();

//     ctx.restore();
//   };

//   const drawShapes = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.save();
//     ctx.setTransform(scale.current, 0, 0, scale.current, panX.current, panY.current);
//     if (useImageBackground) {
//       ctx.drawImage(
//         backgroundImage.current,
//         -panX.current / scale.current,
//         -panY.current / scale.current,
//         canvas.width / scale.current,
//         canvas.height / scale.current
//       );
//     } else {
//       ctx.fillStyle = '#fff';
//       ctx.fillRect(
//         -panX.current / scale.current,
//         -panY.current / scale.current,
//         canvas.width / scale.current,
//         canvas.height / scale.current
//       );
//     }
//     shapes.forEach((shape) => {
//       if (shape.type === 'line') {
//         drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType);
//       } else if (shape.type === 'freehand') {
//         drawFreehand(shape.points, shape.color, shape.thickness);
//       } else if (shape.type === 'text') {
//         ctx.font = `${shape.fontSize}px ${shape.font}`;
//         ctx.fillStyle = shape.color;
//         ctx.fillText(shape.text, shape.x, shape.y);
//       } else if (shape.type === 'image') {
//         ctx.drawImage(shape.img, shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
//       } else {
//         drawShape(
//           shape.type,
//           shape.x1,
//           shape.y1,
//           shape.x2,
//           shape.y2,
//           shape.color,
//           shape.thickness,
//           shape.lineType
//         );
//       }
//     });
//     ctx.restore();
//     drawEdgeMarkers();
//   };

//   const drawLine = (x1, y1, x2, y2, color, thickness, lineType) => {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     ctx.lineWidth = thickness;
//     if (lineType === 'dashed') {
//       ctx.setLineDash([10, 10]);
//     } else if (lineType === 'dotted') {
//       ctx.setLineDash([2, 10]);
//     } else if (lineType === 'dashDot') {
//       ctx.setLineDash([10, 5, 2, 5]);
//     } else {
//       ctx.setLineDash([]);
//     }
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2);
//     ctx.stroke();
//     ctx.setLineDash([]);
//   };

//   const drawText = (text, x, y, color, font) => {
//     ctx.font = `20px ${font}`;
//     ctx.fillStyle = color;
//     ctx.fillText(text, x, y);
//   };

//   const drawFreehand = (points, color, thickness) => {
//     if (points.length < 2) return;
//     ctx.strokeStyle = color;
//     ctx.lineWidth = thickness;
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//       ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.stroke();
//   };

//   const drawPolygon = (ctx, sides, x1, y1, x2, y2) => {
//     const centerX = (x1 + x2) / 2;
//     const centerY = (y1 + y2) / 2;
//     const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
//     const angle = (2 * Math.PI) / sides;
//     ctx.beginPath();
//     for (let i = 0; i < sides; i++) {
//       const x = centerX + radius * Math.cos(i * angle - Math.PI / 2);
//       const y = centerY + radius * Math.sin(i * angle - Math.PI / 2);
//       if (i === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     }
//     ctx.closePath();
//     ctx.stroke();
//   };

//   const drawShape = (type, x1, y1, x2, y2, color, thickness, lineType, ctxx = ctx) => {
//     ctxx.beginPath();
//     ctxx.strokeStyle = color;
//     ctxx.lineWidth = thickness;
//     if (lineType === 'dashed') {
//       ctxx.setLineDash([10, 10]);
//     } else if (lineType === 'dotted') {
//       ctxx.setLineDash([2, 10]);
//     } else if (lineType === 'dashDot') {
//       ctxx.setLineDash([10, 5, 2, 5]);
//     } else {
//       ctxx.setLineDash([]);
//     }
//     if (type === 'rectangle') {
//       ctxx.strokeRect(x1, y1, x2 - x1, y2 - y1);
//     } else if (type === 'circle') {
//       const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
//       ctxx.arc(x1, y1, radius, 0, 2 * Math.PI);
//       ctxx.stroke();
//     } else if (type === 'rhombus') {
//       const centerX = (x1 + x2) / 2;
//       const centerY = (y1 + y2) / 2;
//       const halfWidth = Math.abs(x2 - x1) / 2;
//       const halfHeight = Math.abs(y2 - y1) / 2;
//       ctxx.moveTo(centerX, y1);
//       ctxx.lineTo(x2, centerY);
//       ctxx.lineTo(centerX, y2);
//       ctxx.lineTo(x1, centerY);
//       ctxx.closePath();
//       ctxx.stroke();
//     } else if (type === 'pentagon') {
//       drawPolygon(ctxx, 5, x1, y1, x2, y2);
//     } else if (type === 'hexagon') {
//       drawPolygon(ctxx, 6, x1, y1, x2, y2);
//     } else if (type === 'triangle') {
//       const centerXTriangle = (x1 + x2) / 2;
//       ctxx.moveTo(centerXTriangle, y1);
//       ctxx.lineTo(x2, y2);
//       ctxx.lineTo(x1, y2);
//       ctxx.closePath();
//       ctxx.stroke();
//     } else if (type === 'square') {
//       ctxx.strokeRect(x1, y1, x2 - x1, x2 - x1);
//     } else if (type === 'octagon') {
//       drawPolygon(ctxx, 8, x1, y1, x2, y2);
//     } else if (type === 'oval') {
//       const radiusX = Math.abs(x2 - x1) / 2;
//       const radiusY = Math.abs(y2 - y1) / 2;
//       const centerX = (x1 + x2) / 2;
//       const centerY = (y1 + y2) / 2;
//       ctxx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
//       ctxx.stroke();
//     } else if (type === 'parallelogram') {
//       const centerX = (x1 + x2) / 2;
//       const centerY = (y1 + y2) / 2;
//       ctxx.moveTo(centerX, y1);
//       ctxx.lineTo(x2, y2);
//       ctxx.lineTo(centerX, y2);
//       ctxx.lineTo(x1, y1);
//       ctxx.closePath();
//       ctxx.stroke();
//     } else if (type === 'image') {
//       ctxx.drawImage(shape.img, x1, y1, x2 - x1, y2 - y1);
//     }
//   };

//   const undo = () => {
//     if (!checkBoardAccess()) return;

//     if (shapes.length > 0) {
//       redoStack.push(shapes.pop());
//       updateRedoStack(redoStack);
//       drawShapes();
//       socket.emit('updateBoardAction', { action: 'undo' }, handleServerResponse);
//     }
//   };

//   const redo = () => {
//     if (!checkBoardAccess()) return;

//     if (redoStack.length > 0) {
//       shapes.push(redoStack.pop());
//       updateShapes(shapes);
//       drawShapes();
//       socket.emit('updateBoardAction', { action: 'redo' }, handleServerResponse);
//     }
//   };

//   const saveState = () => {
//     undoStack.push(JSON.stringify(shapes));
//     updateUndoStack(undoStack);
//   };

//   const findShape = (x, y) => {
//     return shapes.find((shape) => {
//       if (shape.type === 'freehand') {
//         return shape.points.some((point) => {
//           const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
//           return distance < shape.thickness;
//         });
//       } else if (shape.type === 'text') {
//         ctx.font = `${shape.fontSize}px ${shape.font}`;
//         const textMetrics = ctx.measureText(shape.text);
//         return x > shape.x && x < shape.x + textMetrics.width && y > shape.y - shape.fontSize && y < shape.y;
//       } else if (shape.type === 'image') {
//         return x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2;
//       } else {
//         return x > shape.x1 && x < shape.x2 && y > shape.y1 && y < shape.y2;
//       }
//     });
//   };

//   const drawSelection = (shape) => {
//     if (!shape) return;

//     const handles = getResizeHandles(shape);
//     ctx.strokeStyle = 'red';
//     ctx.lineWidth = 2;
//     ctx.setLineDash([6, 3]);
//     if (shape.type === 'line') {
//       ctx.beginPath();
//       ctx.moveTo(shape.x1, shape.y1);
//       ctx.lineTo(shape.x2, shape.y2);
//       ctx.stroke();
//     } else if (shape.type === 'circle') {
//       const radius = Math.sqrt(Math.pow(shape.x2 - shape.x1, 2) + Math.pow(shape.y2 - shape.y1, 2));
//       ctx.beginPath();
//       ctx.arc(shape.x1, shape.y1, radius, 0, 2 * Math.PI);
//       ctx.stroke();
//     } else {
//       ctx.strokeRect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
//     }

//     ctx.setLineDash([]);

//     handles.forEach((handle) => {
//       ctx.fillStyle = handle.isCenter ? 'blue' : 'red';
//       ctx.fillRect(handle.x - 6, handle.y - 6, 12, 12);
//     });
//   };

//   const getResizeHandles = (shape) => {
//     const handles = [];
//     if (shape.type === 'line') {
//       handles.push({ x: shape.x1, y: shape.y1 });
//       handles.push({ x: shape.x2, y: shape.y2 });
//     } else if (shape.type === 'circle') {
//       const radius = Math.sqrt(Math.pow(shape.x2 - shape.x1, 2) + Math.pow(shape.y2 - shape.y1, 2));
//       handles.push({ x: shape.x1 + radius, y: shape.y1 });
//       handles.push({ x: shape.x1 - radius, y: shape.y1 });
//       handles.push({ x: shape.x1, y: shape.y1 + radius });
//       handles.push({ x: shape.x1, y: shape.y1 - radius });
//       handles.push({ x: shape.x1, y: shape.y1, isCenter: true });
//     } else if (shape.type === 'text') {
//       const textMetrics = ctx.measureText(shape.text);
//       handles.push({ x: shape.x, y: shape.y - shape.fontSize, isCenter: true });
//       handles.push({ x: shape.x + textMetrics.width, y: shape.y, isCenter: false });
//     } else if (shape.type === 'image') {
//       handles.push({ x: shape.x1, y: shape.y1 });
//       handles.push({ x: shape.x2, y: shape.y1 });
//       handles.push({ x: shape.x2, y: shape.y2 });
//       handles.push({ x: shape.x1, y: shape.y2 });
//       handles.push({ x: (shape.x1 + shape.x2) / 2, y: (shape.y1 + shape.y2) / 2, isCenter: true });
//     } else {
//       handles.push({ x: shape.x1, y: shape.y1 });
//       handles.push({ x: shape.x2, y: shape.y1 });
//       handles.push({ x: shape.x2, y: shape.y2 });
//       handles.push({ x: shape.x1, y: shape.y2 });
//       handles.push({ x: (shape.x1 + shape.x2) / 2, y: (shape.y1 + shape.y2) / 2, isCenter: true });
//     }
//     return handles.map((handle) => ({
//       ...handle,
//       isCenter: handle.isCenter || false,
//     }));
//   };

//   const getHandleAtPosition = (x, y) => {
//     if (!selectedShape.current) return null;
//     return getResizeHandles(selectedShape.current).find((handle) => {
//       return Math.abs(handle.x - x) < 6 && Math.abs(handle.y - y) < 6;
//     });
//   };

//   const resizeShape = (shape, handle, x, y) => {
//     if (shape.type === 'line') {
//       if (handle.x === shape.x1 && handle.y === shape.y1) {
//         shape.x1 = x;
//         shape.y1 = y;
//       } else {
//         shape.x2 = x;
//         shape.y2 = y;
//       }
//     } else if (shape.type === 'circle') {
//       const dx = x - shape.x1;
//       const dy = y - shape.y1;
//       const radius = Math.sqrt(dx * dx + dy * dy);
//       shape.x2 = shape.x1 + radius;
//       shape.y2 = shape.y1;
//     } else if (shape.type === 'text') {
//       if (handle.isCenter) {
//         shape.x = x;
//         shape.y = y;
//       } else {
//         const textMetrics = ctx.measureText(shape.text);
//         shape.x = x - textMetrics.width;
//         shape.y = y;
//       }
//     } else if (shape.type === 'image') {
//       if (handle.isCenter) {
//         const dx = x - (shape.x1 + shape.x2) / 2;
//         const dy = y - (shape.y1 + shape.y2) / 2;
//         moveShape(shape, dx, dy);
//       } else {
//         if (handle.x === shape.x1 && handle.y === shape.y1) {
//           shape.x1 = x;
//           shape.y1 = y;
//         } else if (handle.x === shape.x2 && handle.y === shape.y1) {
//           shape.x2 = x;
//           shape.y1 = y;
//         } else if (handle.x === shape.x2 && handle.y === shape.y2) {
//           shape.x2 = x;
//           shape.y2 = y;
//         } else {
//           shape.x1 = x;
//           shape.y2 = y;
//         }
//       }
//     } else {
//       if (handle.isCenter) {
//         const dx = x - (shape.x1 + shape.x2) / 2;
//         const dy = y - (shape.y1 + shape.y2) / 2;
//         moveShape(shape, dx, dy);
//       } else {
//         if (handle.x === shape.x1 && handle.y === shape.y1) {
//           shape.x1 = x;
//           shape.y1 = y;
//         } else if (handle.x === shape.x2 && handle.y === shape.y1) {
//           shape.x2 = x;
//           shape.y1 = y;
//         } else if (handle.x === shape.x2 && handle.y === shape.y2) {
//           shape.x2 = x;
//           shape.y2 = y;
//         } else {
//           shape.x1 = x;
//           shape.y2 = y;
//         }
//       }
//     }
//     drawShapes();
//   };

//   const moveShape = (shape, dx, dy) => {
//     if (shape.type === 'line' || shape.type === 'circle') {
//       shape.x1 += dx;
//       shape.y1 += dy;
//       shape.x2 += dx;
//       shape.y2 += dy;
//     } else if (shape.type === 'freehand') {
//       shape.points.forEach((point) => {
//         point.x += dx;
//         point.y += dy;
//       });
//     } else if (shape.type === 'text') {
//       shape.x += dx;
//       shape.y += dy;
//     } else if (shape.type === 'image') {
//       shape.x1 += dx;
//       shape.y1 += dy;
//       shape.x2 += dx;
//       shape.y2 += dy;
//     } else {
//       shape.x1 += dx;
//       shape.y1 += dy;
//       shape.x2 += dx;
//       shape.y2 += dy;
//     }
//   };

//   const downloadCanvas = (tempCanvas) => {
//     const link = downloadLinkRef.current;
//     link.href = tempCanvas.toDataURL();
//     link.download = 'whiteboard.png';
//     link.click();
//   };

//   const saveCanvas = () => {
//     const tempCanvas = tempCanvasRef.current;
//     const tempCtx = tempCanvas.getContext('2d');
//     tempCanvas.width = canvas.width;
//     tempCanvas.height = canvas.height;
//     const notShapes = ['freehand', 'text', 'image', 'line'];

//     if (useImageBackground) {
//       const backgroundImage = new CanvasImage(canvas);
//       backgroundImage.crossOrigin = 'anonymous';
//       backgroundImage.onload = () => {
//         tempCtx.drawImage(backgroundImage, 0, 0, tempCanvas.width, tempCanvas.height);
//         shapes.forEach((shape) => {
//           !notShapes.includes(shape.type)
//             ? drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, tempCtx)
//             : drawShapeOnCanvas(shape, tempCtx);
//         });
//         downloadCanvas(tempCanvas);
//       };
//       backgroundImage.src = imageBackgroundUrl;
//     } else {
//       tempCtx.fillStyle = 'white';
//       tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

//       shapes.forEach((shape) => {
//         !notShapes.includes(shape.type)
//           ? drawShape(shape.type, shape.x1, shape.y1, shape.x2, shape.y2, shape.color, shape.thickness, shape.lineType, tempCtx)
//           : drawShapeOnCanvas(shape, tempCtx);
//       });
//       downloadCanvas(tempCanvas);
//     }
//   };

//   const drawShapeOnCanvas = (shape, ctxx = ctx) => {
//     ctxx.beginPath();
//     ctxx.strokeStyle = shape.color;
//     ctxx.lineWidth = shape.thickness || 2;
//     ctxx.fillStyle = shape.color;
//     ctxx.font = `${shape.fontSize}px ${shape.fontFamily}`;

//     const lineType = shape.lineType ? shape.lineType : 'solid';

//     if (lineType === 'dashed') {
//       ctxx.setLineDash([10, 10]);
//     } else if (lineType === 'dotted') {
//       ctxx.setLineDash([2, 10]);
//     } else if (lineType === 'dashDot') {
//       ctxx.setLineDash([10, 5, 2, 5]);
//     } else {
//       ctxx.setLineDash([]);
//     }
//     switch (shape.type) {
//       case 'line':
//         ctxx.moveTo(shape.x1, shape.y1);
//         ctxx.lineTo(shape.x2, shape.y2);
//         break;
//       case 'freehand':
//         try {
//           ctxx.moveTo(shape.points[0].x, shape.points[0].y);
//           shape.points.forEach((point) => ctxx.lineTo(point.x, point.y));
//         } catch (e) {
//           // console.log(e);
//         }
//         break;
//       case 'text':
//         ctxx.fillText(shape.text, shape.x, shape.y);
//         break;
//       case 'image':
//         ctxx.drawImage(shape.img, shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
//         break;
//       default:
//         break;
//     }
//     ctxx.stroke();
//   };

//   const deleteShape = (doEmits = true) => {
//     if (!checkBoardAccess()) return;

//     if (!selectedShape.current) return;
//     if (selectedShape.current) {
//       shapes = shapes.filter((shape) => shape !== selectedShape.current);
//       updateShapes(shapes);
//       selectedShape.current = null;
//       if (doEmits) {
//         socket.emit('updateBoardAction', { action: 'shapes', payload: { shapes } }, handleServerResponse);
//       }
//       drawShapes();
//     }
//   };

//   const toggleBackground = (doEmits = true) => {
//     if (doEmits && !checkBoardAccess()) return;
//     useImageBackground = !useImageBackground;
//     updateUseImageBackground(useImageBackground);
//     if (useImageBackground) {
//       toggleBackgroundRef.current.classList.remove('active');
//     } else {
//       toggleBackgroundRef.current.classList.add('active');
//     }
//     drawShapes();
//     if (doEmits) {
//       socket.emit('updateBoardAction', { action: 'toggleBackground', payload: useImageBackground }, handleServerResponse);
//     }
//   };

//   const clearCanvas = (doEmits = true) => {
//     if (islevel != 2 && doEmits) {
//       showAlert({ message: 'You do not have permission to clear the board', type: 'danger' });
//       return;
//     }
//     if (shapes.length === 0) return;
//     shapes = [];
//     updateShapes([]);
//     drawShapes();
//     if (doEmits) {
//       socket.emit('updateBoardAction', { action: 'clear' }, handleServerResponse);
//     }
//   };

//   const uploadImage = (e, doEmits = true) => {
//     try {
//       if (!checkBoardAccess()) return;
//       const file = e.target.files[0];
//       if (file.size > 1024 * 1024) {
//         showAlert({ message: 'File size must be less than 1MB', type: 'danger' });
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = function (event) {
//         const img = new CanvasImage(canvas);
//         img.src = event.target.result;
//         img.addEventListener('load', () => {
//           if (img.height > 600 && img.height > img.width && !file.type.includes('jpeg')) {
//             showAlert({
//               message: 'For better performance, please upload the image in JPG format.',
//               type: 'warning',
//             });
//             return;
//           }

//           let imageWidth = 350;
//           const aspectRatio = img.height / img.width;
//           let imageHeight = imageWidth * aspectRatio;
//           const maxHeight = 600;
//           if (imageHeight > maxHeight) {
//             imageHeight = maxHeight;
//             imageWidth = imageHeight / aspectRatio;
//             if (imageWidth > 600) {
//               imageWidth = 600;
//             }
//           }
//           const imageShape = {
//             type: 'image',
//             img: img,
//             src: event.target.result,
//             x1: 50,
//             y1: 50,
//             x2: 50 + imageWidth,
//             y2: 50 + imageHeight,
//           };
//           shapes.push(imageShape);
//           updateShapes(shapes);
//           drawShapes();
//           if (doEmits) {
//             socket.emit('updateBoardAction', { action: 'uploadImage', payload: imageShape }, handleServerResponse);
//           }
//         });
//       };
//       reader.onerror = function () {
//         showAlert({ message: 'Error reading file', type: 'danger' });
//       };
//       reader.readAsDataURL(file);
//     } catch (error) {
//       // console.log(error);
//     }
//   };

//   const handleServerResponse = (response) => {
//     if (!response.success) {
//       showAlert({ message: `Whiteboard action failed: ${response.reason}`, type: 'danger' });
//     }
//   };

//   socket.on('whiteboardAction', (data) => {
//     const { action, payload } = data;

//     if (!ctx && canvasRef.current) {
//       ctx = canvasRef.current.getContext('2d');
//       canvasWhiteboard = canvas;
//       updateCanvasWhiteboard(canvasWhiteboard);
//     }

//     if (!ctx) return;

//     switch (action) {
//       case 'draw':
//         if (payload.type === 'freehand') {
//           drawFreehand(payload.points, payload.color, payload.thickness);
//           shapes.push({
//             type: 'freehand',
//             points: payload.points,
//             color: payload.color,
//             thickness: payload.thickness,
//           });
//           updateShapes(shapes);
//         } else {
//           drawLine(
//             payload.x1,
//             payload.y1,
//             payload.x2,
//             payload.y2,
//             payload.color,
//             payload.thickness,
//             payload.lineType
//           );
//           shapes.push({
//             type: 'line',
//             x1: payload.x1,
//             y1: payload.y1,
//             x2: payload.x2,
//             y2: payload.y2,
//             color: payload.color,
//             thickness: payload.thickness,
//             lineType: payload.lineType,
//           });
//           updateShapes(shapes);
//         }
//         break;
//       case 'shape':
//         drawShape(
//           payload.type,
//           payload.x1,
//           payload.y1,
//           payload.x2,
//           payload.y2,
//           payload.color,
//           payload.thickness,
//           payload.lineType
//         );
//         shapes.push({
//           type: payload.type,
//           x1: payload.x1,
//           y1: payload.y1,
//           x2: payload.x2,
//           y2: payload.y2,
//           color: payload.color,
//           thickness: payload.thickness,
//           lineType: payload.lineType,
//         });
//         updateShapes(shapes);
//         break;
//       case 'erase':
//         erase(payload.x, payload.y, payload.eraserThickness);
//         break;
//       case 'clear':
//         clearCanvas(false);
//         break;
//       case 'uploadImage':
//         const img = new CanvasImage(canvas);
//         img.src = payload.src;
//         img.addEventListener('load', () => {
//           const imageShape = {
//             type: 'image',
//             img,
//             src: payload.src,
//             x1: payload.x1,
//             y1: payload.y1,
//             x2: payload.x2,
//             y2: payload.y2,
//           };
//           shapes.push(imageShape);
//           updateShapes(shapes);
//           drawShapes();
//         });
//         break;
//       case 'toggleBackground':
//         toggleBackground(false);
//         drawShapes();
//         break;
//       case 'undo':
//         if (shapes.length > 0) {
//           redoStack.push(shapes.pop());
//           updateRedoStack(redoStack);
//           drawShapes();
//         }
//         break;
//       case 'redo':
//         if (redoStack.length > 0) {
//           shapes.push(redoStack.pop());
//           updateShapes(shapes);
//           drawShapes();
//         }
//         break;
//       case 'text':
//         shapes.push({
//           type: 'text',
//           text: payload.text,
//           x: payload.x,
//           y: payload.y,
//           color: payload.color,
//           font: payload.font,
//           fontSize: payload.fontSize,
//         });
//         updateShapes(shapes);
//         drawShapes();
//         break;
//       case 'deleteShape':
//         shapes = shapes.filter((shape) => shape !== payload);
//         updateShapes(shapes);
//         drawShapes();
//         break;
//       case 'shapes':
//         const oldShapes = shapes.filter((shape) => shape.type === 'image');
//         shapes = payload.shapes.map((shape) => {
//           if (shape.type === 'image') {
//             const oldShape = oldShapes.find((oldShape) => oldShape.src === shape.src);
//             if (oldShape) {
//               return { ...shape, img: oldShape.img };
//             } else {
//               const img = new CanvasImage(canvas);
//               img.src = shape.src;
//               return { ...shape, img };
//             }
//           } else {
//             return shape;
//           }
//         });
//         updateShapes(shapes);
//         drawShapes();
//         break;
//       default:
//         break;
//     }
//   });

//   socket.on('whiteboardUpdated', async (data) => {
//     try {
//       if (islevel == '2' && data.members) {
//         participantsAll = await data.members.map((participant) => ({
//           isBanned: participant.isBanned,
//           name: participant.name,
//         }));

//         participants = await data.members.filter((participant) => participant.isBanned == false);
//         updateParticipants(participants);
//       }

//       whiteboardUsers = data.whiteboardUsers;
//       updateWhiteboardUsers(whiteboardUsers);

//       const useBoard = whiteboardUsers.find((user) => user.name == member && user.useBoard) ? true : false;
//       if (islevel != '2' && !useBoard && !whiteboardEnded) {
//         changeMode('pan');
//       }

//       if (data.whiteboardData && Object.keys(data.whiteboardData).length > 0) {
//         if (data.whiteboardData.shapes) {
//           const oldShapes = shapes.filter((shape) => shape.type === 'image');
//           shapes = data.whiteboardData.shapes.map((shape) => {
//             if (shape.type === 'image') {
//               const oldShape = oldShapes.find((oldShape) => oldShape.src === shape.src);
//               if (oldShape) {
//                 return { ...shape, img: oldShape.img };
//               } else {
//                 const img = new CanvasImage(canvas);
//                 img.src = shape.src;
//                 return { ...shape, img };
//               }
//             } else {
//               return shape;
//             }
//           });
//           updateShapes(shapes);
//         }
//         if (data.whiteboardData.useImageBackground != null) {
//           useImageBackground = data.whiteboardData.useImageBackground;
//           updateUseImageBackground(useImageBackground);
//         } else {
//           useImageBackground = true;
//           updateUseImageBackground(true);
//         }
//         if (data.whiteboardData.redoStack) {
//           redoStack = data.whiteboardData.redoStack;
//           updateRedoStack(redoStack);
//         }
//         if (data.whiteboardData.undoStack) {
//           undoStack = data.whiteboardData.undoStack;
//           updateUndoStack(undoStack);
//         }
//       }

//       if (data.status == 'started' && !whiteboardStarted) {
//         whiteboardStarted = true;
//         whiteboardEnded = false;
//         screenId = `whiteboard-${roomName}`;

//         updateWhiteboardStarted(true);
//         updateWhiteboardEnded(false);
//         updateScreenId(screenId);

//         if (islevel != '2') {
//           shareScreenStarted = true;
//           updateShareScreenStarted(true);
//           await onScreenChanges({ changed: true, parameters });
//         }
//       } else if (data.status == 'ended') {
//         const prevWhiteboardEnded = whiteboardEnded;
//         whiteboardEnded = true;
//         whiteboardStarted = false;
//         updateWhiteboardStarted(false);
//         updateWhiteboardEnded(true);
//         if (islevel == '2' && prevWhiteboardEnded) {
//         } else {
//           shareScreenStarted = false;
//           screenId = null;

//           updateShareScreenStarted(false);
//           updateScreenId(null);
//           await onScreenChanges({ changed: true, parameters });
//         }

//         try {
//           if (whiteboardStarted && islevel == '2' && (recordStarted || recordResumed)) {
//             if (!(recordPaused || recordStopped)) {
//               if (recordingMediaOptions == 'video') {
//                 await captureCanvasStream({ parameters, start: false });
//               }
//             }
//           }
//         } catch (error) { }
//       } else if (data.status == 'started' && whiteboardStarted) {
//         whiteboardStarted = true;
//         whiteboardEnded = false;

//         updateWhiteboardStarted(true);
//         updateWhiteboardEnded(false);

//         shareScreenStarted = true;
//         screenId = `whiteboard-${roomName}`;

//         updateShareScreenStarted(true);
//         updateScreenId(screenId);
//         await onScreenChanges({ changed: true, parameters });
//       }
//     } catch (error) { }
//   });

//   const handleDropdownClick = (id) => {
//     dropdownOpen.current = dropdownOpen.current === id ? null : id;
//   };

//   const handleItemClick = (callback, name, value) => {
//     callback(value);
//     dropdownOpen.current = null;
//     if (['draw', 'freehand', 'shape', 'text', 'erase'].includes(name)) {
//       changeMode(name);
//     }
//   };

//   const dropdownItems = (items, name, callback) => (
//     <View style={styles.dropdownMenu}>
//       {items.map((item, index) => (
//         <Pressable key={index} style={styles.dropdownItem} onPress={() => handleItemClick(callback, name, item.value)}>
//           <Text>{item.label}</Text>
//         </Pressable>
//       ))}
//     </View>
//   );

//   const toggleToolbar = () => {
//     toolbarVisible.current = !toolbarVisible.current;
//   };

//   const toggleColorPicker = () => {
//     setColorPickerVisible(!colorPickerVisible);
//   };

//   const handleColorChange = (color) => {
//     updateColor(color);
//     toggleColorPicker();
//   };

//   return (
//     <View
//       style={[
//         styles.whiteboardInterface,
//         { display: showAspect ? 'flex' : 'none', width: customWidth, height: customHeight },
//       ]}
//     >
//       <View style={styles.whiteboardContent}>
//         <Pressable style={styles.toolbarToggle} onPress={toggleToolbar}>
//           <Icon name={toolbarVisible.current ? 'chevron-left' : 'chevron-right'} size={20} />
//         </Pressable>
//         {toolbarVisible.current && (
//           <View style={styles.toolbar}>
//             <View style={styles.btnGroup}>
//               <Pressable style={styles.dropdownToggle} onPress={() => handleDropdownClick('drawMode')}>
//                 <Icon name="pencil-alt" size={20} />
//               </Pressable>
//               {dropdownOpen.current === 'drawMode' &&
//                 dropdownItems(
//                   [
//                     { label: 'XX-Small (3px)', value: 3 },
//                     { label: 'X-Small (6px)', value: 6 },
//                     { label: 'Small (12px)', value: 12 },
//                     { label: 'Medium (18px)', value: 18 },
//                     { label: 'Large (24px)', value: 24 },
//                     { label: 'X-Large (36px)', value: 36 },
//                   ],
//                   'draw',
//                   updateLineThickness
//                 )}
//             </View>
//             <View style={styles.btnGroup}>
//               <Pressable style={styles.dropdownToggle} onPress={() => handleDropdownClick('freehandMode')}>
//                 <Icon name="paint-brush" size={20} />
//               </Pressable>
//               {dropdownOpen.current === 'freehandMode' &&
//                 dropdownItems(
//                   [
//                     { label: 'X-Small (5px)', value: 5 },
//                     { label: 'Small (10px)', value: 10 },
//                     { label: 'Medium (20px)', value: 20 },
//                     { label: 'Large (40px)', value: 40 },
//                     { label: 'X-Large (60px)', value: 60 },
//                   ],
//                   'freehand',
//                   updateBrushThickness
//                 )}
//             </View>
//             <View style={styles.btnGroup}>
//               <Pressable style={styles.dropdownToggle} onPress={() => handleDropdownClick('shapeMode')}>
//                 <Icon name="shapes" size={20} />
//               </Pressable>
//               {dropdownOpen.current === 'shapeMode' &&
//                 dropdownItems(
//                   [
//                     {
//                       label: <Image source={require('../../assets/images/svg/square.svg')} style={styles.shapeIcon} />,
//                       value: 'square',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/rectangle.svg')} style={styles.shapeIcon} />,
//                       value: 'rectangle',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/circle.svg')} style={styles.shapeIcon} />,
//                       value: 'circle',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/triangle.svg')} style={styles.shapeIcon} />,
//                       value: 'triangle',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/hexagon.svg')} style={styles.shapeIcon} />,
//                       value: 'hexagon',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/pentagon.svg')} style={styles.shapeIcon} />,
//                       value: 'pentagon',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/rhombus.svg')} style={styles.shapeIcon} />,
//                       value: 'rhombus',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/octagon.svg')} style={styles.shapeIcon} />,
//                       value: 'octagon',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/parallelogram.svg')} style={styles.shapeIcon} />,
//                       value: 'parallelogram',
//                     },
//                     {
//                       label: <Image source={require('../../assets/images/svg/oval.svg')} style={styles.shapeIcon} />,
//                       value: 'oval',
//                     },
//                   ],
//                   'shape',
//                   updateShape
//                 )}
//             </View>
//             <Pressable style={styles.btnSecondary} onPress={() => changeMode('select')}>
//               <Icon name="mouse-pointer" size={20} />
//             </Pressable>
//             <View style={styles.btnGroup}>
//               <Pressable style={styles.dropdownToggle} onPress={() => handleDropdownClick('eraseMode')}>
//                 <Icon name="eraser" size={20} />
//               </Pressable>
//               {dropdownOpen.current === 'eraseMode' &&
//                 dropdownItems(
//                   [
//                     { label: 'X-Small (5px)', value: 5 },
//                     { label: 'Small (10px)', value: 10 },
//                     { label: 'Medium (20px)', value: 20 },
//                     { label: 'Large (30px)', value: 30 },
//                     { label: 'X-Large (60px)', value: 60 },
//                   ],
//                   'erase',
//                   updateEraserThickness
//                 )}
//             </View>
//             <Pressable style={styles.btnInfo} onPress={() => changeMode('pan')}>
//               <Icon name="hand-paper" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSuccess} onPress={(e) => zoomCanvas(1.2, e)}>
//               <Icon name="search-plus" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSuccess} onPress={(e) => zoomCanvas(10, e)}>
//               <Icon name="search" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSuccess} onPress={(e) => zoomCanvas(0.8, e)}>
//               <Icon name="search-minus" size={20} />
//             </Pressable>
//             <View style={styles.btnGroup}>
//               <Pressable style={styles.dropdownToggle} onPress={() => handleDropdownClick('addText')}>
//                 <Icon name="font" size={20} />
//               </Pressable>
//               {dropdownOpen.current === 'addText' &&
//                 dropdownItems(
//                   [
//                     { label: 'Arial', value: 'Arial' },
//                     { label: 'Times New Roman', value: 'Times New Roman' },
//                     { label: 'Courier New', value: 'Courier New' },
//                     { label: 'Verdana', value: 'Verdana' },
//                   ],
//                   'text',
//                   updateFont
//                 )}
//             </View>
//             <View style={styles.btnGroup}>
//               <Pressable style={styles.dropdownToggle} onPress={() => handleDropdownClick('fontSize')}>
//                 <Icon name="text-height" size={20} />
//               </Pressable>
//               {dropdownOpen.current === 'fontSize' &&
//                 dropdownItems(
//                   [
//                     { label: 'X-Small (5px)', value: 5 },
//                     { label: 'Small (10px)', value: 10 },
//                     { label: 'Medium (20px)', value: 20 },
//                     { label: 'Large (40px)', value: 40 },
//                     { label: 'X-Large (60px)', value: 60 },
//                   ],
//                   '',
//                   updateFontSize
//                 )}
//             </View>
//             <Pressable style={styles.btnSecondary} onPress={undo}>
//               <Icon name="undo" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSecondary} onPress={redo}>
//               <Icon name="redo" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSecondary} onPress={saveCanvas}>
//               <Icon name="save" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnDanger} onPress={deleteShape}>
//               <Icon name="trash" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSecondary} onPress={clearCanvas}>
//               <Icon name="times" size={20} />
//             </Pressable>
//             <Pressable style={styles.btnSecondary} onPress={toggleBackground} ref={toggleBackgroundRef}>
//               <Image source={require('../../assets/images/svg/graph.jpg')} style={styles.toggleIcon} />
//             </Pressable>
//           </View>
//         )}
//       </View>
//       <Modal visible={colorPickerVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Pressable onPress={() => handleColorChange('#FF0000')}>
//               <View style={[styles.colorOption, { backgroundColor: '#FF0000' }]} />
//             </Pressable>
//             <Pressable onPress={() => handleColorChange('#00FF00')}>
//               <View style={[styles.colorOption, { backgroundColor: '#00FF00' }]} />
//             </Pressable>
//             <Pressable onPress={() => handleColorChange('#0000FF')}>
//               <View style={[styles.colorOption, { backgroundColor: '#0000FF' }]} />
//             </Pressable>
//             <Pressable onPress={() => handleColorChange('#FFFF00')}>
//               <View style={[styles.colorOption, { backgroundColor: '#FFFF00' }]} />
//             </Pressable>
//             <Pressable onPress={() => handleColorChange('#FFFFFF')}>
//               <View style={[styles.colorOption, { backgroundColor: '#FFFFFF', borderColor: '#000000' }]} />
//             </Pressable>
//             <Pressable onPress={() => handleColorChange('#000000')}>
//               <View style={[styles.colorOption, { backgroundColor: '#000000' }]} />
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       <ScrollView>
//         <View style={{ width: 1280, height: 720 }}>
//           <TextInput style={styles.textInput} ref={textInputRef} />
//           <ForwardedCanvas ref={canvasRef} style={{ borderWidth: 2, borderColor: 'red' }} />
//           <ForwardedCanvas ref={tempCanvasRef} style={{ display: 'none' }} />
//         </View>
//       </ScrollView>
//     </View>
     
//   );
// };

// const styles = StyleSheet.create({
//   whiteboardInterface: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     zIndex: 99,
//     backgroundColor: '#fff',
//   },
//   whiteboardContent: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   toolbarToggle: {
//     padding: 10,
//   },
//   toolbar: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     padding: 5,
//     borderRadius: 5,
//     margin: 5,
//   },
//   btnGroup: {
//     position: 'relative',
//     marginRight: 5,
//   },
//   btnSecondary: {
//     backgroundColor: '#d1d1d1',
//     borderRadius: 5,
//     padding: 10,
//     margin: 5,
//   },
//   btnSuccess: {
//     backgroundColor: '#5cb85c',
//     borderRadius: 5,
//     padding: 10,
//     margin: 5,
//   },
//   btnInfo: {
//     backgroundColor: '#5bc0de',
//     borderRadius: 5,
//     padding: 10,
//     margin: 5,
//   },
//   btnDanger: {
//     backgroundColor: '#d9534f',
//     borderRadius: 5,
//     padding: 10,
//     margin: 5,
//   },
//   dropdownToggle: {
//     backgroundColor: '#d1d1d1',
//     borderRadius: 5,
//     padding: 10,
//     margin: 5,
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: 35,
//     left: 0,
//     zIndex: 999,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     padding: 5,
//     minWidth: 120,
//     boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
//     elevation: 1,
//   },
//   dropdownItem: {
//     padding: 10,
//   },
//   shapeIcon: {
//     width: 20,
//     height: 20,
//   },
//   toggleIcon: {
//     width: 40,
//     height: 40,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 10,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   colorOption: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     margin: 5,
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
// });

// export default Whiteboard;
