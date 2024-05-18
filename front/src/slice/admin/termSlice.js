import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../configs/config";
// import { toast } from "react-toastify";
import { getAllData } from "../../pages/utility/handleFactory";
API.defaults.withCredentials = true;
// export const fetchAcademicTerms = createAsyncThunk(

// )
// export const fetchAcademicTeacher = createAsyncThunk(
//   "academicTerms/fetchAcademicTeacher",
//   async () => {
//     return fetchWithAuthorization("/api/v1/admin/teachers");
//   }
// );
export const addTerms = createAsyncThunk(
  "academicTerm/addTerms",
  async (newTerm) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post("/api/v1/academic-terms", newTerm);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const getTerms = getAllData(
  "academicTerms/getTerms",
  "/api/v1/academic-terms"
);
export const updateTerm = createAsyncThunk(
  "academicTerms/updateTerms",
  async (newTerm) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/academic-terms/${newTerm._id}`,
        newTerm
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const getSingleTerm = createAsyncThunk(
  "academicTerms/getSingleTerm",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/academic-terms/${id}`);

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

let academicTermSlice = createSlice({
  name: "academicTerm",
  initialState: {
    academicTerm: [],
    loading: false,
    error: false,
    errorType: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTerms.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicTerm = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(getTerms.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(addTerms.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(addTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        // state.academicTerm = [
        //   ...state.academicTerm,
        //   action.payload.academicTermCreated,
        // ];
        state.status = "fulfilled";
      })
      .addCase(addTerms.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(updateTerm.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(updateTerm.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          error: false,
          academicTerm: [action.payload.data],
          status: "fulfilled",
        };
      })
      .addCase(updateTerm.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(getSingleTerm.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSingleTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicTerm = [action.payload.data];
        state.status = "fulfilled";
      })
      .addCase(getSingleTerm.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      });
  },
});

export default academicTermSlice.reducer;
