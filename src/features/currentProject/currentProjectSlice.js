import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useSelector } from "react-redux";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { toast } from "react-toastify";
import { mapData } from "../../utils/taskMaper";
// import { getAllTasks } from "../tasks/allTasksSlice";
// import { useDispatch } from "react-redux";

const initialState = {
  isLoading: true,
  members: [],
  tasks: [],
  project: {},
  currentTask: {},
  
};

// this is for add member
export const addMemberToProject = createAsyncThunk(
  "allProjects/getProjects/addMember",
  async (data, thunkAPI) => {
    let url = `/projects/addMember`;

    try {
      const resp = await customFetch.post(url, data);
      // console.log("postrequest sent");
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);
export const getProjectMembers = createAsyncThunk(
  "allProjects/getProjects/getProjectMembers",
  async (projectId, thunkAPI) => {
    let url = `/projects/membersByProjectId?id=${projectId}`;

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);
export const getProjectTasks = createAsyncThunk(
  "allProjects/getProjects/getProjectTasks",
  async (projectId, thunkAPI) => {
    let url = `projects/tasks/${projectId}`;

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);


// Project Detail page - create and upadte taskkkkk
export const createTask = createAsyncThunk(
  "tasks/addNewTask",
  async (task, thunkAPI) => {
    const tasks = {
      title: task.title,
      deadLine: task.deadline.toISOString(),
      memberId: task.responsibleId,
      projectId: task.projectId,
    };

    console.log(tasks, "task va;ue -86 ");

    let url = `projects/tasks/create`;

    try {
      const resp = await customFetch.post(url, tasks);

      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);
export const deleteTask = createAsyncThunk(
  "allTasks/modifyTask",
  async (taskId, thunkAPI) => {
    try {
      let deleteTask = {
        taskId,
        isActive:false
      }
      const response = await customFetch.post(`/projects/tasks/modify`,deleteTask);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskState = createAsyncThunk(
  "allTasks/updateTaskState",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/editState", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCurrentTask = createAsyncThunk(
  "allTasks/getCurrentTask",
  async (taskId, thunkAPI) => {
    let url = `projects/tasks/getTaskById/${taskId}`;

    try {
      const resp = await customFetch.get(url);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);


export const updateTaskTitle = createAsyncThunk(
  "allTasks/updateTaskTitle",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/modify", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskDesc = createAsyncThunk(
  "allTasks/updateTaskDesc",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/modify", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskProgress = createAsyncThunk(
  "allTasks/updateTaskProgress",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/modify", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskPriority = createAsyncThunk(
  "allTasks/updateTaskPriority",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/modify", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskDeadLine = createAsyncThunk(
  "allTasks/updateTaskDeadLine",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/modify", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Comment 
export const addCommentToTask = createAsyncThunk(
  "allTasks/addComment",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/addComment", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteCommentToTask = createAsyncThunk(
  "allTasks/deleteComment",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/updateOrDeleteComment", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateCommentToTask = createAsyncThunk(
  "allTasks/updadteComment",
  async (info, thunkAPI) => {
    try {
      const resp = await customFetch.post("projects/tasks/updateOrDeleteComment", info);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* const { allProjects } = useSelector((store) => store.allProjects);
export const getCurrentProject = (projectId) => {
  return allProjects.find((p) => p.id == projectId);
}; */

const currentProjectSlice = createSlice({
  name: "currentProject",
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
    setCurrentProject: (state, payload) => {
      return { ...state, project: payload };
    },
    getCurrentProject: (state) => {
      return state;
      console.log(state);
    },
    /* clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    }, 
    changePage: (state, { payload }) => {
      state.page = payload;
    },*/
    clearCurrentProjectState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectMembers.fulfilled, (state, { payload }) => {
        let memberData = payload.data;
        state.isLoading = false;
        state.members = memberData;
      })
      .addCase(getProjectMembers.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(getProjectTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectTasks.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.tasks = payload.data;
      })
      .addCase(getProjectTasks.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(addMemberToProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMemberToProject.fulfilled, (state, { payload }) => {
        let member = payload.data[0];
        state.isLoading = false;
        state.members = [...state.members, member];

        toast.success(member.name + " is successfully added");
      })
      .addCase(addMemberToProject.rejected, (state, { payload }) => {
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

      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const task = payload.data;
        state.tasks = [...state.tasks, task];

        toast.success("task created successfully");
      })
      .addCase(createTask.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const task = payload.data;
        state.tasks = [...state.tasks, task];

        toast.success("task delted successfully");
      })
      .addCase(deleteTask.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateTaskTitle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTaskTitle.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const editedTask = payload.data;

        state.tasks = state.tasks.map((task) => {
          if (task.id === editedTask.id) {
            return editedTask;
          }
          return task;
        });

        toast.success("title of the has been successfully changed");
      })
      .addCase(updateTaskTitle.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateTaskDesc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTaskDesc.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const editedTask = payload.data;

        state.tasks = state.tasks.map((task) => {
          if (task.id === editedTask.id) {
            return editedTask;
          }
          return task;
        });

        toast.success("description of the task modified successfully");
      })
      .addCase(updateTaskDesc.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateTaskDeadLine.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTaskDeadLine.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const editedTask = payload.data;

        state.tasks = state.tasks.map((task) => {
          if (task.id === editedTask.id) {
            return editedTask;
          }
          return task;
        });

        toast.success("deadLine of task modified successfully");
      })
      .addCase(updateTaskDeadLine.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateTaskProgress.pending, (state) => {
        //state.isLoading = true;
      })
      .addCase(updateTaskProgress.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const editedTask = payload.data;

        state.currentTask = editedTask;
        //console.log("currentTask : " + state.currentTask);

        toast.success("progress modified!");
      })
      .addCase(updateTaskProgress.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateTaskPriority.pending, (state) => {
        //state.isLoading = true;
      })
      .addCase(updateTaskPriority.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const editedTask = payload.data;

        state.currentTask = editedTask;
        //console.log("currentTask : " + state.currentTask);

        toast.success("progress modified!");
      })
      .addCase(updateTaskPriority.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(addCommentToTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCommentToTask.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const editedTask = payload.data;

        state.tasks = state.tasks.map((task) => {
          if (task.id === editedTask.id) {
            return editedTask;
          }
          return task;
        });

        toast.success("Comment recorded!");
      })
      .addCase(addCommentToTask.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateCommentToTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCommentToTask.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // const editedTask = payload.data;

        // console.log(state.tasks,"state.tasks -- 468")
        // state.tasks = state.tasks.map((task) => {
        //   if (task.id === editedTask.id) {
        //     return editedTask;
        //   }
        //   return task;
        // });

        toast.success("Comment recorded!");
      })
      .addCase(updateCommentToTask.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(deleteCommentToTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCommentToTask.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // const editedTask = payload.data;

        // state.tasks = state.tasks.map((task) => {
        //   if (task.id === editedTask.id) {
        //     return editedTask;
        //   }
        //   return task;
        // });

        toast.success("Comment recorded!");
      })
      .addCase(deleteCommentToTask.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(getCurrentTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentTask.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.currentTask = payload.data;

        //toast.success('Commentaire enregistré!');
      })
      .addCase(getCurrentTask.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })


    /* .addCase(getCurrentProject, (state, payload) => {
        state.isLoading = false;
        state.project = payload;
      }) */
  },
});

export const {
  handleChange,
  setCurrentProject,
  getCurrentProject,
  clearCurrentProjectState,
} = currentProjectSlice.actions;

export default currentProjectSlice.reducer;
