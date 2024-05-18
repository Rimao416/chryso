import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../configs/config";

export const getMyCourses = createAsyncThunk(
  "teacher/getMyCourses",
  async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("profile"));
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/api/v1/academic-subjects/my-courses");
    
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
let academicTeacherSlice = createSlice({
  name: "academicTeacherSlice",
  initialState: {
    cours: [],
    loading: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cours = action.payload.data;
      })
      .addCase(getMyCourses.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default academicTeacherSlice.reducer;
