
import styles from './index.less';
import {useEffect} from 'react';
import { RenderingEngine, Enums, init as csRenderInit } from '@cornerstonejs/core';
const LabelPage = () => {
    const initHandle = async () => {
        const imageId = "wadors:https://d1qmxk7r72ysft.cloudfront.net/dicomweb/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.811199116755887922789178901449/frames/1";
        // const imageId = "wadors:https://tools.cornerstonejs.org/examples/assets/dicom/bellona/chest_lung/1.dcm";
        const element = document.getElementById('content');
        const renderingEngineId = 'myRenderingEngine';
        const viewportId = 'CT_STACK';
        await csRenderInit();
        const renderingEngine = new RenderingEngine(renderingEngineId);
        const { ViewportType } = Enums;
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
      <div id="content" className={styles.content}>
          <div className={styles.flexBox}>
              <div className={styles.flexItem}></div>
              <div className={styles.flexItem}></div>
              <div className={styles.flexItem}></div>
          </div>
      </div>
    );
};
export default LabelPage;
  