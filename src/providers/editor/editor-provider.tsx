'use client'
import { EditorState, HistoryState, EditorAction, Editor, DeviceTypes } from "@/types/editor";
import { addElement, deleteElement, updateElement } from "./editor-actions";
import { Dispatch, createContext, useContext, useEffect, useReducer } from "react";
import { FunnelPage } from "@prisma/client";

const initialEditorState: Editor = {
    elements: [
        {
            content: [],
            id: '__body',
            name: 'Body',
            styles: {},
            type: '__body',
        },
    ],
    selectedElement: {
        id: '',
        content: [],
        name: '',
        styles: {},
        type: null,
    },
    device: 'Desktop',
    previewMode: false,
    liveMode: false,
    funnelPageId: '',
}

const initialHistoryState: HistoryState = {
    history: [initialEditorState],
    currentIndex: 0,
}

const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
}


const editorReducer = (
    state: EditorState = initialState,
    action: EditorAction): EditorState => {

    switch (action.type) {
        case "ADD_ELEMENT":
            const updatedEditorState = {
                ...state.editor,
                elements: addElement(state.editor.elements, action)
            }

            const updatedHistory = [
                ...state.history.history.slice(0, state.history.currentIndex + 1), { ...updatedEditorState }
            ]

            return {
                //...state,
                editor: updatedEditorState,
                history: {
                    //...state.history,
                    history: updatedHistory,
                    currentIndex: updatedHistory.length - 1
                }
            }
        case "UPDATE_ELEMENT":
            const updatedElements = updateElement(state.editor.elements, action)
            const updatedElementIsSelected = state.editor.selectedElement?.id === action.payload.elementDetails.id
            const updatedEditorStateWithUpdate = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: updatedElementIsSelected ? action.payload.elementDetails : {
                    id: '',
                    content: [],
                    name: '',
                    styles: {},
                    type: null,
                },
            }

            const updatedHistoryWithUpdate = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateWithUpdate }
            ]

            return {
                editor: updatedEditorStateWithUpdate,
                history: {
                    history: updatedHistoryWithUpdate,
                    currentIndex: updatedHistoryWithUpdate.length - 1
                }
            }
        case "DELETE_ELEMENT":
            const updatedElementsAfterDelete = deleteElement(
                state.editor.elements,
                action
            )
            const updatedEditorStateAfterDelete = {
                ...state.editor,
                elements: updatedElementsAfterDelete,
            }
            const updatedHistoryAfterDelete = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateAfterDelete },
            ]

            return {
                editor: updatedEditorStateAfterDelete,
                history: {
                    history: updatedHistoryAfterDelete,
                    currentIndex: updatedHistoryAfterDelete.length - 1,
                },
            }
        case "CHANGE_CLICKED_ELEMENT":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    selectedElement: action.payload.elementDetails || {
                        id: '',
                        content: [],
                        name: '',
                        styles: {},
                        type: null,
                    }
                },
                // history: {
                //     history: [
                //         ...state.history.history.slice(0, state.history.currentIndex + 1),
                //         { ...state.editor }, 
                //     ],
                //     currentIndex: state.history.currentIndex + 1,
                // },
            }
        case "CHANGE_DEVICE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    device: action.payload.device
                }
            }
        case "TOGGLE_PREVIEW_MODE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    previewMode: !state.editor.previewMode
                }
            }
        case "TOGGLE_LIVE_MODE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    liveMode: action.payload ? action.payload.value : !state.editor.liveMode
                }
            }
        case "REDO":
            if (state.history.currentIndex < state.history.history.length - 1) {
                const nextIndex = state.history.currentIndex + 1
                const nextEditorState = { ...state.history.history[nextIndex] }
                return {
                    editor: nextEditorState,
                    history: {
                        ...state.history,
                        currentIndex: nextIndex,
                    },
                }
            }
            return state
        case "UNDO":
            if (state.history.currentIndex > 0) {
                const prevIndex = state.history.currentIndex - 1
                const prevEditorState = { ...state.history.history[prevIndex] }
                return {
                    editor: prevEditorState,
                    history: {
                        ...state.history,
                        currentIndex: prevIndex,
                    },
                }
            }
            return state
        case "LOAD_DATA":
            return {
                ...initialState,
                editor: {
                    ...initialState.editor,
                    elements: action.payload.elements || [...initialEditorState.elements],
                    liveMode: action.payload.withLive,
                },
            }
        case "SET_FUNNELPAGE_ID":
            const updatedEditorStateWithFunnelPageId = {
                ...state.editor,
                funnelPageId: action.payload.funnelPageId
            }

            const updatedHistoryWithFunnelPageId =  [
                    ...state.history.history.slice(0, state.history.currentIndex + 1),
                    {...updatedEditorStateWithFunnelPageId}
                ]
            
            return {
                editor: updatedEditorStateWithFunnelPageId,
                history: {
                    history: updatedHistoryWithFunnelPageId,
                    currentIndex: updatedHistoryWithFunnelPageId.length - 1
                }
            }
        default:
            return state
    }
}

export type EditorContextData = {
    device: DeviceTypes
    previewMode: boolean
    setPreviewMode: (previewMode: boolean) => void
    setDevice: (device: DeviceTypes) => void
}

export const EditorContext = createContext<{
    state: EditorState
    dispatch: Dispatch<EditorAction>
    subaccountId: string
    funnelId: string
    pageDetails: FunnelPage | null
}>({
    state: initialState,
    dispatch: () => undefined,
    subaccountId: '',
    funnelId: '',
    pageDetails: null,
})

type EditorProps = {
    children: React.ReactNode
    subaccountId: string
    funnelId: string
    pageDetails: FunnelPage,
    favicon?: string | null
}

const EditorProvider = ({subaccountId, funnelId, pageDetails, children}: EditorProps) => {
    const [state, dispatch] = useReducer(editorReducer, initialState)

//  useEffect(() => {
//    const link =
//      document.querySelector("link[rel*='icon']") ||
//      document.createElement("link");
//    link.setAttribute("rel", "icon");
//    link.setAttribute("href", favicon || "/favicon.ico");
//    document.head.appendChild(link);

//    return () => {
//     link.setAttribute("href", "/favicon.ico");
//    }
//  }, [favicon]);

    return (
        <EditorContext.Provider
            value={{
                state,
                dispatch,
                subaccountId: subaccountId,
                funnelId: funnelId,
                pageDetails: pageDetails,
            }}
        >
            {children}
        </EditorContext.Provider>
    )
}

export const useEditor = () => {
    const context = useContext(EditorContext)
    if (!context) {
        throw new Error('useEditor Hook must be used within the editor Provider')
    }
    return context
}

export default EditorProvider