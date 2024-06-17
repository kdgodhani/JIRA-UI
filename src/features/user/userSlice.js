import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
  dashBoardText: "Dashboard",
  userImage: "",
  userParticipationProjects: [],
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
    setDashboardText: (state, { payload }) => {
      state.dashBoardText = payload;
      console.log("dashboardtext" + state.dashBoardText);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        // console.log("pending");
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const user = payload.data[0];

        console.log(user ,"this is full fill sucess ---- ")
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success(`Hello There ${user.name}`);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const user =payload.data[0];
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success(`Welcome ${user.name}`);
        // console.log(user);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const user = payload.data[0];
        state.isLoading = false;
        state.user = user;
        toast.success(`User Updated!`);
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      .addCase(clearStore.rejected, () => {
        toast.error("There was an error..");
      })
      .addCase(getUserImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserImage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const base64Image = btoa(
          new Uint8Array(payload).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        console.log(payload,"inside - 102");
        const url = "data:image/jpeg;base64," + base64Image;
        console.log(url);
        state.userImage = url;
      })
      .addCase(getUserImage.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload && payload.message?payload.message:"Server Error");
      })

      // .addCase(getUserParticipationProjects.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(getUserParticipationProjects.fulfilled, (state, { payload }) => {
      //   state.isLoading = false;

      //   state.userParticipationProjects = payload.data.projects;
      // })
      // .addCase(getUserParticipationProjects.rejected, (state, { payload }) => {
      //   state.isLoading = false;
      //    toast.error(payload && payload.message?payload.message:"Server Error");
      // });
  },
});

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user, thunkAPI) => {
    //return registerUserThunk('/auth/register', user, thunkAPI);
    try {
      const resp = await customFetch.post("user/register", user);
      return resp.data;
    } catch (error) {

      // console.log(error.response.data ,"this is error regiuster")
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    //return loginUserThunk('/auth/login', user, thunkAPI);
    try {
      const resp = await customFetch.post("user/login", user);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserImage = createAsyncThunk(
  "user/image",
  async (_, thunkAPI) => {
    const userId = getUserFromLocalStorage().id;
    try {
      const resp = await customFetch.get(`/image/info/${userId}`);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// export const getUserParticipationProjects = createAsyncThunk(
//   "user/participationProjects",
//   async (_, thunkAPI) => {
//     const userId = getUserFromLocalStorage().id;
//     try {
//       const resp = await customFetch.get(`/utilisateurs/${userId}/projects`);

//       return resp.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

const { logoutUser } = userSlice.actions;
export const clearStore = createAsyncThunk(
  "user/clearStore",
  async (message, thunkAPI) => {
    try {
      thunkAPI.dispatch(logoutUser(message));
      //thunkAPI.dispatch(clearAllJobsState());
      //thunkAPI.dispatch(clearValues());
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.patch("/updateUser", user);
      // console.log(resp.data);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);

export const { toggleSidebar, setDashboardText } = userSlice.actions;
export default userSlice.reducer;
