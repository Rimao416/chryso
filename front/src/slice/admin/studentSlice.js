import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../configs/config";
import { toast } from "react-toastify";
import { fetchWithAuthorization } from "../../pages/utility/handleFactory";
API.defaults.withCredentials = true;
// export const fetchacademicStudents = createAsyncThunk(

// )
export const fetchAcademicStudent = createAsyncThunk(
  "academicStudents/fetchAcademicStudent",
  async () => {
    return fetchWithAuthorization("/api/v1/admin/students");
  }
);

export const getSingleStudent = createAsyncThunk(
  "academicStudents/getSingleStudent",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/admin/students/${id}`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const archiveStudent = createAsyncThunk(
  "academicStudents/archiveStudent",
  async (id, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await API.put(`/api/v1/admin/students/archive/${id}`);
      return id;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const addAcademicStudent = createAsyncThunk(
  "academicStudents/addAcademicStudent",
  async (newAcademicStudent) => {
    // console.log(newAcademicStudent);
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post(
        "/api/v1/admin/students/register",
        newAcademicStudent
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
export const updateAcademicStudent = createAsyncThunk(
  "academicStudents/updateAcademicStudent",
  async (data, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/admin/students/${data.get("id")}`,
        data
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);
let academicStudentSlice = createSlice({
  name: "academicStudents",
  initialState: {
    academicStudents: [],
    loading: false,
    error: false,
    errorType: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(fetchAcademicStudent.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = false;
        state.academicStudents = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(fetchAcademicStudent.rejected, (state) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(addAcademicStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(addAcademicStudent.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = false;
        state.academicStudents = [...state.academicStudents, action.payload];
        state.status = "fulfilled";
      })
      .addCase(addAcademicStudent.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(getSingleStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(getSingleStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.academicStudents = [action.payload.data];
        state.status = "fulfilled";
      })
      .addCase(getSingleStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        // state.errorType = action.payload;
        state.status = "rejected";
      })
      .addCase(updateAcademicStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(updateAcademicStudent.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = false;
      })
      .addCase(updateAcademicStudent.rejected, (state, action) => {
        state.loading = true;
        state.error = false;
        state.status = "error";
      })
      .addCase(archiveStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(archiveStudent.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = false;
        state.academicStudents.forEach((student) => {
          if (student._id === action.payload) {
            student.status = "Bloqué";
          }
        });
      })
      .addCase(archiveStudent.rejected, (state, action) => {
        state.loading = true;
        state.error = false;
        state.status = "error";
      });
  },
});

export default academicStudentSlice.reducer;
