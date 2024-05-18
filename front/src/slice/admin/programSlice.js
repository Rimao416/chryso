import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API } from "../../configs/config";
API.defaults.withCredentials = true;
import { getAllData } from "../../pages/utility/handleFactory";

export const fetchAcademicPrograms = getAllData(
  "academicPrograms/fetchAcademicPrograms",
  "/api/v1/academic-programs"
);

export const getSingleProgram = createAsyncThunk(
  "academicPrograms/getSinglePrograms",
  async (id, { rejectWithValue }) => {
    console.log(id);
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/academic-programs/${id}`);
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

export const addAcademicPrograms = createAsyncThunk(
  "academicPrograms/addAcademicPrograms",
  async (newAcademicProgram) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post(
        "/api/v1/academic-programs",
        newAcademicProgram
      );
      toast.success(response.data.message);
      return response.data.academicProgramCreated;
    } catch (error) {
      console.log(error.response.data);
      toast.error(
        error.response.data.message ||
          "Une erreur est survenue lors de la connexion."
      );
      throw error.response.data;
    }
  }
);

export const updateAcademicPrograms = createAsyncThunk(
  "academicPrograms/updateAcademicPrograms",
  async (newAcademicProgram) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/academic-programs/${newAcademicProgram._id}`,
        newAcademicProgram
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      toast.error(
        error.response.data.message ||
          "Une erreur est survenue lors de la connexion."
      );
      throw error.response.data;
    }
  }
);

const academicProgramsSlice = createSlice({
  name: "academicPrograms",
  initialState: {
    academicProgram: [],
    loading: false,
    error: false,
    errorType: null,
    status: null,
  },
  reducers: {
    openModal(state) {
      state.status = "idle";
    },
    closeModal(state) {
      state.status = "fulfilled";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicPrograms.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(fetchAcademicPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.academicProgram = action.payload.data;
        state.error = false;
        state.status = "fulfilled";
      })
      .addCase(fetchAcademicPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(addAcademicPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(addAcademicPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.academicProgram = [...state.academicProgram, action.payload];
        state.status = "fulfilled";
      })
      .addCase(addAcademicPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(getSingleProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getSingleProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.academicProgram = [action.payload.data];
        state.error = null;
        state.status = "fulfilled";
      })
      .addCase(getSingleProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(updateAcademicPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(updateAcademicPrograms.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.academicProgram = [action.payload.data];
        state.error = null;
        state.status = "fulfilled";
      })
      .addCase(updateAcademicPrograms.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      });
  },
});

export const { openModal, closeModal } = academicProgramsSlice.actions;
export default academicProgramsSlice.reducer;
