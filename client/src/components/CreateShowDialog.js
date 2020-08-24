import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import _ from 'lodash';

export default function CreateShowDialog(props) {
  const useStyles = makeStyles((theme) => ({
    classBox: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(1, 0),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      color: theme.palette.success.light,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }));

  const classes = useStyles();
  const initialState = () => {
    return {
      showName: '',
      showDate: new Date(),
      totalClasses: 1,
      classes: [{ name: '', hasSeniorWorldTour: false }],
      availableClasses: [],
    };
  };

  const onDialogClose = () => {
    setState(initialState());
    props.handleCreateShowDialogClose();
  };

  const [state, setState] = React.useState(initialState());
  const updateClassesCount = (e) => {
    const initClasses = _.times(
      e.target.value,
      _.constant({ name: '', hasSeniorWorldTour: false })
    );
    setState({ ...state, totalClasses: e.target.value, classes: initClasses });
  };

  const updateClass = (e, classIndex) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let allClasses = [...state.classes];
    let currentClass = { ...allClasses[classIndex] };
    currentClass[e.target.name] = value;
    allClasses[classIndex] = currentClass;
    setState({ ...state, classes: allClasses });
  };

  const updateField = (e) => {
    const stateKey = e.target ? e.target.name : 'showDate';
    const stateValue = e.target ? e.target.value : e;
    setState({
      ...state,
      [stateKey]: stateValue,
    });
  };

  const isFormInvalid =
    state.showName === '' ||
    state.showDate === '' ||
    _.some(state.classes, (eachClass) => eachClass.name === '');

  return (
    <Dialog
      open={props.open}
      onClose={onDialogClose}
      onExited={onDialogClose}
      maxWidth='sm'
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Create a New Show</DialogTitle>
      <DialogContent>
        <DialogContentText>Please fill out below information</DialogContentText>
        {props.error && (
          <Typography variant='subtitle1' display='inline' color='error'>
            {props.error}
          </Typography>
        )}
        <TextField
          autoFocus
          required
          margin='dense'
          id='showName'
          label='Show Name'
          type='text'
          variant='outlined'
          fullWidth
          name='showName'
          value={state.showName}
          onChange={updateField}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            disablePast
            required
            inputVariant='outlined'
            margin='dense'
            fullWidth
            id='date-picker-dialog'
            label='Show Date'
            format='MM/dd/yyyy'
            value={state.showDate}
            name='showDate'
            InputAdornmentProps={{ position: 'start' }}
            onChange={updateField}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <FormControl variant='outlined' margin='dense'>
          <InputLabel id='number-of-classes'>Classes</InputLabel>
          <Select
            labelId='class-list'
            id='class-list-select'
            value={state.totalClasses}
            name='totalClasses'
            onChange={updateClassesCount}
            label='Classes'
          >
            {_.times(5).map((val) => {
              const item = val + 1;
              return (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {_.times(state.totalClasses).map((classIndex) => {
          return (
            <Box
              key={classIndex}
              border={1}
              boxSizing='border-box'
              borderRadius={4}
              borderColor='grey.400'
              className={classes.classBox}
            >
              <TextField
                required
                margin='dense'
                id={`className.${classIndex}`}
                label='Class Name'
                type='text'
                variant='outlined'
                fullWidth
                name='name'
                value={state.classes[classIndex].name}
                onChange={(e) => updateClass(e, classIndex)}
              />
              <FormControl component='fieldset' margin='dense'>
                <FormLabel component='legend'>
                  Senior World Tour Eligible?
                </FormLabel>
                <FormGroup aria-label='position' row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.classes[classIndex].hasSeniorWorldTour}
                        onChange={(e) => updateClass(e, classIndex)}
                        color='primary'
                        name='hasSeniorWorldTour'
                      />
                    }
                    label='Yes'
                    labelPlacement='end'
                  />
                </FormGroup>
              </FormControl>
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          size='small'
          onClick={onDialogClose}
          color='primary'
        >
          Cancel
        </Button>
        <div className={classes.wrapper}>
          <Button
            variant='contained'
            size='small'
            onClick={() => props.onCreateShowSubmit(state)}
            color='primary'
            disabled={isFormInvalid || props.isShowCreating}
          >
            Submit
          </Button>
          {props.isShowCreating && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
