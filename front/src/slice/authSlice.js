import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API } from "../configs/config";
// import Cookies from "js-cookie";
// const API_URL = "localhost:5000/api/v1/users";

// const AUTH_URL = "http://localhost:5000/api/v1/users/login";
// Action asynchrone pour la connexion
export const login = createAsyncThunk("auth/login", async (credentials) => {
  try {
    const response = await API.post("/api/v1/users/login", credentials);
    // console.log(response)
    return response.data;
  } catch (error) {
    toast.error(
      error.response.data.message ||
        "Une erreur est survenue lors de la connexion."
    );

    throw error.response.data;

    // throw error.response.data;
  }
});

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data) => {
    const { token } = data;

    console.log(token);
    const credentials = {
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };
    console.log(data);
    try {
      const response = await API.patch(
        `/api/v1/users/resetPassword/${token}`,
        credentials
      );
      console.log(response);
      return response.data;
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Une erreur est survenue lors de la connexion."
      );
      throw error.response.data;
    }
  }
);
// const initialState = {
//   userInfo: localStorage.getItem("profile")
//     ? JSON.parse(localStorage.getItem("profile"))
//     : null,
//   loading: false,
//   error: null,
//   errorType: null,
// };

// Slice Redux pour gérer l'authentification
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("profile")
      ? JSON.parse(localStorage.getItem("profile"))
      : null,
    loading: false,
    error: null,
    errorType: null,
  },
  reducers: {
    logout: (state) => {
      // Cookies.remove('jwt', { path: '' })
      state.user = null;
      localStorage.removeItem("profile");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Je suis là");
        console.log(action.payload);
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
        // console.log(role)

        // console.log(action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = true;
        state.errorType = action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.user = action.payload;
        localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
        // toast.success(action.payload.message);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorType = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
