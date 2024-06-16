import React from "react";
import { Card, CardHeader, CardContent, IconButton, Typography } from "@mui/material";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";

// const StyledCard = styled(Card)`
//   width: 250px;
//   height: 150px;
//   margin-bottom: 8px;
// `;

// const StyledCardContent = styled(CardContent)`
//   padding: 8px;
// `;

const priorityColors = {
  high: "red",
  medium: "yellow",
  low: "green",
};

const StyledCard = styled(Card)`
  width: 250px;
  height: 180px;
  margin-bottom: 3px;
  border: 2px solid ${({ priority }) => priorityColors[priority] || "grey"};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledCardContent = styled(CardContent)`
  padding: 8px;
`;

const CustomCard = ({ id, title, description, label, priority, onDelete, onClick }) => {
  return (
    <StyledCard priority={priority} onClick={() => onClick(id)}>
      <CardHeader
        action={
          <IconButton
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            <MdDelete />
          </IconButton>
        }
        title={<Typography variant="h6" noWrap>{title}</Typography>}
        titleTypographyProps={{ style: { fontSize: '1rem' } }}
        style={{ padding: '8px' }}
      />
      <StyledCardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {label}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" style={{ color: priorityColors[priority] || "black" }}>
          Priority: <span style={{ fontWeight: 'bold', color: priorityColors[priority] || "black" }}>{priority}</span>
        </Typography>
      </StyledCardContent>
    </StyledCard>
  );
};

export default CustomCard;
