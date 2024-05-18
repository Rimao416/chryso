import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API } from "../../configs/config";
import { loadStripe } from "@stripe/stripe-js";
API.defaults.withCredentials = true;
import { getAllData } from "../../pages/utility/handleFactory";

export const fetchAcademicPayment = getAllData(
  "academicPayments/fetchAcademicPayment",
  "/api/v1/academic-payments"
);

export const getSinglePayment = createAsyncThunk(
  "academicPayments/getSinglePayment",
  async (id, { rejectWithValue }) => {
    console.log(id);
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get(`/api/v1/academic-payments/${id}`);
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

export const addAcademicPayment = createAsyncThunk(
  "academicPayments/addAcademicPayment",
  async (newAcademicPayment) => {
    const stripe = loadStripe(
      "pk_test_51J5TX7LLiFJrGSKS2YAiMz0QWVv2Ue1ijVZWAmSj3tpeiVl8n7qKdk21bVK9zMRUiLjLVXgMR2yvzQJwVrk9ysj500eu5Vy2Nm"
    );

    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.post(
        "/api/v1/academic-payments",
        newAcademicPayment
      );
      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      console.log(result);
      if (result.error) {
        toast.error(result.error);
      }
      toast.success(response.data.message);
      return response.data.academicPaymentCreated;
    } catch (error) {
      console.log(error);
      // toast.error(
      //   error.response.data.message ||
      //     "Une erreur est survenue lors de la connexion."
      // );
      // throw error.response.data;
    }
  }
);

export const updateAcdemicPayments = createAsyncThunk(
  "academicPayments/updateAcdemicPayments",
  async (newAcademicPayment) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.put(
        `/api/v1/academic-payments/${newAcademicPayment._id}`,
        newAcademicPayment
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
export const getMyAcademicPayments = createAsyncThunk(
  "academicPayments/getMyAcademicPayments",
  async (_, { rejectWithValue }) => {
    const { token } = JSON.parse(localStorage.getItem("profile"));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await API.get("/api/v1/academic-payments/user");
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const academicPayments = createSlice({
  name: "academicPayments",
  initialState: {
    academicPayment: [],
    loading: false,
    error: false,
    errorType: null,
    status: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicPayment.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.status = "idle";
      })
      .addCase(fetchAcademicPayment.fulfilled, (state, action) => {
        // console.log(action)
        state.loading = false;
        state.academicPayment = action.payload;
        state.error = false;
        state.status = "fulfilled";
      })
      .addCase(fetchAcademicPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(addAcademicPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(addAcademicPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.academicPayment = [...state.academicPayment, action.payload];
        state.status = "fulfilled";
      })
      .addCase(addAcademicPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(getSinglePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getSinglePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.academicPayment = [action.payload.data];
        state.error = null;
        state.status = "fulfilled";
      })
      .addCase(getSinglePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(updateAcdemicPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(updateAcdemicPayments.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.academicPayment = [action.payload.data];
        state.error = null;
        state.status = "fulfilled";
      })
      .addCase(updateAcdemicPayments.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(getMyAcademicPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getMyAcademicPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.academicPayment = action.payload;
        state.error = null;
        state.status = "fulfilled";
      })
      .addCase(getMyAcademicPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "rejected";
      });
  },
});

export default academicPayments.reducer;
