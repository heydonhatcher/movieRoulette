import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  CardActions,
  Typography,
  Select,
  FormControl
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function InfoCard(props) {
  const classes = useStyles();

  return (
    <div
      className="movieCard"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Card
        style={{
          width: "33%",
          height: "200px",
          margin: "10px"
        }}
        variant="outlined"
      >
        <CardContent>
          <Typography variant="h6">Movie Pick</Typography>
          <Typography variant="body1">Choose yo' movie...</Typography>
        </CardContent>
        <CardActions>
          <FormControl className={classes.formControl}>
            <InputLabel id="quality-select-label">Principal</InputLabel>
            <Select
              labelId="quality-select-label"
              id="quality-select"
              value={props.value}
              onChange={props.onChange}
            >
              <MenuItem value={1}>Director</MenuItem>
              <MenuItem value={2}>Producer</MenuItem>
              <MenuItem value={3}>Actor</MenuItem>
            </Select>
          </FormControl>
        </CardActions>
      </Card>
    </div>
  );
}
