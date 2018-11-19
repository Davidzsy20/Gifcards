import React, { Component } from 'react';
import _ from 'lodash';
import './Amexgif.css';
// import {Input,Form, Button} from 'semantic-ui-react';
class Amexgif extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '', apiOutput: '', renderOuput: '', sorting: 'trendASC', checkbox: [],
    };

    this.doSort = this.doSort.bind(this);
    this.doFilter = this.doFilter.bind(this);
  }

  componentDidMount() {
    const { apiOutput } = this.state;
    if (!apiOutput) {
      fetch('https://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=OKQXM2674LHNupcoLkUQP4Jy2rpjlddD&limit=100&q=american%20express')
        .then(res => res.json())
        .then(res => this.onLoad(res))
        .catch(err => console.error('this is the error log', err));
    }
  }


  onLoad(data) {
    const output = data.data;

    const checkbox = [...new Set(_.map(output, v => v.rating))].reduce((acc, val) => {
      acc[val] = false;
      return acc;
    }, {});
    this.setState({
      apiOutput: output,
      renderOuput: output,
      checkbox,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { userInput } = this.state;
    fetch(`https://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=OKQXM2674LHNupcoLkUQP4Jy2rpjlddD&limit=150&q=${userInput}`)
      .then(res => res.json())
      .then(res => this.onLoad(res))
      .catch(err => console.error('this is the error log', err));
  }

  handleInput(e) {
    this.setState({ userInput: e.target.value });
  }

  doSort(pram) {
    const order = pram.target.value;
    const numberPattern = /\d+/g;
    const { renderOuput } = this.state;
    if (order === 'trendASC') {
      const renderOutputASC = renderOuput.sort((a, b) => {
        const before = a.trending_datetime.match(numberPattern).join(''); const
          after = b.trending_datetime.match(numberPattern).join('');
        return after - before;
      });
      this.setState({ renderOuput: renderOutputASC, sorting: 'trendDSC' });
    } else if (order === 'trendDSC') {
      const renderOutputDSC = renderOuput.sort((a, b) => {
        const before = a.trending_datetime.match(numberPattern).join(''); const
          after = b.trending_datetime.match(numberPattern).join('');
        return before - after;
      });
      this.setState({ renderOuput: renderOutputDSC, sorting: 'trendASC' });
    }
  }

  doFilter(e) {
    const check = e.target.checked;
    const { checkbox } = this.state;
    const boxValue = e.target.value;
    const { apiOutput } = this.state;
    if (check) {
      checkbox[boxValue] = true;
    } else {
      checkbox[boxValue] = false;
    }

    const filteredOutput = apiOutput
      .filter((el) => {
        if (checkbox[el.rating]) {
          return true;
        }
        return false;
      });
    this.setState({ renderOuput: filteredOutput, checkbox });
  }

  render() {
    const { renderOuput } = this.state;
    const checkbox = this.state;
    const pandora = renderOuput === ''
      ? <h1>Nothing to Show</h1>
      : (
        <div>
          <ul className="row">
            {renderOuput.map((val, i) => (
              <li className="col-4" key={i}>
                <img src={val.images.fixed_height.url} alt="no img" />
                <div>
                  <span>
                    <p>Trending Date</p>
                    <p>{val.trending_datetime}</p>
                  </span>
                  <span>
Rating
                    <p>{val.rating}</p>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    const checkboxes = (
      <ul>
        {_.map(checkbox, (val, k, collection) => (
          <li key={k}>
            <label id="box">
              {k}
              <input type="checkbox" value={k} checkedLink={collection[k]} onChange={e => this.doFilter(e)} />
            </label>
          </li>
        ))}
      </ul>
    );
    return (
      <div>
        <h1>Hello I'm GIPHY</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input className="form-control" type="text" placeholder="Search anything" value={this.state.userInput} onChange={this.handleInput.bind(this)} />
          <button className="btn btn-outline-secondary" type="submit">search</button>
        </form>
        <div>{checkboxes}</div>
        <button className="btn btn-primary" value={this.state.sorting} onClick={e => this.doSort(e)}>{this.state.sorting}</button>
        <div>{pandora}</div>
      </div>
    );
  }
}

export default Amexgif;
