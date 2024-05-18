import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../configs/config";
// import { toast } from "react-toastify";
API.defaults.withCredentials = true;

export const addAcademicYear = createAsyncThunk(
  "academicYear/addAcademicYear",
  async (newAcademic) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.withCredentials = true;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post("/api/v1/academic-years", newAcademic);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const getSingleAcademic = createAsyncThunk(
  "academicYear/getSingleAcademicYear",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/academic-years/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAcademicYears = createAsyncThunk(
  "academicYear/getAcademicYears",
  async () => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.withCredentials = true;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get("/api/v1/academic-years");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const updateAcademicYears = createAsyncThunk(
  "academicYear/updateAcademicYears",
  async (newAcademic) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.withCredentials = true;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/academic-years/${newAcademic._id}`,
        newAcademic
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

let academicYearSlice = createSlice({
  name: "academicYear",
  initialState: {
    academicYear: [],
    loading: false,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAcademicYear.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(addAcademicYear.fulfilled, (state, action) => {
        console.log(action.payload.data);
        //  UPDATE ACADEMIC YEAR STATUT TO FALSE EXCEPT NEW ONE
        state.academicYear.map((item) => {
          console.log(item);
          // if (item._id !== action.payload.academicYearCreated._id) {
          //   item.status = false;
          // }
        });
        state.loading = false;
        state.error = false;
        state.academicYear = [
          ...state.academicYear,
          action.payload.academicYearCreated,
        ];
        state.status = "fulfilled";
        if (action.payload.academicYearCreated.isCurrent) {
          state.academicYear.forEach((year) => {
            if (year._id !== action.payload.academicYearCreated._id) {
              year.isCurrent = false;
            }
          });
        }
      })
      .addCase(addAcademicYear.rejected, (state) => {
        state.loading = false;
        state.error = true;
        state.status = "rejected";
      })
      .addCase(getAcademicYears.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicYear = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(getAcademicYears.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(getSingleAcademic.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSingleAcademic.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicYear = [action.payload.data];
        state.status = "fulfilled";
      })
      .addCase(getSingleAcademic.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(updateAcademicYears.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(updateAcademicYears.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          error: false,
          academicYear: [action.payload.data],
          status: "fulfilled",
        };
      })
      .addCase(updateAcademicYears.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      });

    //     state.error = false;
    //     state.status = "idle";
    //   })
    //   .addCase(updateSubject.fulfilled, (state, action) => {
    //     return {
    //       ...state,
    //       loading: false,
    //       error: false,
    //       academicSubject: [action.payload.subjectUpdated],
    //       status: "fulfilled",
    //     };
    //   })
    //   .addCase(updateSubject.rejected, (state) => {
    //     state.loading = false;
    //     state.error = true;
    //     // state.errorType = action.payload;
    //     state.status = "rejected";
    //   })
    //   .addCase(getSingleSubject.pending, (state) => {
    //     state.loading = true;
    //     state.error = false;
    //     state.status = "idle";
    //   })
    //   .addCase(getSingleSubject.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.error = false;
    //     state.academicSubject = [action.payload.data];
    //     state.status = "fulfilled";
    //   })
    //   .addCase(getSingleSubject.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = true;
    //     // state.errorType = action.payload;
    //     state.status = "rejected";
    //   });
  },
});

export default academicYearSlice.reducer;
