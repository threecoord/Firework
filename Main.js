
function Main() {

        const eCanvas = document.createElement('canvas');
        eCanvas.id = 'Canvas';
        const nWidth = 1024;
        const nHeight = 1024;
        eCanvas.width = nWidth;
        eCanvas.height = nHeight;
        document.body.appendChild(eCanvas);
        function CenterCanvas() {
                const eParent = eCanvas.parentElement;
                eCanvas.style.position = 'absolute';
                eCanvas.style.left = (eParent.clientWidth - nWidth) / 2 + 'px';
        }
        CenterCanvas();
        window.addEventListener('resize', CenterCanvas);

        const oCtx = eCanvas.getContext('2d');
        oCtx.textAlign = "center";
        oCtx.textBaseline = "middle";

        function anColor(sColor) {
                sColor = sColor.replace(/^#/, '');
                return [
                        parseInt(sColor.substring(0, 2), 16),
                        parseInt(sColor.substring(2, 4), 16),
                        parseInt(sColor.substring(4, 6), 16),
                ];
        }

        function sColor(nR, nG, nB) {
                nR = Math.max(0, Math.min(255, Math.round(nR)));
                nG = Math.max(0, Math.min(255, Math.round(nG)));
                nB = Math.max(0, Math.min(255, Math.round(nB)));
                const sR = nR.toString(16).padStart(2, '0');
                const sG = nG.toString(16).padStart(2, '0');
                const sB = nB.toString(16).padStart(2, '0');
                return `#${sR}${sG}${sB}`.toUpperCase();
        }

        function DrawFrame(anX, anY, asColor, anSize, asType, asWord) {
                const nCount = anX.length;
                const oImageData = oCtx.getImageData(0, 0, nWidth, nHeight);
                oImageData.data.fill(0); 
                for (let nI = 3; nI < oImageData.data.length; nI += 4) {
                        oImageData.data[nI] = 255;
                }
                for(let nI = 0; nI < nCount; nI++) {
                        if(asType[nI] == "Pixel") {
                                let nRadius = anSize[nI] / 2.0;
                                for(let nXD = -nRadius; nXD <= nRadius; nXD += 0.5) {
                                        for(let nYD = -nRadius; nYD <= nRadius; nYD += 0.5) {
                                                if(nXD * nXD + nYD * nYD <= nRadius * nRadius) {
                                                        let nX = Math.round(anX[nI] + nXD);
                                                        let nY = Math.round(anY[nI] + nYD);
                                                        if((nX >= 0) && (nX < nWidth) && (nY >= 0) && (nY < nHeight)) {
                                                                let nIData = (nY * nWidth + nX) * 4;
                                                                [oImageData.data[nIData + 0], oImageData.data[nIData + 1], oImageData.data[nIData + 2]] = anColor(asColor[nI]);
                                                                oImageData.data[nIData + 3] = 255;
                                                        }

                                                }
                                        }
                                }
                        }
                }
                oCtx.putImageData(oImageData, 0, 0);
                for(let nI = 0; nI < nCount; nI++) {
                        if(asType[nI] == "Word") {
                                oCtx.font = String(anSize[nI]) + "px Arial";
                                oCtx.fillStyle = asColor[nI];
                                oCtx.fillText(asWord[nI], anX[nI], anY[nI]);
                        }
                }
        }

        const nFPS = 60.0;
        const nTIF = Math.round(1000.0 / nFPS);
        const nTCount = 2000;
        let nT = 0;
        const oIntervalId = setInterval(() => {
                nT = nT % nTCount;
                const anX = [];
                const anY = [];
                const asColor = [];
                const anSize = [];
                const asType = [];
                const asWord = [];
                function AddLine(nXStart, nXEnd, nYStart, nYEnd, nTStart, nTEnd, sColorStart, sColorEnd, nSizeStart, nSizeEnd, nCountTail, nTTail, sType, sWord) {
                        const nXD = nXEnd - nXStart;
                        const nYD = nYEnd - nYStart;
                        const nTD = nTEnd - nTStart;
                        let nColorStartR;
                        let nColorStartG;
                        let nColorStartB;
                        [nColorStartR, nColorStartG, nColorStartB] = anColor(sColorStart);
                        let nColorEndR;
                        let nColorEndG;
                        let nColorEndB;  
                        [nColorEndR, nColorEndG, nColorEndB] = anColor(sColorEnd);   
                        let nColorDR;      
                        let nColorDG; 
                        let nColorDB;   
                        [nColorDR, nColorDG, nColorDB] = [nColorEndR - nColorStartR, nColorEndG - nColorStartG, nColorEndB - nColorStartB];
                        const sColorD = sColor(nColorDR, nColorDG, nColorDB);
                        const nSizeD = nSizeEnd - nSizeStart;
                        let nTN = nT - nCountTail * nTTail;
                        for(let nI = 0; nI < nCountTail; nI++) {
                                nTN += nTTail;
                                if((nTN >= nTStart) && (nTN <= nTEnd)) {
                                        let nTND = nTN - nTStart;
                                        let nRatio = nTND / nTD;
                                        let nX = nXD * nRatio + nXStart;
                                        let nY = nYD * nRatio + nYStart;
                                        let nColorR = nColorDR * nRatio + nColorStartR;
                                        let nColorG = nColorDG * nRatio + nColorStartG;
                                        let nColorB = nColorDB * nRatio + nColorStartB;
                                        let nSize = nSizeD * nRatio + nSizeStart;
                                        anX.push(nX);
                                        anY.push(nY);
                                        asColor.push(sColor(nColorR, nColorG, nColorB));
                                        anSize.push(nSize);
                                        asType.push(sType);
                                        if(sType == "Word") {
                                                asWord.push(sWord);
                                        }
                                }
                        }
                }
                const nXStart = nWidth / 2.0;
                const nYStart = nWidth / 2.0;
                const nRadius = 100.0;
                const nCountLine = 10;
                const nAngleStep = 2.0 * Math.PI / nCountLine;
                let nAngle = 0.0;
                let nXEnd;
                let nYEnd;
                for(let nI = 0; nI < nCountLine; nI++) {
                        nXEnd = nXStart + nRadius * Math.cos(nAngle);
                        nYEnd = nYStart + nRadius * Math.sin(nAngle);
                        AddLine(nXStart, nXEnd, nYStart, nYEnd, 0, nTCount, "#ff00ff", "#00ff00", 1, 10, 5, 100, "Pixel", "唯");
                        nAngle += nAngleStep;
                }
                DrawFrame(anX, anY, asColor, anSize, asType, asWord);
                nT += nTIF;
        }, nTIF);

}

Main();
