import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../configs/config";
// import { toast } from "react-toastify";
import { getAllData } from "../../pages/utility/handleFactory";
API.defaults.withCredentials = true;

export const addSubjects = createAsyncThunk(
  "academicSubject/addSubjects",
  async (newSubject) => {
    // const { token } = JSON.parse(localStorage.getItem("profile"));
    // API.defaults.withCredentials = true;
    // API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post("/api/v1/academic-subjects", newSubject);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const getSubjects = getAllData(
  "academicSubjects/getSubjects",
  "/api/v1/academic-subjects"
);
export const updateSubject = createAsyncThunk(
  "academicSubjects/updateSubjects",
  async (newSubject) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/academic-subjects/${newSubject._id}`,
        newSubject
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const getSingleSubject = createAsyncThunk(
  "academicSubjects/getSingleSubject",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/academic-subjects/${id}`);

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

let academicSubjectSlice = createSlice({
  name: "academicSubject",
  initialState: {
    academicSubject: [],
    loading: false,
    error: false,
    errorType: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubjects.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicSubject = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(getSubjects.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(addSubjects.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(addSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicSubject = [
          ...state.academicSubject,
          action.payload.subjectCreated,
        ];
        state.status = "fulfilled";
      })
      .addCase(addSubjects.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          error: false,
          academicSubject: [action.payload.subjectUpdated],
          status: "fulfilled",
        };
      })
      .addCase(updateSubject.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(getSingleSubject.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSingleSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicSubject = [action.payload.data];
        state.status = "fulfilled";
      })
      .addCase(getSingleSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      });
  },
});

export default academicSubjectSlice.reducer;
