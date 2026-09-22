import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchTickets = createAsyncThunk(
  "tickets/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/tickets", { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchTicket = createAsyncThunk(
  "tickets/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tickets/${id}`);
      return res.data.data.ticket;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/tickets", data);
      return res.data.data.ticket;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tickets/${id}`, data);
      return res.data.data.ticket;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchStats = createAsyncThunk(
  "tickets/stats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tickets/stats");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    list: [],
    current: null,
    pagination: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.list.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default ticketSlice.reducer;