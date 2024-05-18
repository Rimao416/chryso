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
export const addClass = createAsyncThunk(
  "academicClass/addClass",
  async (newClass) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post("/api/v1/class-levels", newClass);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw error.response.data;
    }
  }
);
export const getClass = getAllData(
  "academicClass/getClass",
  "/api/v1/class-levels"
);
export const updateClass = createAsyncThunk(
  "academicClass/updateClass",
  async (newClass) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/class-levels/${newClass._id}`,
        newClass
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw error.response.data;
    }
  }
);
export const getSingleClass = createAsyncThunk(
  "academicClass/getSingleClass",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/class-levels/${id}`);
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

let academicClassSlice = createSlice({
  name: "academicClass",
  initialState: {
    academicClass: [],
    loading: false,
    error: false,
    errorType: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClass.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicClass = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(getClass.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(addClass.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicClass = [
          ...state.academicClass,
          action.payload.classCreated,
        ];
        state.status = "fulfilled";
      })
      .addCase(addClass.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        console.log(action);
        return {
          ...state,
          loading: false,
          error: false,
          academicClass: [action.payload.data],
          status: "fulfilled",
        };
      })
      .addCase(updateClass.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(getSingleClass.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSingleClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicClass = [action.payload.data];
        state.status = "fulfilled";
      })
      .addCase(getSingleClass.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      });
    //   .addCase(getSingleTeacher.pending, (state) => {
    //     state.loading = true;
    //     state.error = false;
    //     state.status = "idle";
    //   })
    //   .addCase(getSingleTeacher.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.error = false;
    //     state.academicTeacher = [action.payload.data];
    //     state.status = "fulfilled";
    //   })
    //   .addCase(getSingleTeacher.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = true;
    //     // state.errorType = action.payload;
    //     state.status = "rejected";
    //   });
  },
});

export default academicClassSlice.reducer;
