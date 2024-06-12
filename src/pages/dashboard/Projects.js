import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Loading } from "../../components";
import {
  createProject,
  getAllProjects,
  getTasksByProject,
} from "../../features/project/projectSlice";
import Project from "../../components/Project";
import { useEffect } from "react";
import { Divider } from "@mui/material";
import { setDashboardText } from "../../features/user/userSlice";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import NewProject from "../../components/NewProject";
import { getUserFromLocalStorage } from "../../utils/localStorage";


// export const Projects = () => {
//   const { isSidebarOpen } = useSelector((store) => store.user);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllProjects());
//     dispatch(setDashboardText("Your projects"));
//   }, []);

//   const { isLoading, projects, totalProjects } = useSelector(
//     (store) => store.allProjects
//   );

//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [title, setTitle] = useState(""); // Project Name
  
//   const handleOpenModal = () => {
//     setModalIsOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalIsOpen(false);
//   };

//   const addNewProject = async () => {
//     const newProject = {
//       projectName: title
//     };
//     handleCloseModal();
//     await dispatch(createProject(newProject)).then(() => dispatch(getAllProjects()));
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <Wrapper>
//       <p style={{ marginBottom: "2px", color: "#576574" }}>
//         Total: {totalProjects} project{totalProjects > 1 && "s"}
//       </p>
//       <div style={{ textAlign: "right" }}>
//         <button
//           style={{
//             backgroundColor: "initial",
//             margin: "auto",
//             border: "none",
//             color: "white",
//           }}
//           onClick={handleOpenModal}
//           title="Create a new project"
//         >
//           <MdOutlineAddCircleOutline
//             style={{
//               color: "#284387",
//               fontSize: "xx-large",
//               cursor: "pointer",
//             }}
//           />
//         </button>
//       </div>
//       <Divider sx={{ marginBottom: "2%", marginTop: "2px" }} />
//       <div className="jobs">
//         {projects.map((p) => {
//           // dispatch(getTasksByProject(p.id));
//           return <Project key={p.id} {...p} isSidebarOpen={isSidebarOpen} />;
//         })}
//       </div>
//       {modalIsOpen && (
//         <NewProject
//           handleCloseModal={handleCloseModal}
//           title={title}
//           setTitle={setTitle}
//           addNewProject={addNewProject}
//         />
//       )}
//     </Wrapper>
//   );
// };


export const Projects = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(setDashboardText("Your projects"));
  }, [dispatch]);

  const { isLoading, projects, totalProjects } = useSelector(
    (store) => store.allProjects
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState(""); // Project Name
  
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const addNewProject = async () => {
    const newProject = {
      projectName: title
    };
    handleCloseModal();
    await dispatch(createProject(newProject)).then(() => dispatch(getAllProjects()));
  };

  if (isLoading) {
    return <Loading />;
  }
  
  console.log(projects,"projects---------------")

  return (
    <Wrapper>
      <p style={{ marginBottom: "2px", color: "#576574" }}>
        Total: {totalProjects} project{totalProjects > 1 && "s"}
      </p>
      <div style={{ textAlign: "right" }}>
        <button
          style={{
            backgroundColor: "initial",
            margin: "auto",
            border: "none",
            color: "white",
          }}
          onClick={handleOpenModal}
          title="Create a new project"
        >
          <MdOutlineAddCircleOutline
            style={{
              color: "#284387",
              fontSize: "xx-large",
              cursor: "pointer",
            }}
          />
        </button>
      </div>
      <Divider sx={{ marginBottom: "2%", marginTop: "2px" }} />
      <div className="jobs">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((p) => (
            p && p.id ? (
              <Project key={p.id} {...p} isSidebarOpen={isSidebarOpen} />
            ) : null
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
      {modalIsOpen && (
        <NewProject
          handleCloseModal={handleCloseModal}
          title={title}
          setTitle={setTitle}
          addNewProject={addNewProject}
        />
      )}
    </Wrapper>
  );
};


const Wrapper = styled.section`
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 992px) {
    .jobs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`;





















// export const Projects = () => {
//   const { isSidebarOpen } = useSelector((store) => store.user);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getAllProjects());
//     dispatch(setDashboardText("Vos projets"));
//   }, []);
//   const { isLoading, projects, totalProjects } = useSelector(
//     (store) => store.allProjects
//   );

//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const handleOpenModal = () => {
//     setModalIsOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalIsOpen(false);
//   };
//   const addNewProject = async () => {
//     const newProject = {
//       title: title,
//       chefId: getUserFromLocalStorage().id,
//     };
//     handleCloseModal();
//     await dispatch(createProject(newProject)).then(dispatch(getAllProjects()));
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <Wrapper>
//       <p style={{ marginBottom: "2px", color: "#576574" }}>
//         Total : {totalProjects} projet{totalProjects > 1 && "s"}
//       </p>
//       <div style={{ textAlign: "right" }}>
//         <button
//           style={{
//             backgroundColor: "initial",

//             margin: "auto",
//             border: "none",
//             color: "white",
//           }}
//           onClick={handleOpenModal}
//           title="Créer un nouveau projet"
//         >
//           <MdOutlineAddCircleOutline
//             style={{
//               color: "#284387",
//               fontSize: "xx-large",
//               cursor: "hand",
//             }}
//           />
//         </button>
//       </div>
//       <Divider sx={{ marginBottom: "2%", marginTop: "2px" }} />
//       <div className="jobs">
//         {projects.map((p) => {
//           // dispatch(getTasksByProject(p.id));
//           return <Project key={p.id} {...p} isSidebarOpen={isSidebarOpen} />;
//         })}
//       </div>
//       {modalIsOpen && (
//         <NewProject
//           handleCloseModal={handleCloseModal}
//           title={title}
//           setTitle={setTitle}
//           addNewProject={addNewProject}
//         />
//       )}
//     </Wrapper>
//   );
// };

// const Wrapper = styled.section`
//   h2 {
//     text-transform: none;
//   }
//   & > h5 {
//     font-weight: 700;
//   }
//   .jobs {
//     display: grid;
//     grid-template-columns: 1fr;
//     row-gap: 2rem;
//   }
//   @media (min-width: 992px) {
//     .jobs {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       gap: 1rem;
//     }
//   }
// `;

