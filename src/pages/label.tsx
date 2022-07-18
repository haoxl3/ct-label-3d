
import styles from './index.less';
import {useEffect} from 'react';
import { RenderingEngine, Enums, init as csRenderInit } from '@cornerstonejs/core';
import * as cornerstone from '@cornerstonejs/core';
import dicomParser from 'dicom-parser';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
const { ViewportType } = Enums;

const LabelPage = () => {
    const initCornerstoneWADOImageLoader = () => {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.configure({
            useWebWorkers: true,
            decodeConfig: {
                convertFloatPixelDataToInt: false,
            },
        });
        let maxWebWorkers = 1;
        if (navigator.hardwareConcurrency) {
            maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
        }

        var config = {
            maxWebWorkers,
            startWebWorkersOnDemand: false,
            taskConfiguration: {
                decodeTask: {
                initializeCodecsOnStartup: false,
                strict: false,
                },
            },
        };
        cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
    };
    const initHandle = async () => {
        // const imageId = "wadors:https://d1qmxk7r72ysft.cloudfront.net/dicomweb/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.811199116755887922789178901449/frames/1";
        const imageId = "wadouri:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/wado?requestType=WADO&studyUID=1.3.6.1.4.1.25403.345050719074.3824.20170125112931.11&seriesUID=1.3.6.1.4.1.25403.345050719074.3824.20170125113028.6&objectUID=1.3.6.1.4.1.25403.345050719074.3824.20170125113100.3&contentType=application%2Fdicom"
        const element = document.getElementById('content');
        const renderingEngineId = 'myRenderingEngine';
        const viewportId = 'CT_STACK';
        initCornerstoneWADOImageLoader();
        await csRenderInit();
        const renderingEngine = new RenderingEngine(renderingEngineId);
        const viewportInput = {
            viewportId,
            element,
            type: ViewportType.STACK,
            defaultOptions: {
                background: [0, 0, 0]
            }
        };
        renderingEngine.enableElement(viewportInput);
        const viewport = renderingEngine.getViewport(viewportInput.viewportId);
        const stack = [imageId];
        await viewport.setStack(stack);
        viewport.render();
    };
    useEffect(() => {
        initHandle();
    }, []);
    return (
        <div className={styles.content}>
            <div className={styles.flexBox}>
                <div className={styles.flexItem} id="content"></div>
                <div className={styles.flexItem}></div>
                <div className={styles.flexItem}></div>
            </div>
        </div>
    );
};
export default LabelPage;
  