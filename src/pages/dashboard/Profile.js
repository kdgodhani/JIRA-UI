
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getUserParticipationProjects,
  setDashboardText,
  updateUser,
} from "../../features/user/userSlice";
import React from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import { urlBase } from "../../utils/axios";
import userIcon from "../../assets/images/user.png";

import { RiCloseLine } from "react-icons/ri";
import { MdDone } from "react-icons/md";
import axios from "axios";
import { getUserFromLocalStorage } from "../../utils/localStorage";
import customFetch from "../../utils/axios";
import { GrTask } from "react-icons/gr";
import { FaTasks } from "react-icons/fa";
import { FcParallelTasks } from "react-icons/fc";
import { MDBCardFooter, MDBCardTitle } from "mdbreact";
import { getAllTasks } from "../../features/tasks/allTasksSlice";
import { getAllProjects } from "../../features/project/projectSlice";

const Profile = () => {
  const { isLoading, user, userImage, userParticipationProjects } = useSelector(
    (store) => store.user
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDashboardText("Profile"));
    dispatch(getAllTasks());
    dispatch(getAllProjects());
    getUserImage(getUserFromLocalStorage().id);
    dispatch(getUserParticipationProjects());
  }, []);

  const [formIsOpen, setFormIsOpen] = useState(false);
  const { projects } = useSelector((store) => store.allProjects);
  const { tasks } = useSelector((store) => store.allTasks);

  const createdProjects = projects;
  const receivedTasks = tasks;
  const validatedTasks = tasks.filter((card) => card.status === "VALIDATED");

  const [imageUrl, setImageUrl] = useState("");

  function toggleForm() {
    setFormIsOpen(!formIsOpen);
  }

  function onImageChange(e) {
    setImageUrl(e.target.files[0]);
  }

  function updateImage() {
    const data = new FormData();
    data.append("image", imageUrl);
    const userId = getUserFromLocalStorage().id;
    axios.post(`${urlBase}/image/${userId}`, data).then(
      (res) => {
        toast.success("The image has been updated");
        toggleForm();
        getUserImage(getUserFromLocalStorage().id);
      },
      () => {
        toast.error("The image has not been updated");
      }
    );
  }
  const [url, setUrl] = useState(userIcon);
  function getUserImage(id) {
    fetch(`${urlBase}/image/info/${id}`)
      .then((response) => {
        if (response.ok) return response.blob();
        return;
      })
      .then((blob) => {
        if (blob) {
          const urlx = URL.createObjectURL(blob);
          setUrl(urlx);
        }
      })
      .catch((error) => {
        setUrl(userIcon);
      });
  }

  return (
    <>
      <MDBCard>
        <div
          className="rounded-top text-white d-flex flex-row"
          style={{ backgroundColor: "#F6F2FF", height: "200px" }}
        >
          <div
            className="ms-4 mt-5 d-flex flex-column"
            style={{ width: "150px" }}
          >
            <MDBCardImage
              src={url}
              alt={""}
              className="mt-4 mb-2 img-thumbnail"
              style={{
                width: "150px",
                zIndex: "1",
                color: "gray",
              }}
            />

            <MDBBtn
              outline
              color="dark"
              style={{ height: "36px", overflow: "visible" }}
              onClick={toggleForm}
            >
              Edit
            </MDBBtn>
            {formIsOpen && (
              <div
                style={{
                  backgroundColor: "initial",
                  zIndex: "1",
                  marginTop: "5%",
                  display: "flex",
                  width: "200%",
                }}
              >
                <input
                  className="form-control form-control-sm"
                  id="formFileSm"
                  type="file"
                  style={{ width: "160%", height: "75%" }}
                  onChange={onImageChange}
                />
                <button
                  role="button"
                  style={{
                    padding: "10px",
                    border: "none",
                    float: "right",
                    position: "relative",
                    backgroundColor: "initial",
                  }}
                  onClick={updateImage}
                >
                  <MdDone
                    style={{
                      fontSize: "large",
                      marginBottom: "10%",
                      color: "#535c68",
                    }}
                  />
                </button>
                <button
                  role="button"
                  style={{
                    padding: "10px",
                    border: "none",
                    float: "right",
                    position: "relative",
                    backgroundColor: "initial",
                  }}
                  onClick={() => toggleForm()}
                >
                  <RiCloseLine
                    style={{
                      fontSize: "large",
                      marginBottom: "10%",
                      color: "gray",
                    }}
                  />
                </button>
              </div>
            )}
          </div>
          <div
            className="ms-3"
            style={{
              marginTop: "130px",
              color: "#1E003D",
            }}
          >
            <MDBTypography tag="h5" style={{ marginBottom: "0" }}>
              {user.email}
            </MDBTypography>
          </div>
        </div>
        {/* <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="d-flex justify-content-end text-center py-1">
            <div>
              <MDBCardText className="small text-muted mb-0">
                {user.email}
              </MDBCardText>
            </div>
          </div>
        </div> */}
        <MDBCardBody className="text-black p-4">
          <div className="mb-5">
            <p className="lead fw-normal mb-1">About</p>
            <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
              <MDBCardText className="font-italic mb-1">
                Software Developer
              </MDBCardText>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <MDBCardText className="lead fw-normal mb-0">Statistics</MDBCardText>
          </div>
          <MDBRow className="row-cols-1 row-cols-md-4 g-7">
            <MDBCol>
              <MDBCard className="h-100" style={{ alignItems: "center" }}>
                <MDBCardBody>
                  <MDBCardTitle
                    style={{ color: "#9b59b6", fontSize: "xxx-large" }}
                  >
                    {createdProjects.length > 9
                      ? createdProjects.length
                      : `0${createdProjects.length}`}
                  </MDBCardTitle>
                </MDBCardBody>
                <MDBCardFooter>
                  <small className="text-muted">Created Projects</small>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
            {/* <MDBCol>
              <MDBCard className="h-100" style={{ alignItems: "center" }}>
                <MDBCardBody>
                  <MDBCardTitle
                    style={{ color: "#e67e22", fontSize: "xxx-large" }}
                  >
                    {userParticipationProjects.length > 9
                      ? userParticipationProjects.length
                      : `0${userParticipationProjects.length}`}
                  </MDBCardTitle>
                </MDBCardBody>
                <MDBCardFooter>
                  <small className="text-muted">
                    Participation in Other Projects
                  </small>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol> */}
            <MDBCol>
              <MDBCard className="h-100" style={{ alignItems: "center" }}>
                <MDBCardBody>
                  <MDBCardTitle
                    style={{ color: "#9b59b6", fontSize: "xxx-large" }}
                  >
                    {receivedTasks.length > 9
                      ? receivedTasks.length
                      : `0${receivedTasks.length}`}
                  </MDBCardTitle>
                </MDBCardBody>
                <MDBCardFooter>
                  <small className="text-muted">Received Tasks</small>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
            {/* <MDBCol>
              <MDBCard className="h-100" style={{ alignItems: "center" }}>
                <MDBCardBody>
                  <MDBCardTitle
                    style={{ color: "#e67e22", fontSize: "xxx-large" }}
                  >
                    {validatedTasks.length > 9
                      ? validatedTasks.length
                      : `0${validatedTasks.length}`}
                  </MDBCardTitle>
                </MDBCardBody>
                <MDBCardFooter>
                  <small className="text-muted">Validated Tasks</small>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol> */}
          </MDBRow>
        </MDBCardBody>
        <MDBRow className="row-cols-1 row-cols-md-2 g-7">
        </MDBRow>
      </MDBCard>
    </>
  );
};
export default Profile;

