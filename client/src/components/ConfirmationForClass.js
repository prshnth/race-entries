import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function ConfirmationForClass(props) {
  const useStyles = makeStyles({
    table: {
      minWidth: 200,
    },
  });

  const classes = useStyles();

  const onDialogClose = () => {
    props.handleConfirmationDialogClose();
  };

  const getParticipantsForClass = () => {
    return props.participants.filter(
      (participant) =>
        participant.participationShowId === props.selectedShow.id &&
        participant.participationClass === props.selectedClass.name
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={onDialogClose}
      onExited={onDialogClose}
      maxWidth='sm'
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        {props.selectedShow &&
          moment(props.selectedShow.showDate, 'YYYY-MM-DD').format(
            'dddd, MMMM Do YYYY'
          )}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirmations for the class:{' '}
          {props.selectedClass && props.selectedClass.name}
        </DialogContentText>
        {props.selectedShow && getParticipantsForClass().length ? (
          <TableContainer component={Paper}>
            <Table
              stickyHeader
              className={classes.table}
              aria-label='participants table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>Rider Name</TableCell>
                  <TableCell>Horse Name</TableCell>
                  <TableCell>Owner Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getParticipantsForClass().map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell component='th' scope='row'>
                      {participant.riderName}
                    </TableCell>
                    <TableCell>{participant.horseName}</TableCell>
                    <TableCell>{participant.ownerName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant='h6' display='inline' color='primary'>
            There are no registrations for this class yet.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
