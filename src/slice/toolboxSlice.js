import { MENU_ITEMS, COLORS } from "@/constants";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    [MENU_ITEMS.PENCIL]: {
        color: COLORS.BLACK,
        size: 3
    },
    [MENU_ITEMS.ERASER]: {
        color: COLORS.WHITE,
        size: 3
    },
    [MENU_ITEMS.UNDO]: { },
    [MENU_ITEMS.REDO]: { },
    [MENU_ITEMS.DOWNLOAD]: { }
}

export const menuSlice = createSlice({
    name: 'toolbox',
    initialState,
    reducers: {
        changeColor: (state, action) => {
            state[action.payload.item].color = action.payload.color;
        },
        changeBrushSize: (state, action) => {
            state[action.payload.item].size = action.payload.size;
        }
    }
})

export const { changeColor, changeBrushSize } = toolboxSlice.actions;

const ToolboxReducer = toolboxSlice.reducer;

export default ToolboxReducer;