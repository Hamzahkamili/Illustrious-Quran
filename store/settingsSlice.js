import {createSlice} from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        arabicText: "simple",
        language: "en",
        author: "Ahmed Ali",
        fontSize: 18,
    },
    reducers: {
        addArabicText: (state, action) => {
            state.arabicText = action.payload.id
        },
        addLanguage: (state, action) => {
            state.language = action.payload.id;
        },
        addAuthor: (state, action) => {
            state.author = action.payload.id;
        },
        addFontSize: (state, action) => {
            state.fontSize = action.payload.id;
        }
    }
})

export const addArabicText =  settingsSlice.actions.addArabicText
export const addLanguage = settingsSlice.actions.addLanguage
export const addAuthor = settingsSlice.actions.addAuthor
export const addFontSize = settingsSlice.actions.addFontSize

export default settingsSlice.reducer