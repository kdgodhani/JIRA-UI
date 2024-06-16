import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { toast } from 'react-toastify';
import { mapData } from '../../utils/taskMaper';

const initialState = {
  isLoading: true,
  tasks: [],
  totalTasks: 0,
  mapedTasks: {},
};

export const getAllTasks = createAsyncThunk(
  'allTasks/getTasks',
  async (_, thunkAPI) => {
    const userId = getUserFromLocalStorage().id;
    let url = `projects/tasks/getAllTaskByUserId/${userId}`;

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);

export const updateTaskState = createAsyncThunk(
  'allTasks/updateTaskState',
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post('projects/tasks/editState', info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const allTasksSlice = createSlice({
  name: 'allTasks',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      //state.page = 1;
      state[name] = value;
    },
    /* clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    }, 
    changePage: (state, { payload }) => {
      state.page = payload;
    },*/
    clearAllTasksState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTasks.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.tasks = payload.data;
        state.mapedTasks = mapData(state.tasks);
        state.totalTasks = payload.data.length;
      })
      .addCase(getAllTasks.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateTaskState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTaskState.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const updatedTask = payload.data;
        state.tasks = state.tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return { ...task, status: updatedTask.status };
          }
          return task;
        });
        state.mapedTasks = mapData(state.tasks, true); // Pass true if manager view
      })
      .addCase(updateTaskState.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

  },
});

export default allTasksSlice.reducer;
