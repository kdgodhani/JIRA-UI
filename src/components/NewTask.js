import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Wrapper from "../assets/wrappers/TaskModal";
import ProjectInfo from "./ProjectInfo";
import { BiTask } from "react-icons/bi";
import { FaAlignLeft, FaCalendarAlt } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { RiCloseLine } from "react-icons/ri";


const NewTask = ({
  handleCloseModal,
  membersList,
  title,
  setTitle,
  assignee,
  setAssignee,
  deadline,
  setDeadline,
  addNewTask,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Title:", title); // Debug log
    console.log("Assignee:", assignee); // Debug log

    if (!title || !assignee) {
      toast.error("please complete all fields");
      return;
    }
    addNewTask();
    handleCloseModal();
  };

  return (
    <Wrapper>
      <div>
        <div className="modal">
          <div className="modal-body" style={{ height: "auto", width: "40%" }}>
            <header>
              <button
                className="button-81"
                role="button"
                style={{
                  padding: "7px",
                  marginLeft: "35px",
                  marginBottom: "5px",
                  float: "right",
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                }}
                onClick={() => handleCloseModal()}
              >
                <RiCloseLine style={{ fontSize: "large" }} />
              </button>

              <ProjectInfo icon={<BiTask />} text="New Task" />
            </header>

            <form onSubmit={handleSubmit} style={{ marginTop: "5%" }}>
              <label htmlFor="title" className="form__label">
                Task title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="form__input"
              />
              <br />
              <label htmlFor="assignee" className="form__label">
                Assigned to:
              </label>
              <div className="form__select-container">
                <select
                  id="assignee"
                  value={assignee}
                  onChange={(event) => {
                    console.log("Selected assignee:", event.target.value); // Debug log
                    setAssignee(event.target.value);
                  }}
                  className="form__select"
                  placeholder="Choose a member"
                >
                  <option value="" key={-1} style={{ color: "gray" }}>
                    Choose a member
                  </option>
                  {membersList.map((member) => {
                    return (
                      <option
                        value={member.name}
                        key={member.id}
                        style={{ color: "black" }}
                      >
                        {member.name}
                      </option>
                    );
                  })}
                </select>
                <FaCaretDown className="form__select-icon" />
              </div>
              <br />
              <label htmlFor="deadline" className="form__label">
                Deadline:
              </label>
              <div className="form__datepicker-container">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                  id="deadline"
                  className="form__input"
                />
                <FaCalendarAlt className="form__datepicker-icon" />
              </div>
              <br />
              <button type="submit" className="form__button">
                Add task
              </button>
            </form>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewTask;
