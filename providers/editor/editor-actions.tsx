import { EditorAction, EditorElement } from "@/types/editor";

export const addElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'ADD_ELEMENT')
        throw Error(
            'You sent the wrong action type to the Add Element editor State'
        )
    return editorArray.map((item) => {
        if (item.id === action.payload.containerId && Array.isArray(item.content)) {
            return {
                ...item,
                content: [...item.content, action.payload.elementDetails],
            }
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: addElement(item.content, action),
            }
        }
        return item
    })
}

export const updateElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'UPDATE_ELEMENT') {
        throw Error('You sent the wrong action type to the update Element State')
    }
    return editorArray.map((item) => {
        if (item.id === action.payload.elementDetails.id) {
            return { ...item, ...action.payload.elementDetails }
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: updateElement(item.content, action),
            }
        }
        return item
    })
}

export const deleteElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'DELETE_ELEMENT')
        throw Error(
            'You sent the wrong action type to the Delete Element editor State'
        )
    return editorArray.filter((item) => {
        if (item.id === action.payload.elementDetails.id) {
            return false
        } else if (item.content && Array.isArray(item.content)) {
            item.content = deleteElement(item.content, action)
        }
        return true
    })
}