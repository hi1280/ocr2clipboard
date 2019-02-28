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
import { addLocaleData, FormattedMessage, injectIntl, IntlProvider } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as ja from 'react-intl/locale-data/ja';
import { Util } from './util';

const styles = (theme: Theme) =>
  createStyles({
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

interface IProps extends WithStyles<typeof styles> {}

const Option = withStyles(styles)(
  class extends React.Component<IProps> {
    public state = {
      apiKey: '',
    };
    private locale = navigator.language.split('_')[0];

    private apiKeyMessage = injectIntl(({ intl }) => {
      return (
        <TextField
          fullWidth={true}
          id="apiKey"
          name="apiKey"
          label={intl.formatMessage({ id: 'apikey' })}
          value={this.state.apiKey}
          onChange={e => this.handleChange(e)}
        />
      );
    });

    constructor(props: IProps) {
      super(props);
      addLocaleData([...en, ...ja]);
      chrome.storage.sync.get('apiKey').then(v => {
        if (v && v.apiKey) {
          this.setState({ apiKey: v.apiKey });
        }
      });
    }

    public render() {
      const { classes } = this.props;
      return (
        <IntlProvider locale={this.locale} messages={Util.chooseLocale(this.locale)}>
          <React.Fragment>
            <CssBaseline />
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  <FormattedMessage id="config" />
                </Typography>
              </Toolbar>
            </AppBar>
            <main className={classes.layout}>
              <Paper className={classes.paper}>
                <Grid container={true} spacing={24}>
                  <Grid item={true} xs={12}>
                    <this.apiKeyMessage />
                  </Grid>
                </Grid>
              </Paper>
            </main>
          </React.Fragment>
        </IntlProvider>
      );
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
      this.setState({ apiKey: e.target.value });
      chrome.storage.sync.set({ apiKey: e.target.value });
    }
  },
);

ReactDOM.render(<Option />, document.getElementById('option'));
