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

    console.log(user,"user ---- from local storage --- ")

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
    let url = `/projets/${projectId}/tasks`;

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);*/

export const updateProjectState = createAsyncThunk(
  "allProjects/updateProjectState",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("/projects/editState", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

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

      .addCase(updateProjectState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProjectState.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.projects = state.projects.map((project) => {
          if (project.id == payload.tache.id)
            return { ...project, etat: payload.tache.etat };
          return project;
        });

        console.log(payload.tache);
      })
      .addCase(updateProjectState.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, { payload }) => {

        console.log(payload , "this is payload     --- inside")
        state.isLoading = false;
        state.projects = [...state.projects, payload.projet];

        console.log(state.projects , "this is state projectr    --- insode ")
        toast.success("project created successfully!");
      })
      .addCase(createProject.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
    /*.addCase(getTasksByProject.pending, (state) => {})
      .addCase(getTasksByProject.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const currentProjectId = payload.idProjet;
        state.projects = state.projects.map((p) => {
          if (p.id == currentProjectId) p.tasks = payload.taches;
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
