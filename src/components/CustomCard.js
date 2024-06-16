import React from "react";
import { Card, CardHeader, CardContent, IconButton, Typography } from "@mui/material";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";

const StyledCard = styled(Card)`
  width: 250px;
  height: 150px;
  margin-bottom: 8px;
`;

const StyledCardContent = styled(CardContent)`
  padding: 8px;
`;

const CustomCard = ({ id, title, description, label,priority, onDelete, onClick }) => {
  return (
    <StyledCard onClick={() => onClick(id)}>
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
        <Typography variant="body2" color="textSecondary" component="p">
          {priority}
        </Typography>
      </StyledCardContent>
    </StyledCard>
  );
};

export default CustomCard;
