import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../configs/config";
import { toast } from "react-toastify";
import { fetchWithAuthorization } from "../../pages/utility/handleFactory";
API.defaults.withCredentials = true;
// export const fetchAcademicTerms = createAsyncThunk(

// )
export const fetchAcademicTeacher = createAsyncThunk(
  "academicTerms/fetchAcademicTeacher",
  async () => {
    return fetchWithAuthorization("/api/v1/admin/teachers");
  }
);

export const getSingleTeacher = createAsyncThunk(
  "academicTerms/getSingleTeacher",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/admin/teachers/${id}`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const addAcademicTeacher = createAsyncThunk(
  "academicTerms/addAcademicTeacher",
  async (newAcademicTeacher) => {
    // console.log(newAcademicTeacher);
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post(
        "/api/v1/admin/teachers/register",
        newAcademicTeacher
      );
      // console.log(response.data);
      toast.success(response.data.message);
      return response.data.academicTermCreated;
    } catch (error) {
      // console.log(error.response.data);
      toast.error(
        error.response.data.message ||
          "Une erreur est survenue lors de la connexion."
      );
      throw error.response.data;
    }
  }
);
let academicTeacherSlice = createSlice({
  name: "academicTerms",
  initialState: {
    academicTeacher: [],
    loading: false,
    error: false,
    errorType: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicTeacher.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(fetchAcademicTeacher.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.error = false;
        state.academicTeacher = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(fetchAcademicTeacher.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(addAcademicTeacher.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(addAcademicTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicTeacher = [...state.academicTeacher, action.payload];
        state.status = "fulfilled";
      })
      .addCase(addAcademicTeacher.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(getSingleTeacher.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSingleTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicTeacher = [action.payload.data];
        state.status = "fulfilled";
      })
      .addCase(getSingleTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      });
  },
});

export default academicTeacherSlice.reducer;
