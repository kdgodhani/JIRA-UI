import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import { useDispatch, useSelector } from "react-redux";
import ProjectInfo from "./ProjectInfo";
import moment from "moment";
import {
  setCurrentProject,
  getProjectTasks,
  clearCurrentProjectState,
  getProjectMembers,
} from "../features/currentProject/currentProjectSlice";
import { toggleSidebar } from "../features/user/userSlice";

import {
  deleteProject,
  getTasksByProject,
  setEditProject,
} from "../features/project/projectSlice";
import React, { useEffect, useState } from "react";
import { stringAvatar } from "../utils/utilsFunctions";
import { Avatar, AvatarGroup, Stack } from "@mui/material";
import { urlBase } from "../utils/axios";
import userIcon from "../assets/images/user.png";
import UserAvatar from "./UserAvatar";
import { MdDelete,MdModeEdit ,MdControlPoint  } from "react-icons/md";
import { getUserFromLocalStorage } from "../utils/localStorage";

const Project = ({
  id,
  name,
  members = [], // Provide default value
  createdDateTime: start,
  createdBy: manager,
  isSidebarOpen,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSidebarOpen) dispatch(toggleSidebar());
    getTasksByProject(id);
  }, [isSidebarOpen, dispatch, id]);

  const date = moment(start).format("MMM Do, YYYY");
  const uniqueMembers = members.filter(
    (item, index) => members.findIndex((i) => i.memberId === item.memberId) === index
  );

  function timePassed(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const differenceInMilliseconds = now - date;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.floor(differenceInDays);
  }

  const [tasks, setTasks] = useState([]);
  // const getTasksByProject = async (projectId) =>
  //   await fetch(`${urlBase}projects/${projectId}/tasks`).then(
  //     async (response) => {
  //       if (response.ok) {
  //         const data = await response.json();
  //         setTasks(data.tasks);
  //       } else {
  //         console.log(response);
  //       }
  //     }
  //   );

  const getTasksByProject = async (projectId) => {
    const user = getUserFromLocalStorage();

    console.log(user.token,"token --- 73")
    try {
      const response = await fetch(`${urlBase}projects/tasks/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();

        console.log(data.data, "this is data ---- 85")
        setTasks(data.data);
      } else {
        console.log('Error fetching tasks:', response.message);
      }
    } catch (error) {
      console.log('Error fetching tasks:', error.message);
    }
  };
  

  return (
    <Wrapper>
      <header style={{ backgroundColor: "#f3f0f8" }}>
        <Avatar {...stringAvatar(name)} style={{ margin: "4%" }} />
        <div className="info" style={{ marginLeft: "4%" }}>
          <h5>{name}</h5>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <ProjectInfo icon={<FaCalendarAlt />} text={`Start ${date}`} />
          <ProjectInfo
            icon={<FaBriefcase />}
            // text={`Since ${timePassed(start)} days`}
            text={`Since 0 days`}
          />
          <ProjectInfo
            icon={<IoPeopleOutline />}
            text={` ${tasks.length} tasks`}
          />
          <ProjectInfo
            icon={<IoPeopleOutline />}
            text={` ${uniqueMembers.length} members`}
          />
          <div style={{ height: "25", float: "right" }}>
            <AvatarGroup max={4} sx={{ marginLeft: "10%" }}>
              {uniqueMembers.map((item) => (
                <UserAvatar key={item.memberId} id={item.memberId} name={item.memberName} />
              ))}
            </AvatarGroup>
          </div>
        </div>
        {/* <footer>
          <div className="actions" style={{ float: "center" }}>
            <Link
              to={{
                pathname: "/project-details",
                state: { currentProject: { id, name, members, start } },
              }}
              className="btn edit-btn"
              onClick={() => {
                const project = { id, name, members, start };
                dispatch(clearCurrentProjectState());
                dispatch(setCurrentProject(project));
                dispatch(getProjectTasks(project.id));
                dispatch(getProjectMembers(project.id));
                if (isSidebarOpen) dispatch(toggleSidebar());
              }}
            >
              See more
            </Link>

            <button
                className="button-81"
                role="button"
                title="Update"
                // onClick={toggleAddMemberForm}
                style={{
                  marginLeft: "40%",
                  marginRight: "40%",
                  padding: "3px",
                  marginBottom: "2%",
                }}
              >
                <MdOutlineAddCircleOutline style={{ fontSize: "larger" }} />
              </button>

              <button
                className="button-81"
                role="button"
                title="Delete"
                // onClick={toggleAddMemberForm}
                style={{
                  marginLeft: "40%",
                  marginRight: "40%",
                  padding: "3px",
                  marginBottom: "2%",
                }}
              >
                <MdOutlineAddCircleOutline style={{ fontSize: "larger" }} />
              </button>
          </div>
        </footer> */}

<footer className="footer-container">
      <div className="actions">
        <Link
          to={{
            pathname: "/project-details",
            state: { currentProject: { id, name, members, start } },
          }}
          className="btn edit-btn"
          onClick={() => {
            const project = { id, name, members, start };

            console.log(project,"project ---- 191")
            dispatch(clearCurrentProjectState());
            dispatch(setCurrentProject(project));
            dispatch(getProjectTasks(project.id));
            dispatch(getProjectMembers(project.id));
            if (isSidebarOpen) dispatch(toggleSidebar());
          }}
        >
          See more
        </Link>

        <button
          className="button-81"
          role="button"
          title="Update"
        >
          <MdDelete style={{ fontSize: "large" }} />
        </button>

        <button
          className="button-81"
          role="button"
          title="Delete"
        >
          <MdModeEdit  style={{ fontSize: "large" }} />
        </button>
      </div>
    </footer>
      </div>
    </Wrapper>
  );
};


export default Project;
