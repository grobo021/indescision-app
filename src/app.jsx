/* global React, ReactDOM, PropTypes */

const Header = ({title, subtitle}) => (
  <div>
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
  </div>
);

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
};

Header.defaultProps = {
  title: 'Indescision App',
  subtitle: 'This is a default subtitle!'
};

const Action = ({handlePick, hasOptions}) => (
  <div>
    <button
      onClick={handlePick}
      disabled={!hasOptions}
      type="button"
    >
      What should I do?
    </button>
  </div>
);
Action.propTypes = {
  handlePick: PropTypes.func.isRequired,
  hasOptions: PropTypes.bool.isRequired
};

const Option = ({optionText, handleDeleteOption}) => (
  <div>
    {optionText}
    <button
      onClick={() => {
        handleDeleteOption(optionText);
      }}
      type="button"
    >
      remove
    </button>
  </div>
);
Option.propTypes = {
  optionText: PropTypes.string.isRequired,
  handleDeleteOption: PropTypes.func.isRequired
};

const Options = ({handleDeleteOptions, handleDeleteOption, options}) => (
  <div>
    <button
      onClick={handleDeleteOptions}
      type="button"
    >
      Remove All
    </button>
    {options.length === 0 && <p>Please add an option to get started!</p>}
    {
      options.map((option) => (
        <Option
          key={option}
          optionText={option}
          handleDeleteOption={handleDeleteOption}
        />
      ))
    }
  </div>
);
Options.propTypes = {
  handleDeleteOptions: PropTypes.func.isRequired,
  handleDeleteOption: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

class AddOption extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.state = {
      error: undefined
    };
  }

  handleAddOption(e) {
    e.preventDefault();

    const option = e.target.elements.option.value.trim();
    const error = this.props.handleAddOption(option);

    this.setState(() => ({ error }));

    if (!error) {
      e.target.elements.option.value = '';
    }
  }

  render() {
    return (
      <div>
        {this.state.error && <p>{this.state.error}</p>}
        <form onSubmit={this.handleAddOption}>
          <input type="text" name="option" />
          <button type="button">Add Option</button>
        </form>
      </div>
    );
  }
}
AddOption.propTypes = {
  handleAddOption: PropTypes.func.isRequired
};

class IndecisionApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDeleteOptions = this.handleDeleteOptions.bind(this);
    this.handlePick = this.handlePick.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
    this.state = {
      options: []
    };
  }

  componentDidMount() {
    try {
      const json = localStorage.getItem('options');
      const options = JSON.parse(json);

      if (options) {
        this.setState(() => ({ options }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.options.length !== this.state.options.length) {
      const json = JSON.stringify(this.state.options);
      localStorage.setItem('options', json);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  handleDeleteOptions() {
    this.setState(() => ({ options: [] }));
  }

  handleDeleteOption(optionToRemove) {
    this.setState((prevState) => ({
      options: prevState.options.filter((option) => optionToRemove !== option)
    }));
  }

  handlePick() {
    const randomNum = Math.floor(Math.random() * this.state.options.length);
    const option = this.state.options[randomNum];
    alert(option);
  }

  handleAddOption(option) {
    if (!option) {
      return 'Enter valid value to add item';
    } if (this.state.options.indexOf(option) > -1) {
      return 'This option already exists';
    }

    return this.setState((prevState) => ({
      options: prevState.options.concat(option)
    }));
  }

  render() {
    const subtitle = 'Put your life in the hands of a computer';

    return (
      <div>
        <Header subtitle={subtitle} />
        <Action
          hasOptions={this.state.options.length > 0}
          handlePick={this.handlePick}
        />
        <Options
          options={this.state.options}
          handleDeleteOptions={this.handleDeleteOptions}
          handleDeleteOption={this.handleDeleteOption}
        />
        <AddOption
          handleAddOption={this.handleAddOption}
        />
      </div>
    );
  }
}

ReactDOM.render(<IndecisionApp />, document.getElementById('app'));
