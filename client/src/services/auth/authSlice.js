import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getCookie, setCookie } from '../../helpers/config';

const url = 'http://localhost:5000/api/auth/login';

const initialState = {
    userEmail: null,
    isLoading: true,
};

export const login = createAsyncThunk(
    'LOGIN',
    async (data, thunkAPI) => {
      try {
        console.log(data);
        // console.log(thunkAPI);
        // console.log(thunkAPI.getState());
        // thunkAPI.dispatch(openModal());
        // axios.defaults.headers.common["access_token"] = getCookie("access_token");
        const resp = await axios.post(url, {data: data})
  
        return resp.data;
      } catch (error) {
        return thunkAPI.rejectWithValue('something went wrong');
      }
    }
  );

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    [login.pending]: (state) => {
        console.log(state);
        state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      console.log(action);
      state.isLoading = false;
      setCookie("access_token", action.payload.accessToken, 0.001)
      setCookie("refresh_token",  action.payload.refreshToken, 1)
      window.location.replace("http://localhost:3000")
    },
    [login.rejected]: (state, action) => {
      console.log(action);
      state.isLoading = false;
    },
  },
})

export default authSlice.reducer
