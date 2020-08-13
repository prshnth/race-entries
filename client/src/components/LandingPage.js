import React from 'react';
import { withFirebase } from './Firebase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import HowToReg from '@material-ui/icons/HowToReg';
import Register from '@material-ui/icons/GroupAdd';
import Assignment from '@material-ui/icons/Assignment';
import { compose } from 'recompose';
import moment from 'moment';

const withStyles = (Component) => (props) => {
  const useStyles = makeStyles((theme) => ({
    boxContainer: {
      flex: '1 1 auto',
      overflow: 'hidden',
      padding: theme.spacing(1, 2),
      margin: theme.spacing(1, 0),
      maxWidth: '600px',
      width: '100%',
      bgcolor: 'background.paper',
      m: 1,
      style: { width: '5rem', height: '5rem' },
      borderColor: 'text.primary',
    },
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paper: {
      margin: `${theme.spacing(2)}px auto`,
      padding: theme.spacing(2),
    },
    button: {
      margin: '5px',
    },
  }));
  const classes = useStyles();
  return <Component {...props} classes={classes} />;
};

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shows: [],
      participants: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.participantsListener = this.props.firebase.db
      .collection('participants')
      .where('participationDate', '>=', moment().format('YYYY-MM-DD'))
      .onSnapshot((snapshot) => {
        const participants = snapshot.docs.map((participant) =>
          participant.data()
        );
        this.setState({ participants });
      });
    this.showsListener = this.props.firebase.db
      .collection('shows')
      .where('showDate', '>=', moment().format('YYYY-MM-DD'))
      .onSnapshot((snapshot) => {
        const shows = snapshot.docs.map((show) => show.data());
        this.setState({ shows, loading: true });
      });
  }

  componentWillUnmount() {
    this.participantsListener();
    this.showsListener();
  }

  render() {
    return this.state.shows && this.state.shows.length ? (
      <div className={this.props.classes.container}>
        {this.state.shows
          .sort((firstShow, secondShow) =>
            moment(firstShow.showDate).isBefore(secondShow.showDate) ? -1 : 1
          )
          .map((show, index) => (
            <Box
              border={1}
              boxSizing='border-box'
              key={index}
              borderRadius={12}
              borderColor='grey.400'
              className={this.props.classes.boxContainer}
            >
              <Typography noWrap variant='h6' display='inline' color='primary'>
                {moment(show.showDate, 'YYYY-MM-DD').format(
                  'dddd, MMMM Do YYYY'
                )}
              </Typography>
              {show.classes
                ? show.classes.map((eachClass, classIndex) => (
                    <Paper
                      className={this.props.classes.paper}
                      elevation={6}
                      key={classIndex}
                    >
                      <Grid container wrap='nowrap' spacing={2}>
                        <Grid item>
                          <Typography
                            variant='subtitle2'
                            color='textSecondary'
                            noWrap
                          >
                            {eachClass.name}
                          </Typography>
                          <Button
                            variant='outlined'
                            size='small'
                            color='primary'
                            className={this.props.classes.button}
                            startIcon={<Register />}
                          >
                            Enroll
                          </Button>
                          <Button
                            variant='outlined'
                            size='small'
                            color='primary'
                            className={this.props.classes.button}
                            startIcon={<HowToReg />}
                          >
                            Confirmed
                          </Button>
                          <Button
                            variant='outlined'
                            color='primary'
                            size='small'
                            className={this.props.classes.button}
                            startIcon={<Assignment />}
                          >
                            Draw
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                : null}
            </Box>
          ))}
      </div>
    ) : (
      <Typography noWrap display='inline' color='primary'>
        There are no shows available currently.
      </Typography>
    );
  }
}

export default compose(withStyles, withFirebase)(LandingPage);
