


import React from "react";
import { Loading, TeamMember } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Wrapper from "../../assets/wrappers/ProjectDetails";
import ProgressBar from "react-bootstrap/ProgressBar";
import Board from "react-trello";
import NewCardForm from "react-trello";
import CardSubmitButton from "react-trello";
import { mapData } from "../../utils/taskMaper";

import { useState } from "react";
import NewTask from "../../components/NewTask";

import { MdOutlineAddCircleOutline } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  getProjectTasks,
  updateTaskState,
  createTask,
  getProjectMembers,
  addMemberToProject,
  getCurrentProject,
  getCurrentTask,
} from "../../features/currentProject/currentProjectSlice";
import { TaskModal } from "../../components/TaskModal";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils/utilsFunctions";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { getAllTasks } from "../../features/tasks/allTasksSlice";
import { setDashboardText } from "../../features/user/userSlice";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { MDBCard, MDBCardHeader, MDBCardText } from "mdbreact";

export const ProjectDetails = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDashboardText("Project Details"));
  }, [dispatch]);
  const { project } = useSelector((store) => store.currentProject);
  const { tasks, isLoading } = useSelector((store) => store.currentProject);
  const membersDup = useSelector((store) => store.currentProject).members;
  const members = membersDup.filter(
    (item, index) => membersDup.findIndex((i) => i.id === item.id) === index
  );
  const [taskData, setTaskData] = useState(tasks);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [addMemberFormIsOpen, setAddMemberFormIsOpen] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState("");

  const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    const info = { idTask: cardId, newState: targetLaneId };
    dispatch(updateTaskState(info));
    setTaskData(tasks);
  };

  const getProgress = () => {
    return Math.round(
      tasks.reduce((total, task) => total + task.progress, 0) / tasks.length
    );
  };

  console.log(tasks,"this is task under project detail - 74")

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState({});

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  const handleCardClick = (taskId) => {
    if (!modalIsOpen) toggleModal();
    dispatch(getCurrentTask(taskId));
    setCurrentTaskId(taskId);
  };

  const [newTaskModalIsOpen, setNewTaskModalIsOpen] = useState(false);
  const handleOpenModal = () => {
    setNewTaskModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setNewTaskModalIsOpen(false);
    setTitle("");
    setAssignee("");
    setDeadline(null);
  };

  const addNewTask = () => {
    console.log("Assignee in addNewTask:", assignee); // Debug log
    const selectedMember = members.find(
      (m) => m.name.toLowerCase().trim() === assignee.toLowerCase().trim()
    );

    if (!selectedMember) {
      toast.error("Selected member not found");
      return;
    }

    const newTask = {
      title,
      responsibleId: selectedMember.memberId,
      deadline,
      projectId: project.payload.id,
    };
    console.log("New Task:", newTask); // Debug log
    dispatch(createTask(newTask));
  };

  function toggleAddMemberForm() {
    setAddMemberFormIsOpen(!addMemberFormIsOpen);
  }

  function addMember(e) {
    e.preventDefault();
    if (members.find((x) => x.email === emailToAdd) != null) {
      toast.error("this user is already part of your project");
      setEmailToAdd("");
      return;
    }
    const data = { email: emailToAdd, id: project.payload.id };
    dispatch(addMemberToProject(data));
    setEmailToAdd("");
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <div className="main">
        <header>
          <Avatar
            {...stringAvatar(project.payload.name)}
            style={{ margin: "1%" }}
          />
          <div className="info">
            <h5>{project.payload.name}</h5>
          </div>
        </header>

        <MDBRow className="row-cols-1 row-cols-md-4 g-7">
          <MDBCol className="col-md-10">
            <div className="progress">
              <h5
                style={{
                  color: "#48484C",
                  marginBottom: 3,
                  fontSize: "large",
                }}
              >
                {!isNaN(getProgress()) && `Progress ${getProgress()} %`}
              </h5>
              <progress value={getProgress()} max="100" />
            </div>
            <header />
            <div style={{ textAlign: "right" }}>
              <button
                className="button-81"
                role="button"
                style={{
                  padding: "7px",
                  marginLeft: "35px",
                  marginBottom: "5px",
                }}
                onClick={handleOpenModal}
                title="Create a new task"
              >
                <MdOutlineAddCircleOutline
                  style={{
                    fontSize: "xx-large",
                    cursor: "pointer",
                  }}
                />
              </button>
            </div>

            <div className="board-container">
              <p
                style={{
                  marginBottom: "2px",
                  color: "#576574",
                  fontSize: "smaller",
                  marginLeft: "35%",
                }}
              >
                click on the task to see more
              </p>
              <Board
                data={mapData(tasks, true)}
                editable
                cardDraggable
                style={{
                  backgroundColor: " #F6F2FF",
                }}
                laneStyle={{ backgroundColor: " #D7CBF6" }}
                handleDragEnd={handleDragEnd}
                onCardClick={(cardId) => handleCardClick(cardId)}
              >
                <NewCardForm
                  descriptionPlaceholder="assigned to"
                  labelPlaceholder="deadline"
                  titlePlaceholder="title"
                  onSubmit={(card) => console.log(card)}
                >
                  <CardSubmitButton />
                </NewCardForm>
              </Board>
            </div>
          </MDBCol>
          <MDBCol
            className="col-md-2"
            style={{
              marginTop: "5%",
              borderRadius: "5%",
              borderColor: "gray",
            }}
          >
            <MDBCard style={{ backgroundColor: "#f9f9ff" }}>
              <MDBCardHeader style={{ alignSelf: "center" }}>
                Members
              </MDBCardHeader>

              {members.map((member) => (
                <TeamMember key={member.id} member={member} />
              ))}

              <button
                className="button-81"
                role="button"
                title="add a member"
                onClick={toggleAddMemberForm}
                style={{
                  marginLeft: "40%",
                  marginRight: "40%",
                  padding: "3px",
                  marginBottom: "2%",
                }}
              >
                <MdOutlineAddCircleOutline style={{ fontSize: "larger" }} />
              </button>
              {addMemberFormIsOpen && (
                <Form
                  onSubmit={addMember}
                  style={{
                    marginLeft: "6%",
                    marginTop: "3%",
                    marginRight: "6%",
                  }}
                >
                  <div
                    className="form-group"
                    style={{ display: "grid", alignItems: "center" }}
                  >
                    <input
                      type="email"
                      value={emailToAdd}
                      onChange={(e) => setEmailToAdd(e.target.value)}
                      placeholder="Email"
                      required
                      style={{
                        borderRadius: "5px",
                        border: "none",
                        width: "100%",
                        height: "40px",
                      }}
                    />
                    <Button
                      type="submit"
                      style={{
                        marginTop: "3%",
                        fontSize: "12px",
                        marginLeft: "20%",
                        marginRight: "20%",
                        backgroundColor: "#32257A",
                        border: "none",
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </Form>
              )}
              <div style={{ clear: "both" }} />
            </MDBCard>
          </MDBCol>
        </MDBRow>

        {modalIsOpen && (
          <TaskModal
            currentTaskId={currentTaskId}
            toggleModal={toggleModal}
            manager={true}
          />
        )}

        {newTaskModalIsOpen && (
          <NewTask
            handleCloseModal={handleCloseModal}
            membersList={members}
            title={title}
            setTitle={setTitle}
            assignee={assignee}
            setAssignee={setAssignee}
            deadline={deadline}
            setDeadline={setDeadline}
            addNewTask={addNewTask}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default ProjectDetails;
