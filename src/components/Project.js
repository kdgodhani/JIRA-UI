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
import {
  deleteProject,
  updateProject,
  getAllProjects
} from "../features/project/projectSlice";
import { toggleSidebar } from "../features/user/userSlice";
import styled from "styled-components";

import React, { useEffect, useState } from "react";
import { stringAvatar } from "../utils/utilsFunctions";
// import { Avatar, AvatarGroup, Stack } from "@mui/material";
import { Avatar, AvatarGroup, Stack, Modal, TextField, Button } from "@mui/material";

import { urlBase } from "../utils/axios";
import UserAvatar from "./UserAvatar";
import { MdDelete,MdModeEdit ,MdControlPoint  } from "react-icons/md";
import { getUserFromLocalStorage } from "../utils/localStorage";

const Project = ({
  id,
  name,
  members = [],
  createdDateTime: start,
  createdBy: manager,
  isSidebarOpen,
  fetchProjects, 
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

  const [tasks, setTasks] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState(name);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectData, setProjectData] = useState({ name });

  const getTasksByProject = async (projectId) => {
    const user = getUserFromLocalStorage();
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
        setTasks(data.data);
      } else {
        console.log('Error fetching tasks:', response.message);
      }
    } catch (error) {
      console.log('Error fetching tasks:', error.message);
    }
  };

  const handleUpdate = async () => {
    const updatedProject = { id, name: updatedName };

    await dispatch(updateProject(updatedProject))
    .then(() => dispatch(getAllProjects()));
    setUpdateModalOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteProject(id))
    .then(() => dispatch(getAllProjects()));

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
          <ProjectInfo icon={<FaBriefcase />} text={`Since 0 days`} />
          <ProjectInfo icon={<IoPeopleOutline />} text={` ${tasks.length} tasks`} />
          <ProjectInfo icon={<IoPeopleOutline />} text={` ${uniqueMembers.length} members`} />
          <div style={{ height: "25", float: "right" }}>
            <AvatarGroup max={4} sx={{ marginLeft: "10%" }}>
              {uniqueMembers.map((item) => (
                <UserAvatar key={item.memberId} id={item.memberId} name={item.memberName} />
              ))}
            </AvatarGroup>
          </div>
        </div>
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
              onClick={() => setUpdateModalOpen(true)}
            >
              <MdModeEdit style={{ fontSize: "large" }} />
            </button>

            <button
              className="button-81"
              role="button"
              title="Delete"
              onClick={() => setDeleteModalOpen(true)}
            >
              <MdDelete style={{ fontSize: "large" }} />
            </button>
          </div>
        </footer>
      </div>

      {updateModalOpen && (
        <ModalContainer>
          <ModalContent>
            <h2>Update Project</h2>
            <TextField
              label="Project Name"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setUpdateModalOpen(false)}>
              Cancel
            </Button>
          </ModalContent>
        </ModalContainer>
      )}

      {deleteModalOpen && (
        <ModalContainer>
          <ModalContent>
            <h2>Are you sure you want to delete this project?</h2>
            <Button variant="contained" color="primary" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setDeleteModalOpen(false)}>
              No
            </Button>
          </ModalContent>
        </ModalContainer>
      )}
    </Wrapper>
  );
};

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 1000; /* Ensures the modal is on top */
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px; /* Fixed width */
  max-width: 90%; /* Ensures it is responsive on smaller screens */
  text-align: center; /* Center-align text */
`;

export default Project;
