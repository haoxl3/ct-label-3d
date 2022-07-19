import styles from './index.less';
import {useEffect} from 'react';
import {
    RenderingEngine,
    Enums,
    init as csRenderInit,
    volumeLoader,
    CONSTANTS,
    Types,
    setVolumesForViewports
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
const {
    ToolGroupManager,
    Enums: csToolsEnums,
    StackScrollMouseWheelTool,
    CrosshairsTool
} = cornerstoneTools;
import {setCtTransferFunctionForVolumeActor} from '@/utils/setCtTransferFunctionForVolumeActor';
// import {addDropdownToToolbar} from '@/utils/addDropdownToToolbar';
import {imageIds} from '@/utils/imageIds';

const { MouseBindings } = csToolsEnums;
const { ViewportType } = Enums;
const { ORIENTATION } = CONSTANTS;
// Define a unique id for the volume
const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id

const viewportId1 = 'CT_AXIAL';
const viewportId2 = 'CT_SAGITTAL';
const viewportId3 = 'CT_CORONAL';
const toolGroupId = 'MY_TOOLGROUP_ID';

const viewportColors = {
    [viewportId1]: 'rgb(200, 0, 0)',
    [viewportId2]: 'rgb(200, 200, 0)',
    [viewportId3]: 'rgb(0, 200, 0)',
};

const viewportReferenceLineControllable = [
    viewportId1,
    viewportId2,
    viewportId3,
];
  
const viewportReferenceLineDraggableRotatable = [
    viewportId1,
    viewportId2,
    viewportId3,
];
  
const viewportReferenceLineSlabThicknessControlsOn = [
    viewportId1,
    viewportId2,
    viewportId3,
];

const CrossHairs = () => {
    const getReferenceLineColor = (viewportId: any) => {
        return viewportColors[viewportId];
    };
    const getReferenceLineControllable = (viewportId: any) => {
        const index = viewportReferenceLineControllable.indexOf(viewportId);
        return index !== -1;
    };
    const getReferenceLineDraggableRotatable = (viewportId: any) => {
        const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
        return index !== -1;
    };
    const getReferenceLineSlabThicknessControlsOn = (viewportId: any) => {
        const index =
          viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
        return index !== -1;
    };
    const initHandle = async () => {
        await csRenderInit();
        // Add tools to Cornerstone3D
        cornerstoneTools.addTool(StackScrollMouseWheelTool);
        cornerstoneTools.addTool(CrosshairsTool);
        // const imageIds = '';
        console.log(imageIds);
        const volume = await volumeLoader.createAndCacheVolume(volumeId, {
            imageIds,
        });
        // Instantiate a rendering engine
        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);
        const element1 = document.getElementById('element1');
        const element2 = document.getElementById('element2');
        const element3 = document.getElementById('element3');
        const viewportInputArray = [
            {
                viewportId: viewportId1,
                type: ViewportType.ORTHOGRAPHIC,
                element: element1,
                defaultOptions: {
                  orientation: ORIENTATION.AXIAL,
                  background: [0, 0, 0],
                },
            },
            {
                viewportId: viewportId2,
                type: ViewportType.ORTHOGRAPHIC,
                element: element2,
                defaultOptions: {
                  orientation: ORIENTATION.SAGITTAL,
                  background: [0, 0, 0],
                },
            },
            {
                viewportId: viewportId3,
                type: ViewportType.ORTHOGRAPHIC,
                element: element3,
                defaultOptions: {
                  orientation: ORIENTATION.CORONAL,
                  background: [0, 0, 0],
                },
            },
        ];
        renderingEngine.setViewports(viewportInputArray);
        // Set the volume to load
        volume.load();

        // Set volumes on the viewports
        await setVolumesForViewports(
            renderingEngine,
            [
                {
                    volumeId,
                    callback: setCtTransferFunctionForVolumeActor,
                },
            ],
            [viewportId1, viewportId2, viewportId3]
        );

        // Define tool groups to add the segmentation display tool to
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
        // For the crosshairs to operate, the viewports must currently be
        // added ahead of setting the tool active. This will be improved in the future.
        toolGroup.addViewport(viewportId1, renderingEngineId);
        toolGroup.addViewport(viewportId2, renderingEngineId);
        toolGroup.addViewport(viewportId3, renderingEngineId);
        // Manipulation Tools
        toolGroup.addTool(StackScrollMouseWheelTool.toolName);
        // Add Crosshairs tool and configure it to link the three viewports
        // These viewports could use different tool groups. See the PET-CT example
        // for a more complicated used case.
        toolGroup.addTool(CrosshairsTool.toolName, {
            getReferenceLineColor,
            getReferenceLineControllable,
            getReferenceLineDraggableRotatable,
            getReferenceLineSlabThicknessControlsOn,
        });
        toolGroup.setToolActive(CrosshairsTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Primary }],
        });
        // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
        // hook instead of mouse buttons, it does not need to assign any mouse button.
        toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
        // Render the image
        renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
    };
    useEffect(() => {
        initHandle();
    }, []);
    return (
        <div className={styles.content}>
            <div className={styles.flexBox}>
                <div className={styles.flexItem} id="element1"></div>
                <div className={styles.flexItem} id="element2"></div>
                <div className={styles.flexItem} id="element3"></div>
            </div>
        </div>
    )
};
export default CrossHairs;