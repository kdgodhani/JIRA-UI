
export const mapData = (tasks, manager) => {
  const cards = tasks.map(
    ({
      id,
      startDate,
      deadline,
      status,
      project,
      responsible,
      title,
      progress,
      comments,
    }) => {
      return {
        id: `${id}`,
        title: title,
        description: manager
          ? `assigned to: ${responsible.name.toUpperCase()}`
          : `project: ${project.name}`,
        label: `${deadline.substring(0, 10)}`,
        draggable: true,
        startDate,
        project,
        progress,
        comments,
        status,
      };
    }
  );

  const pending = cards.filter((card) => card.status === "PENDING");
  const inProgress = cards.filter((card) => card.status === "IN_PROGRESS");
  const waitingForValidation = cards.filter(
    (card) => card.status === "WAITING_FOR_VALIDATION"
  );
  const completed = cards.filter((card) => card.status === "COMPLETED");

  const taskData = {
    lanes: [
      {
        id: "1",
        title: "Pending",
        label: `${pending.length} tasks`,
        cards: pending,
        style: { backgroundColor: "#d1d8e0" }, // Style of Lane
        disallowAddingCard: true,
      },
      {
        id: "2",
        title: "In Progress",
        label: `${inProgress.length} tasks`,
        cards: inProgress,
        disallowAddingCard: true,
        style: { backgroundColor: "#74b9ff" },
      },
      {
        id: "3",
        title: "Waiting for Validation",
        label: `${waitingForValidation.length} tasks`,
        cards: waitingForValidation,
        style: { backgroundColor: "#81ecec" }, // Style of Lane
        disallowAddingCard: true,
      },
      {
        id: "4",
        title: "completed",
        label: `${completed.length} tasks`,
        cards: completed,
        style: { backgroundColor: "#55efc4" },
        disallowAddingCard: true,
      }
   
    ]
  }
  return taskData;
};
