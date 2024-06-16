import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserFromLocalStorage } from "../../utils/localStorage";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const initialState = {
  isLoading: true,
  projects: [],
  totalProjects: 0,
};

export const getAllProjects = createAsyncThunk(
  "allProjects/getProjects",
  async (_, thunkAPI) => {
    const user = getUserFromLocalStorage();
    let url = `/projects/getAllByUserId`; // here we get id from JWT Token

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);
/*export const getTasksByProject = createAsyncThunk(
  "allProjects/getProjects/getProjectTasks",
  async (projectId, thunkAPI) => {
    let url = `/projects/${projectId}/tasks`;

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);*/

// export const updateProjectState = createAsyncThunk(
//   "allProjects/updateProjectState",
//   async (info, thunkAPI) => {
//     try {
//       const resp = await customFetch.post("/projects/editState", info);
//       return resp.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

export const createProject = createAsyncThunk(
  "allProjects/addNewProject",
  async (newProject, thunkAPI) => {
    let url = "projects/create";
    try {
      const resp = await customFetch.post(url, newProject);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (updatedProject, thunkAPI) => {
    try {
      const response = await customFetch.post(
        `/projects/updateOrDelete`,
        updatedProject
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      let deleteProject = {
        id:projectId,
        isActive:false
      }
      const response = await customFetch.post(`/projects/updateOrDelete`,deleteProject);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const allProjectsSlice = createSlice({
  name: "allProjects",
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
    clearAllProjectsState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.projects = payload.data;
        state.totalProjects = payload.data.length;
      })
      .addCase(getAllProjects.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const index = state.projects.findIndex((p) => p.id === payload.data[0].id);
        if (index !== -1) {
          state.projects[index] = payload.project;
        }
        toast.success("Project updated successfully");
      })
      .addCase(updateProject.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== payload.data[0].id);
        state.totalProjects--;
        toast.success("Project deleted successfully");
      })
      .addCase(deleteProject.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.projects = [...state.projects, payload.data];
        toast.success("project created successfully!");
      })
      .addCase(createProject.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload.message);
      });
    /*.addCase(getTasksByProject.pending, (state) => {})
      .addCase(getTasksByProject.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const currentProjectId = payload.idProjet;
        state.projects = state.projects.map((p) => {
          if (p.id == currentProjectId) p.tasks = payload.data;
          return p;
        });

        //toast.success("tasks got from backend");
      })
      .addCase(getTasksByProject.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })*/
  },
});

export default allProjectsSlice.reducer;
