import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/TaskDetails";
import { MdDone } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { Calendar, CheckSquare, List, Tag, Trash, Type } from "react-feather";

import {
  updateTaskDeadLine,
  updateTaskDesc,
  updateTaskTitle,
  updateTaskPriority,
  addCommentToTask,
  getCurrentTask,
  updateTaskProgress,
} from "../features/currentProject/currentProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { getUserFromLocalStorage } from "../utils/localStorage";
import { toast } from "react-toastify";
import { getAllTasks } from "../features/tasks/allTasksSlice";
import Form from "react-bootstrap/Form";

function TaskDetails({ taskId, manager = true, toggleModal, handleCardClick }) {
  const dispatch = useDispatch();
  const { currentTask } = useSelector((store) => store.currentProject);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editProgressFormIsOpen, setEditProgressFormIsOpen] = useState(false);
  const [newProgress, setNewProgress] = useState(0);
  const [priority, setPriority] = useState("low");
  let task = currentTask[0];

  useEffect(() => {
    if (task) {
      setNewTitle(task.title);
      setNewDesc(task.description);
      setNewProgress(task.progress);
      setPriority(task.priority);
    }
  }, [task]);

  const handleTitleSubmit = async (e) => {
    e.preventDefault();
    const info = { taskId: task.id, newTitle: newTitle };
    await dispatch(updateTaskTitle(info)).then(
      dispatch(getCurrentTask(taskId))
    );
    setIsEditingTitle(false);
  };

  const handleDescSubmit = async (e) => {
    e.preventDefault();
    const info = { taskId: task.id, newDesc: newDesc };
    await dispatch(updateTaskDesc(info)).then(dispatch(getCurrentTask(taskId)));
    setIsEditingDesc(false);
  };

  const updateDeadLine = async (newDeadLine) => {
    if (manager) {
      const info = { taskId: task.id, newDeadLine: newDeadLine };
      await dispatch(updateTaskDeadLine(info)).then(
        dispatch(getCurrentTask(taskId))
      );
    } else {
      toast.error("Only the project manager can modify the deadline");
    }
  };

  const updateProgress = async (value) => {
    value.preventDefault();
    const info = { taskId: task.id, newProgress: newProgress };
    await dispatch(updateTaskProgress(info)).then(
      dispatch(getCurrentTask(taskId))
    );
  };

  const addComment = async (data) => {
    const info = {
      text: data.text,
      authorId: getUserFromLocalStorage().id,
      taskId: task.id,
    };
    await dispatch(addCommentToTask(info)).then(
      dispatch(getCurrentTask(taskId))
    );
    dispatch(getAllTasks());
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    setPriority(newPriority);
    const info = { taskId: task.id, newPriority };
    await dispatch(updateTaskPriority(info)).then(
      dispatch(getCurrentTask(taskId))
    );
  };

  function toggleEditProgressForm() {
    setEditProgressFormIsOpen(!editProgressFormIsOpen);
  }

  const priorityColors = {
    high: "red",
    medium: "yellow",
    low: "green",
  };

  return (
    <Wrapper>
      <div className="cardinfo">
        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Type />
            <p>Title</p>
          </div>
          {isEditingTitle ? (
            <form
              onSubmit={handleTitleSubmit}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter Title"
                autoFocus
                style={{ marginRight: "10px", padding: "5px", flex: "1" }}
              />
              <button
                type="submit"
                style={{ marginRight: "5px", padding: "5px" }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                style={{ padding: "5px" }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <p
              onClick={() => manager && setIsEditingTitle(true)}
              style={{ cursor: "pointer" }}
            >
              {task?.title || "No title available"}
            </p>
          )}
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <List />
            <p>Description</p>
          </div>
          {isEditingDesc ? (
            <form
              onSubmit={handleDescSubmit}
              style={{ display: "flex", alignItems: "center" }}
            >
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Enter Description"
                autoFocus
                style={{ marginRight: "10px", padding: "5px", flex: "1" }}
              />
              <button
                type="submit"
                style={{ marginRight: "5px", padding: "5px" }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDesc(false)}
                style={{ padding: "5px" }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <p
              onClick={() => manager && setIsEditingDesc(true)}
              style={{ cursor: "pointer" }}
            >
              {task?.description || "No description available"}
            </p>
          )}
        </div>

        {/* <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Tag />
            <p>Priority</p>
          </div>
          <select
            value={priority}
            onChange={handlePriorityChange}
            style={{
              backgroundColor: priorityColors[priority],
              color: "white",
              padding: "5px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={!manager}
          >
            <option value="High" style={{ color: "red" }}>
              High
            </option>
            <option value="Medium" style={{ color: "yellow" }}>
              Medium
            </option>
            <option value="Low" style={{ color: "green" }}>
              Low
            </option>
          </select>
        </div> */}

<div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Tag />
            <p>Priority</p>
          </div>
          <select
            value={task?.priority}
            onChange={handlePriorityChange}
            style={{
              padding: "5px",
              backgroundColor: priority === "high" ? "red" : priority === "medium" ? "yellow" : "green",
              color: priority === "medium" ? "black" : "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "5px", // Add margin to separate from the previous box
            }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Calendar />
            <p>Deadline</p>
          </div>
          <input
            type="date"
            value={task?.deadline || new Date().toISOString().substr(0, 10)}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDeadLine(event.target.value)}
            readOnly={!manager}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <CheckSquare />
            <p>Progress</p>
            {manager && (
              <button
                style={{
                  backgroundColor: "initial",
                  marginLeft: "auto",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={toggleEditProgressForm}
              >
                <MdOutlineEdit style={{ color: "black", fontSize: "25px" }} />
              </button>
            )}
          </div>
          <div
            className="cardinfo-box-progress-bar"
            style={{ marginBottom: "5%" }}
          >
            <progress value={newProgress} max="100" />
            <p style={{ marginLeft: "8px", color: "#6ab04c" }}>
              {newProgress} %
            </p>
          </div>

          {editProgressFormIsOpen && (
            <Form
              onSubmit={updateProgress}
              style={{ marginLeft: "6%", marginTop: "3%", marginRight: "6%" }}
            >
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="number"
                  value={newProgress}
                  min={0}
                  max={100}
                  onChange={(event) => setNewProgress(event.target.value)}
                  autoFocus
                  style={{
                    width: "60px",
                    padding: "4px",
                    borderColor: "#95a5a6",
                    borderRadius: "5px",
                    borderWidth: "thin",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "transparent",
                    marginLeft: "10px",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <MdDone style={{ color: "#535c68", fontSize: "20px" }} />
                </button>
              </div>
            </Form>
          )}
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <BiCommentDetail />
            <p>Comments</p>
          </div>
          <Comment comments={task?.comments} addComment={addComment} />
        </div>
      </div>
    </Wrapper>
  );
}

export default TaskDetails;
