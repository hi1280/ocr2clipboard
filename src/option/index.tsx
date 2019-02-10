import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    layout: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      width: 'auto',
      [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 600,
      },
    },
    paper: {
      marginBottom: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 2,
      [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
        marginTop: theme.spacing.unit * 6,
        padding: theme.spacing.unit * 3,
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {
  classes: {
    appBar: string;
    layout: string;
    paper: string;
  };
}

const Option = withStyles(styles)(
  class extends React.Component<IProps> {
    public state = {
      apiKey: '',
    };

    constructor(props: IProps) {
      super(props);
      chrome.storage.sync.get('apiKey').then(v => {
        this.setState({ apiKey: v.apiKey });
      });
    }

    public render() {
      const { classes } = this.props;
      return (
        <React.Fragment>
          <CssBaseline />
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                設定
              </Typography>
            </Toolbar>
          </AppBar>
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Grid container={true} spacing={24}>
                <Grid item={true} xs={12}>
                  <TextField
                    fullWidth={true}
                    id="apiKey"
                    name="apiKey"
                    label="APIキー"
                    value={this.state.apiKey}
                    onChange={e => this.handleChange(e)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </main>
        </React.Fragment>
      );
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
      this.setState({ apiKey: e.target.value });
      chrome.storage.sync.set({ apiKey: e.target.value });
    }
  },
);

ReactDOM.render(<Option />, document.getElementById('option'));
